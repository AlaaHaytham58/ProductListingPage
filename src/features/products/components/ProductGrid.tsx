import { AnimatePresence, motion } from 'framer-motion';
import { PackageSearch, RefreshCw } from 'lucide-react';
import type { Product } from '../../../types/product';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { Button } from '../../../components/ui/Button';
import { useI18n } from '../../../i18n/i18nContext';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onViewDetails: (product: Product) => void;
  selectedProductId?: number;
}

export function ProductGrid({
  products,
  isLoading,
  error,
  onRetry,
  onViewDetails,
  selectedProductId,
}: ProductGridProps) {
  const { t } = useI18n();

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300 py-20 text-center dark:border-neutral-700">
        <p className="font-heading text-lg font-bold text-neutral-900 dark:text-neutral-50">
          {t.errorState.title}
        </p>
        <Button size="sm" onClick={onRetry}>
          <RefreshCw size={16} /> {t.errorState.retry}
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 lg:gap-x-6 xl:grid-cols-5 2xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-neutral-300 py-20 text-center dark:border-neutral-700">
        <PackageSearch size={40} className="text-neutral-400" />
        <p className="font-heading text-lg font-bold text-neutral-900 dark:text-neutral-50">
          {t.empty.title}
        </p>
        <p className="text-sm text-neutral-500">{t.empty.subtitle}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 lg:gap-x-6 xl:grid-cols-5 2xl:grid-cols-6">
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <ProductCard
              product={product}
              onViewDetails={onViewDetails}
              isSelected={product.id === selectedProductId}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
