-- Row Level Security Policies for Client Portal (FIXED)
-- Run this AFTER 001_client_portal.sql

-- Enable RLS on NEW tables only (don't touch existing client_services yet)
ALTER TABLE client_portal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CLIENT PORTAL USERS
-- ============================================

CREATE POLICY "Clients can view their own portal user" ON client_portal_users
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can manage portal users" ON client_portal_users
  FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role full access to portal users" ON client_portal_users
  FOR ALL 
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- INVOICES
-- ============================================

CREATE POLICY "Clients can view their own invoices" ON invoices
  FOR SELECT 
  USING (
    client_id IN (
      SELECT client_id FROM client_portal_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can manage invoices" ON invoices
  FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role full access to invoices" ON invoices
  FOR ALL 
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- PAYMENTS
-- ============================================

CREATE POLICY "Clients can view their own payments" ON payments
  FOR SELECT 
  USING (
    client_id IN (
      SELECT client_id FROM client_portal_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can manage payments" ON payments
  FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role full access to payments" ON payments
  FOR ALL 
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- RECURRING BILLING
-- ============================================

CREATE POLICY "Clients can view their own billing" ON recurring_billing
  FOR SELECT 
  USING (
    client_id IN (
      SELECT client_id FROM client_portal_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can manage billing" ON recurring_billing
  FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role full access to billing" ON recurring_billing
  FOR ALL 
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE POLICY "Authenticated users can view notifications" ON notifications
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage notifications" ON notifications
  FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role full access to notifications" ON notifications
  FOR ALL 
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- CLIENT SERVICES (ADD POLICIES, DON'T TOUCH EXISTING)
-- ============================================

-- Only add CLIENT access, preserve existing admin access
CREATE POLICY "Clients can view their own services" ON client_services
  FOR SELECT 
  USING (
    client_id IN (
      SELECT client_id FROM client_portal_users 
      WHERE user_id = auth.uid()
    )
  );

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

-- Note: Existing "Authenticated users can manage client_services" policy 
-- should already exist and handles admin access. Don't touch it.
