import { Heart, Moon, Plus, ShoppingCart, Sun } from 'lucide-react';
import { Container } from './Container';
import { Button } from '../ui/Button';
import { CartBadge } from '../../features/cart/components/CartBadge';
import { WishlistBadge } from '../../features/wishlist/components/WishlistBadge';
import { useI18n } from '../../i18n/i18nContext';

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAddProduct: () => void;
}

export function Header({ isDark, onToggleDark, onOpenCart, onOpenWishlist, onOpenAddProduct }: HeaderProps) {
  const { t, locale, toggleLocale } = useI18n();

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-surface/80 backdrop-blur dark:border-neutral-700 dark:bg-surface-elevated/80">
      <Container className="flex h-16 items-center justify-between gap-4">
        <h1 className="font-heading text-xl font-bold text-primary-600 dark:text-primary-100">
          {t.header.title}
        </h1>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleLocale} aria-label="Toggle language">
            {locale === 'en' ? 'ع' : 'EN'}
          </Button>

          <Button variant="ghost" size="sm" onClick={onToggleDark} aria-label="Toggle dark mode">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          <Button variant="outline" size="sm" onClick={onOpenAddProduct} className="hidden sm:inline-flex">
            <Plus size={16} />
            {t.header.addProduct}
          </Button>
          <Button variant="outline" size="sm" onClick={onOpenAddProduct} className="sm:hidden" aria-label={t.header.addProduct}>
            <Plus size={16} />
          </Button>

          <button
            onClick={onOpenWishlist}
            aria-label={t.header.wishlist}
            className="relative rounded-xl p-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <Heart size={20} />
            <WishlistBadge />
          </button>

          <button
            onClick={onOpenCart}
            aria-label={t.header.cart}
            className="relative rounded-xl p-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <ShoppingCart size={20} />
            <CartBadge />
          </button>
        </div>
      </Container>
    </header>
  );
}
