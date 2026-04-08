# Client Billing Redirect Setup

This guide explains how to add a "Billing" button to a client's admin dashboard that auto-logs them into their Shortlist client portal (`my.shortlistpass.com`).

## How It Works

1. Client clicks "Billing" in their site admin
2. API looks up their email from the `clients` table
3. Generates a magic link for that email
4. Redirects them to the magic link
5. Supabase authenticates them and redirects to the client portal
6. They're logged in, seeing only their own invoices/services

## Prerequisites

Before the billing redirect works, the client must be set up in:

1. **`clients` table** - Their business record with email
2. **Supabase Auth** - User account with that email
3. **`client_portal_users` table** - Links their auth user_id to their client_id

### Quick Setup via Portal

1. Go to `portal.shortlistpass.com`
2. Find the client
3. Click **"Set Password"** or **"Invite to Portal"**

This automatically creates the auth user and links them.

### Manual Setup via API

Hit this endpoint (replace email):
```
POST /api/portal/set-client-password
{
  "clientId": "their-client-uuid",
  "email": "client@email.com",
  "name": "Client Name",
  "password": "TempPassword123!"
}
```

## Adding Billing Button to Client Admin

### 1. Create the API Route

Create `/app/api/admin/billing-redirect/route.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// The client's email to look up
const CLIENT_EMAIL = 'client@email.com'

export async function GET() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.redirect('https://my.shortlistpass.com/login')
  }

  try {
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Get client record
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('id, email, name')
      .ilike('email', CLIENT_EMAIL)
      .single()

    if (clientError || !client?.email) {
      return NextResponse.redirect('https://my.shortlistpass.com/login')
    }

    // Generate magic link
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: client.email,
      options: {
        redirectTo: 'https://my.shortlistpass.com/client-portal/auth/callback',
      },
    })

    if (error || !data?.properties?.action_link) {
      return NextResponse.redirect('https://my.shortlistpass.com/login')
    }

    return NextResponse.redirect(data.properties.action_link)
  } catch (err) {
    return NextResponse.redirect('https://my.shortlistpass.com/login')
  }
}
```

### 2. Add the Billing Card to Admin Dashboard

In the client's admin page (e.g., `/app/admin/page.tsx`):

```tsx
import { CreditCard } from 'lucide-react'

// Add this card to the dashboard grid:
<a
  href="/api/admin/billing-redirect"
  className="bg-white p-6 rounded-lg shadow-md border hover:shadow-xl transition-all"
>
  <div className="flex items-center gap-3 mb-2">
    <CreditCard className="text-gold" size={24} />
    <h2 className="text-2xl">Billing</h2>
  </div>
  <p>View invoices & manage subscription</p>
</a>
```

## Security Notes

- **Client isolation**: Each client only sees their own data. The `client_portal_users` table links their user to their specific `client_id`, and all queries filter by this.
- **Magic link**: Generated server-side using the service role key. The link is single-use and expires.
- **No password exposure**: The client never sees or enters a password for the portal.

## Existing Implementations

- **Dani Diaz** (`danidiaz.com`): `/app/api/admin/billing-redirect/route.ts`
  - Email: `danidiazrealestate@gmail.com`

## Troubleshooting

### "Client not found"
- Check the email in the API matches the `clients` table exactly

### Redirects to login instead of auto-login
- Verify the client exists in Supabase Auth (check Authentication > Users)
- Verify they're linked in `client_portal_users`
- Use `?debug=1` on the redirect URL to see what's missing

### Debug Mode
Add `?debug=1` to the billing redirect URL to see:
```json
{
  "client": { "id": "...", "email": "...", "name": "..." },
  "authUserExists": true,
  "authUserId": "...",
  "portalLink": { ... }
}
```

All three must be present for auto-login to work.
