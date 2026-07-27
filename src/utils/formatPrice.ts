export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function discountedPrice(price: number, discountPercentage: number): number {
  return price - (price * discountPercentage) / 100;
}
