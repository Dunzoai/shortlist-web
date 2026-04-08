-- Add Palmetto Taps to web_clients table
INSERT INTO web_clients (
  slug,
  business_name,
  domains,
  primary_color,
  secondary_color,
  accent_color,
  text_color,
  background_color,
  tagline,
  bio,
  contact_email,
  contact_phone
) VALUES (
  'palmetto_taps',
  'Palmetto Taps',
  ARRAY['palmettotaps.com', 'www.palmettotaps.com', 'palmetto-taps.shortlistpass.com'],
  '#2D3E50',  -- dark blue/gray
  '#8B7355',  -- brown/tan
  '#D4A373',  -- warm tan accent
  '#1A1A1A',  -- near black text
  '#E2D6C7',  -- cream background
  'Horry County''s First Self-Serve Taproom',
  '40 self-serve taps in downtown Conway, SC. Pour your own craft beer, enjoy live music, and hang out on our dog-friendly patio.',
  'info@palmettotaps.com',
  '(843) 555-TAPS'
);
