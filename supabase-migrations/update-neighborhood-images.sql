-- Update neighborhood images to use the new uploaded files
-- Run this in your Supabase SQL Editor

UPDATE neighborhoods SET image_url = '/myrtle-beach.jpg' WHERE name = 'Myrtle Beach';
UPDATE neighborhoods SET image_url = '/north-myrtle-beach.jpg' WHERE name = 'North Myrtle Beach';
UPDATE neighborhoods SET image_url = '/surfside-beach.jpg' WHERE name = 'Surfside Beach';
UPDATE neighborhoods SET image_url = '/pawleys-island.jpg' WHERE name = 'Pawleys Island';
UPDATE neighborhoods SET image_url = '/carolina-forest.jpg' WHERE name = 'Carolina Forest';
UPDATE neighborhoods SET image_url = '/conway.png' WHERE name = 'Conway';
