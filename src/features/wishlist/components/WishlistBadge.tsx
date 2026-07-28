import { useWishlist } from '../context/WishlistContext';

export function WishlistBadge() {
  const { items } = useWishlist();

  if (items.length === 0) return null;

  return (
    <span
      key={items.length}
      className="absolute -end-1.5 -top-1.5 flex h-5 min-w-5 animate-badgeBounce items-center justify-center rounded-full bg-accent-500 px-1 text-xs font-semibold text-white"
    >
      {items.length}
    </span>
  );
}
