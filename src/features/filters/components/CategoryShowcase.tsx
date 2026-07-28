import { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CategoryPreview } from '../../products/hooks/useCategoryPreviews';
import { cn } from '../../../utils/cn';
import { useI18n } from '../../../i18n/i18nContext';

interface CategoryShowcaseProps {
  previews: CategoryPreview[];
  activeCategory: string;
  onSelect: (slug: string) => void;
}

export function CategoryShowcase({ previews, activeCategory, onSelect }: CategoryShowcaseProps) {
  const { t } = useI18n();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const scrolled = Math.abs(el.scrollLeft);
    setCanScrollStart(scrolled > 4);
    setCanScrollEnd(scrolled < maxScroll - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState, previews.length]);

  const scrollByAmount = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const sign = getComputedStyle(el).direction === 'rtl' ? -1 : 1;
    el.scrollBy({ left: direction * sign * 320, behavior: 'smooth' });
  };

  if (previews.length === 0) return null;

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-neutral-900 dark:text-neutral-50">
        {t.home.shopByInterest}
      </h2>
      <p className="mb-3 text-sm text-neutral-500">{t.home.categories}</p>

      <div className="group/showcase relative">
        <button
          onClick={() => scrollByAmount(-1)}
          aria-label="Scroll categories backward"
          className={cn(
            'absolute start-0 top-12 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-surface shadow-md transition-all duration-200 dark:border-neutral-700 dark:bg-surface-elevated',
            canScrollStart
              ? 'opacity-0 group-hover/showcase:opacity-100'
              : 'pointer-events-none opacity-0',
          )}
        >
          <ChevronLeft size={18} className="rtl:-scale-x-100" />
        </button>

        <div
          ref={scrollerRef}
          onScroll={updateScrollState}
          className="-mx-1 flex gap-4 overflow-x-auto scroll-smooth px-1 pb-2"
        >
          {previews.map((category) => {
            const isActive = category.slug === activeCategory;
            return (
              <button
                key={category.slug}
                onClick={() => onSelect(isActive ? 'all' : category.slug)}
                className="flex w-24 flex-shrink-0 flex-col items-center gap-2 text-center"
              >
                <span
                  className={cn(
                    'h-24 w-24 overflow-hidden rounded-full border-2 transition-colors',
                    isActive
                      ? 'border-primary-600'
                      : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600',
                  )}
                >
                  <img src={category.thumbnail} alt="" className="h-full w-full object-cover" />
                </span>
                <span className="line-clamp-1 text-xs font-medium capitalize text-neutral-700 dark:text-neutral-200">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => scrollByAmount(1)}
          aria-label="Scroll categories forward"
          className={cn(
            'absolute end-0 top-12 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-surface shadow-md transition-all duration-200 dark:border-neutral-700 dark:bg-surface-elevated',
            canScrollEnd ? 'opacity-0 group-hover/showcase:opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          <ChevronRight size={18} className="rtl:-scale-x-100" />
        </button>
      </div>
    </div>
  );
}
