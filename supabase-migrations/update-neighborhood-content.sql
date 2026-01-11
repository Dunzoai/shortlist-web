-- Update neighborhood descriptions and highlights with new content
-- Run this in your Supabase SQL Editor

UPDATE neighborhoods SET
  description = 'The heart of the Grand Strand and the name everyone knows. Myrtle Beach is where the action is—60 miles of sandy beaches, the iconic SkyWheel, Broadway at the Beach, and endless mini-golf courses. It''s tourist-friendly but also home to year-round residents who love being in the center of it all. From oceanfront high-rises to quiet inland neighborhoods, there''s something for every budget and lifestyle.',
  highlights = ARRAY['Iconic boardwalk & SkyWheel', 'Broadway at the Beach', 'Endless dining & entertainment', 'Year-round events & festivals']
WHERE name = 'Myrtle Beach';

UPDATE neighborhoods SET
  description = 'A more laid-back vibe than its southern neighbor. North Myrtle Beach is known for Barefoot Landing, the shag dancing scene (yes, the official state dance was born here), and beautiful beaches with a slightly quieter feel. Cherry Grove and Ocean Drive are local favorites. Great for families and retirees who want beach life without the bustle.',
  highlights = ARRAY['Barefoot Landing shopping', 'Birthplace of the shag dance', 'Cherry Grove Pier', 'Less crowded beaches']
WHERE name = 'North Myrtle Beach';

UPDATE neighborhoods SET
  description = 'Known as "The Family Beach," Surfside is a charming small-town escape just minutes south of Myrtle Beach. No high-rises here—just a classic beach town with a fishing pier, local restaurants, and a strong sense of community. Families love the relaxed pace and the annual holiday parades. If you want the beach without the chaos, this is your spot.',
  highlights = ARRAY['Small-town beach vibe', 'Family-friendly atmosphere', 'Surfside Pier', 'Community events year-round']
WHERE name = 'Surfside Beach';

UPDATE neighborhoods SET
  description = 'One of the oldest summer resorts on the East Coast, Pawleys Island is famously "arrogantly shabby"—and proud of it. This is where you come to slow down. Known for its handmade rope hammocks, stunning creek views, and Lowcountry charm, Pawleys attracts those who appreciate history, nature, and a quieter way of life. Nearby Litchfield Beach offers a similar feel with a bit more development.',
  highlights = ARRAY['Historic Lowcountry charm', 'Famous rope hammocks', 'Creek & marsh views', 'Laid-back, upscale vibe']
WHERE name = 'Pawleys Island';

UPDATE neighborhoods SET
  description = 'The fastest-growing community in the region—and for good reason. Carolina Forest is a master-planned area with top-rated schools, parks, shopping, and restaurants. It feels like its own little city, yet the beach is just 15 minutes away. Families flock here for the schools and amenities. Popular neighborhoods include The Farm, Waterbridge, and Plantation Lakes.',
  highlights = ARRAY['Top-rated schools', 'Master-planned community', 'Shopping & dining nearby', '15 minutes to the beach']
WHERE name = 'Carolina Forest';

UPDATE neighborhoods SET
  description = 'The charming, historic riverfront town that serves as the Horry County seat. Conway offers tree-lined streets, a walkable downtown with local shops and restaurants, and that classic Southern small-town feel. It''s more affordable than the beach areas and has been growing with new developments while keeping its character. The Riverwalk along the Waccamaw River is a local gem.',
  highlights = ARRAY['Historic downtown & Riverwalk', 'Affordable living', 'Southern small-town charm', '20 minutes to beach']
WHERE name = 'Conway';
