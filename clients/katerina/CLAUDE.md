# Katerina Sells Florida - Client Documentation

## Business Overview

- **Business:** Katerina Sells Florida (Demo Site)
- **Location:** Lake Worth, Florida
- **Website:** `katerina-demo.shortlistpass.com`
- **Database slug:** `katerina`
- **Tagline:** "Finding Your Perfect Place in the Sunshine State"

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
- Professional, warm, approachable real estate
- South Florida lifestyle and local market expertise

---

## Pages

| Page | File | Route |
|------|------|-------|
| Homepage | `/clients/katerina/pages/HomePage.tsx` | `/` |
| About | `/clients/katerina/pages/AboutPage.tsx` | `/about` |
| Buyers | `/clients/katerina/pages/BuyersPage.tsx` | `/buyers` |
| Sellers | `/clients/katerina/pages/SellersPage.tsx` | `/sellers` |
| Listings | `/clients/katerina/pages/ListingsPage.tsx` | `/listings` |
| Listing Detail | `/clients/katerina/pages/ListingDetailPage.tsx` | `/listings/[id]` |
| Blog | `/clients/katerina/pages/BlogPage.tsx` | `/blog` |
| Blog Post | `/clients/katerina/pages/BlogPostPage.tsx` | `/blog/[slug]` |
| Calculator | `/clients/katerina/pages/CalculatorPage.tsx` | `/calculator` |
| Contact | `/clients/katerina/pages/ContactPage.tsx` | `/contact` |

**Note:** International page is disabled (redirects to `/`).

---

## Components

| Component | File | Description |
|-----------|------|-------------|
| Nav | `components/Nav.tsx` | Main navigation (no International link) |
| Footer | `components/Footer.tsx` | Site footer with placeholder contact info |
| LanguageToggle | `components/LanguageToggle.tsx` | EN/ES language switcher |
| LanguageContext | `components/LanguageContext.tsx` | React context for i18n |
| MortgageCalculator | `components/MortgageCalculator.tsx` | Interactive mortgage calculator |
| NeighborhoodGuides | `components/NeighborhoodGuides.tsx` | Area guides section |
| ParallaxSection | `components/ParallaxSection.tsx` | Parallax image dividers |
| StyleToggle | `components/StyleToggle.tsx` | Theme/style switcher |
| StyleContext | `components/StyleContext.tsx` | React context for theming |

---

## Navigation Links

| Label | Href |
|-------|------|
| Home | `/` |
| Buyers | `/buyers` |
| Sellers | `/sellers` |
| About | `/about` |
| Blog | `/blog` |
| My SmartAssistant | `#` (placeholder) |

---

## Contact Information (Demo Placeholders)

- **Phone:** (555) 123-4567
- **Email:** katerina@example.com
- **Office:** 123 Lake Ave, Lake Worth, FL 33460
- **Social:** All `#` placeholder links

---

## Notes

This is a **demo site** to showcase the platform to a potential client. All personal info, photos, and social links use placeholders. Photos show gradient placeholders with "Your Photo Here" text.

To activate, add a `web_clients` row in Supabase with `slug: 'katerina'` and the target domain in the `domains` array.
