import { Select } from '../../../components/ui/Select';
import { useI18n } from '../../../i18n/i18nContext';
import type { SortOption } from '../../../types/product';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  const { t } = useI18n();
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">{t.filters.sort}</p>
      <Select value={value} onChange={(e) => onChange(e.target.value as SortOption)}>
        <option value="default">{t.filters.sortDefault}</option>
        <option value="price-asc">{t.filters.sortPriceAsc}</option>
        <option value="price-desc">{t.filters.sortPriceDesc}</option>
        <option value="name-asc">{t.filters.sortNameAsc}</option>
      </Select>
    </div>
  );
}
