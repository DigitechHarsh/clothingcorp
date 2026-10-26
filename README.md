# Clothing Corp. — Single-Vendor E-Commerce Platform

A production-ready, multipage e-commerce application for **Clothing Corp.**, an independent single-vendor clothing brand specializing in mindfully constructed apparel made from 100% natural botanical and animal fibres.

---

## 🎨 Design System & Aesthetic Principles

Built strictly adhering to the warm, restrained, editorial aesthetic:
- **Warm White (`#FAF7F2`)**: Page backgrounds & surface layers
- **Pure White (`#FFFFFF`)**: Cards, inputs, and admin panel surfaces
- **Cobalt Blue (`#0047AB`)**: Primary actions, links, active states, and primary analytics
- **Cobalt Dark (`#003580`)**: Interactive hover states
- **Sun Yellow (`#FFC83D`)**: Accent-only badges, marquee accents, and promotional highlights
- **Ink (`#1A1A1A`)**: Typography & headers
- **Muted (`#6B6B6B`)**: Secondary text & metadata
- **Subtle Border (`#E8E2D9`)**: Editorial card borders and dividers

*Strict anti-slop rules enforced:* Zero decorative icon clutter, no gradients or glassmorphism, flat restrained layouts, and Google Fonts (`Newsreader` serif + `Plus Jakarta Sans`).

---

## 🚀 Key Features

### 1. Storefront Experience
- **Continuous Marquee Bar:** Auto-scrolling top announcement ticker, pauses on hover, editable via admin.
- **Header & Navigation:** Text wordmark, active link indicators, quick search, live cart & wishlist counter badges, user session dropdown, and responsive mobile menu.
- **Homepage:**
  - Dynamic seasonal offer strip with promo code callout.
  - Asymmetric editorial hero banner featuring structured garments.
  - **Featured Products grid (5 per row on desktop, responsive 2/3 on mobile/tablet)**.
  - Shop by Category tiles with live product counts.
  - Promotional split banner on natural fabric philosophy.
  - New Arrivals & Best Sellers collections.
  - Text-only authentic customer testimonials.
  - Functional newsletter journal signup with immediate localStorage persistence.
- **Catalog & Archive (`/products`):**
  - Left filter sidebar: Category radio selection, size chips (S to 4XL), price range inputs & slider, sort order (Newest, Price Low-High, Price High-Low, Name A-Z).
  - URL query string synchronization (`?category=...&size=...&min=...&max=...`).
  - Secondary image reveal on card hover, quick-size bag picker, and wishlist toggles.
- **Product Detail (`/products/[slug]`):**
  - Multi-image vertical thumbnail gallery with full-size switcher.
  - Size availability selector with out-of-stock disablement and real-time inventory counter.
  - Quantity counter, Add to Bag, Wishlist toggle.
  - Fabric & composition, garment care, and shipping/returns accordions.
  - "You May Also Like" recommendation engine.
- **Slide-In Bag Drawer & Cart (`/cart`):**
  - Instant slide-in drawer on add-to-bag.
  - Free shipping progress meter towards ₹2,500 threshold.
  - Real-time quantity increment/decrement/removal.
  - Promotional coupon engine (e.g. `WINTER20`, `FIRST10`).
- **Checkout Flow (`/checkout`):**
  - Shipping address form with saved address auto-fill for authenticated users.
  - Mock payment methods (UPI, Cards, Net Banking, COD).
  - Instant order creation with generated order reference (`CC-XXXXX`).
- **Personal Wishlist (`/wishlist`):**
  - Saved pieces archive with quick Add to Bag.
- **Patron Portal (`/account` & `/account/orders`):**
  - Profile details, delivery address management, and tracked order histories.

### 2. Admin Operations Panel (`/admin`)
- **Operations Dashboard:** Gross revenue, total orders, pending dispatch count, active garment count, and low-stock alerts.
- **Interactive Visualizations:** Recharts monthly turnover area chart and product category distribution.
- **Garment Inventory Management (`/admin/products`):** Full CRUD for products, image gallery URLs, and per-size stock allocation.
- **Fulfillment Logistics (`/admin/orders`):** Order status workflow (`Processing` → `Shipped` → `Delivered` → `Cancelled`) and parcel inspection.
- **Category Taxonomies (`/admin/categories`):** Manage catalog categories and cover imagery.
- **Promotional Campaigns (`/admin/offers`):** Edit top marquee text, sub-header banners, coupon codes, and discount percentages live.
- **System Settings & Diagnostics (`/admin/settings`):** Store configurations with a built-in **"Reset Demo Data"** diagnostic feature.

---

## 🔑 Demo Accounts

Quick single-click login buttons are provided on the `/login` page:

| Role | Email | Password |
|---|---|---|
| **Admin Director** | `admin@clothingcorp.com` | `admin123` (or any) |
| **Demo Customer (Arjun)** | `demo@clothingcorp.com` | `demo123` (or any) |

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 with custom theme tokens
- **Data Visualizations:** Recharts
- **Icons:** Minimal Lucide React (only for bag, heart, user, search, and controls)
- **Data Access Layer:** Complete service abstraction layer (`/lib/storage.ts` + `/lib/services/*`). Components never access `localStorage` directly, allowing an easy drop-in replacement with a real Node.js / PostgreSQL / MongoDB backend.

---

## 💻 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open http://localhost:3000 in your browser
```

To create an optimized production build:
```bash
npm run build
npm run start
```
