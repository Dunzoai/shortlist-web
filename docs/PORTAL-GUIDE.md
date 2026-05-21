# Portal & Client Dashboard Guide

How the admin portal (`portal.shortlistpass.com`) and client dashboard (`my.shortlistpass.com`) work together.

---

## Overview

| Portal | URL | Who uses it |
|--------|-----|-------------|
| Admin Portal | `portal.shortlistpass.com` | The Shortlist Co team |
| Client Dashboard | `my.shortlistpass.com` | Clients |

Admin writes data (services, invoices, notes) -> Client sees it on their dashboard. Payments flow back through Stripe webhooks and update both sides automatically.

---

## Admin Portal

### Pages

| Page | Path | What it does |
|------|------|-------------|
| Dashboard | `/` | Overview metrics: total clients, active clients, monthly + one-time revenue |
| Clients | `/clients` | List all clients, search, click to edit |
| Client Detail | `/clients/[id]` | Edit client info, manage services, invite to portal, view payment history |
| Invoices | `/invoices` | List all invoices, filter by status, see outstanding/overdue/paid stats |
| New Invoice | `/invoices/new` | Create invoice, auto-populate line items from active services |
| Invoice Detail | `/invoices/[id]` | View/edit invoice, send to client |
| Revenue | `/revenue` | Monthly recurring + one-time revenue breakdown |
| Projections | `/projections` | Financial forecasting from active services and expenses |
| Expenses | `/expenses` | Track business expenses by category |
| Services | `/services` | Master service catalog (templates that get assigned to clients) |
| Team | `/team` | Manage representatives / account managers |
| Affiliates | `/affiliates` | Referral partners and commission tracking |

### Key Workflows

**Adding a new client:**

1. Go to Clients -> New Client
2. Fill in name, email, phone
3. Assign an account manager (representative)
4. Optionally link to an affiliate
5. Save

**Assigning services to a client:**

1. Go to Clients -> click client name
2. Use the "Add Service" dropdown on the right
3. Set monthly cost, one-time cost, deposit amount
4. Set start date and status
5. Add service notes (these are visible to the client on their dashboard)
6. Assign who performs the service (team member)

**Inviting a client to their dashboard:**

1. Go to Clients -> click client name
2. Make sure the client has an email address
3. Click "Invite to Portal"
4. Client receives an email with a link to set their password
5. After setting password, they can log in at `my.shortlistpass.com`

**Creating and sending an invoice:**

1. Go to Invoices -> New Invoice
2. Select the client
3. Line items auto-populate from their active services with `monthly_cost > 0`
4. Adjust amounts, add one-time items if needed
5. Set due date
6. Save as draft, then send when ready
7. Client sees it on their Invoices page with a Pay button

---

## Client Dashboard

### Pages

| Page | Path | What it does |
|------|------|-------------|
| Services | `/services` | View all assigned services (default landing page) |
| Invoices | `/invoices` | View invoices, pay via Stripe |
| Billing | `/billing` | Subscription status, payment history |
| Settings | `/settings` | Account settings |

### What the client sees

**Services page:**
- Each service card shows: name, status (Active/Paused/Cancelled), description, admin notes
- Monthly services: price per month, next renewal date
- One-time services: total cost, deposit paid, amount owed, payment status
- If subscribed: "SUBSCRIBED" badge, "Auto-renews: [date]"
- If payment failed: "PAYMENT FAILED" badge
- Pause and Cancel buttons on active services

**Invoices page:**
- Table of all invoices with number, amount, status, due date
- "Pay Now" button for one-time invoices
- "Pay & Subscribe" button for invoices with recurring services
- Success/cancelled banners after returning from Stripe

**Billing page:**
- Subscription status and next billing date
- Payment history table (last 20 payments): date, amount, card info, status

**Sidebar:**
- Account Managed By section showing their rep's name and email
- Invoice badge counter (red dot with number of unpaid invoices)

---

## What Syncs Between Admin and Client

| Admin writes | Table | Client sees |
|-------------|-------|-------------|
| Service assignment + costs | `client_services` | Service cards with pricing |
| Service notes | `client_services.notes` | "Service Details" box on card |
| Deposit / amount paid | `client_services.deposit_amount`, `amount_paid` | Deposit tracking on one-time services |
| Service status change | `client_services.status` | Status badge on card |
| Invoice creation | `invoices` + `invoice_items` | Invoice in table with Pay button |
| Account manager assignment | `clients.representative_id` | "Account Managed By" in sidebar |

| Client does | What happens | Admin sees |
|------------|-------------|-----------|
| Pays invoice (one-time) | Stripe webhook marks invoice paid, creates payment | Invoice status = Paid, payment in history |
| Subscribes (recurring) | Stripe creates subscription, webhook stores in `recurring_billing` | Subscription active, monthly payments auto-tracked |
| Pauses service | Updates `client_services`, sends notification | Service status = Paused, notification received |
| Cancels service | Updates `client_services`, sends notification | Service status = Cancelled, notification received |

---

## Stripe Payment Flow

### One-time payment

```
Client clicks "Pay Now"
  -> POST /api/stripe/create-checkout-session (mode: payment)
  -> Stripe Checkout page
  -> Client pays
  -> Stripe sends checkout.session.completed webhook
  -> Webhook marks invoice as paid, creates payment record
  -> Client redirected back with success message
```

### Subscription (recurring services)

```
Client clicks "Pay & Subscribe"
  -> POST /api/stripe/create-checkout-session (mode: subscription)
  -> Stripe Checkout page (shows recurring + one-time items)
  -> Client enters card and subscribes
  -> Stripe sends checkout.session.completed webhook
  -> Webhook creates recurring_billing record, marks initial invoice paid
  -> Every month: Stripe auto-charges
    -> Stripe sends invoice.paid webhook
    -> Webhook auto-creates invoice in our system (already marked paid)
    -> Webhook creates payment record
    -> Updates next_billing_date
```

### Mixed invoices (one-time + recurring)

When an invoice has both one-time items (e.g., website build) and recurring items (e.g., hosting, social media), the checkout uses `mode: subscription`. Stripe charges one-time items on the first invoice only, recurring items repeat monthly.

Example: Website ($2,000) + Hosting ($50/mo) + Social ($500/mo)
- Day 1: Client pays $2,550
- Month 2+: Client auto-charged $550/mo

### Webhook events handled

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Store subscription, mark invoice paid |
| `invoice.paid` | Create payment, auto-generate invoice for renewals |
| `invoice.payment_failed` | Record failed payment, pause subscription |
| `customer.subscription.updated` | Sync status (active/paused/cancelled) |
| `customer.subscription.deleted` | Mark subscription cancelled |

### Stripe setup required

1. Webhook URL: `https://my.shortlistpass.com/api/webhooks/stripe`
2. Events: the 5 listed above
3. Env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

---

## Authentication

### Admin portal

- Uses `ADMIN_EMAILS` env var (comma-separated list of allowed emails)
- Middleware checks Supabase auth session + email in allowed list
- Login at `portal.shortlistpass.com/login`

### Client portal

Two types of users can log in:

**Regular clients:**
- Invited by admin via "Invite to Portal" button
- Creates Supabase Auth account + `client_portal_users` row linking user to client
- Can only see their own data

**Super admins (Owner role):**
- Has a record in `representatives` table with `role = 'Owner'`
- Can log in at `my.shortlistpass.com` and see ALL clients
- Gets a client switcher dropdown in the sidebar
- Useful for testing and support

### Password flows

- **Initial setup:** Admin invites client -> client gets email -> clicks link -> sets password at `/client-portal/set-password`
- **Forgot password:** Client goes to `/client-portal/forgot-password` -> enters email -> gets reset link -> sets new password

---

## Database Tables

### Core

| Table | Purpose |
|-------|---------|
| `clients` | Client records (name, email, phone, affiliate, representative) |
| `services` | Service catalog (name, description) |
| `client_services` | Which services each client has, with costs, status, notes |
| `representatives` | Team members / account managers |
| `affiliates` | Referral partners |
| `expenses` | Business expense tracking |

### Billing

| Table | Purpose |
|-------|---------|
| `invoices` | Invoice records with status, amounts, dates |
| `invoice_items` | Line items on invoices, linked to services |
| `payments` | All payment records (completed, failed, refunded) |
| `client_billing` | Stripe customer ID, autopay preferences |
| `recurring_billing` | Subscription status, next billing date |
| `billing_emails` | Log of sent receipts, reminders, etc. |

### Auth

| Table | Purpose |
|-------|---------|
| `client_portal_users` | Links Supabase auth users to clients |

---

## Environment Variables

| Variable | Used for |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (client-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key (server-side, bypasses RLS) |
| `STRIPE_SECRET_KEY` | Stripe API access |
| `STRIPE_WEBHOOK_SECRET` | Verify webhook signatures |
| `ADMIN_EMAILS` | Comma-separated admin portal emails |

---

## File Structure

```
app/
  portal/                    # Admin portal
    page.tsx                 # Dashboard
    layout.tsx               # Admin layout
    PortalNav.tsx            # Sidebar navigation
    clients/                 # Client management
    invoices/                # Invoice management
    revenue/                 # Revenue reports
    projections/             # Financial projections
    expenses/                # Expense tracking
    services/                # Service catalog
    team/                    # Team management
    affiliates/              # Affiliate management

  client-portal/             # Client dashboard
    layout.tsx               # Client layout with sidebar
    services/page.tsx        # Services (landing page)
    invoices/page.tsx        # Invoices + pay
    billing/page.tsx         # Subscription + payment history
    settings/page.tsx        # Account settings
    login/page.tsx           # Login
    set-password/page.tsx    # Set password (invite/reset)
    forgot-password/page.tsx # Password reset request
    auth/callback/route.ts   # Auth callback

  api/
    portal/
      invite-client/route.ts # Invite client to portal
      notify-cancel/route.ts # Notify admin of cancellation
    stripe/
      create-checkout-session/route.ts  # Create Stripe checkout
    webhooks/
      stripe/route.ts        # Stripe webhook handler

lib/
  usePortalClient.ts         # Hook: resolve client ID + super admin check
  portal-types.ts            # TypeScript types for all entities
  stripe.ts                  # Stripe client singleton + helpers
  supabase/client.ts         # Supabase browser client

middleware.ts                # Subdomain routing + auth checks
```
