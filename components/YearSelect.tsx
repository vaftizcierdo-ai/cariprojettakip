'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function YearSelect({
  currentYear,
  selectedYear,
}: {
  currentYear: number;
  selectedYear: number;
}) {
  const router = useRouter();
  const params = useSearchParams();

  // son 7 yıl (istediğin gibi artır)
  const years = Array.from({ length: 7 }, (_, i) => currentYear - i);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    const next = new URLSearchParams(params.toString());
    next.set('year', year);
    router.push(`?${next.toString()}`);
  };

  return (
    <select
      value={String(selectedYear)}
      onChange={onChange}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        color: '#e8e8f0',
        padding: '0.625rem 0.875rem',
        borderRadius: '0.75rem',
        fontSize: '0.875rem',
        outline: 'none',
        cursor: 'pointer',
      }}
    >
      {years.map((y) => (
        <option key={y} value={y} style={{ background: '#1a1a2a' }}>
          {y}
        </option>
      ))}
    </select>
  );
}
