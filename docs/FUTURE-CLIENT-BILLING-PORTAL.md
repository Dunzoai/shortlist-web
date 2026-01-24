# Client Billing Portal - Future Feature

## Overview
Client-facing portal where Shortlist clients can view their services, manage payment methods, pay invoices, and set up autopay for recurring charges.

---

## Payment Processor: Stripe

### Why Stripe
- Industry standard for SaaS/subscription billing
- Handles PCI compliance
- Stripe Elements for secure card input
- Subscription management built-in
- Invoice generation
- Customer portal (optional hosted solution)

### Stripe Products to Use
- **Stripe Customers** - Link to our clients
- **Stripe Payment Methods** - Store cards securely
- **Stripe Subscriptions** - Recurring monthly charges
- **Stripe Invoices** - One-time charges, outstanding balances
- **Stripe Checkout/Elements** - Secure payment UI

---

## Database Schema

```sql
-- Add Stripe customer ID to clients
ALTER TABLE clients ADD COLUMN stripe_customer_id TEXT;

-- Invoices for tracking charges
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')) DEFAULT 'draft',
  due_date DATE,
  paid_at TIMESTAMPTZ,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Link invoices to specific services (optional, for itemized invoices)
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  client_service_id UUID REFERENCES client_services(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payment history
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  stripe_payment_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')) DEFAULT 'pending',
  payment_method TEXT, -- 'card', 'cash', 'check', 'transfer'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Admin access
CREATE POLICY "Auth users can manage invoices" ON invoices FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can manage invoice_items" ON invoice_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can manage payments" ON payments FOR ALL USING (auth.role() = 'authenticated');

-- Client access (for client portal - future)
-- Will need policies that check client_id matches logged-in client's ID
```

---

## Admin Dashboard Features

### Invoice Management (`/portal/invoices`)
- List all invoices with status filters (draft, sent, paid, overdue)
- Create invoice for a client
- Auto-generate from client's active services
- Send invoice (email via Stripe or custom)
- Mark as paid (for cash/check payments)
- View payment history

### Client Detail Page Additions
- Outstanding balance display
- Payment history
- "Generate Invoice" button
- "Send Payment Reminder" button
- Stripe customer link

### Dashboard Additions
- Outstanding balance total (accounts receivable)
- Overdue invoices count
- Recent payments

---

## Client Portal Features

### Authentication
- Separate from admin auth
- Magic link to client's email
- Or: password-based with email from clients table

### Client Dashboard
- Current services list with monthly costs
- Outstanding balance
- Payment history
- Next payment due date

### Payment Methods
- Add card via Stripe Elements
- View saved cards
- Set default payment method
- Remove cards

### Pay Now
- View outstanding invoices
- Pay single invoice
- Pay full balance

### Autopay Setup
- Enable/disable autopay
- Select payment method for autopay
- Choose billing date (1st, 15th, etc.)

---

## Stripe Integration

### Environment Variables
```
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### API Routes Needed

```
POST /api/stripe/create-customer
  - Creates Stripe customer for a client
  - Stores stripe_customer_id

POST /api/stripe/create-setup-intent
  - For adding payment methods
  - Returns client_secret for Stripe Elements

POST /api/stripe/create-payment-intent
  - For one-time payments
  - Returns client_secret

POST /api/stripe/create-subscription
  - Sets up recurring billing
  - Links to client's services

POST /api/stripe/webhook
  - Receives Stripe events
  - Updates invoice/payment status
  - Handles subscription renewals
  - Handles failed payments

GET /api/stripe/payment-methods/:clientId
  - List client's saved cards

DELETE /api/stripe/payment-methods/:paymentMethodId
  - Remove a card
```

### Webhook Events to Handle
- `invoice.paid` - Mark invoice as paid
- `invoice.payment_failed` - Mark as overdue, notify
- `customer.subscription.updated` - Sync subscription status
- `payment_intent.succeeded` - Record payment
- `payment_intent.payment_failed` - Handle failure

---

## Implementation Phases

### Phase 1: Admin Invoice Tracking (No Stripe)
- Add invoices table
- Invoice list page in admin
- Create/edit invoices manually
- Mark as paid manually
- Track outstanding balances

### Phase 2: Stripe Setup
- Create Stripe account
- Add API keys to env
- Create Stripe customers for existing clients
- Basic webhook handling

### Phase 3: Admin Stripe Integration
- Generate invoices in Stripe
- Send invoices via Stripe
- Sync payment status via webhooks
- Payment history in admin

### Phase 4: Client Portal MVP
- Client login system
- View services and balance
- View invoices
- Add payment method
- Pay invoice

### Phase 5: Autopay & Subscriptions
- Set up Stripe subscriptions
- Autopay toggle for clients
- Automatic monthly billing
- Failed payment handling

---

## UI Mockups (Conceptual)

### Admin Invoice List
```
Invoices
[Filter: All | Draft | Sent | Paid | Overdue]

| Client        | Amount  | Status  | Due Date   | Actions      |
|---------------|---------|---------|------------|--------------|
| Dani Diaz     | $35.00  | Overdue | Jan 15     | [Send] [Pay] |
| Nito's        | $150.00 | Sent    | Jan 20     | [Remind]     |
| Palmetto Taps | $200.00 | Paid    | Jan 10     | [View]       |
```

### Client Portal Dashboard
```
Welcome, Dani!

Your Services:
- Hosting: $35/mo
- SmartPages: $50/mo

Outstanding Balance: $85.00
[Pay Now]

Payment Methods:
- Visa ending in 4242 (default)
[Add Card]

☑️ Autopay enabled - charges on the 1st
```

---

## Security Considerations
- Never store raw card numbers (Stripe handles this)
- Use Stripe Elements for PCI compliance
- Verify webhook signatures
- Client portal must only show their own data
- Rate limit payment attempts

---

## Notes
- Start with Phase 1 (manual invoice tracking) to get workflow right
- Stripe has a hosted Customer Portal - evaluate if that's sufficient vs custom
- Consider Stripe Billing Portal for self-service subscription management
- Mobile-friendly client portal is important
