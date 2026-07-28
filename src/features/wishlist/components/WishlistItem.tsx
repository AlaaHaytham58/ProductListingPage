import { Heart, ShoppingCart } from 'lucide-react';
import type { Product } from '../../../types/product';
import { formatPrice } from '../../../utils/formatPrice';
import { useI18n } from '../../../i18n/i18nContext';
import { useCart } from '../../cart/context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export function WishlistItem({ product }: { product: Product }) {
  const { t } = useI18n();
  const { addItem } = useCart();
  const { removeItem } = useWishlist();
  const outOfStock = product.stock === 0;

  return (
    <div className="flex items-center gap-3 border-b border-neutral-200 py-3 last:border-none dark:border-neutral-700">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-medium text-neutral-900 dark:text-neutral-50">
          {product.title}
        </p>
        <p className="text-sm text-neutral-500">{formatPrice(product.price)}</p>
        <div className="mt-1 flex items-center gap-3">
          <button
            onClick={() => addItem(product)}
            disabled={outOfStock}
            className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline disabled:cursor-not-allowed disabled:text-neutral-400 disabled:no-underline dark:text-primary-100"
          >
            <ShoppingCart size={14} />
            {outOfStock ? t.product.outOfStock : t.wishlist.moveToCart}
          </button>
        </div>
      </div>
      <button
        onClick={() => removeItem(product.id)}
        className="text-accent-500 hover:text-error"
        aria-label={t.wishlist.removeFromWishlist}
      >
        <Heart size={18} className="fill-current" />
      </button>
    </div>
  );
}
