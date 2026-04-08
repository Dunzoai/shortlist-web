-- ================================================
-- Billing System Schema
-- Run this in Supabase SQL Editor
-- ================================================

-- Client billing preferences (autopay, email settings)
CREATE TABLE client_billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE UNIQUE,

  -- Stripe
  stripe_customer_id TEXT,

  -- Autopay settings
  autopay_enabled BOOLEAN DEFAULT false,
  default_payment_method_id TEXT, -- Stripe payment method ID

  -- Email preferences
  send_invoice_emails BOOLEAN DEFAULT true,
  send_receipt_emails BOOLEAN DEFAULT true,
  send_reminder_emails BOOLEAN DEFAULT true,

  -- Billing cycle
  billing_day INTEGER DEFAULT 1 CHECK (billing_day >= 1 AND billing_day <= 28), -- Day of month to bill

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,

  -- Invoice details
  invoice_number TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'partially_paid', 'overdue', 'cancelled', 'refunded')) DEFAULT 'draft',

  -- Amounts
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,4) DEFAULT 0, -- e.g., 0.0825 for 8.25%
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  amount_due DECIMAL(10,2) GENERATED ALWAYS AS (total - amount_paid) STORED,

  -- Dates
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,

  -- Billing period (for recurring invoices)
  period_start DATE,
  period_end DATE,

  -- Stripe
  stripe_invoice_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_hosted_invoice_url TEXT, -- Stripe's hosted invoice page

  -- PDF
  pdf_url TEXT,

  -- Notes
  notes TEXT,
  internal_notes TEXT, -- Admin only, not shown to client

  -- Reminders tracking
  reminder_sent_at TIMESTAMPTZ,
  reminder_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Invoice line items
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,

  -- What's being billed
  description TEXT NOT NULL,
  service_id UUID REFERENCES services(id), -- Optional link to service
  client_service_id UUID REFERENCES client_services(id), -- Optional link to specific client service

  -- Amounts
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  amount DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,

  -- For recurring items
  period_start DATE,
  period_end DATE,

  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL, -- Can be null for credits/adjustments

  -- Payment details
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('card', 'ach', 'check', 'cash', 'other', 'credit')),
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')) DEFAULT 'pending',

  -- Stripe
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  stripe_refund_id TEXT,

  -- Card details (from Stripe, for display)
  card_brand TEXT, -- visa, mastercard, amex, etc.
  card_last4 TEXT,

  -- Failure tracking
  failure_reason TEXT,
  failure_code TEXT,

  -- Notes
  notes TEXT,

  -- Refund tracking
  refunded_amount DECIMAL(10,2) DEFAULT 0,
  refunded_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Client portal users (separate from admin users)
CREATE TABLE client_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,

  -- Auth
  email TEXT NOT NULL,
  auth_user_id UUID REFERENCES auth.users(id), -- Links to Supabase Auth

  -- Profile
  name TEXT,
  phone TEXT,
  is_primary BOOLEAN DEFAULT false, -- Primary contact for billing

  -- Access
  can_view_invoices BOOLEAN DEFAULT true,
  can_make_payments BOOLEAN DEFAULT true,
  can_manage_autopay BOOLEAN DEFAULT false,

  -- Activity
  last_login_at TIMESTAMPTZ,
  invited_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(client_id, email)
);

-- Email log (track what was sent)
CREATE TABLE billing_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,

  email_type TEXT CHECK (email_type IN ('invoice', 'receipt', 'reminder', 'overdue', 'autopay_failed', 'autopay_success')),
  recipient_email TEXT NOT NULL,
  subject TEXT,

  -- Status
  status TEXT CHECK (status IN ('queued', 'sent', 'delivered', 'failed', 'bounced')) DEFAULT 'queued',
  sent_at TIMESTAMPTZ,

  -- Error tracking
  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- ================================================
-- Indexes for performance
-- ================================================

CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);

CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);

CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_status ON payments(status);

CREATE INDEX idx_client_users_client_id ON client_users(client_id);
CREATE INDEX idx_client_users_email ON client_users(email);
CREATE INDEX idx_client_users_auth_user_id ON client_users(auth_user_id);

CREATE INDEX idx_client_billing_client_id ON client_billing(client_id);
CREATE INDEX idx_client_billing_stripe_customer_id ON client_billing(stripe_customer_id);

CREATE INDEX idx_billing_emails_invoice_id ON billing_emails(invoice_id);

-- ================================================
-- Row Level Security
-- ================================================

ALTER TABLE client_billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_emails ENABLE ROW LEVEL SECURITY;

-- Admin policies (authenticated users can manage all)
CREATE POLICY "Admin full access to client_billing" ON client_billing
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to invoices" ON invoices
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to invoice_items" ON invoice_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to payments" ON payments
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to client_users" ON client_users
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to billing_emails" ON billing_emails
  FOR ALL USING (auth.role() = 'authenticated');

-- ================================================
-- Helper function: Generate invoice number
-- Format: INV-2026-00001
-- ================================================

CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  current_year INTEGER;
  next_number INTEGER;
  invoice_num TEXT;
BEGIN
  current_year := EXTRACT(YEAR FROM CURRENT_DATE);

  SELECT COALESCE(MAX(
    CAST(SUBSTRING(invoice_number FROM 10 FOR 5) AS INTEGER)
  ), 0) + 1
  INTO next_number
  FROM invoices
  WHERE invoice_number LIKE 'INV-' || current_year || '-%';

  invoice_num := 'INV-' || current_year || '-' || LPAD(next_number::TEXT, 5, '0');

  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Trigger: Auto-generate invoice number
-- ================================================

CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number := generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_invoice_number
  BEFORE INSERT ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION set_invoice_number();

-- ================================================
-- Trigger: Update invoice totals when items change
-- ================================================

CREATE OR REPLACE FUNCTION update_invoice_totals()
RETURNS TRIGGER AS $$
DECLARE
  inv_subtotal DECIMAL(10,2);
  inv_tax_rate DECIMAL(5,4);
  inv_tax_amount DECIMAL(10,2);
  inv_total DECIMAL(10,2);
BEGIN
  -- Get the invoice_id (works for INSERT, UPDATE, DELETE)
  IF TG_OP = 'DELETE' THEN
    SELECT COALESCE(SUM(quantity * unit_price), 0) INTO inv_subtotal
    FROM invoice_items WHERE invoice_id = OLD.invoice_id;

    SELECT tax_rate INTO inv_tax_rate FROM invoices WHERE id = OLD.invoice_id;
    inv_tax_amount := inv_subtotal * COALESCE(inv_tax_rate, 0);
    inv_total := inv_subtotal + inv_tax_amount;

    UPDATE invoices SET
      subtotal = inv_subtotal,
      tax_amount = inv_tax_amount,
      total = inv_total,
      updated_at = now()
    WHERE id = OLD.invoice_id;
  ELSE
    SELECT COALESCE(SUM(quantity * unit_price), 0) INTO inv_subtotal
    FROM invoice_items WHERE invoice_id = NEW.invoice_id;

    SELECT tax_rate INTO inv_tax_rate FROM invoices WHERE id = NEW.invoice_id;
    inv_tax_amount := inv_subtotal * COALESCE(inv_tax_rate, 0);
    inv_total := inv_subtotal + inv_tax_amount;

    UPDATE invoices SET
      subtotal = inv_subtotal,
      tax_amount = inv_tax_amount,
      total = inv_total,
      updated_at = now()
    WHERE id = NEW.invoice_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_invoice_totals
  AFTER INSERT OR UPDATE OR DELETE ON invoice_items
  FOR EACH ROW
  EXECUTE FUNCTION update_invoice_totals();

-- ================================================
-- Trigger: Update invoice status based on payments
-- ================================================

CREATE OR REPLACE FUNCTION update_invoice_payment_status()
RETURNS TRIGGER AS $$
DECLARE
  inv_total DECIMAL(10,2);
  inv_paid DECIMAL(10,2);
BEGIN
  -- Get invoice totals
  SELECT total, amount_paid INTO inv_total, inv_paid
  FROM invoices WHERE id = NEW.invoice_id;

  -- Update status based on payment
  IF inv_paid >= inv_total THEN
    UPDATE invoices SET
      status = 'paid',
      paid_at = COALESCE(paid_at, now()),
      updated_at = now()
    WHERE id = NEW.invoice_id;
  ELSIF inv_paid > 0 THEN
    UPDATE invoices SET
      status = 'partially_paid',
      updated_at = now()
    WHERE id = NEW.invoice_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_invoice_payment_status
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION update_invoice_payment_status();

-- ================================================
-- Function: Create invoice from client services
-- ================================================

CREATE OR REPLACE FUNCTION create_invoice_from_services(
  p_client_id UUID,
  p_due_date DATE DEFAULT CURRENT_DATE + INTERVAL '30 days',
  p_period_start DATE DEFAULT date_trunc('month', CURRENT_DATE)::DATE,
  p_period_end DATE DEFAULT (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::DATE
)
RETURNS UUID AS $$
DECLARE
  new_invoice_id UUID;
  service_record RECORD;
BEGIN
  -- Create the invoice
  INSERT INTO invoices (client_id, due_date, period_start, period_end)
  VALUES (p_client_id, p_due_date, p_period_start, p_period_end)
  RETURNING id INTO new_invoice_id;

  -- Add line items for each active service
  FOR service_record IN
    SELECT
      cs.id as client_service_id,
      cs.service_id,
      s.name as service_name,
      cs.monthly_cost
    FROM client_services cs
    JOIN services s ON s.id = cs.service_id
    WHERE cs.client_id = p_client_id
      AND cs.status = 'active'
      AND cs.monthly_cost > 0
  LOOP
    INSERT INTO invoice_items (
      invoice_id,
      description,
      service_id,
      client_service_id,
      quantity,
      unit_price,
      period_start,
      period_end
    ) VALUES (
      new_invoice_id,
      service_record.service_name,
      service_record.service_id,
      service_record.client_service_id,
      1,
      service_record.monthly_cost,
      p_period_start,
      p_period_end
    );
  END LOOP;

  RETURN new_invoice_id;
END;
$$ LANGUAGE plpgsql;
