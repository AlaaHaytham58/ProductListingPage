import { createContext, useContext, type ReactNode } from 'react';
import type { Product } from '../../../types/product';
import type { WishlistItems } from '../../../types/wishlist';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

interface WishlistContextValue {
  items: WishlistItems;
  isWishlisted: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
  removeItem: (productId: number) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<WishlistItems>('wishlist-items', []);

  const toggleWishlist = (product: Product) => {
    setItems(
      items.some((item) => item.id === product.id)
        ? items.filter((item) => item.id !== product.id)
        : [...items, product],
    );
  };

  const value: WishlistContextValue = {
    items,
    isWishlisted: (productId) => items.some((item) => item.id === productId),
    toggleWishlist,
    removeItem: (productId) => setItems(items.filter((item) => item.id !== productId)),
    clearWishlist: () => setItems([]),
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
