# Multi-Client Routing System

This application supports multiple real estate agents/clients on a single codebase using domain-based routing. Each client gets their own branded website with custom colors, content, and components.

## How It Works

### 1. Domain-Based Client Resolution

When a user visits any domain (e.g., `demo-nitos.shortlistpass.com` or `danidiaz.com`), the system:

1. **Extracts the hostname** from the request headers in `app/layout.tsx`
2. **Queries Supabase** `web_clients` table to find a client where the hostname exists in the `domains` array
3. **Loads client data** (colors, business name, slug, etc.)
4. **Falls back to 'danidiaz'** if no matching client is found
5. **Provides client data** to all components via React Context

### 2. Code Flow

```
Request → app/layout.tsx → getClient(hostname) → Supabase Query → ClientProvider → All Components
```

**Key files:**
- `/lib/getClient.ts` - Queries Supabase for client by hostname
- `/lib/ClientContext.tsx` - React Context provider for client data
- `/app/layout.tsx` - Root layout that fetches client and provides context

### 3. Using Client Data in Components

Any component in the app can access the current client's data:

```tsx
import { useClient } from '@/lib/ClientContext';

function MyComponent() {
  const { client } = useClient();

  return (
    <div style={{ backgroundColor: client?.primary_color }}>
      <h1>{client?.business_name}</h1>
      <p>{client?.tagline}</p>
    </div>
  );
}
```

**Available client data:**
- `slug` - Client identifier (e.g., "danidiaz", "nitos")
- `business_name` - Business name for display
- `primary_color`, `secondary_color`, `accent_color` - Brand colors
- `text_color`, `background_color` - Theme colors
- `domains` - Array of domains pointing to this client
- `contact_email`, `contact_phone` - Contact info
- `logo_url`, `tagline`, `bio` - Branding content

## Adding a New Client

### Step 1: Create Folder Structure

```bash
mkdir -p clients/{client-slug}/components
mkdir -p clients/{client-slug}/pages
```

Example:
```bash
mkdir -p clients/nitos/components
mkdir -p clients/nitos/pages
```

### Step 2: Add Client to Supabase

Add a new row to the `web_clients` table:

```sql
INSERT INTO web_clients (
  slug,
  business_name,
  primary_color,
  secondary_color,
  accent_color,
  text_color,
  background_color,
  domains,
  contact_email,
  contact_phone,
  tagline,
  bio
) VALUES (
  'nitos',
  'Nito''s Real Estate',
  '#1B365D',
  '#C4A25A',
  '#D6BFAE',
  '#3D3D3D',
  '#F7F7F7',
  ARRAY['demo-nitos.shortlistpass.com', 'nitos.com'],
  'nito@example.com',
  '+1-555-1234',
  'Your trusted real estate advisor',
  'Bio text here...'
);
```

**Important:** The `domains` array must include all domains that should route to this client.

### Step 3: Add Domain to Vercel

1. Go to your Vercel project settings
2. Navigate to **Domains**
3. Add the new domain (e.g., `demo-nitos.shortlistpass.com`)
4. Configure DNS:
   - **CNAME record**: Point to `cname.vercel-dns.com`
   - Or **A record**: Point to Vercel's IP
5. Wait for DNS propagation (can take up to 48 hours)

### Step 4: Add Client-Specific Components

Create components in `/clients/{slug}/components/`:

```tsx
// clients/nitos/components/Nav.tsx
'use client';

import { useClient } from '@/lib/ClientContext';

export function Nav() {
  const { client } = useClient();

  return (
    <nav style={{ backgroundColor: client?.primary_color }}>
      <h1>{client?.business_name}</h1>
      {/* ... */}
    </nav>
  );
}
```

### Step 5: Add Client-Specific Pages

Create pages in `/clients/{slug}/pages/`:

```tsx
// clients/nitos/pages/HomePage.tsx
'use client';

import { useClient } from '@/lib/ClientContext';
import { Nav } from '@/clients/nitos/components/Nav';

export function HomePage() {
  const { client } = useClient();

  return (
    <main>
      <Nav />
      <h1>{client?.business_name}</h1>
      <p>{client?.tagline}</p>
    </main>
  );
}
```

### Step 6: Update Route Files (if needed)

If creating new routes specific to this client, update `/app/{route}/page.tsx`:

```tsx
// app/page.tsx
import { HomePage } from '@/clients/danidiaz/pages/HomePage';

export default HomePage;
```

## Fallback Behavior

If no client match is found for a domain:

1. The system logs a warning: `No client found for hostname: {hostname}, falling back to danidiaz`
2. The **danidiaz** client data is loaded as default
3. The app continues to function normally with danidiaz branding

**Fallback scenarios:**
- New domain not yet added to Supabase
- Typo in domain configuration
- Supabase connection issues
- Local development (localhost:3000)

**Why danidiaz?** It's the first client and serves as the default template.

## Local Development

When running locally (`localhost:3000`), the hostname won't match any client domains, so it will fallback to **danidiaz**.

To test other clients locally:

1. Add `localhost:3000` to the client's `domains` array in Supabase
2. Or use `getClientBySlug()` directly in your test code

```tsx
import { getClientBySlug } from '@/lib/getClient';

const client = await getClientBySlug('nitos');
```

## Troubleshooting

### "No client found" warning in logs

**Cause:** The hostname isn't in any client's `domains` array.

**Fix:** Add the domain to the correct client in Supabase:

```sql
UPDATE web_clients
SET domains = array_append(domains, 'new-domain.com')
WHERE slug = 'client-slug';
```

### Wrong client data showing

**Cause:** Multiple clients have the same domain in their `domains` array.

**Fix:** Ensure each domain appears in only one client's `domains` array.

### Changes not reflecting

**Cause:** Cached client data or build cache.

**Fix:**
1. Clear Next.js cache: `rm -rf .next`
2. Rebuild: `npm run build`
3. Verify Supabase data is correct

## Architecture Notes

### Why Context Instead of Props?

Using React Context (`ClientProvider`) allows any component to access client data without prop drilling. This is essential for:
- Deeply nested components
- Third-party components that can't accept props
- Consistent access pattern across the app

### Why Server-Side in Layout?

Client data is fetched in `app/layout.tsx` (Server Component) because:
- Available on first render (no loading state needed)
- SEO-friendly (colors, business name in initial HTML)
- Single fetch per page load (not per component)
- Shared across all routes

### Client vs Server Components

- **Server Component:** `app/layout.tsx` (fetches client data)
- **Client Components:** All components using `useClient()` hook (marked with `'use client'`)

### Database Schema

The `web_clients` table must have:
- `domains` column type: `text[]` (PostgreSQL array)
- `slug` column: unique identifier
- All color columns: valid hex codes (e.g., `#1B365D`)

## Future Enhancements

Potential improvements to the routing system:

1. **Client-specific routing**: Route to different page components based on client slug
2. **Theme caching**: Cache client themes in localStorage or cookies
3. **Analytics**: Track which domains/clients are being accessed
4. **Admin panel**: UI for managing clients and domains
5. **Subdomain routing**: Support `{client}.shortlistpass.com` pattern
6. **Edge middleware**: Move client resolution to Vercel Edge for better performance

## Summary

**To add a new client:**
1. Create folder structure in `/clients/{slug}/`
2. Add client row to Supabase with domains array
3. Add domain to Vercel project
4. Build client-specific components and pages
5. Use `useClient()` hook to access client data anywhere

**The system automatically:**
- Routes requests to correct client based on hostname
- Falls back to danidiaz if no match
- Provides client data via Context to all components
- Works seamlessly in local development and production
