-- Supabase Table Schema for Home Valuation Leads
-- This table stores lead information from the Home Valuation form

CREATE TABLE IF NOT EXISTS valuation_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES web_clients(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('single-family', 'townhouse', 'condo', 'multi-family', 'land', 'other')),
  year_built TEXT,
  square_footage TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed', 'archived'))
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_valuation_leads_client_id ON valuation_leads(client_id);
CREATE INDEX IF NOT EXISTS idx_valuation_leads_created_at ON valuation_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_valuation_leads_status ON valuation_leads(status);

-- Enable Row Level Security (RLS)
ALTER TABLE valuation_leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (for the public form submission)
CREATE POLICY "Allow public insert for valuation leads"
  ON valuation_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated users to read their client's leads
-- (You may need to adjust this based on your auth setup)
CREATE POLICY "Allow authenticated users to read valuation leads"
  ON valuation_leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Add comment to the table
COMMENT ON TABLE valuation_leads IS 'Stores home valuation lead information from the website contact form';
