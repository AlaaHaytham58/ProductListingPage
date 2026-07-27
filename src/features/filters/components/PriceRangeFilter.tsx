import { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useI18n } from '../../../i18n/i18nContext';

interface PriceRangeFilterProps {
  minPrice: number | null;
  maxPrice: number | null;
  onApply: (min: number | null, max: number | null) => void;
}

export function PriceRangeFilter({ minPrice, maxPrice, onApply }: PriceRangeFilterProps) {
  const { t } = useI18n();
  const [min, setMin] = useState(minPrice?.toString() ?? '');
  const [max, setMax] = useState(maxPrice?.toString() ?? '');

  const handleApply = () => {
    onApply(min === '' ? null : Number(min), max === '' ? null : Number(max));
  };

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">
        {t.filters.priceRange}
      </p>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          placeholder={t.filters.min}
          value={min}
          onChange={(e) => setMin(e.target.value)}
          aria-label={t.filters.min}
        />
        <Input
          type="number"
          min={0}
          placeholder={t.filters.max}
          value={max}
          onChange={(e) => setMax(e.target.value)}
          aria-label={t.filters.max}
        />
      </div>
      <Button size="sm" variant="outline" className="mt-2 w-full" onClick={handleApply}>
        {t.filters.apply}
      </Button>
    </div>
  );
}
