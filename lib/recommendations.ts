import { ContractType, ListingType } from '@prisma/client';
import prisma from '@/lib/prisma';

export type RecommendationFilters = {
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  listingType?: ListingType;
  contractType?: ContractType;
  minStyleScore?: number;
};

export type Recommendation = {
  id: number;
  title: string;
  address: string;
  price: number;
  area: number;
  rooms: number;
  bathrooms: number;
  type: ListingType;
  contractType: ContractType;
  listingDate: string;
  rating: number;
  styleScore: number;
  description: string;
  neighborhood: string;
  amenities: string | null;
  regionName: string;
  score: number;
  reason: string;
};

const normalize = (value: number, min: number, max: number) => {
  if (max === min) {
    return 0.5;
  }
  return (value - min) / (max - min);
};

const describeReasons = (
  priceScore: number,
  areaScore: number,
  ratingScore: number,
  styleScore: number,
  regionWeight: number,
  ageScore: number
) => {
  const reasons: string[] = [];
  if (priceScore > 0.65) {
    reasons.push('가격대비 경쟁력');
  }
  if (areaScore > 0.65) {
    reasons.push('면적 대비 가성비');
  }
  if (styleScore > 0.6) {
    reasons.push('스타일 점수 우수');
  }
  if (ratingScore > 0.55) {
    reasons.push('평점이 높은 매물');
  }
  if (regionWeight > 0.6) {
    reasons.push('선호 지역 우대');
  }
  if (ageScore > 0.65) {
    reasons.push('최신 등록 매물');
  }
  if (reasons.length === 0) {
    return '다양한 조건을 고루 갖춘 추천 매물';
  }
  return reasons.slice(0, 2).join(' + ');
};

export const getRecommendations = async (
  filters: RecommendationFilters = {},
  limit: number = 6
): Promise<Recommendation[]> => {
  const now = Date.now();

  const where: any = {};
  if (filters.region) {
    where.region = { name: filters.region };
  }
  if (filters.listingType) {
    where.type = filters.listingType;
  }
  if (filters.contractType) {
    where.contractType = filters.contractType;
  }
  if (filters.minStyleScore !== undefined) {
    where.styleScore = { gte: filters.minStyleScore };
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) {
      where.price.gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      where.price.lte = filters.maxPrice;
    }
  }

  const listings = await prisma.listing.findMany({
    where,
    include: { region: true },
  });

  if (!listings.length) {
    return [];
  }

  const prices = listings.map((item) => item.price);
  const areas = listings.map((item) => item.area);
  const ratings = listings.map((item) => item.rating);
  const styles = listings.map((item) => item.styleScore);
  const weights = listings.map((item) => item.region.preferenceWeight);
  const timestamps = listings.map((item) => item.listingDate.getTime());

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minArea = Math.min(...areas);
  const maxArea = Math.max(...areas);
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);
  const minStyle = Math.min(...styles);
  const maxStyle = Math.max(...styles);
  const maxWeight = Math.max(...weights);
  const minDate = Math.min(...timestamps);
  const maxDate = Math.max(...timestamps);

  const scored: Recommendation[] = listings
    .map((listing) => {
      const priceScore = 1 - normalize(listing.price, minPrice, maxPrice);
      const areaScore = normalize(listing.area, minArea, maxArea);
      const ratingScore = normalize(listing.rating, minRating, maxRating);
      const styleScore = normalize(listing.styleScore, minStyle, maxStyle);
      const regionWeightScore = maxWeight === 0 ? 0.5 : listing.region.preferenceWeight / maxWeight;
      const dateNormalized = normalize(listing.listingDate.getTime(), minDate, maxDate);
      const ageScore = 1 - dateNormalized;

      const overall =
        priceScore * 0.22 +
        areaScore * 0.2 +
        ratingScore * 0.2 +
        styleScore * 0.14 +
        ageScore * 0.14 +
        regionWeightScore * 0.1;

      const reason = describeReasons(priceScore, areaScore, ratingScore, styleScore, regionWeightScore, ageScore);

      return {
        id: listing.id,
        title: listing.title,
        address: listing.address,
        price: listing.price,
        area: listing.area,
        rooms: listing.rooms,
        bathrooms: listing.bathrooms,
        type: listing.type,
        contractType: listing.contractType,
        listingDate: listing.listingDate.toISOString(),
        rating: listing.rating,
        styleScore: listing.styleScore,
        description: listing.description,
        neighborhood: listing.neighborhood,
        amenities: listing.amenities,
        regionName: listing.region.name,
        score: Number((overall * 100).toFixed(2)),
        reason,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
};
