'use client';

import type { ContractType, ListingType } from '@prisma/client';

export type FilterState = {
  region: string;
  listingType: ListingType | '';
  contractType: ContractType | '';
  minPrice: string;
  maxPrice: string;
  styleScore: number;
};

type Props = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
};

const regionOptions = ['Gangnam', 'Mapo', 'Jongno', 'Seongsu', 'Yongsan'];
const typeOptions: { label: string; value: ListingType }[] = [
  { label: '아파트', value: 'APARTMENT' },
  { label: '빌라/타운하우스', value: 'VILLA' },
  { label: '타운하우스', value: 'TOWNHOUSE' },
  { label: '오피스텔', value: 'OFFICE' },
];

const contractOptions: { label: string; value: ContractType }[] = [
  { label: '전세', value: 'JEONSE' },
  { label: '월세', value: 'MONTHLY' },
  { label: '매매', value: 'SALE' },
];

export const initialFilterState: FilterState = {
  region: '',
  listingType: '',
  contractType: '',
  minPrice: '',
  maxPrice: '',
  styleScore: 60,
};

const normalizeNumber = (value: string) => (value === '' ? '' : value);

export default function FilterPanel({ filters, onChange, onReset }: Props) {
  const handleUpdate = (key: keyof FilterState, value: string | number) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wide text-slate-500">필터 진입점</p>
        <h2 className="text-2xl font-semibold text-slate-900">지역 · 가격 · 스타일로 추천 피드 제어</h2>
        <p className="text-sm text-slate-500">
          선호 지역, 계약 유형, 가격대를 조합하여 추천 이유와 순위를 확인하세요.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
          지역
          <select
            className="rounded-xl border border-slate-200 px-3 py-2 text-base"
            value={filters.region}
            onChange={(event) => handleUpdate('region', event.target.value)}
          >
            <option value="">전체 지역</option>
            {regionOptions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
          매물 유형
          <select
            className="rounded-xl border border-slate-200 px-3 py-2 text-base"
            value={filters.listingType}
            onChange={(event) => handleUpdate('listingType', event.target.value)}
          >
            <option value="">전체 유형</option>
            {typeOptions.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
          계약 타입
          <select
            className="rounded-xl border border-slate-200 px-3 py-2 text-base"
            value={filters.contractType}
            onChange={(event) => handleUpdate('contractType', event.target.value)}
          >
            <option value="">전체 계약</option>
            {contractOptions.map((contract) => (
              <option key={contract.value} value={contract.value}>
                {contract.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-2 text-sm font-medium text-slate-600">
          <span>가격대 (만원)</span>
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              placeholder="최소"
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2"
              value={normalizeNumber(filters.minPrice)}
              onChange={(event) => handleUpdate('minPrice', event.target.value)}
            />
            <input
              type="number"
              min={0}
              placeholder="최대"
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2"
              value={normalizeNumber(filters.maxPrice)}
              onChange={(event) => handleUpdate('maxPrice', event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-sm font-medium text-slate-600">
          <span>스타일 점수 최소 {filters.styleScore}</span>
          <span className="text-xs text-slate-400">0~100</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={filters.styleScore}
          aria-label="스타일 점수 슬라이더"
          onChange={(event) => handleUpdate('styleScore', Number(event.target.value))}
          className="w-full"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
        >
          필터 초기화
        </button>
        <p className="text-xs text-slate-500">적용 시 추천 산정이 즉시 갱신됩니다.</p>
      </div>
    </section>
  );
}
