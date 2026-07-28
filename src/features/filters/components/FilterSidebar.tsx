import { X } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { CategoryFilter } from './CategoryFilter';
import { PriceRangeFilter } from './PriceRangeFilter';
import { SortSelect } from './SortSelect';
import { useI18n } from '../../../i18n/i18nContext';
import type { Category, ProductFilters, SortOption } from '../../../types/product';

interface FilterSidebarProps {
  filters: ProductFilters;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPriceApply: (min: number | null, max: number | null) => void;
  onSortChange: (value: SortOption) => void;
  onClearAll: () => void;
}

export function FilterSidebar({
  filters,
  categories,
  onSearchChange,
  onCategoryChange,
  onPriceApply,
  onSortChange,
  onClearAll,
}: FilterSidebarProps) {
  const { t } = useI18n();

  const activePills: { label: string; onRemove: () => void }[] = [];
  if (filters.search) activePills.push({ label: `"${filters.search}"`, onRemove: () => onSearchChange('') });
  if (filters.category !== 'all') {
    const categoryName = categories.find((c) => c.slug === filters.category)?.name ?? filters.category;
    activePills.push({ label: categoryName, onRemove: () => onCategoryChange('all') });
  }
  if (filters.minPrice !== null || filters.maxPrice !== null) {
    activePills.push({
      label: `${filters.minPrice ?? 0} - ${filters.maxPrice ?? '∞'}`,
      onRemove: () => onPriceApply(null, null),
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <SearchBar value={filters.search} onChange={onSearchChange} />

      <div>
        <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">
          {t.product.category}
        </p>
        <CategoryFilter categories={categories} value={filters.category} onChange={onCategoryChange} />
      </div>

      <PriceRangeFilter minPrice={filters.minPrice} maxPrice={filters.maxPrice} onApply={onPriceApply} />

      <SortSelect value={filters.sort} onChange={onSortChange} />

      {activePills.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              {t.filters.activeFilters}
            </p>
            <button
              onClick={onClearAll}
              className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-100"
            >
              {t.filters.clearAll}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activePills.map((pill, i) => (
              <span
                key={i}
                className="flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600 dark:bg-primary-500/10 dark:text-primary-100"
              >
                {pill.label}
                <button onClick={pill.onRemove} aria-label="Remove filter">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
