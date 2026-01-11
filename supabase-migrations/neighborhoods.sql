-- Create neighborhoods table
CREATE TABLE IF NOT EXISTS neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  highlights TEXT[] NOT NULL,
  price_range TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert neighborhood data
INSERT INTO neighborhoods (name, description, highlights, price_range, image_url, display_order) VALUES
(
  'Myrtle Beach',
  'The heart of the Grand Strand, Myrtle Beach offers the perfect blend of entertainment, dining, and coastal living. From the iconic boardwalk to world-class golf courses, this vibrant area has something for everyone.

Experience the best of beach life with miles of pristine shoreline, endless shopping at Broadway at the Beach and Coastal Grand Mall, and entertainment options that keep the fun going year-round.',
  ARRAY[
    'Iconic Myrtle Beach Boardwalk & Promenade',
    'Broadway at the Beach entertainment complex',
    'Over 100 championship golf courses nearby',
    'SkyWheel - 200-foot observation wheel',
    'Family Kingdom Amusement Park',
    'Vibrant nightlife and dining scene'
  ],
  '$200K - $600K',
  '/myrtle-beach.jpg',
  1
),
(
  'North Myrtle Beach',
  'Known for its family-friendly atmosphere and the famous shag dance, North Myrtle Beach offers a more relaxed coastal experience. Beautiful beaches, excellent restaurants, and welcoming communities make this area a favorite for both residents and visitors.

Discover charming neighborhoods, pristine beaches less crowded than downtown, and a strong sense of community that makes North Myrtle Beach feel like home from day one.',
  ARRAY[
    'Cherry Grove Beach and fishing pier',
    'Barefoot Landing shopping and dining',
    'Alabama Theatre and entertainment venues',
    'Access to Intracoastal Waterway',
    'Ocean Drive Beach - home of the Shag',
    'Family-friendly community atmosphere'
  ],
  '$250K - $700K',
  '/north-myrtle-beach.jpg',
  2
),
(
  'Surfside Beach',
  'Dubbed the "Family Beach," Surfside offers a quieter, more laid-back coastal lifestyle. This charming town maintains its small-town feel while providing easy access to all Grand Strand attractions.

Perfect for those seeking a peaceful beach community with excellent fishing, beautiful sunrises, and neighbors who quickly become friends.',
  ARRAY[
    'Family-oriented beach community',
    'Surfside Pier for fishing and dining',
    'Less crowded beaches',
    'Annual festivals and events',
    'Excellent local restaurants',
    'Close to Murrells Inlet MarshWalk'
  ],
  '$300K - $800K',
  '/surfside-beach.jpg',
  3
),
(
  'Pawleys Island',
  'Renowned for its natural beauty and unhurried pace, Pawleys Island embodies the "arrogantly shabby" philosophy. This historic island community offers pristine beaches, stunning marsh views, and a lifestyle that celebrates simplicity and natural beauty.

Experience true coastal living where the focus is on relaxation, family, and appreciating the natural wonders of the Lowcountry.',
  ARRAY[
    'Historic island with rich heritage',
    'Pristine, uncrowded beaches',
    'Brookgreen Gardens nearby',
    'Famous Pawleys Island rope hammocks',
    'Excellent fishing and crabbing',
    'Protected maritime forest'
  ],
  '$400K - $2M+',
  '/pawleys-island.jpg',
  4
),
(
  'Carolina Forest',
  'One of the fastest-growing communities in Horry County, Carolina Forest offers suburban living with excellent schools, shopping, and amenities. While not directly on the ocean, its location provides a perfect balance of convenience and affordability.

Ideal for families seeking top-rated schools, newer homes, and a strong community feel, all while being just minutes from the beach.',
  ARRAY[
    'Top-rated schools and education',
    'Newer home construction',
    'Multiple shopping centers',
    'Parks and recreational facilities',
    'Family-friendly neighborhoods',
    'Easy access to Highway 31'
  ],
  '$250K - $500K',
  '/carolina-forest.jpg',
  5
),
(
  'Conway',
  'The historic county seat of Horry County, Conway blends small-town charm with modern conveniences. Located along the beautiful Waccamaw River, this area offers a different pace of life while remaining close to beach attractions.

Perfect for those seeking more affordable housing, historic character, and a genuine Southern community atmosphere.',
  ARRAY[
    'Historic downtown Riverwalk',
    'Coastal Carolina University',
    'Affordable housing options',
    'Rich history and architecture',
    'Local festivals and farmers markets',
    'Beautiful riverfront living'
  ],
  '$150K - $400K',
  '/conway.png',
  6
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_neighborhoods_display_order ON neighborhoods(display_order);
