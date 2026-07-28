import { useState } from 'react';
import { Toaster } from 'sonner';
import { Header } from './components/layout/Header';
import { Container } from './components/layout/Container';
import { FilterSidebar } from './features/filters/components/FilterSidebar';
import { FilterDrawer } from './features/filters/components/FilterDrawer';
import { FilterPillBar } from './features/filters/components/FilterPillBar';
import { CategoryShowcase } from './features/filters/components/CategoryShowcase';
import { ProductGrid } from './features/products/components/ProductGrid';
import { Pagination } from './features/products/components/Pagination';
import { ProductDetailsModal } from './features/products/components/modals/ProductDetailsModal';
import { AddProductModal } from './features/products/components/modals/AddProductModal';
import { CartDrawer } from './features/cart/components/CartDrawer';
import { ScrollToTopButton } from './components/ui/ScrollToTopButton';
import { useProducts, PAGE_SIZE } from './features/products/hooks/useProducts';
import { useCategories } from './features/products/hooks/useCategories';
import { useCategoryPreviews } from './features/products/hooks/useCategoryPreviews';
import { useDebounce } from './features/products/hooks/useDebounce';
import { useDarkMode } from './hooks/useDarkMode';
import { useI18n } from './i18n/i18nContext';
import { startViewTransition } from './utils/viewTransition';
import type { Product, ProductFilters, SortOption } from './types/product';

const initialFilters: ProductFilters = {
  search: '',
  category: 'all',
  minPrice: null,
  maxPrice: null,
  sort: 'default',
  page: 1,
};

function App() {
  const { t } = useI18n();
  const [isDark, toggleDark] = useDarkMode();
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const debouncedSearch = useDebounce(filters.search, 300);
  const { categories } = useCategories();
  const categoryPreviews = useCategoryPreviews(categories);
  const { products, total, isLoading, error, prependProduct } = useProducts({
    ...filters,
    search: debouncedSearch,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const updateFilters = (partial: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial, page: 1 }));
  };

  const handleViewDetails = (product: Product) => {
    startViewTransition(() => setSelectedProduct(product));
  };

  const handleCloseDetails = () => {
    startViewTransition(() => setSelectedProduct(null));
  };

  const activeExtraFilterCount =
    (filters.search ? 1 : 0) + (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0);

  const filterSidebarProps = {
    filters,
    categories,
    onSearchChange: (value: string) => updateFilters({ search: value }),
    onCategoryChange: (value: string) => updateFilters({ category: value }),
    onPriceApply: (min: number | null, max: number | null) => updateFilters({ minPrice: min, maxPrice: max }),
    onSortChange: (value: SortOption) => updateFilters({ sort: value }),
    onClearAll: () => setFilters(initialFilters),
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <Toaster position="top-right" richColors />
      <Header
        isDark={isDark}
        onToggleDark={toggleDark}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAddProduct={() => setIsAddProductOpen(true)}
      />

      <Container className="py-6">
        <div className="mb-8">
          <CategoryShowcase
            previews={categoryPreviews}
            activeCategory={filters.category}
            onSelect={(slug) => updateFilters({ category: slug })}
          />
        </div>

        <h2 className="mb-3 font-heading text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          {t.home.findSomethingYouLove}
        </h2>

        <div className="mb-6">
          <FilterPillBar
            filters={filters}
            categories={categories}
            activeExtraFilterCount={activeExtraFilterCount}
            onCategoryChange={(value) => updateFilters({ category: value })}
            onSortChange={(value) => updateFilters({ sort: value })}
            onOpenAllFilters={() => setIsFilterDrawerOpen(true)}
          />
        </div>

        <p className="mb-4 text-sm text-neutral-500">
          {t.pagination.showing} {products.length} {t.pagination.of} {total} {t.pagination.products}
        </p>

        <ProductGrid
          products={products}
          isLoading={isLoading}
          error={error}
          onRetry={() => updateFilters({})}
          onViewDetails={handleViewDetails}
          selectedProductId={selectedProduct?.id}
        />

        <Pagination
          page={filters.page}
          totalPages={totalPages}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        />
      </Container>

      <FilterDrawer isOpen={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)}>
        <FilterSidebar {...filterSidebarProps} />
      </FilterDrawer>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <ProductDetailsModal product={selectedProduct} onClose={handleCloseDetails} />

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductAdded={prependProduct}
      />

      <ScrollToTopButton />
    </div>
  );
}

export default App;
