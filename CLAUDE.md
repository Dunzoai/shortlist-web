# Dani Díaz Real Estate Website - Build Instructions

## Project Overview

- Multi-tenant real estate site for Dani Díaz, bilingual realtor in Myrtle Beach
- Pulls client data from Supabase (slug: 'danidiaz')
- Inspired by mitchelladkins.com / Luxury Presence style
- Modern, elegant, luxury real estate aesthetic

## Brand Kit

### Colors
- **Primary:** #1B365D (navy)
- **Secondary:** #C4A25A (gold)
- **Accent:** #D6BFAE (blush)
- **Text:** #3D3D3D (charcoal)
- **Background:** #F7F7F7 (off-white)

### Typography
- **Heading font:** Playfair Display
- **Body font:** Lora

### Brand Copy
- **Tagline:** "From Global Roots to Local Roofs"
- **Business:** Dani Díaz - Bilingual Realtor® at Faircloth Real Estate Group

## Pages to Build

### 1. Homepage
- Hero section with video/image background
- Dual CTA buttons (Buyers / Sellers)
- About preview section
- Featured listings grid
- Testimonials section
- Contact form

### 2. About
- Full bio
- Professional photo placeholder
- Credentials and certifications
- Personal story / journey

### 3. Buyers
- Category-filtered blog posts (category: 'buyers')
- Resources and guides for buyers

### 4. Sellers
- Category-filtered blog posts (category: 'sellers')
- Resources and guides for sellers

### 5. Blog
- All posts grid/list
- Filterable by tags/category
- Pagination

### 6. Blog/[slug]
- Individual post page
- Full content rendering
- Related posts

### 7. Listings
- Property grid from Supabase listings table
- Filter by price, beds, location
- Search functionality

### 8. Listings/[id]
- Individual listing detail page
- Photo gallery
- Property details
- Contact agent CTA

### 9. Contact
- Contact form
- Sends email notification
- Office location / map placeholder

## Features

### Language Toggle (EN/ES)
- Toggle button in navigation
- Uses LLM translation with caching
- Stores translations in `page_translations_cache` table
- Persists language preference in localStorage

### Navigation
- Responsive mobile nav (hamburger menu)
- Fixed header with scroll effect
- Links: Home, Buyers, Sellers, About, Blog
- Language toggle

### Animations
- Smooth scroll animations using Framer Motion
- Fade in on scroll
- Subtle hover effects

### Dynamic Data
- All content pulled from Supabase
- Client branding from `web_clients` table
- Blog posts from `blog_posts` table
- Listings from `listings` table

## Database Tables (already exist in Supabase)

### web_clients
- Client profile data
- Brand colors (primary_color, secondary_color, accent_color)
- Business info, slug, contact details

### blog_posts
- title, slug, content, excerpt
- category (buyers, sellers, general)
- tags, featured_image
- published_at, author

### listings
- Property data (address, price, beds, baths, sqft)
- Photos array
- Status (active, pending, sold)
- Description, features

### page_translations_cache
- Cached Spanish translations
- page_key, locale, translations (JSON)
- created_at, updated_at

## Image Placeholders

Use Unsplash placeholder images for development:
- Hero: Luxury home exterior or Myrtle Beach scenery
- About photo: Professional headshot placeholder
- Listing photos: Various home interiors/exteriors

Add comments where real images needed:
```tsx
{/* TODO: Replace with actual image */}
```

## Tech Stack

- **Framework:** Next.js 14 App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase
- **Animations:** Framer Motion

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## STOP POINT

**Complete these first:**
1. ✅ Homepage (hero, dual CTA, about preview, featured listings, testimonials, contact form)
2. ✅ About page (full bio, photo, credentials, story)
3. ✅ Nav component with language toggle (EN/ES)

**Do NOT build yet:**
- Blog page
- Blog/[slug] page
- Listings page
- Listings/[id] page
- Contact page

**Commit and push when the above 3 items are complete.**
