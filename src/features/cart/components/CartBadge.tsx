import { useCart } from '../context/CartContext';

export function CartBadge() {
  const { totalItems } = useCart();

  if (totalItems === 0) return null;

  return (
    <span
      key={totalItems}
      className="absolute -end-1.5 -top-1.5 flex h-5 min-w-5 animate-badgeBounce items-center justify-center rounded-full bg-accent-500 px-1 text-xs font-semibold text-white"
    >
      {totalItems}
    </span>
  );
}
