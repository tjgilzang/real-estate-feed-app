import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import type { ContractType, ListingType } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? 'file:./dev.db' }),
});

type SeedListing = {
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
  amenities: string;
  regionName: string;
};

console.log('DB 연결 확인:', process.env.DATABASE_URL);

const regions = [
  {
    name: 'Gangnam',
    popularity: 0.96,
    preferenceWeight: 0.9,
    description: '학군/업무 중심',
  },
  {
    name: 'Mapo',
    popularity: 0.8,
    preferenceWeight: 0.7,
    description: '마포/공덕 역세권',
  },
  {
    name: 'Jongno',
    popularity: 0.7,
    preferenceWeight: 0.65,
    description: '전통+문화 중심',
  },
  {
    name: 'Seongsu',
    popularity: 0.75,
    preferenceWeight: 0.72,
    description: '트렌디+스타일',
  },
  {
    name: 'Yongsan',
    popularity: 0.78,
    preferenceWeight: 0.68,
    description: '한강+용산 플랫폼',
  },
];

const listings: SeedListing[] = [
  {
    title: '대치동 프리미엄 하이츠',
    address: '서울 강남구 대치동 14-12',
    price: 12500,
    area: 84,
    rooms: 3,
    bathrooms: 2,
    type: 'APARTMENT',
    contractType: 'JEONSE',
    listingDate: '2026-02-28',
    rating: 4.8,
    styleScore: 78,
    description: '학교/지하철/공원 인접, 환기 좋은 3룸 구조. 수납/주방 레이아웃이 실사용 중심.',
    neighborhood: '대치동 학군',
    amenities: '2호선/3호선 환승, 탄천 산책로, 단지 내 피트니스',
    regionName: 'Gangnam',
  },
  {
    title: '성수동 슬림뷰 레지던스',
    address: '서울 성동구 성수동1가 26-5',
    price: 8300,
    area: 58,
    rooms: 2,
    bathrooms: 1,
    type: 'VILLA',
    contractType: 'MONTHLY',
    listingDate: '2026-03-02',
    rating: 4.6,
    styleScore: 86,
    description: '복층 느낌의 자연광 가득한 2룸. 카페 거리 도보 3분, 스타일 점수/뷰 기준 상위 10%.',
    neighborhood: '성수동 카페거리',
    amenities: '트렌디 카페, 복합문화시설, 자전거 대여',
    regionName: 'Seongsu',
  },
  {
    title: '마포 프론트스퀘어 메이커',
    address: '서울 마포구 공덕동 258-7',
    price: 6700,
    area: 46,
    rooms: 1,
    bathrooms: 1,
    type: 'OFFICE',
    contractType: 'MONTHLY',
    listingDate: '2026-03-05',
    rating: 4.5,
    styleScore: 72,
    description: '공덕역 초역세권 오피스텔. 사무+거주 혼합 가능, 면적대비 가격 경쟁력 우수.',
    neighborhood: '공덕 전통시장 인접',
    amenities: '공덕역 3개 노선, 근린생활시설, 공유오피스',
    regionName: 'Mapo',
  },
  {
    title: '용산 한강뷰 시그니처',
    address: '서울 용산구 이촌동 88-4',
    price: 11200,
    area: 78,
    rooms: 3,
    bathrooms: 2,
    type: 'APARTMENT',
    contractType: 'SALE',
    listingDate: '2026-02-20',
    rating: 4.7,
    styleScore: 80,
    description: '한강 조망, 첨단 보안 시스템, 전면 발코니 3면 개방형. 장기투자/자녀 진학 매물.',
    neighborhood: '이촌 한강',
    amenities: '한강공원, 국제학교 통학, 복합몰',
    regionName: 'Yongsan',
  },
  {
    title: '종로 한옥마을 리빌딩',
    address: '서울 종로구 가회동 32-1',
    price: 6900,
    area: 54,
    rooms: 2,
    bathrooms: 1,
    type: 'TOWNHOUSE',
    contractType: 'JEONSE',
    listingDate: '2026-03-01',
    rating: 4.4,
    styleScore: 70,
    description: '전통 한옥 감성 + 리모델링. 좁은 면적을 활용한 거실+다이닝 공간 구성.',
    neighborhood: '북촌 빌라',
    amenities: '인사동, 경복궁, 외국인 커뮤니티',
    regionName: 'Jongno',
  },
  {
    title: '마포역 더스카이 스테이',
    address: '서울 마포구 도화동 12-3',
    price: 5100,
    area: 40,
    rooms: 1,
    bathrooms: 1,
    type: 'OFFICE',
    contractType: 'MONTHLY',
    listingDate: '2026-03-07',
    rating: 4.2,
    styleScore: 66,
    description: '마포역 도보 2분, 실내 구조 재질감 중심으로 설계. 주차/짐 보관 별도.',
    neighborhood: '마포역 상권',
    amenities: '마포중앙도서관, 복합문화센터',
    regionName: 'Mapo',
  },
  {
    title: '성수 아카이브 하우스',
    address: '서울 성동구 성수동2가 301-4',
    price: 9100,
    area: 73,
    rooms: 2,
    bathrooms: 2,
    type: 'APARTMENT',
    contractType: 'JEONSE',
    listingDate: '2026-02-18',
    rating: 4.9,
    styleScore: 92,
    description: '전체 리모델링 완료, 스타일 점수 최상위 5%. 단지 내 커뮤니티, 실내 정원.',
    neighborhood: '성수2가 디자인플랫폼',
    amenities: '갤러리, 커뮤니티하우스, 강변 조망',
    regionName: 'Seongsu',
  },
];

async function main() {
  await prisma.listing.deleteMany();

  await Promise.all(
    regions.map((region) =>
      prisma.region.upsert({
        where: { name: region.name },
        update: {
          popularity: region.popularity,
          preferenceWeight: region.preferenceWeight,
          description: region.description,
        },
        create: region,
      })
    )
  );

  for (const listing of listings) {
    const targetRegion = await prisma.region.findUnique({ where: { name: listing.regionName } });
    if (!targetRegion) continue;

    await prisma.listing.create({
      data: {
        title: listing.title,
        address: listing.address,
        price: listing.price,
        area: listing.area,
        rooms: listing.rooms,
        bathrooms: listing.bathrooms,
        type: listing.type,
        contractType: listing.contractType,
        listingDate: new Date(listing.listingDate),
        rating: listing.rating,
        styleScore: listing.styleScore,
        description: listing.description,
        neighborhood: listing.neighborhood,
        amenities: listing.amenities,
        region: { connect: { id: targetRegion.id } },
      },
    });
  }

  console.log('Seed 완료: 매물 %d건 입력', listings.length);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
