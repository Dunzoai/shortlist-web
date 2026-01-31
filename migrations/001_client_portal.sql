-- Client Portal Database Schema
CREATE TABLE IF NOT EXISTS client_portal_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_client_portal_users_user_id ON client_portal_users(user_id);
CREATE INDEX IF NOT EXISTS idx_client_portal_users_client_id ON client_portal_users(client_id);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')) DEFAULT 'pending',
  due_date DATE,
  paid_at TIMESTAMPTZ,
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  payment_method_last4 TEXT,
  status TEXT CHECK (status IN ('pending', 'succeeded', 'failed')) DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recurring_billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT CHECK (status IN ('active', 'cancelled', 'paused')) DEFAULT 'active',
  next_billing_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT,
  recipient_email TEXT NOT NULL,
  subject TEXT,
  body TEXT,
  metadata JSONB,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE client_services ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
