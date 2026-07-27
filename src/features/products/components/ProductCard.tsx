import { useState, type CSSProperties } from 'react';
import { Check, ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../../../types/product';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { formatPrice } from '../../../utils/formatPrice';
import { useI18n } from '../../../i18n/i18nContext';
import { useCart } from '../../cart/context/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { t } = useI18n();
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    setJustAdded(true);
    toast.success(`${product.title} ${t.toast.addedToCart}`);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const outOfStock = product.stock === 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-surface shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-700 dark:bg-surface-elevated">
      <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={product.thumbnail}
          alt={product.title}
          style={{ viewTransitionName: `product-image-${product.id}` } as CSSProperties}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Badge className="w-fit capitalize">{product.category}</Badge>
        <h3 className="line-clamp-1 font-heading text-base font-bold text-neutral-900 dark:text-neutral-50">
          {product.title}
        </h3>
        <p className="line-clamp-2 text-sm text-neutral-500">{product.description}</p>

        <div className="mt-1 flex items-center justify-between">
          <span className="font-heading text-lg font-bold text-accent-600 dark:text-accent-500">
            {formatPrice(product.price)}
          </span>
          <span className="flex items-center gap-1 text-sm text-neutral-500">
            <Star size={14} className="fill-accent-500 text-accent-500" />
            {product.rating.toFixed(1)}
          </span>
        </div>

        {outOfStock && <span className="text-xs font-medium text-error">{t.product.outOfStock}</span>}

        <div className="mt-2 flex gap-2">
          <Button
            size="sm"
            className="flex-1"
            disabled={outOfStock}
            onClick={handleAddToCart}
            variant={justAdded ? 'accent' : 'primary'}
          >
            {justAdded ? (
              <>
                <Check size={16} /> {t.product.added}
              </>
            ) : (
              <>
                <ShoppingCart size={16} /> {t.product.addToCart}
              </>
            )}
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onViewDetails(product)}>
            {t.product.viewDetails}
          </Button>
        </div>
      </div>
    </div>
  );
}
