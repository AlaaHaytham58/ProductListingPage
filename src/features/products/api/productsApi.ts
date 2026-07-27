import type { Category, Product, ProductsResponse } from '../../../types/product';

const BASE = 'https://dummyjson.com';

export async function getProducts(params: {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}): Promise<ProductsResponse> {
  const query = new URLSearchParams();
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  if (params.skip !== undefined) query.set('skip', String(params.skip));
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.order) query.set('order', params.order);

  const res = await fetch(`${BASE}/products?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function searchProducts(params: {
  q: string;
  limit?: number;
  skip?: number;
}): Promise<ProductsResponse> {
  const query = new URLSearchParams({ q: params.q });
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  if (params.skip !== undefined) query.set('skip', String(params.skip));

  const res = await fetch(`${BASE}/products/search?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to search products');
  return res.json();
}

export async function getProductsByCategory(
  category: string,
  params: { limit?: number; skip?: number },
): Promise<ProductsResponse> {
  const query = new URLSearchParams();
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  if (params.skip !== undefined) query.set('skip', String(params.skip));

  const res = await fetch(`${BASE}/products/category/${encodeURIComponent(category)}?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products by category');
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE}/products/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function getProduct(id: number): Promise<Product> {
  const res = await fetch(`${BASE}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const res = await fetch(`${BASE}/products/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to add product');
  return res.json();
}
