import type { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'UPDATE_QUANTITY'; productId: number; quantity: number }
  | { type: 'CLEAR_CART' };

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
