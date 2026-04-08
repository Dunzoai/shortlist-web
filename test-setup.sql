-- First, find or create a test client
-- Replace 'test-client-id' with actual client ID from your clients table

-- Create a test portal user (check if you have a client ID first)
-- You'll need to:
-- 1. Sign up via /portal/login (creates auth user)
-- 2. Then manually link that user to a client in client_portal_users table

-- Or run this after you know the auth user ID:
INSERT INTO client_portal_users (user_id, client_id, is_active)
VALUES ('YOUR_AUTH_USER_ID', 'YOUR_CLIENT_ID', true);
