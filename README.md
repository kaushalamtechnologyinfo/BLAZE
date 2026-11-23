# Blazetech Engineering — Website & Admin CMS

Complete Next.js (App Router) + Tailwind CSS website and built-in Admin CMS for **Blazetech Engineering**, populated with all content, products, news updates, gallery photos, FAQs, custom pages, and PDF brochure from `blazetechengineering.in`.

## Getting Started

```bash
npm install
npm run dev
```

- **Website:** `http://localhost:3000`
- **Admin Panel:** `http://localhost:3000/admin`
- **Default Admin Login:** `admin` / `admin123`

To change the admin credentials, copy `.env.example` to `.env.local` and set `ADMIN_USER`, `ADMIN_PASSWORD`, and `ADMIN_SECRET`.

## Features

- **Public Website:**
  - Modern industrial design matched to Blazetech's Navy (`#12213b`) & Orange (`#f5841f`) brand identity
  - Full product catalogue (24 products across 4 categories) with search, category filtering, structured specifications, and per-product enquiry forms
  - Latest News / Updates (112 articles) with pagination, search, and keyword filtering
  - Interactive Image Gallery with full-screen lightbox
  - Embedded PDF Product Brochure viewer & download
  - FAQ page with FAQPage JSON-LD schema, Contact page with Google Maps & Quote form, Custom SEO pages, and floating WhatsApp / Call actions
- **Admin CMS (`/admin`):**
  - Dashboard with live counts and unread enquiry alerts
  - Full CRUD for **Products**, **Categories**, **Latest News**, **Gallery**, **Custom Pages**, **FAQs**, **Enquiries**, **Newsletter Subscribers** (with CSV export), and **Site Settings**
  - Direct image & PDF upload stored locally in `public/uploads/`
  - All data persisted in `data/site.json` (zero external database required)
