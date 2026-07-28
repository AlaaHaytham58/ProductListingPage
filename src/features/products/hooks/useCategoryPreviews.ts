import { useEffect, useState } from 'react';
import { getProducts } from '../api/productsApi';
import type { Category } from '../../../types/product';

export interface CategoryPreview extends Category {
  thumbnail: string;
}

export function useCategoryPreviews(categories: Category[]): CategoryPreview[] {
  const [previews, setPreviews] = useState<CategoryPreview[]>([]);

  useEffect(() => {
    if (categories.length === 0) return;
    let cancelled = false;

    getProducts({ limit: 0 }).then((response) => {
      if (cancelled) return;
      const thumbnailByCategory = new Map<string, string>();
      for (const product of response.products) {
        if (!thumbnailByCategory.has(product.category)) {
          thumbnailByCategory.set(product.category, product.thumbnail);
        }
      }
      setPreviews(
        categories
          .filter((category) => thumbnailByCategory.has(category.slug))
          .map((category) => ({ ...category, thumbnail: thumbnailByCategory.get(category.slug)! })),
      );
    });

    return () => {
      cancelled = true;
    };
  }, [categories]);

  return previews;
}
