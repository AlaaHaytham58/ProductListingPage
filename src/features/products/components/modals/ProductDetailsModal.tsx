import { useState, type CSSProperties } from 'react';
import { Heart, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { formatPrice, discountedPrice } from '../../../../utils/formatPrice';
import { useI18n } from '../../../../i18n/i18nContext';
import { useCart } from '../../../cart/context/CartContext';
import { useWishlist } from '../../../wishlist/context/WishlistContext';
import type { Product } from '../../../../types/product';
import { cn } from '../../../../utils/cn';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
  const { t } = useI18n();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [activeImage, setActiveImage] = useState(0);

  if (!product) return null;

  const images = product.images.length > 0 ? product.images : [product.thumbnail];
  const outOfStock = product.stock === 0;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.title} ${t.toast.addedToCart}`);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    toast.success(wishlisted ? t.toast.removedFromWishlist : t.toast.addedToWishlist);
  };

  return (
    <Modal isOpen={!!product} onClose={onClose} className="max-w-3xl">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
            <img
              src={images[activeImage]}
              alt={product.title}
              style={{ viewTransitionName: `product-image-${product.id}` } as CSSProperties}
              className="modal-product-image h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2',
                    i === activeImage ? 'border-primary-600' : 'border-transparent',
                  )}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Badge className="w-fit capitalize">{product.category}</Badge>
          <h2 className="font-heading text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            {product.title}
          </h2>
          <p className="text-sm text-neutral-500">{product.description}</p>

          <div className="mt-2 flex items-center gap-3">
            <span className="font-heading text-2xl font-bold text-accent-600 dark:text-accent-500">
              {formatPrice(discountedPrice(product.price, product.discountPercentage))}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-neutral-400 line-through">{formatPrice(product.price)}</span>
            )}
            <span className="flex items-center gap-1 text-sm text-neutral-500">
              <Star size={14} className="fill-accent-500 text-accent-500" />
              {product.rating.toFixed(1)}
            </span>
          </div>

          <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <dt className="text-neutral-500">{t.product.brand}</dt>
              <dd className="font-medium text-neutral-900 dark:text-neutral-50">{product.brand}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">{t.product.stock}</dt>
              <dd className="font-medium text-neutral-900 dark:text-neutral-50">{product.stock}</dd>
            </div>
          </dl>

          {outOfStock && <span className="text-sm font-medium text-error">{t.product.outOfStock}</span>}

          <div className="mt-4 flex items-center gap-2">
            <Button className="flex-1" disabled={outOfStock} onClick={handleAddToCart}>
              {t.product.addToCart}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={handleToggleWishlist}
              aria-label={wishlisted ? t.wishlist.removeFromWishlist : t.wishlist.addToWishlist}
              aria-pressed={wishlisted}
              className={cn(wishlisted && 'border-accent-500 text-accent-500 dark:border-accent-500')}
            >
              <Heart size={16} className={wishlisted ? 'fill-current' : ''} />
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
