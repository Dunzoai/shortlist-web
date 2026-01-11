-- Instagram Tokens Table
-- Run this in your Supabase SQL editor to create the instagram_tokens table

CREATE TABLE IF NOT EXISTS instagram_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT UNIQUE NOT NULL,
  access_token TEXT NOT NULL,
  instagram_user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_instagram_tokens_client_id ON instagram_tokens(client_id);
CREATE INDEX IF NOT EXISTS idx_instagram_tokens_expires_at ON instagram_tokens(expires_at);

-- Add RLS policies (adjust based on your security requirements)
ALTER TABLE instagram_tokens ENABLE ROW LEVEL SECURITY;

-- Allow public read access (adjust based on your needs)
CREATE POLICY "Allow public read access" ON instagram_tokens
  FOR SELECT
  USING (true);

-- Only allow service role to insert/update
CREATE POLICY "Only service role can modify" ON instagram_tokens
  FOR ALL
  USING (auth.role() = 'service_role');
