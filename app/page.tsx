'use client';

import { useEffect, useMemo, useState } from 'react';
import FilterPanel, { FilterState, initialFilterState } from '@/components/FilterPanel';
import RecommendationCard from '@/components/RecommendationCard';
import type { Recommendation } from '@/lib/recommendations';

const formatCurrencyLabel = (value: string, label: string) => {
  if (!value) return null;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return `${label}: ${parsed.toLocaleString('ko-KR')}만 원`;
};

const listingTypeLabels: Record<string, string> = {
  APARTMENT: '아파트',
  VILLA: '빌라/타운하우스',
  TOWNHOUSE: '타운하우스',
  OFFICE: '오피스텔/오피스',
};

const contractTypeLabels: Record<string, string> = {
  JEONSE: '전세',
  MONTHLY: '월세',
  SALE: '매매',
};

export default function Home() {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [listings, setListings] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.region) params.set('region', filters.region);
    if (filters.listingType) params.set('listingType', filters.listingType);
    if (filters.contractType) params.set('contractType', filters.contractType);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.styleScore > 0) params.set('minStyleScore', String(filters.styleScore));
    params.set('limit', '9');
    return params.toString();
  }, [filters]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const endpoint = query ? `/api/recommendations?${query}` : '/api/recommendations';

    fetch(endpoint, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('추천 피드를 불러오지 못했습니다.');
        }
        const payload = await response.json();
        setListings(payload.data || []);
        setActiveId(payload.data?.[0]?.id ?? null);
      })
      .catch((reason) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') {
          return;
        }
        setError(reason.message ?? '알 수 없는 오류가 발생했습니다.');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [query]);

  const filterSummary = useMemo(() => {
    return [
      formatCurrencyLabel(filters.minPrice, '최소'),
      formatCurrencyLabel(filters.maxPrice, '최대'),
      filters.region ? `지역: ${filters.region}` : null,
      filters.listingType
        ? `유형: ${listingTypeLabels[filters.listingType] ?? filters.listingType}`
        : null,
      filters.contractType
        ? `계약: ${contractTypeLabels[filters.contractType] ?? filters.contractType}`
        : null,
      filters.styleScore ? `스타일 ≥ ${filters.styleScore}` : null,
    ]
      .filter(Boolean)
      .slice(0, 4);
  }, [filters]);

  const handleReset = () => {
    setFilters(initialFilterState);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-6xl space-y-8 px-5 py-10">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">맞춤 추천</p>
          <h1 className="text-4xl font-semibold text-slate-900">선호 기반 부동산 피드</h1>
          <p className="text-base text-slate-600">
            가격, 지역, 계약 유형을 동시에 고려하고, 추천 사유를 명확히 제공하는 추천 리스트입니다. 필터를
            선택하면 API 응답과 추천 이유가 즉시 갱신됩니다.
          </p>
        </header>

        <FilterPanel filters={filters} onChange={setFilters} onReset={handleReset} />

        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-700">현재 적용 필터</p>
            {filterSummary.length ? (
              filterSummary.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {label}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">전체 매물 보기</span>
            )}
          </div>

          {loading && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
              추천 피드를 불러오는 중...
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !listings.length && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              조건에 맞는 매물이 없습니다. 필터를 조정해 주세요.
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            {listings.map((listing, index) => (
              <RecommendationCard
                key={listing.id}
                listing={listing}
                rank={index + 1}
                expanded={activeId === listing.id}
                onToggle={() => setActiveId((prev) => (prev === listing.id ? null : listing.id))}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
