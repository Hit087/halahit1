# Hit | هيت — Luxury Dessert E-Commerce

Production-ready Next.js 14 e-commerce for the Saudi luxury dessert brand **Hit | هيت**.

Tagline: **لكل قطعة ذكرى**

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- TailwindCSS
- Prisma + PostgreSQL
- Zustand (cart + locale)
- NextAuth (JWT, admin-only)
- PWA (`@ducanh2912/next-pwa`)

## Features

### Storefront
- Luxury RTL-first UI (Arabic + English toggle)
- Admin-managed hero carousel
- Products with image gallery
- Zustand cart with localStorage persistence
- Coupon discounts
- WhatsApp checkout (no payment gateway)

### Admin (`/admin`)
- **Email:** `hithytl15@gmail.com` (only allowed admin)
- Products, categories, coupons CRUD
- Orders from WhatsApp flow
- Store settings + hero slides
- Analytics: visits, orders, popular products

## Quick Start

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database

### 2. Install

```bash
cd hit-store
npm install
```

### 3. Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/hit_store"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-long-random-string"
ADMIN_EMAIL="hithytl15@gmail.com"
ADMIN_PASSWORD="YourSecurePassword"
```

Generate secret:

```bash
openssl rand -base64 32
```

### 4. Database

```bash
npm run db:push
npm run db:seed
```

### 5. Run

```bash
npm run dev
```

- Store: http://localhost:3000
- Admin: http://localhost:3000/admin/login

Default seed admin password (if not overridden): `HitAdmin2024!`

## Deployment

1. Set all environment variables on your host (Vercel, Railway, etc.)
2. Run `prisma db push` and `prisma db seed` against production DB
3. Ensure `public/uploads` is writable or use object storage (extend `server/upload.ts`)
4. Build: `npm run build && npm start`

## Project Structure

```
app/           # Routes (shop + admin + API)
components/    # UI, layout, admin
lib/           # Auth, utils, validations, i18n
server/        # Actions, queries, upload, analytics
store/         # Zustand stores
prisma/        # Schema + seed
public/        # PWA manifest, uploads
```

## Security

- `/admin/*` protected by NextAuth middleware
- Only `ADMIN_EMAIL` can sign in
- Server actions validate input with Zod
- No public registration

## License

Private — Hit | هيت
