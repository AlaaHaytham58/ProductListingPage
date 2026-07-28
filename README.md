# 🛒 ShopHub — Product Listing Page

A responsive e-commerce product listing page built with React, TypeScript, Vite, and Tailwind CSS, using [DummyJSON](https://dummyjson.com/docs/products) as the product data source.

## ✨ Features

### Core
- Product grid with responsive layout (1 → 2 → 3 → 4 columns across phone/tablet/desktop)
- Product name, price, description, category, rating, and image on every card
- Add-to-cart and view-details actions on every card
- Cart item count shown live in the header (with a bounce animation on change)
- Wishlist / favorites — toggle from the card or details modal, persisted to `localStorage`, with its own drawer and header badge
- Search by name (debounced), category filter, price range filter, and sort, all combinable
- Pagination that resets to page 1 whenever a filter changes
- Add-new-product form with validation (react-hook-form + zod), inline error messages
- Skeleton loading screens matching the grid layout, plus empty/error states

### Extras
- 🌙 Dark mode toggle (persisted, respects system preference on first load)
- 🌐 English ↔ Arabic i18n with full RTL support
- ✨ View Transitions API morph from card image to modal image
- 💫 Micro-interactions: add-to-cart button morph, cart badge bounce, card hover lift, skeleton shimmer
- 📱 Verified responsive at 375px, 768px, 1024px, and 1440px
- 👤 About-the-developer section in the footer

## 🛠 Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS · Framer Motion · Zod · React Hook Form · Sonner · Lucide

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

```bash
npm run build   # type-check + production build
npm run preview # preview the production build
```

## 📁 Architecture

```
src/
├── components/
│   ├── ui/          # Button, Input, Select, Modal, Badge, Skeleton
│   └── layout/       # Header, Footer, Container
├── features/
│   ├── products/
│   │   ├── components/       # ProductCard, ProductGrid, Pagination, ProductCardSkeleton
│   │   │   └── modals/        # ProductDetailsModal, AddProductModal
│   │   ├── hooks/            # useProducts, useCategories, useDebounce
│   │   └── api/              # productsApi.ts
│   ├── cart/
│   │   ├── components/       # CartBadge, CartDrawer, CartItem
│   │   └── context/          # CartContext + CartProvider (useReducer)
│   ├── wishlist/
│   │   ├── components/       # WishlistBadge, WishlistDrawer, WishlistItem
│   │   └── context/          # WishlistContext + WishlistProvider (localStorage-persisted)
│   └── filters/
│       └── components/       # SearchBar, CategoryFilter, PriceRangeFilter, SortSelect, FilterSidebar, FilterDrawer
├── i18n/             # translations/en.ts, translations/ar.ts, i18nContext.tsx
├── types/            # product.ts, cart.ts
├── utils/            # cn.ts, formatPrice.ts, viewTransition.ts
├── hooks/            # useLocalStorage, useMediaQuery, useDarkMode, useEscapeKey
└── App.tsx
```

### Design decisions
- **No routing library** — a single page with modals keeps the scope focused and matches the task.
- **Context + useReducer for cart** — demonstrates standard state-management patterns without extra dependencies.
- **API layer isolation** — components never call `fetch` directly; only hooks call the typed functions in `features/products/api/productsApi.ts`.
- **Client-side price filtering & search+category combination** — DummyJSON doesn't support price-range queries, and its search endpoint can't be combined with the category endpoint, so when both are active the app fetches by category and filters by name client-side (documented in `useProducts`).
- **CSS variables (as RGB triplets) for theming** — `tailwind.config.js` maps each color to `rgb(var(--x) / <alpha-value>)`, so dark mode is a single class toggle and Tailwind's opacity modifiers (`/50`, `/10`, etc.) work correctly on every custom color.
- **Logical CSS properties** (`ps-`, `pe-`, `start-`, `end-`) throughout so the RTL Arabic layout doesn't need a separate stylesheet.

## 📄 License
MIT
