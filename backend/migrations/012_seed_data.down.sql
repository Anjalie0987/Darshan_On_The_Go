-- DOWN Migration: 012_seed_data

DELETE FROM global_settings WHERE key = 'MAINTENANCE_MODE';
DELETE FROM streaming_providers WHERE provider_code IN ('YOUTUBE', 'FACEBOOK');
DELETE FROM temple_categories WHERE slug IN ('jyotirlinga', 'shakti-peeth', 'iskcon');
DELETE FROM cities WHERE name IN ('Mumbai', 'Pune', 'Varanasi', 'Somnath');
DELETE FROM states WHERE code IN ('MH', 'UP', 'GJ', 'TN');
DELETE FROM countries WHERE code = 'IN';
