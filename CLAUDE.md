# Shortlist Web - Multi-Tenant Architecture

## Overview

This is a **multi-tenant Next.js application** that serves different client websites from a single codebase. Each client gets their own branded experience with unique pages, components, and data sources.

**Live Examples:**
- `demo-nitos.shortlistpass.com` → Nito's Empanadas (food truck)
- `danidiaz.com` → Dani Díaz Real Estate

---

## Project Structure

```
/app                    # Next.js App Router pages (routing layer)
  /page.tsx             # Routes to client-specific HomePage
  /about/page.tsx       # Routes to client-specific AboutPage
  /game/page.tsx        # Routes to client-specific GamePage
  ...

/clients                # Client-specific code
  /nitos/               # Nito's Empanadas
    /pages/             # Page components (HomePage.tsx, GamePage.tsx)
    /components/        # Shared components (Header.tsx, MenuSection.tsx)
    /CLAUDE.md          # Client-specific documentation
  /danidiaz/            # Dani Díaz Real Estate
    /pages/             # Page components (HomePage.tsx, AboutPage.tsx, etc.)
    /components/        # Shared components (Nav.tsx, Footer.tsx)
    /CLAUDE.md          # Client-specific documentation

/lib
  /getClient.ts         # Hostname → client resolution
  /supabase.ts          # Supabase client

/public                 # Static assets (images, fonts)
```

---

## How Multi-Tenant Routing Works

### 1. Domain Resolution (`/lib/getClient.ts`)

When a request comes in, we determine which client based on the hostname:

```typescript
// In any page.tsx
const headersList = await headers();
const hostname = headersList.get('host'); // e.g., "demo-nitos.shortlistpass.com"
const client = await getClient(hostname);
```

The `getClient()` function:
1. Queries Supabase `web_clients` table
2. Looks for a row where `domains` array contains the hostname
3. Returns client data (slug, colors, contact info, etc.)
4. Falls back to `danidiaz` if no match found

### 2. Client Routing (in `/app/*/page.tsx`)

Each route imports client-specific components and renders based on slug:

```typescript
import { HomePage as NitosHomePage } from '@/clients/nitos/pages/HomePage';
import { HomePage as DaniDiazHomePage } from '@/clients/danidiaz/pages/HomePage';

export default async function Page() {
  const client = await getClient(hostname);

  if (client?.slug === 'nitos') {
    return <NitosHomePage />;
  }

  return <DaniDiazHomePage />; // Default
}
```

---

## Database: Supabase

### `web_clients` Table

Stores client configuration:

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `slug` | string | Unique identifier (e.g., "nitos", "danidiaz") |
| `business_name` | string | Display name |
| `primary_color` | string | Brand color hex |
| `secondary_color` | string | Brand color hex |
| `accent_color` | string | Brand color hex |
| `domains` | string[] | Array of hostnames that map to this client |
| `contact_email` | string | Business email |
| `contact_phone` | string | Business phone |
| `logo_url` | string | Logo image URL |
| `tagline` | string | Business tagline |

**Example row:**
```json
{
  "slug": "nitos",
  "business_name": "Nito's Empanadas",
  "domains": ["demo-nitos.shortlistpass.com", "localhost:3000"],
  "primary_color": "#2D5A3D",
  "secondary_color": "#C4A052"
}
```

---

## Adding a New Client

### Step 1: Create Database Entry

Add a row to `web_clients` in Supabase:
- Set unique `slug`
- Add all domains that should route to this client
- Set brand colors

### Step 2: Create Client Folder

```bash
mkdir -p clients/{slug}/pages
mkdir -p clients/{slug}/components
touch clients/{slug}/CLAUDE.md
```

### Step 3: Create HomePage

Create `clients/{slug}/pages/HomePage.tsx`:

```typescript
'use client';

export function HomePage() {
  return (
    <main>
      <h1>Welcome to {Business Name}</h1>
    </main>
  );
}
```

### Step 4: Add Route

Update `/app/page.tsx`:

```typescript
import { HomePage as NewClientHomePage } from '@/clients/{slug}/pages/HomePage';

// In the Page component:
if (client?.slug === '{slug}') {
  return <NewClientHomePage />;
}
```

### Step 5: Repeat for Other Routes

For each route the client needs (about, contact, etc.):
1. Create the page component in `clients/{slug}/pages/`
2. Update the corresponding `/app/*/page.tsx` to import and route to it

### Step 6: Document

Create `clients/{slug}/CLAUDE.md` with:
- Business overview
- Brand colors
- Data sources (API endpoints, database tables)
- Page descriptions
- Component inventory

---

## External APIs

Different clients may use different data sources:

| Client | Data Source | Used For |
|--------|-------------|----------|
| Nito's | SmartPage API (`app.shortlistpass.com`) | Menu items, locations |
| Dani Díaz | Supabase | Listings, blog posts |

See client-specific CLAUDE.md files for API details.

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Development

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Build for production
npm run lint     # Run ESLint
```

To test different clients locally, add the hostname to the client's `domains` array in Supabase:
```json
["demo-nitos.shortlistpass.com", "localhost:3000"]
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `/lib/getClient.ts` | Hostname → client resolution |
| `/app/page.tsx` | Homepage routing |
| `/app/layout.tsx` | Root layout, fonts, metadata |
| `/clients/{slug}/pages/*.tsx` | Client page components |
| `/clients/{slug}/components/*.tsx` | Client shared components |
| `/clients/{slug}/CLAUDE.md` | Client-specific documentation |
