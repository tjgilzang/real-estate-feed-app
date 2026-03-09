'use client';

import type { Recommendation } from '@/lib/recommendations';

const contractMap: Record<string, string> = {
  JEONSE: '전세',
  MONTHLY: '월세',
  SALE: '매매',
};

const listingMap: Record<string, string> = {
  APARTMENT: '아파트',
  VILLA: '빌라/타운하우스',
  TOWNHOUSE: '타운하우스',
  OFFICE: '오피스텔/오피스',
};

const formatPrice = (value: number) => {
  return `${value.toLocaleString('ko-KR')}만원`;
};

type Props = {
  listing: Recommendation;
  rank: number;
  expanded: boolean;
  onToggle: () => void;
};

export default function RecommendationCard({ listing, rank, expanded, onToggle }: Props) {
  return (
    <article
      className={`flex flex-col gap-3 rounded-2xl border bg-white p-5 transition-shadow hover:shadow-lg ${
        expanded ? 'ring-2 ring-indigo-400' : 'ring-1 ring-slate-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-indigo-500">추천 순위 {rank}위</p>
          <h3 className="text-xl font-semibold text-slate-900">{listing.title}</h3>
          <p className="text-sm text-slate-500">{listing.address}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          점수 {listing.score}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        <span>면적 {listing.area}㎡</span>
        <span>
          룸{listing.rooms} · 욕실{listing.bathrooms}
        </span>
        <span>{listingMap[listing.type]}</span>
        <span>{contractMap[listing.contractType]}</span>
      </div>

      <p className="text-sm font-medium text-slate-700">추천 이유: {listing.reason}</p>
      <p className="text-lg font-bold text-slate-900">{formatPrice(listing.price)}</p>

      <button
        type="button"
        onClick={onToggle}
        className="text-left text-sm font-medium text-indigo-600 underline-offset-4 transition hover:text-indigo-500"
      >
        {expanded ? '상세 보기 접기' : '상세 보기 열기'}
      </button>

      {expanded && (
        <div className="space-y-2 text-sm text-slate-600">
          <p>{listing.description}</p>
          <p className="text-xs uppercase tracking-wide text-slate-400">행정/스타일 정보</p>
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <span>동네: {listing.neighborhood}</span>
            <span>지역: {listing.regionName}</span>
            <span>스타일 점수: {listing.styleScore}</span>
            <span>등록일: {new Date(listing.listingDate).toLocaleDateString('ko-KR')}</span>
          </div>
          <p className="text-sm text-slate-500">편의: {listing.amenities ?? '정보 없음'}</p>
        </div>
      )}
    </article>
  );
}
