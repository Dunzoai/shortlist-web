# Shortlist Portal - TODO & Roadmap

## Admin Portal (portal.shortlistpass.com)

### Completed Features
- [x] Authentication (email/password login)
- [x] Dashboard with key metrics
- [x] Clients management (CRUD)
- [x] Services management (CRUD)
- [x] Team/Representatives management (CRUD)
- [x] Affiliates management
- [x] Revenue tracking with filters (monthly, one-time, by rep)
- [x] Expenses tracking (recurring and one-time)
- [x] Projections page with profit calculation
- [x] 12-month profit forecast (date-aware)
- [x] Performed By attribution (defaults to Account Manager)
- [x] Company-level service tracking
- [x] Portal-specific favicon (bright yellow-green)
- [x] Portal SEO metadata (noindex for privacy)
- [x] Clickable drill-down on Projections (see clients by service/performer)
- [x] Mobile responsive layout (collapsible sidebar, hamburger menu)

### Remaining Admin Portal Work

#### High Priority
- [ ] **Data Export** - Export revenue/expenses to CSV for accounting
- [ ] **Invoice Generation** - Create PDF invoices for clients
- [ ] **Payment Integration** - Stripe integration for collecting payments
- [ ] **Bulk Actions** - Mark multiple services as inactive, bulk edit

#### Medium Priority
- [ ] **Search** - Global search across clients, services, expenses
- [ ] **Pagination** - Paginate large lists (clients, revenue table)
- [ ] **Activity Log** - Track who made changes and when
- [ ] **Dashboard Charts** - Visual revenue/expense charts over time
- [ ] **Notes System** - Add notes to clients for internal tracking

#### Low Priority / Nice to Have
- [ ] **Multiple Admin Users** - Role-based access (admin, viewer)
- [ ] **Settings Page** - Configure company info, logo, defaults
- [ ] **Email Notifications** - Alerts for upcoming renewals, late payments
- [ ] **Dark/Light Mode** - Already dark, but toggle option

---

## AI Integration

### Option A: AI Assistant Chat (Recommended First)
Natural language queries against your data:
- "Who are my highest revenue clients?"
- "Which services are most profitable?"
- "Show clients who started in the last 30 days"
- "What's my projected revenue if I add 3 more social media clients?"
- "Which rep has the highest one-time revenue?"

**Implementation:**
- Chat interface in sidebar or floating button
- Uses Claude API with function calling
- Functions to query Supabase (getClients, getRevenue, getExpenses, etc.)
- Context-aware responses based on portal data

### Option B: AI Insights Panel
Proactive insights displayed on Dashboard:
- "MRR grew 15% this month"
- "Destiny handles 42% of your recurring revenue"
- "3 clients are due for renewal next month"
- "Website Build is your most profitable one-time service"
- "Consider: 2 social media clients have no account manager assigned"

**Implementation:**
- Scheduled analysis (daily/weekly)
- Store insights in database
- Display cards on Dashboard
- Click to drill down into the data

### Option C: AI Content Generation
Generate business content:
- Draft client emails (welcome, renewal reminder, payment request)
- Create invoice summaries and statements
- Generate proposals based on service templates
- Write social media captions for clients (meta - AI for your AI clients)

### Option D: Smart Forecasting
Predictive analytics:
- Churn risk scoring per client
- Revenue forecasting with confidence intervals
- Suggest upsell opportunities based on patterns
- Seasonal trend analysis

### AI Implementation Priority
1. **AI Assistant Chat** - Most immediate value, query anything
2. **AI Insights Panel** - Passive value, surfaces things you'd miss
3. **AI Content** - Time saver for repetitive tasks
4. **Smart Forecasting** - Advanced, needs more historical data

---

## Client Portal (clients.shortlistpass.com)

### Phase 1: Core Client Experience

#### Authentication
- [ ] Client login page (magic link or password)
- [ ] Client registration/invite flow
- [ ] Password reset
- [ ] "Remember this device" option

#### Client Dashboard
- [ ] Welcome message with company name
- [ ] Current subscription summary
- [ ] Monthly cost display
- [ ] Account status indicator (active, pending, overdue)

#### Services View
- [ ] List of active services
- [ ] Service details (name, cost, start date)
- [ ] Service history (past services)

### Phase 2: Billing & Payments

#### Invoice Management
- [ ] View past invoices
- [ ] Download invoice PDFs
- [ ] Invoice status (paid, pending, overdue)

#### Payment System
- [ ] Pay outstanding balance
- [ ] Stripe checkout integration
- [ ] Payment history
- [ ] Save payment method for recurring
- [ ] Auto-pay enrollment

#### Subscription Management
- [ ] View subscription details
- [ ] Request service changes
- [ ] Cancel service requests

### Phase 3: Communication

#### Support
- [ ] Contact form / support ticket
- [ ] FAQ section
- [ ] Live chat integration (optional)

#### Profile
- [ ] Update contact information
- [ ] Change password
- [ ] Notification preferences

---

## Database Schema Additions Needed

### For Client Portal
```sql
-- Client portal users (separate from admin users)
CREATE TABLE client_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT, -- nullable for magic link only
  name TEXT,
  is_primary BOOLEAN DEFAULT false,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  invoice_number TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  stripe_invoice_id TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Invoice line items
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  amount DECIMAL(10,2) NOT NULL
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  invoice_id UUID REFERENCES invoices(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT, -- 'card', 'ach', 'check', 'other'
  stripe_payment_id TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Support tickets
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  client_user_id UUID REFERENCES client_users(id),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to UUID REFERENCES representatives(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Technical Notes

### Stripe Integration
- Use Stripe Billing for subscriptions
- Stripe Invoicing for invoice generation
- Stripe Checkout for one-time payments
- Stripe Customer Portal (optional) for self-service

### Email System
- Transactional emails via Resend or SendGrid
- Invoice delivery
- Payment receipts
- Password reset
- Magic link auth

### Security Considerations
- Client portal separate auth from admin
- RLS policies scoped to client_id
- Rate limiting on login attempts
- Audit logging for sensitive operations

---

## Implementation Order Recommendation

1. **Invoice System** - Generate and display invoices
2. **Stripe Integration** - Accept payments
3. **Client Portal Auth** - Separate client login
4. **Client Dashboard** - View subscription and invoices
5. **Payment Flow** - Pay invoices via Stripe
6. **Email Notifications** - Invoice and payment emails
7. **Support Tickets** - Client communication
