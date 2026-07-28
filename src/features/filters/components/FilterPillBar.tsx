import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import type { Category, ProductFilters, SortOption } from '../../../types/product';
import { useI18n } from '../../../i18n/i18nContext';
import { cn } from '../../../utils/cn';

const pillBase =
  'flex items-center gap-1.5 rounded-full border border-neutral-300 bg-surface px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-500 dark:border-neutral-600 dark:bg-surface-elevated dark:text-neutral-50';

interface FilterPillBarProps {
  filters: ProductFilters;
  categories: Category[];
  activeExtraFilterCount: number;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onOpenAllFilters: () => void;
}

export function FilterPillBar({
  filters,
  categories,
  activeExtraFilterCount,
  onCategoryChange,
  onSortChange,
  onOpenAllFilters,
}: FilterPillBarProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={cn(pillBase, 'cursor-pointer appearance-none pe-9')}
            aria-label={t.product.category}
          >
            <option value="all">{t.filters.allCategories}</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug} className="capitalize">
                {category.name}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute inset-y-0 end-3 my-auto" />
        </div>

        <button onClick={onOpenAllFilters} className={cn(pillBase, 'relative')}>
          <SlidersHorizontal size={14} />
          {t.filters.filters}
          {activeExtraFilterCount > 0 && (
            <span className="ms-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-semibold text-white">
              {activeExtraFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="relative">
        <select
          value={filters.sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className={cn(pillBase, 'cursor-pointer appearance-none pe-9')}
          aria-label={t.filters.sort}
        >
          <option value="default">{t.filters.sort}: {t.filters.sortDefault}</option>
          <option value="price-asc">{t.filters.sort}: {t.filters.sortPriceAsc}</option>
          <option value="price-desc">{t.filters.sort}: {t.filters.sortPriceDesc}</option>
          <option value="name-asc">{t.filters.sort}: {t.filters.sortNameAsc}</option>
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute inset-y-0 end-3 my-auto" />
      </div>
    </div>
  );
}
