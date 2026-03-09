import { ContractType, ListingType } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getRecommendations, RecommendationFilters } from '@/lib/recommendations';

const parseEnum = <T extends string>(value: string | null, values: readonly T[]): T | undefined => {
  if (!value) return undefined;
  return values.find((option) => option === value as T);
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const filters: RecommendationFilters = {};
  const region = searchParams.get('region');
  const listingType = parseEnum(searchParams.get('listingType'), Object.values(ListingType));
  const contractType = parseEnum(searchParams.get('contractType'), Object.values(ContractType));
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const styleScore = searchParams.get('minStyleScore');
  const limit = Number(searchParams.get('limit') ?? 6);

  if (region) {
    filters.region = region;
  }
  if (listingType) {
    filters.listingType = listingType;
  }
  if (contractType) {
    filters.contractType = contractType;
  }
  if (minPrice) {
    filters.minPrice = Number(minPrice);
  }
  if (maxPrice) {
    filters.maxPrice = Number(maxPrice);
  }
  if (styleScore) {
    filters.minStyleScore = Number(styleScore);
  }

  const recommendations = await getRecommendations(filters, limit);

  return NextResponse.json({ data: recommendations });
}
