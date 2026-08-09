-- UP Migration: 012_seed_data

-- Seed Countries
INSERT INTO countries (name, code, is_active) VALUES
('India', 'IN', TRUE);

-- Seed States (sample)
INSERT INTO states (country_id, name, code) VALUES
(1, 'Maharashtra', 'MH'),
(1, 'Uttar Pradesh', 'UP'),
(1, 'Gujarat', 'GJ'),
(1, 'Tamil Nadu', 'TN');

-- Seed Cities (sample)
INSERT INTO cities (state_id, name) VALUES
(1, 'Mumbai'),
(1, 'Pune'),
(2, 'Varanasi'),
(3, 'Somnath');

-- Seed Categories
INSERT INTO temple_categories (name, slug, description, display_order) VALUES
('Jyotirlinga', 'jyotirlinga', 'The 12 most sacred shrines of Lord Shiva', 1),
('Shakti Peeth', 'shakti-peeth', 'Significant shrines and pilgrimage destinations in Shaktism', 2),
('ISKCON', 'iskcon', 'International Society for Krishna Consciousness', 3);

-- Seed Streaming Providers
INSERT INTO streaming_providers (provider_name, provider_code, api_base_url, supports_live_detection, supports_embeds) VALUES
('YouTube', 'YOUTUBE', 'https://www.googleapis.com/youtube/v3', TRUE, TRUE),
('Facebook Live', 'FACEBOOK', 'https://graph.facebook.com/v19.0', TRUE, TRUE);

-- Seed Global Settings
INSERT INTO global_settings (key, value, type, description) VALUES
('MAINTENANCE_MODE', '{"enabled": false}', 'json', 'Puts the entire site into maintenance mode');
