import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '../../../types/cart';
import { formatPrice } from '../../../utils/formatPrice';
import { useCart } from '../context/CartContext';

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-3 border-b border-neutral-200 py-3 last:border-none dark:border-neutral-700">
      <img
        src={item.product.thumbnail}
        alt={item.product.title}
        className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-medium text-neutral-900 dark:text-neutral-50">
          {item.product.title}
        </p>
        <p className="text-sm text-neutral-500">{formatPrice(item.product.price)}</p>
        <div className="mt-1 flex items-center gap-2">
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            className="rounded-lg border border-neutral-200 p-1 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="w-6 text-center text-sm">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            className="rounded-lg border border-neutral-200 p-1 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
          {formatPrice(item.product.price * item.quantity)}
        </p>
        <button
          onClick={() => removeItem(item.product.id)}
          className="text-neutral-400 hover:text-error"
          aria-label="Remove item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
