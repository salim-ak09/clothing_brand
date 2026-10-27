<div align="center">

# ⚡ AETHER — High-End Luxury Streetwear & 3D E-Commerce Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-ef4444?style=for-the-badge&logo=turborepo)](https://turbo.build/repo)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-049EF4?style=for-the-badge&logo=threedotjs)](https://threejs.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

**Aether** is an ultra-modern, high-performance monorepo platform designed for luxury apparel and heavyweight streetwear brands. Engineered with cutting-edge 3D product visualization, interactive studio customizers, AI-driven personal styling, and an enterprise administrative suite.

[Explore Features](#-core-features) • [Monorepo Architecture](#-monorepo-architecture) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Environment Setup](#-environment-configuration)

</div>

---

## 💎 Project Overview

Aether was crafted to bridge high fashion and modern web graphics. Instead of static product pages, the platform immerses customers in real-time 3D garments (450 GSM French Terry Cotton hoodies, luxury cuts, and bespoke puff embroidery), smooth scroll-driven cinematic storytelling, and rich interactive configuration.

### Highlights
- 👕 **Cinematic 3D Garment Customizer**: Real-time 3D model manipulation (GLTF/GLB), dynamic fabric roughness, normal map rendering, decal placement, and color shifting using React Three Fiber.
- 🛍️ **Immersive Storefront**: GSAP & Framer Motion scroll-driven showcases, fluid navigation, slide-over carts, and high-conversion checkout flows.
- 🤖 **AI Personal Stylist**: Powered by Google Generative AI (Gemini) to provide tailored clothing combinations, sizing guidance, and wardrobe curation.
- 🎛️ **Full-Featured Admin Operations Portal**: Analytics dash, 2FA-secured staff authentication (TOTP, Telegram Bot, SMTP OTP), inventory management, product 3D asset uploads, and live order tracking.
- ⚡ **Turborepo Monorepo**: Blazing-fast build pipelines, shared UI component system, unified TypeScript, and centralized Prisma ORM schema.

---

## 🏗️ Monorepo Architecture

```
clothing_brand (aether-monorepo)
├── apps/
│   ├── storefront/          # Public luxury e-commerce web application (Next.js 16)
│   │   ├── app/             # App Router pages (Home, Shop, Product 3D, Checkout, About)
│   │   ├── components/      # 3D Studio, Lenis Smooth Scroll, AI Stylist, Cart Drawer
│   │   └── public/          # 3D models (.glb), textures, luxury branding assets
│   │
│   └── admin/               # Internal brand management back-office (Next.js 16)
│       ├── app/             # Analytics, Orders, Inventory, Products, Studio Mockups, 2FA
│       └── components/      # Data tables, Charts (Recharts), Admin Sidebar & Navbars
│
├── packages/
│   ├── database/            # Centralized Prisma ORM schema & Supabase/PostgreSQL client
│   ├── ui/                  # Reusable shared React component design system
│   ├── eslint-config/       # Unified ESLint configurations across the monorepo
│   └── typescript-config/   # Strict TypeScript presets for Next.js and React packages
│
├── turbo.json               # Turborepo task pipeline configuration
└── package.json             # Root workspace dependency declarations
```

---

## 🛠️ Tech Stack

### Storefront & Client Experience
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + React 19
- **3D & Canvas**: [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei)
- **Animation & FX**: [GSAP](https://greensock.com/), [Framer Motion](https://www.framer.com/motion/), [@studio-freight/lenis](https://github.com/studio-freight/lenis)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS + Lucide Icons
- **AI Intelligence**: [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Gemini)
- **State & Storage**: [Zustand](https://zustand-demo.pmnd.rs/), [Upstash Redis](https://upstash.com/) rate-limiting

### Administration & Operations
- **Data Tables & Charts**: [TanStack Table](https://tanstack.com/table/v8), [Recharts](https://recharts.org/)
- **Security & Multi-Factor Auth (2FA)**: [OTPLib](https://github.com/yeojinj/otplib), [QRCode](https://github.com/soldair/node-qrcode), Nodemailer, Telegram Bot API
- **Checkout & Payments**: [Stripe](https://stripe.com/) Payment Intents & Stripe Elements

### Data & Infrastructure
- **Database & ORM**: PostgreSQL (via Supabase), [Prisma ORM 5](https://www.prisma.io/)
- **Queues & Background Tasks**: [BullMQ](https://bullmq.io/) + [ioRedis](https://github.com/redis/ioredis)
- **Monorepo Engine**: [Turborepo 2](https://turbo.build/)

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: `v20.x` or `v24.x` (LTS recommended)
- **Package Manager**: `npm` (v10+ or v11+)
- **PostgreSQL**: Local instance or cloud database (e.g., Supabase)

### 2. Clone and Install Dependencies

```bash
git clone https://github.com/salim-ak09/clothing_brand.git
cd clothing_brand

# Install all workspace dependencies
npm install
```

### 3. Database Initialization

Generate Prisma client and sync schema with your PostgreSQL database:

```bash
# Generate Prisma Client for packages/database
npm run generate --workspace=@repo/database

# Push schema directly to your database (Development)
npm run db:push --workspace=@repo/database
```

### 4. Running Development Servers

Start all applications simultaneously via Turborepo:

```bash
npm run dev
```

Or run applications individually:

| Application | Port | Dev Command | Description |
| :--- | :--- | :--- | :--- |
| **Storefront** | `http://localhost:3000` | `npm run dev --workspace=storefront` | Customer-facing luxury 3D store |
| **Admin** | `http://localhost:3001` | `npm run dev --workspace=admin` | Executive operations & catalog control |

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root (or inside the individual `apps/storefront` and `apps/admin` packages as needed):

```bash
# Database Connections (PostgreSQL / Supabase)
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# Authentication
AUTH_SECRET="your-generated-super-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Payments (Stripe)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# AI Personal Stylist (Google Gemini)
GEMINI_API_KEY="AIzaSy..."

# Caching & Rate Limiting (Upstash / Redis)
UPSTASH_REDIS_REST_URL="https://...upstash.io"
UPSTASH_REDIS_REST_TOKEN="..."
REDIS_URL="redis://localhost:6379"

# Transactional Emails (Resend / SMTP)
RESEND_API_KEY="re_..."
```

---

## 📦 Key Scripts

All top-level commands are powered by **Turborepo** with cross-package dependency caching:

```bash
# Run development mode for all apps
npm run dev

# Create optimized production builds
npm run build

# Type check all TypeScript workspaces
npm run check-types

# Lint all codebases
npm run lint

# Format with Prettier
npm run format
```

---

## 🛡️ Database Schema Overview

The database is built on Prisma with support for enterprise apparel commerce:
- **`User`**: Profiles, customer tiers, and multi-channel 2FA security options (TOTP secrets, Telegram Bot configuration, custom SMTP credentials).
- **`Product`**: High-density fabric specs (e.g. 450 GSM), French Terry specifications, category filters, and base pricing.
- **`Product3DAsset`**: Low-poly and high-poly `.glb` asset URLs, decal anchoring transformation matrices, roughness maps, and normal maps.
- **`ProductVariant`**: Color hexadecimal mapping, size matrix (`S`, `M`, `L`, `XL`, `XXL`), live inventory tracking, and safety stock reservation.
- **`Order` & `OrderItem`**: Multi-state order processing (`PENDING`, `PAID`, `SHIPPED`), Stripe transaction reconciliation, promo code support, and customized garment specifications.

---

## 🤝 Contributing & License

Contributions are welcome! Please feel free to submit a Pull Request or open an issue.

Distributed under the **MIT License**. See `LICENSE` for more information.
