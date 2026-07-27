import { Select } from '../../../components/ui/Select';
import { useI18n } from '../../../i18n/i18nContext';
import type { Category } from '../../../types/product';

interface CategoryFilterProps {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
}

export function CategoryFilter({ categories, value, onChange }: CategoryFilterProps) {
  const { t } = useI18n();
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value)} aria-label={t.filters.allCategories}>
      <option value="all">{t.filters.allCategories}</option>
      {categories.map((category) => (
        <option key={category.slug} value={category.slug} className="capitalize">
          {category.name}
        </option>
      ))}
    </Select>
  );
}
