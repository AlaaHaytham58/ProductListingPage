# TCCD Frontend Level 3 — Complete Build Guide

## PROJECT OVERVIEW

Build a **Product Listing Page** for an e-commerce store using **React + TypeScript + Vite + Tailwind CSS**.
Single page app. No routing library needed — use modals for details and add-product views.

### What the graders care about (from the PDF):
1. Main functionality works — products display, cart count, filters, pagination, add product form
2. Consistent color usage and contrast
3. Simple and intuitive UX with clearly labeled actions
4. Responsive design (phone → tablet → desktop)
5. Efficient use of React features — typed hooks, reusable components, clean state management

---

## ARCHITECTURE

```
src/
├── components/                  # Shared reusable UI primitives
│   ├── ui/                      # Button, Input, Select, Modal, Badge, Skeleton, Toast
│   └── layout/                  # Header, Container, Footer
├── features/
│   ├── products/
│   │   ├── components/          # ProductCard, ProductGrid, ProductCardSkeleton
│   │   │   └── modals/          # ProductDetailsModal, AddProductModal
│   │   ├── hooks/               # useProducts, useCategories, useDebounce
│   │   └── api/                 # productsApi.ts (all fetch calls)
│   ├── cart/
│   │   ├── components/          # CartBadge, CartDrawer, CartItem
│   │   └── context/             # CartContext.tsx + CartProvider
│   └── filters/
│       └── components/          # SearchBar, CategoryFilter, PriceRangeFilter, FilterSidebar
├── i18n/                        # translations/en.ts, translations/ar.ts, i18nContext.tsx
├── types/                       # product.ts, cart.ts, api.ts
├── utils/                       # formatPrice.ts, cn.ts (classname merger), validators.ts
├── hooks/                       # useLocalStorage.ts, useMediaQuery.ts
├── App.tsx
├── main.tsx
└── index.css                    # Tailwind directives + custom CSS animations
```

### Key architecture rules:
- **No prop drilling** — Cart state lives in CartContext, i18n in I18nContext
- **Each feature folder is self-contained** — its own components, hooks, api
- **Types are centralized** in `types/` and imported everywhere
- **API layer is isolated** — components never call fetch directly, only through hooks that call api functions
- **All components are typed** with explicit Props interfaces

---

## TECH STACK

| Tool | Why |
|---|---|
| Vite | Fast dev server, instant HMR |
| React 18+ | Required by task |
| TypeScript | Required by task — strict mode ON |
| Tailwind CSS v3 | Utility-first, responsive prefixes, dark mode via `class` strategy |
| react-hook-form + zod | Form validation for Add Product |
| framer-motion | AnimatePresence for card transitions + layout animations |
| sonner | Toast notifications (tiny, beautiful) |
| lucide-react | Icons — consistent, tree-shakeable |
| clsx + tailwind-merge | Conditional classnames without conflicts |

### NO npm packages for:
- State management (use React Context + useReducer)
- HTTP (use native fetch — no axios needed for this scope)
- Routing (no react-router — use modals)
- CSS-in-JS (Tailwind handles everything)

---

## DESIGN SYSTEM — NON-NEGOTIABLE CHOICES

### The goal: look human-designed, not AI-generated

**CRITICAL**: Do NOT use cream/beige backgrounds (#F4F1EA), terracotta accents, acid-green-on-black, or broadsheet newspaper layouts. These are the three most common AI-generated design patterns and reviewers will clock them immediately.

### Font Pairing
**Headings:** `DM Sans` (700 weight) — geometric, modern, slightly playful
**Body:** `Inter` (400, 500 weights) — the best UI body font, period
**Why this pair works:** DM Sans has wider letter-spacing and rounder terminals than Inter, creating visual contrast without clashing. Both are variable fonts = one file each = fast loading.

Load via Google Fonts in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Color Palette

```css
:root {
  /* Primary — deep indigo, not generic blue */
  --color-primary-50: #eef2ff;
  --color-primary-100: #e0e7ff;
  --color-primary-500: #6366f1;
  --color-primary-600: #4f46e5;
  --color-primary-700: #4338ca;

  /* Neutral — cool slate, NOT warm grey */
  --color-neutral-50: #f8fafc;
  --color-neutral-100: #f1f5f9;
  --color-neutral-200: #e2e8f0;
  --color-neutral-300: #cbd5e1;
  --color-neutral-500: #64748b;
  --color-neutral-700: #334155;
  --color-neutral-800: #1e293b;
  --color-neutral-900: #0f172a;

  /* Accent — warm amber for cart/CTA actions */
  --color-accent-500: #f59e0b;
  --color-accent-600: #d97706;

  /* Semantic */
  --color-success: #10b981;
  --color-error: #ef4444;

  /* Surface */
  --color-surface: #ffffff;
  --color-surface-elevated: #ffffff;
  --color-background: var(--color-neutral-50);
}

/* DARK MODE */
.dark {
  --color-surface: #1e293b;
  --color-surface-elevated: #334155;
  --color-background: #0f172a;
}
```

Map these to Tailwind in `tailwind.config.ts`:
```ts
colors: {
  primary: {
    50: 'var(--color-primary-50)',
    100: 'var(--color-primary-100)',
    500: 'var(--color-primary-500)',
    600: 'var(--color-primary-600)',
    700: 'var(--color-primary-700)',
  },
  // ... same pattern for neutral, accent
}
```

### Spacing & Layout
- Page max-width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Card gap: `gap-6` on desktop, `gap-4` on mobile
- Border radius: `rounded-2xl` on cards, `rounded-xl` on buttons/inputs — CONSISTENT everywhere
- Shadows: `shadow-sm` default, `shadow-md` on hover — subtle, never heavy
- Product grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`

### RTL Support (for Arabic i18n)
- Set `dir="rtl"` on `<html>` when Arabic is active
- Use Tailwind's logical properties: `ps-4` instead of `pl-4`, `ms-2` instead of `ml-2`
- Use `start` / `end` instead of `left` / `right` in flex/grid alignment
- The font pairing (DM Sans + Inter) both support Arabic glyphs

---

## UI COMPONENT SOURCES — WHERE TO COPY FROM

**DO NOT design from scratch. Copy structure from these, then customize colors/spacing to match the palette above.**

### Primary sources (all free, all copy-paste Tailwind):

1. **Meraki UI** — https://merakiui.com/components
   - USE: Navbar, Product Cards, Skeleton, Modals, Pagination, Forms, Inputs
   - WHY: Built-in RTL + dark mode support. Components already handle the LTR↔RTL flip
   - Copy the Card component from their ecommerce section, the Modal from Application UI, the Skeleton loader

2. **HyperUI** — https://hyperui.dev/components/ecommerce/products
   - USE: Product card variations, filter sidebar, pagination
   - WHY: eCommerce-specific components, clean and minimal
   - Copy their product card grid layout as a starting point

3. **Preline UI** — https://preline.co/examples.html
   - USE: If you need a more complete page layout reference
   - Their e-commerce product listing example is a good structural reference

### How to adapt copied components:
1. Copy the HTML structure
2. Replace all color classes with your palette (`bg-blue-500` → `bg-primary-500`)
3. Replace font classes with your font system (`font-sans` → `font-body`, etc.)
4. Add TypeScript props interface
5. Extract into a React component with proper typing
6. Add `dir` support for RTL where needed

---

## API LAYER — DUMMYJSON

### Base URL: `https://dummyjson.com`

### Endpoints you need:

```typescript
// types/product.ts
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface Category {
  slug: string;
  name: string;
  url: string;
}
```

### API functions (src/features/products/api/productsApi.ts):

```typescript
const BASE = 'https://dummyjson.com';

// Get paginated products
// GET /products?limit=12&skip=0
export async function getProducts(params: {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}): Promise<ProductsResponse>

// Search products by name
// GET /products/search?q=phone&limit=12&skip=0
export async function searchProducts(params: {
  q: string;
  limit?: number;
  skip?: number;
}): Promise<ProductsResponse>

// Get products by category
// GET /products/category/smartphones?limit=12&skip=0
export async function getProductsByCategory(
  category: string,
  params: { limit?: number; skip?: number }
): Promise<ProductsResponse>

// Get all categories
// GET /products/categories
export async function getCategories(): Promise<Category[]>

// Get single product
// GET /products/1
export async function getProduct(id: number): Promise<Product>

// Add product (simulated — returns fake response)
// POST /products/add
export async function addProduct(product: Omit<Product, 'id'>): Promise<Product>
```

### IMPORTANT API NOTES:
- Default limit is 30, use `limit=12` for a cleaner grid (4×3 on desktop)
- `total` in the response tells you how many products exist for pagination math
- Search endpoint (`/products/search?q=`) does NOT support category filtering simultaneously
- For combined search + category: fetch by category, then client-side filter by search term
- Price range filtering is NOT supported by the API — do it client-side after fetching
- The `?delay=800` param simulates slow network — use during dev to test skeletons
- POST to `/products/add` returns a response with a new `id` but does NOT persist

---

## FEATURE SPECIFICATIONS

### 1. Product Card
```
┌─────────────────────────┐
│  ┌───────────────────┐  │
│  │                   │  │
│  │   Product Image   │  │  ← aspect-ratio: 4/3, object-cover
│  │                   │  │
│  └───────────────────┘  │
│  Category badge          │  ← small pill, primary-50 bg, primary-600 text
│  Product Title           │  ← DM Sans 700, line-clamp-1
│  Description snippet     │  ← Inter 400, text-neutral-500, line-clamp-2
│  ┌──────┐               │
│  │$Price│    ★ 4.5       │  ← price in accent-600, rating with star icon
│  └──────┘               │
│  ┌──────────┐ ┌────────┐│
│  │ Add Cart │ │ Details ││  ← two clear action buttons
│  └──────────┘ └────────┘│
└─────────────────────────┘
```
- "Add to Cart" button: solid primary-600, white text, cart icon from lucide
- "View Details" button: outlined, primary-600 border + text
- On hover: card lifts with `hover:-translate-y-1 hover:shadow-lg transition-all duration-200`
- Micro-interaction: on "Add to Cart" click, button briefly shows a checkmark ✓ for 1.5s then reverts

### 2. Skeleton Card (while loading)
Same dimensions as ProductCard. Use `animate-pulse` with neutral-200 background blocks:
- Image area: full-width rectangle
- Title: 60% width bar
- Description: two bars at 90% and 70% width
- Price: small bar
- Buttons: two bars
Show 12 skeleton cards (matching the grid) during initial load

### 3. Filter Sidebar / Bar
**Desktop (lg+):** Sticky sidebar on the left, 280px wide
**Tablet/Mobile (<lg):** Collapsible drawer that slides in from left, triggered by a filter icon button

Contents:
- **Search input** — with magnifying glass icon, debounced 300ms
- **Category dropdown** — populated from `/products/categories`, includes "All Categories" option
- **Price range** — two number inputs (Min / Max) with a small "Apply" button
- **Sort by** — dropdown: "Default", "Price: Low → High", "Price: High → Low", "Name A→Z"
- **Active filters display** — show pills for active filters with × to remove each
- **Clear all filters** — text button, only visible when filters are active

### 4. Pagination
- Show at bottom of product grid
- Display: « Prev | 1 | 2 | 3 | ... | 10 | Next »
- Highlight current page with primary-600 bg
- Disabled state for Prev on page 1 and Next on last page
- Items per page: 12 (hardcoded is fine)
- **Reset to page 1** whenever any filter changes — this is a common bug, don't miss it

### 5. Cart System
**State management:** CartContext with useReducer

```typescript
// types/cart.ts
interface CartItem {
  product: Product;
  quantity: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'UPDATE_QUANTITY'; productId: number; quantity: number }
  | { type: 'CLEAR_CART' };

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
```

**Cart badge** in header: shows totalItems count. When count changes, badge does a brief scale bounce animation (CSS keyframe: scale 1 → 1.3 → 1 over 300ms).

**Cart drawer** (EXTRA): slide-out panel from right side showing:
- List of items with thumbnail, name, quantity ± controls, item subtotal
- Total price at bottom
- "Clear Cart" button

### 6. Product Details Modal
Triggered by "View Details" button on any card. Uses native `<dialog>` element or a custom Modal component.

Contents:
- Large product image (with thumbnail gallery if images array has multiple)
- Full title, full description (no line-clamp)
- Price, discount percentage, rating (stars), stock count, brand, category
- "Add to Cart" button
- Close button (×) and click-outside-to-close

**View Transition:** When opening, the product image morphs from the card position to the modal position using the View Transitions API:
```css
.product-card-image-{id} {
  view-transition-name: product-image-{id};
}
.modal-product-image {
  view-transition-name: product-image-{id};
}
```
```typescript
document.startViewTransition(() => {
  setSelectedProduct(product);
  setModalOpen(true);
});
```

### 7. Add Product Form (Modal)
Triggered by a "+" FAB button or "Add Product" button in the header.

Fields with validation (react-hook-form + zod):
```typescript
const addProductSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  price: z.number().positive('Price must be positive'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  brand: z.string().min(1, 'Brand is required'),
  thumbnail: z.string().url('Must be a valid URL').or(z.literal('')),
});
```

- Show inline error messages below each field in red
- On submit: POST to `/products/add`, then prepend the returned product to the local products array
- Show success toast: "Product added successfully!"
- Close modal after successful submission
- Disable submit button while submitting, show loading spinner

---

## EXTRAS IMPLEMENTATION

### 8. Dark Mode Toggle
- Store preference in React state (or localStorage if you want persistence)
- Toggle button in header: Sun icon ↔ Moon icon
- Add/remove `dark` class on `<html>` element
- All components use Tailwind's `dark:` prefix for dark variants
- Transition: `transition-colors duration-200` on body

### 9. i18n (English ↔ Arabic)
Create an I18nContext:

```typescript
// i18n/translations/en.ts
export const en = {
  header: { title: 'ShopHub', cart: 'Cart', addProduct: 'Add Product' },
  filters: { search: 'Search products...', allCategories: 'All Categories',
             priceRange: 'Price Range', min: 'Min', max: 'Max', clearAll: 'Clear filters' },
  product: { addToCart: 'Add to Cart', viewDetails: 'View Details', outOfStock: 'Out of Stock' },
  cart: { empty: 'Your cart is empty', total: 'Total', clear: 'Clear Cart', items: 'items' },
  addForm: { title: 'Add New Product', name: 'Product Name', price: 'Price',
             description: 'Description', category: 'Category', brand: 'Brand',
             image: 'Image URL', submit: 'Add Product', cancel: 'Cancel' },
  pagination: { prev: 'Previous', next: 'Next', showing: 'Showing', of: 'of', products: 'products' },
  toast: { addedToCart: 'added to cart', productAdded: 'Product added successfully!' },
};

// i18n/translations/ar.ts
export const ar = {
  header: { title: 'شوب هب', cart: 'السلة', addProduct: 'إضافة منتج' },
  filters: { search: 'ابحث عن منتجات...', allCategories: 'جميع الفئات',
             priceRange: 'نطاق السعر', min: 'أقل', max: 'أعلى', clearAll: 'مسح الفلاتر' },
  product: { addToCart: 'أضف للسلة', viewDetails: 'عرض التفاصيل', outOfStock: 'نفذت الكمية' },
  cart: { empty: 'سلتك فارغة', total: 'المجموع', clear: 'تفريغ السلة', items: 'عناصر' },
  addForm: { title: 'إضافة منتج جديد', name: 'اسم المنتج', price: 'السعر',
             description: 'الوصف', category: 'الفئة', brand: 'العلامة التجارية',
             image: 'رابط الصورة', submit: 'إضافة المنتج', cancel: 'إلغاء' },
  pagination: { prev: 'السابق', next: 'التالي', showing: 'عرض', of: 'من', products: 'منتجات' },
  toast: { addedToCart: 'أُضيف إلى السلة', productAdded: 'تمت إضافة المنتج بنجاح!' },
};
```

- Toggle button in header: "EN" / "ع" text button
- When Arabic: set `document.documentElement.dir = 'rtl'` and `lang = 'ar'`
- When English: set `dir = 'ltr'` and `lang = 'en'`
- Use `useI18n()` hook that returns `{ t, locale, toggleLocale }`
- Access translations: `t.product.addToCart`

### 10. Micro-Interactions (CSS only — no extra libraries needed for these)

**Add to Cart button morph:**
```css
@keyframes cartSuccess {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
```
On click → change button text to "✓ Added" + green bg for 1.5s → revert

**Cart badge bounce:**
```css
@keyframes badgeBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}
.cart-badge-bounce {
  animation: badgeBounce 0.3s ease-out;
}
```
Trigger by changing the `key` prop on the badge element when count changes

**Card hover lift:**
Already handled by Tailwind: `hover:-translate-y-1 transition-transform duration-200`

**Wishlist heart fill:**
```css
@keyframes heartPop {
  0% { transform: scale(1); }
  30% { transform: scale(1.3); }
  60% { transform: scale(0.9); }
  100% { transform: scale(1); }
}
```

**Shimmer skeleton animation:**
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton-shimmer {
  background: linear-gradient(90deg,
    var(--color-neutral-200) 25%,
    var(--color-neutral-100) 50%,
    var(--color-neutral-200) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

### 11. View Transitions API
```typescript
// utils/viewTransition.ts
export function startViewTransition(callback: () => void) {
  if (document.startViewTransition) {
    document.startViewTransition(callback);
  } else {
    callback(); // fallback for unsupported browsers
  }
}
```

Use when:
- Opening/closing product details modal
- Switching pagination pages (cards fade-crossfade)

### 12. Animated Filter Transitions (framer-motion)
```tsx
<AnimatePresence mode="popLayout">
  {products.map(product => (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      layout
      transition={{ duration: 0.2 }}
    >
      <ProductCard product={product} />
    </motion.div>
  ))}
</AnimatePresence>
```

---

## 6–7 HOUR BUILD SCHEDULE

### Hour 0:00–0:30 — Scaffolding
- `npm create vite@latest shop-hub -- --template react-ts`
- Install: tailwindcss, postcss, autoprefixer, framer-motion, sonner, lucide-react, react-hook-form, @hookform/resolvers, zod, clsx, tailwind-merge
- Configure tailwind.config.ts with custom colors, fonts, darkMode: 'class'
- Set up Google Fonts in index.html
- Create folder structure (copy the architecture above exactly)
- Create `utils/cn.ts` (clsx + twMerge helper)
- Write all types in `types/product.ts` and `types/cart.ts`
- **COMMIT: "chore: project scaffolding and config"**

### Hour 0:30–1:00 — API + Data Layer
- Write `productsApi.ts` with all fetch functions (typed)
- Write `useProducts` hook — takes filter params, returns { products, total, isLoading, error }
- Write `useCategories` hook — fetches categories once, caches
- Write `useDebounce` hook (generic, 300ms default)
- Test in browser console that data flows
- **COMMIT: "feat: API layer and data fetching hooks"**

### Hour 1:00–2:15 — Core UI (THE MOST IMPORTANT HOUR)
- Build Header component (logo, cart badge, dark toggle, language toggle, add product button)
- Build ProductCard (copy structure from Meraki UI / HyperUI cards, restyle)
- Build ProductCardSkeleton with shimmer animation
- Build ProductGrid (responsive grid, maps over products or skeletons)
- Build Container/Layout wrapper
- At this point the page should show real products in a beautiful grid with loading skeletons
- **COMMIT: "feat: product grid with cards and skeleton loading"**

### Hour 2:15–3:15 — Filters + Pagination
- Build SearchBar with debounce
- Build CategoryFilter (select dropdown populated from API)
- Build PriceRangeFilter (min/max inputs)
- Build SortSelect
- Build FilterSidebar (desktop) / FilterDrawer (mobile, slides in)
- Build Pagination component
- Wire everything: filter state in parent, passed to useProducts, reset page on filter change
- **COMMIT: "feat: filtering by name, category, price range with pagination"**

### Hour 3:15–4:00 — Cart System
- Create CartContext + CartProvider with useReducer
- Build CartBadge in header with bounce animation
- Wire "Add to Cart" button on ProductCard → dispatch ADD_ITEM
- Add sonner Toaster, show toast on add
- Build CartDrawer (slide-out panel with items list, quantities, total)
- Micro-interaction: button morph to "✓ Added" on click
- **COMMIT: "feat: cart system with context, drawer, and notifications"**

### Hour 4:00–4:45 — Details Modal + Add Product Form
- Build Modal component (reusable, uses `<dialog>` or div+backdrop)
- Build ProductDetailsModal — full product info, image gallery, add to cart
- Build AddProductModal with react-hook-form + zod validation
- POST to API, prepend to local list, show success toast
- Add View Transition on modal open
- **COMMIT: "feat: product details modal and add product form with validation"**

### Hour 4:45–5:30 — i18n + Dark Mode
- Create I18nContext with translations object
- Create `useI18n` hook
- Replace all hardcoded strings with `t.xxx.yyy`
- Add RTL support: `dir` attribute, logical Tailwind properties
- Implement dark mode: toggle in header, `dark` class on html
- Dark variants on all components (bg, text, border colors)
- **COMMIT: "feat: i18n (EN/AR with RTL) and dark mode"**

### Hour 5:30–6:15 — Polish & Extras
- Add framer-motion AnimatePresence on product grid
- Add all micro-interactions (button morph, badge bounce, heart pop)
- Test every breakpoint: 375px (iPhone SE), 768px (iPad), 1024px, 1440px
- Empty state: "No products match your filters" with illustration
- Error state: "Something went wrong" with retry button
- Add favicon (shopping bag from lucide, convert to .ico)
- **COMMIT: "feat: animations, micro-interactions, and responsive polish"**

### Hour 6:15–7:00 — README + Deploy + Final
- Write README.md (see template below)
- `npm run build` — fix any TypeScript errors
- Deploy to Vercel (connect GitHub repo → auto deploy)
- Add live demo link to README
- Review all commits — clean up any console.logs
- Final smoke test on deployed version
- **COMMIT: "docs: README with features, setup, and architecture"**

---

## README.md TEMPLATE

```markdown
# 🛒 ShopHub — Product Listing Page

A modern, responsive e-commerce product listing built with React, TypeScript, and Tailwind CSS.

🔗 **[Live Demo](https://your-vercel-url.vercel.app)**

## ✨ Features

### Core
- Product grid with responsive layout (1→2→3→4 columns)
- Real-time search, category filter, price range filter
- Pagination with smart page reset on filter change
- Shopping cart with item management and live counter
- Add new product form with full validation
- Product details modal with image gallery

### Extras
- 🌙 Dark mode with system preference detection
- 🌐 i18n: English ↔ Arabic with full RTL support
- ✨ View Transitions API for smooth modal animations
- 💫 Micro-interactions (button morphs, badge bounces, card lifts)
- 🦴 Shimmer skeleton loading screens
- 📱 Fully responsive (tested 375px → 1440px)

## 🛠 Tech Stack

React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · Zod · React Hook Form · Sonner

## 🚀 Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/shop-hub.git
cd shop-hub
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 📁 Architecture

[paste the folder structure from above]

### Design Decisions
- **No routing library** — Single page with modals keeps the bundle small and matches the task scope
- **Context + useReducer** for cart — Avoids unnecessary dependencies while demonstrating proper state management patterns
- **API layer isolation** — Components never fetch directly; hooks call typed API functions, making the data layer testable and swappable
- **CSS variables for theming** — Dark mode and potential theme changes require only variable swaps, not class rewrites
- **Logical CSS properties** — `padding-inline-start` instead of `padding-left` enables RTL support without duplicate stylesheets

## 📄 License
MIT
```

---

## COMMIT STRATEGY

Make commits as you finish each section. **Never do one giant commit at the end.**
Suggested commit messages (conventional commits format):

```
chore: project scaffolding and config
feat: API layer and data fetching hooks
feat: product grid with cards and skeleton loading
feat: filtering by name, category, price range with pagination
feat: cart system with context, drawer, and notifications
feat: product details modal and add product form with validation
feat: i18n (EN/AR with RTL) and dark mode
feat: animations, micro-interactions, and responsive polish
docs: README with features, setup, and architecture
fix: responsive tweaks and edge cases
```

---

## COMMON MISTAKES TO AVOID

1. **Forgetting to reset pagination when filters change** — always `setPage(1)` in filter handlers
2. **Not handling the "no results" state** — show a friendly empty state, not a blank page
3. **Price filter applied server-side** — DummyJSON doesn't support it, do it client-side
4. **Search + Category combined** — API doesn't support both at once; fetch by category, filter by search client-side
5. **Missing TypeScript types** — don't use `any` anywhere, the graders will check
6. **Console.log left in code** — remove all before final commit
7. **Not testing mobile** — open Chrome DevTools → device toolbar → test at 375px width
8. **Dark mode breaks one component** — test EVERY component in dark mode
9. **RTL breaks layout** — test the entire page in Arabic mode, check nothing overflows
10. **Add Product form doesn't validate** — always show inline errors, never just alert()
