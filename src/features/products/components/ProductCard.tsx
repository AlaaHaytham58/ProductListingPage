import { useState, type CSSProperties } from 'react';
import { Check, Heart, ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../../../types/product';
import { formatPrice } from '../../../utils/formatPrice';
import { useI18n } from '../../../i18n/i18nContext';
import { useCart } from '../../cart/context/CartContext';
import { useWishlist } from '../../wishlist/context/WishlistContext';
import { cn } from '../../../utils/cn';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  isSelected?: boolean;
}

function StarRow({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < rounded ? 'fill-neutral-900 text-neutral-900 dark:fill-neutral-50 dark:text-neutral-50' : 'fill-none text-neutral-300 dark:text-neutral-600'}
        />
      ))}
    </span>
  );
}

export function ProductCard({ product, onViewDetails, isSelected }: ProductCardProps) {
  const { t } = useI18n();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const outOfStock = product.stock === 0;
  const reviewCount = product.reviews?.length ?? 0;
  const hasDiscount = product.discountPercentage > 0;
  const originalPrice = hasDiscount ? product.price / (1 - product.discountPercentage / 100) : product.price;

  const cornerBadge =
    product.rating >= 4.6 ? t.home.bestseller : hasDiscount && product.discountPercentage >= 15 ? t.home.onSale : null;

  const handleAddToCart = () => {
    addItem(product);
    setJustAdded(true);
    toast.success(`${product.title} ${t.toast.addedToCart}`);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    toast.success(wishlisted ? t.toast.removedFromWishlist : t.toast.addedToWishlist);
  };

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
        <button
          onClick={() => onViewDetails(product)}
          className="block h-full w-full"
          aria-label={`${t.product.viewDetails}: ${product.title}`}
        >
          <img
            src={product.thumbnail}
            alt={product.title}
            style={
              isSelected ? undefined : ({ viewTransitionName: `product-image-${product.id}` } as CSSProperties)
            }
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </button>

        {cornerBadge && (
          <span className="pointer-events-none absolute start-2 top-2 rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-neutral-900 shadow-sm dark:bg-surface-elevated dark:text-neutral-50">
            {cornerBadge}
          </span>
        )}

        <button
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? t.wishlist.removeFromWishlist : t.wishlist.addToWishlist}
          aria-pressed={wishlisted}
          className={cn(
            'absolute end-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-surface shadow-sm transition-colors duration-200 dark:bg-surface-elevated',
            wishlisted ? 'text-accent-500' : 'text-neutral-500 hover:text-accent-500 dark:text-neutral-300',
          )}
        >
          <Heart size={16} className={wishlisted ? 'fill-current' : ''} />
        </button>

        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          aria-label={t.product.addToCart}
          className={cn(
            'absolute bottom-2 end-2 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all duration-200',
            'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
            justAdded ? 'bg-success text-white' : 'bg-surface text-neutral-900 hover:bg-primary-600 hover:text-white dark:bg-surface-elevated dark:text-neutral-50',
            outOfStock && 'cursor-not-allowed opacity-0',
          )}
        >
          {justAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
        </button>
      </div>

      <button
        onClick={() => onViewDetails(product)}
        className="mt-2 text-start text-sm font-medium text-neutral-900 line-clamp-1 hover:underline dark:text-neutral-50"
      >
        {product.title}
      </button>

      <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
        <StarRow rating={product.rating} />
        <span className="font-medium text-neutral-700 dark:text-neutral-300">{product.rating.toFixed(1)}</span>
        {reviewCount > 0 && <span>({reviewCount})</span>}
        {product.rating >= 4.7 && (
          <span className="flex items-center gap-0.5 font-medium text-primary-600 dark:text-primary-100">
            <Star size={10} className="fill-primary-600 dark:fill-primary-100" />
            {t.home.topRated}
          </span>
        )}
      </div>

      <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
          {formatPrice(product.price)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-xs text-neutral-400 line-through">{formatPrice(originalPrice)}</span>
            <span className="text-xs font-medium text-success">
              ({Math.round(product.discountPercentage)}% off)
            </span>
          </>
        )}
      </div>

      {product.shippingInformation && (
        <p className="text-xs font-medium text-success">{product.shippingInformation}</p>
      )}

      <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500 capitalize">
        {t.product.soldBy} {product.brand}
      </p>

      {outOfStock && <span className="mt-0.5 text-xs font-medium text-error">{t.product.outOfStock}</span>}

      <div className="mt-2 flex items-center gap-3 text-xs font-medium">
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={cn(
            'flex items-center gap-1 rounded-full border border-neutral-300 px-3 py-1.5 transition-colors hover:border-primary-600 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-600 dark:text-neutral-100 dark:hover:border-primary-100 dark:hover:text-primary-100',
            justAdded && 'border-success text-success dark:border-success dark:text-success',
          )}
        >
          {justAdded ? <Check size={12} /> : <ShoppingCart size={12} />}
          {justAdded ? t.product.added : t.product.addToCart}
        </button>
        <button
          onClick={() => onViewDetails(product)}
          className="text-neutral-500 underline-offset-2 hover:text-primary-600 hover:underline dark:text-neutral-300 dark:hover:text-primary-100"
        >
          {t.product.viewDetails}
        </button>
      </div>
    </div>
  );
}
