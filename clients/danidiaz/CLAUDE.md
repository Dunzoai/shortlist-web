# Dani Díaz Real Estate - Client Documentation

## Business Overview

- **Business:** Dani Díaz - Bilingual Realtor at Faircloth Real Estate Group
- **Location:** Myrtle Beach, SC
- **Website:** `danidiaz.com`
- **Database slug:** `danidiaz`
- **Tagline:** "From Global Roots to Local Roofs"

---

## Brand Kit

### Colors
- **Primary:** `#1B365D` (navy blue)
- **Secondary:** `#C4A25A` (gold)
- **Accent:** `#D6BFAE` (blush/rose)
- **Text:** `#3D3D3D` (charcoal)
- **Background:** `#F7F7F7` (off-white)

### Typography
- **Heading font:** Playfair Display (elegant serif)
- **Body font:** Lora (readable serif)

### Brand Voice
- Professional, bilingual, luxury real estate
- International expertise with local knowledge

---

## Pages

| Page | File | Route |
|------|------|-------|
| Homepage | `/clients/danidiaz/pages/HomePage.tsx` | `/` |
| About | `/clients/danidiaz/pages/AboutPage.tsx` | `/about` |
| Buyers | `/clients/danidiaz/pages/BuyersPage.tsx` | `/buyers` |
| Sellers | `/clients/danidiaz/pages/SellersPage.tsx` | `/sellers` |
| International | `/clients/danidiaz/pages/InternationalPage.tsx` | `/international` |
| Listings | `/clients/danidiaz/pages/ListingsPage.tsx` | `/listings` |
| Listing Detail | `/clients/danidiaz/pages/ListingDetailPage.tsx` | `/listings/[id]` |
| Blog | `/clients/danidiaz/pages/BlogPage.tsx` | `/blog` |
| Blog Post | `/clients/danidiaz/pages/BlogPostPage.tsx` | `/blog/[slug]` |
| Calculator | `/clients/danidiaz/pages/CalculatorPage.tsx` | `/calculator` |
| Contact | `/clients/danidiaz/pages/ContactPage.tsx` | `/contact` |

---

## Components

| Component | File | Description |
|-----------|------|-------------|
| Nav | `components/Nav.tsx` | Main navigation with language toggle |
| Footer | `components/Footer.tsx` | Site footer with contact info |
| LanguageToggle | `components/LanguageToggle.tsx` | EN/ES language switcher |
| LanguageContext | `components/LanguageContext.tsx` | React context for i18n |
| MortgageCalculator | `components/MortgageCalculator.tsx` | Interactive mortgage calculator |
| NeighborhoodGuides | `components/NeighborhoodGuides.tsx` | Area guides section |
| InstagramFeed | `components/InstagramFeed.tsx` | Instagram feed integration |
| ParallaxSection | `components/ParallaxSection.tsx` | Parallax image dividers |
| StyleToggle | `components/StyleToggle.tsx` | Theme/style switcher |
| StyleContext | `components/StyleContext.tsx` | React context for theming |

---

## Data Sources

### Supabase (Primary Database)

Dani Díaz pulls data directly from **Supabase** tables.

#### Listings Table

```sql
-- Table: listings
id              uuid PRIMARY KEY
client_id       uuid REFERENCES web_clients(id)
address         text
city            text
state           text
zip             text
price           numeric
beds            integer
baths           numeric
sqft            integer
description     text
features        text[]
photos          text[]           -- Array of image URLs
status          text             -- 'active', 'pending', 'sold'
mls_number      text
created_at      timestamp
updated_at      timestamp
```

**Usage:**
```typescript
import { supabase } from '@/lib/supabase';

const { data: listings } = await supabase
  .from('listings')
  .select('*')
  .eq('status', 'active')
  .order('created_at', { ascending: false });
```

#### Blog Posts Table

```sql
-- Table: blog_posts
id              uuid PRIMARY KEY
client_id       uuid REFERENCES web_clients(id)
title           text
slug            text UNIQUE
content         text             -- Markdown or HTML
excerpt         text
category        text             -- 'buyers', 'sellers', 'general'
tags            text[]
featured_image  text
author          text
published_at    timestamp
created_at      timestamp
updated_at      timestamp
```

**Usage:**
```typescript
// Get buyers-focused posts
const { data: posts } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('category', 'buyers')
  .order('published_at', { ascending: false });

// Get single post by slug
const { data: post } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('slug', 'first-time-homebuyer-guide')
  .single();
```

#### Translations Cache Table

```sql
-- Table: page_translations_cache
id              uuid PRIMARY KEY
page_key        text             -- e.g., 'homepage', 'about'
locale          text             -- 'es', 'en'
translations    jsonb            -- Cached translated content
created_at      timestamp
updated_at      timestamp
```

**Usage (for bilingual support):**
```typescript
// Check cache first
const { data: cached } = await supabase
  .from('page_translations_cache')
  .select('translations')
  .eq('page_key', 'homepage')
  .eq('locale', 'es')
  .single();

if (cached) {
  return cached.translations;
}
// Otherwise, translate via LLM and cache result
```

---

## Language Toggle (EN/ES)

The site supports English and Spanish with:

1. **LanguageContext** - React context storing current locale
2. **LanguageToggle** - UI button to switch languages
3. **page_translations_cache** - Supabase table caching translations
4. **localStorage** - Persists user's language preference

### How Translation Works

1. User clicks Spanish toggle
2. Check `page_translations_cache` for cached Spanish version
3. If not cached, call LLM to translate content
4. Store translation in cache table
5. Display translated content

---

## Navigation Links

Main nav in `/clients/danidiaz/components/Nav.tsx`:

| Label | Href |
|-------|------|
| Home | `/` |
| Buyers | `/buyers` |
| Sellers | `/sellers` |
| International | `/international` |
| About | `/about` |
| Blog | `/blog` |
| Contact | `/contact` |

---

## Key Features

### Mortgage Calculator
Interactive calculator at `/calculator`:
- Input: Home price, down payment, interest rate, term
- Output: Monthly payment breakdown (P&I, taxes, insurance)

### Neighborhood Guides
Information about Myrtle Beach areas:
- Market Square
- Grande Dunes
- Carolina Forest
- etc.

### Blog with Categories
- **Buyers:** First-time buyer guides, mortgage tips
- **Sellers:** Staging tips, pricing strategies
- **General:** Market updates, community news

### Listing Search
Filter properties by:
- Price range
- Bedrooms/bathrooms
- Location/neighborhood
- Status (active, pending, sold)

---

## Admin Pages

Located in `/app/admin/`:

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard |
| `/admin/blog` | Manage blog posts |
| `/admin/blog/new` | Create new post |
| `/admin/blog/[id]` | Edit post |
| `/admin/properties` | Manage listings |
| `/admin/properties/new` | Add new listing |
| `/admin/properties/[id]` | Edit listing |

---

## Contact Information

- **Phone:** TBD
- **Email:** TBD
- **Office:** Faircloth Real Estate Group, Myrtle Beach, SC
- **Social:** Instagram, Facebook (TBD)
