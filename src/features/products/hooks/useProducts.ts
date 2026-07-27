import { useEffect, useState } from 'react';
import { getProducts, getProductsByCategory, searchProducts } from '../api/productsApi';
import type { Product, ProductFilters } from '../../../types/product';

const PAGE_SIZE = 12;

interface UseProductsResult {
  products: Product[];
  total: number;
  isLoading: boolean;
  error: string | null;
  prependProduct: (product: Product) => void;
}

export function useProducts(filters: ProductFilters): UseProductsResult {
  const [allMatching, setAllMatching] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedProducts, setAddedProducts] = useState<Product[]>([]);

  const { search, category, minPrice, maxPrice, sort } = filters;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        let response;
        if (category && category !== 'all') {
          response = await getProductsByCategory(category, { limit: 0 });
        } else if (search) {
          response = await searchProducts({ q: search, limit: 0 });
        } else {
          response = await getProducts({ limit: 0 });
        }

        let items = response.products;

        if (category && category !== 'all' && search) {
          const query = search.toLowerCase();
          items = items.filter((p) => p.title.toLowerCase().includes(query));
        }

        if (minPrice !== null) items = items.filter((p) => p.price >= minPrice);
        if (maxPrice !== null) items = items.filter((p) => p.price <= maxPrice);

        if (sort === 'price-asc') items = [...items].sort((a, b) => a.price - b.price);
        else if (sort === 'price-desc') items = [...items].sort((a, b) => b.price - a.price);
        else if (sort === 'name-asc') items = [...items].sort((a, b) => a.title.localeCompare(b.title));

        if (!cancelled) setAllMatching(items);
      } catch {
        if (!cancelled) setError('Something went wrong while loading products.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [search, category, minPrice, maxPrice, sort]);

  const combined = [...addedProducts, ...allMatching];
  const start = (filters.page - 1) * PAGE_SIZE;
  const pageItems = combined.slice(start, start + PAGE_SIZE);

  const prependProduct = (product: Product) => {
    setAddedProducts((prev) => [product, ...prev]);
  };

  return {
    products: pageItems,
    total: combined.length,
    isLoading,
    error,
    prependProduct,
  };
}

export { PAGE_SIZE };
