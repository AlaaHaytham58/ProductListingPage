import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useI18n } from '../../../i18n/i18nContext';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(page: number, totalPages: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = [];
  const add = (p: number) => pages.push(p);

  add(1);
  if (page > 3) pages.push('ellipsis');
  for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) add(p);
  if (page < totalPages - 2) pages.push('ellipsis');
  if (totalPages > 1) add(totalPages);

  return pages;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const { t } = useI18n();
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-neutral-200 dark:hover:bg-neutral-800"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">{t.pagination.prev}</span>
      </button>

      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-neutral-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'h-9 min-w-9 rounded-xl px-3 text-sm font-medium transition-colors',
              p === page
                ? 'bg-primary-600 text-white'
                : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800',
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-neutral-200 dark:hover:bg-neutral-800"
      >
        <span className="hidden sm:inline">{t.pagination.next}</span>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
