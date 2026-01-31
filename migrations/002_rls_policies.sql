-- Row Level Security Policies for Client Portal
-- Run this AFTER 001_client_portal.sql

-- Enable RLS on all tables
ALTER TABLE client_portal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CLIENT PORTAL USERS
-- ============================================

-- Clients can view their own portal user record
CREATE POLICY "Clients can view their own portal user" ON client_portal_users
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Admins (authenticated users) have full access
CREATE POLICY "Admins can manage all portal users" ON client_portal_users
  FOR ALL 
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE email IN (
        SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
      )
    )
  );

-- ============================================
-- INVOICES
-- ============================================

-- Clients can only view their own invoices
CREATE POLICY "Clients can view their own invoices" ON invoices
  FOR SELECT 
  USING (
    client_id IN (
      SELECT client_id FROM client_portal_users 
      WHERE user_id = auth.uid()
    )
  );

-- Admins have full access to all invoices
CREATE POLICY "Admins can manage all invoices" ON invoices
  FOR ALL 
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE email IN (
        SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
      )
    )
  );

-- Service role (for API operations) has full access
CREATE POLICY "Service role has full access to invoices" ON invoices
  FOR ALL 
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- PAYMENTS
-- ============================================

-- Clients can view their own payments
CREATE POLICY "Clients can view their own payments" ON payments
  FOR SELECT 
  USING (
    client_id IN (
      SELECT client_id FROM client_portal_users 
      WHERE user_id = auth.uid()
    )
  );

-- Admins have full access
CREATE POLICY "Admins can manage all payments" ON payments
  FOR ALL 
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE email IN (
        SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
      )
    )
  );

-- Service role has full access
CREATE POLICY "Service role has full access to payments" ON payments
  FOR ALL 
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- RECURRING BILLING
-- ============================================

-- Clients can view their own billing
CREATE POLICY "Clients can view their own billing" ON recurring_billing
  FOR SELECT 
  USING (
    client_id IN (
      SELECT client_id FROM client_portal_users 
      WHERE user_id = auth.uid()
    )
  );

-- Admins have full access
CREATE POLICY "Admins can manage all billing" ON recurring_billing
  FOR ALL 
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE email IN (
        SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
      )
    )
  );

-- Service role has full access
CREATE POLICY "Service role has full access to billing" ON recurring_billing
  FOR ALL 
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- NOTIFICATIONS
-- ============================================

-- Only admins and service role can access notifications
CREATE POLICY "Admins can view all notifications" ON notifications
  FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE email IN (
        SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
      )
    )
  );

CREATE POLICY "Admins can manage notifications" ON notifications
  FOR ALL 
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE email IN (
        SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
      )
    )
  );

-- Service role has full access
CREATE POLICY "Service role has full access to notifications" ON notifications
  FOR ALL 
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- CLIENT SERVICES (Update existing policies)
-- ============================================

-- Clients can view their own services
DROP POLICY IF EXISTS "Clients can view their own services" ON client_services;
CREATE POLICY "Clients can view their own services" ON client_services
  FOR SELECT 
  USING (
    client_id IN (
      SELECT client_id FROM client_portal_users 
      WHERE user_id = auth.uid()
    )
  );

-- Clients can update their own service status (pause/cancel)
DROP POLICY IF EXISTS "Clients can update their service status" ON client_services;
CREATE POLICY "Clients can update their service status" ON client_services
  FOR UPDATE 
  USING (
    client_id IN (
      SELECT client_id FROM client_portal_users 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    client_id IN (
      SELECT client_id FROM client_portal_users 
      WHERE user_id = auth.uid()
    )
  );
