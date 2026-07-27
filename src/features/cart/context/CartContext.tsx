import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { CartAction, CartItem, CartState } from '../../../types/cart';
import type { Product } from '../../../types/product';

function calculateTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
  return items.reduce(
    (acc, item) => ({
      totalItems: acc.totalItems + item.quantity,
      totalPrice: acc.totalPrice + item.quantity * item.product.price,
    }),
    { totalItems: 0, totalPrice: 0 },
  );
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((item) => item.product.id === action.product.id);
      const items = existing
        ? state.items.map((item) =>
            item.product.id === action.product.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...state.items, { product: action.product, quantity: 1 }];
      return { items, ...calculateTotals(items) };
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter((item) => item.product.id !== action.productId);
      return { items, ...calculateTotals(items) };
    }
    case 'UPDATE_QUANTITY': {
      const items = state.items
        .map((item) =>
          item.product.id === action.productId ? { ...item, quantity: action.quantity } : item,
        )
        .filter((item) => item.quantity > 0);
      return { items, ...calculateTotals(items) };
    }
    case 'CLEAR_CART':
      return { items: [], totalItems: 0, totalPrice: 0 };
    default:
      return state;
  }
}

interface CartContextValue extends CartState {
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], totalItems: 0, totalPrice: 0 });

  const value: CartContextValue = {
    ...state,
    addItem: (product) => dispatch({ type: 'ADD_ITEM', product }),
    removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', productId }),
    updateQuantity: (productId, quantity) => dispatch({ type: 'UPDATE_QUANTITY', productId, quantity }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
