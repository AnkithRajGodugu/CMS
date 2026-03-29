-- V29: Rich seed data for Content Creation sector
-- Adds: content_admin user, content_user, projects, content_assets

-- ============================================================
-- CONTENT SECTOR USERS
-- Passwords = 'password123' (bcrypt)
-- ============================================================
INSERT INTO users (username, email, password, role, user_type, enabled, email_verified, sector_id, created_at)
VALUES
  ('content_admin', 'content.admin@cms.com', '$2a$10$ymSPnMfyEL.bhzet0YgjRe/HlamfMcTU0sT7FnlOjO1Z6lXCp3R4O', 'MANAGER', 'INDIVIDUAL', true, true,
   (SELECT id FROM sectors WHERE code = 'CONTENT'), NOW()),
  ('creator_priya', 'priya.creator@cms.com', '$2a$10$ymSPnMfyEL.bhzet0YgjRe/HlamfMcTU0sT7FnlOjO1Z6lXCp3R4O', 'USER', 'INDIVIDUAL', true, true,
   (SELECT id FROM sectors WHERE code = 'CONTENT'), NOW()),
  ('creator_raj', 'raj.creator@cms.com', '$2a$10$ymSPnMfyEL.bhzet0YgjRe/HlamfMcTU0sT7FnlOjO1Z6lXCp3R4O', 'USER', 'INDIVIDUAL', true, true,
   (SELECT id FROM sectors WHERE code = 'CONTENT'), NOW())
ON CONFLICT (username) DO NOTHING;

-- ============================================================
-- PROJECTS (linked to content_admin)
-- ============================================================
INSERT INTO projects (project_name, client_name, status, start_date, deadline, budget, user_id, created_at, updated_at)
SELECT
  project_name, client_name, status::varchar, start_date::date, deadline::date, budget::numeric,
  (SELECT id FROM users WHERE username = 'content_admin'),
  created_at, created_at
FROM (VALUES
  ('Brand Identity Redesign',    'NovaTech Solutions',    'IN_PROGRESS', '2026-01-15', '2026-04-30', 85000.00,  NOW() - INTERVAL '45 days'),
  ('Social Media Campaign Q2',   'GreenLeaf Organics',    'IN_PROGRESS', '2026-02-01', '2026-06-30', 42000.00,  NOW() - INTERVAL '30 days'),
  ('Product Launch Video Series','Apex Electronics',      'REVIEW',      '2025-12-01', '2026-03-31', 120000.00, NOW() - INTERVAL '90 days'),
  ('Annual Report Design',       'Metro Financials',      'COMPLETED',   '2025-10-01', '2025-12-31', 35000.00,  NOW() - INTERVAL '120 days'),
  ('E-Commerce Website UX',      'StyleHub India',        'IN_PROGRESS', '2026-02-15', '2026-05-15', 68000.00,  NOW() - INTERVAL '25 days'),
  ('Podcast Content Production', 'MindFuel Media',        'PLANNING',    '2026-04-01', '2026-07-31', 55000.00,  NOW() - INTERVAL '10 days'),
  ('Email Newsletter Revamp',    'TechInsider Weekly',    'COMPLETED',   '2025-11-01', '2026-01-15', 18000.00,  NOW() - INTERVAL '75 days'),
  ('Event Photography Package',  'Luxe Events Co.',       'ON_HOLD',     '2026-03-01', '2026-05-01', 28000.00,  NOW() - INTERVAL '5 days'),
  ('App UI/UX Overhaul',         'FinPay Technologies',   'IN_PROGRESS', '2026-01-20', '2026-06-01', 195000.00, NOW() - INTERVAL '50 days'),
  ('Content Strategy Roadmap',   'BlueOcean Ventures',    'REVIEW',      '2026-03-01', '2026-04-15', 32000.00,  NOW() - INTERVAL '15 days')
) AS t(project_name, client_name, status, start_date, deadline, budget, created_at);

-- ============================================================
-- CONTENT ASSETS (linked to content_admin and to projects)
-- ============================================================
INSERT INTO content_assets (title, file_url, type, version, user_id, project_id, created_at, updated_at)
SELECT
  title, file_url, type::varchar, version,
  (SELECT id FROM users WHERE username = 'content_admin'),
  (SELECT id FROM projects WHERE project_name = project_name_ref AND user_id = (SELECT id FROM users WHERE username = 'content_admin') LIMIT 1),
  NOW() - created_offset, NOW() - created_offset
FROM (VALUES
  ('NovaTech Brand Guidelines PDF',    'https://assets.cms.local/novatech/brand-guidelines-v3.pdf',     'DOCUMENT', 3, 'Brand Identity Redesign',    INTERVAL '40 days'),
  ('NovaTech Logo Final SVG',          'https://assets.cms.local/novatech/logo-final.svg',              'IMAGE',    5, 'Brand Identity Redesign',    INTERVAL '38 days'),
  ('GreenLeaf Instagram Reel Script',  'https://assets.cms.local/greenleaf/ig-reel-script.docx',        'DOCUMENT', 1, 'Social Media Campaign Q2',   INTERVAL '28 days'),
  ('GreenLeaf Product Photos Set',     'https://assets.cms.local/greenleaf/product-photos-batch1.zip',  'IMAGE',    2, 'Social Media Campaign Q2',   INTERVAL '25 days'),
  ('Apex Unboxing Video Draft',        'https://assets.cms.local/apex/unboxing-video-draft.mp4',        'VIDEO',    2, 'Product Launch Video Series', INTERVAL '45 days'),
  ('Apex Product Demo Voiceover',      'https://assets.cms.local/apex/demo-voiceover.mp3',              'AUDIO',    1, 'Product Launch Video Series', INTERVAL '40 days'),
  ('Metro Annual Report Final PDF',    'https://assets.cms.local/metro/annual-report-2025.pdf',         'DOCUMENT', 4, 'Annual Report Design',       INTERVAL '80 days'),
  ('StyleHub UX Wireframes',           'https://assets.cms.local/stylehub/wireframes-v2.fig',           'OTHER',    2, 'E-Commerce Website UX',      INTERVAL '20 days'),
  ('MindFuel Episode 1 Script',        'https://assets.cms.local/mindfuel/ep1-script.docx',             'DOCUMENT', 1, 'Podcast Content Production', INTERVAL '8 days'),
  ('FinPay App Prototype v1',          'https://assets.cms.local/finpay/app-prototype-v1.fig',          'OTHER',    3, 'App UI/UX Overhaul',         INTERVAL '45 days'),
  ('FinPay Icon Set',                  'https://assets.cms.local/finpay/icon-set-final.zip',            'IMAGE',    1, 'App UI/UX Overhaul',         INTERVAL '30 days'),
  ('BlueOcean Strategy Deck',          'https://assets.cms.local/blueocean/strategy-deck.pptx',         'DOCUMENT', 2, 'Content Strategy Roadmap',   INTERVAL '12 days')
) AS t(title, file_url, type, version, project_name_ref, created_offset);

-- ============================================================
-- USER-LINKED PROJECTS (for creator_priya user-side)
-- ============================================================
INSERT INTO projects (project_name, client_name, status, start_date, deadline, budget, user_id, created_at, updated_at)
SELECT
  project_name, client_name, status::varchar, start_date::date, deadline::date, budget::numeric,
  (SELECT id FROM users WHERE username = 'creator_priya'),
  created_at, created_at
FROM (VALUES
  ('YouTube Shorts Series',      'SelfMade Academy',  'IN_PROGRESS', '2026-02-01', '2026-05-01', 12000.00, NOW() - INTERVAL '20 days'),
  ('LinkedIn Content Pack',      'HR Horizons',       'COMPLETED',   '2025-12-01', '2026-02-28', 8000.00,  NOW() - INTERVAL '60 days')
) AS t(project_name, client_name, status, start_date, deadline, budget, created_at);

-- ============================================================
-- CONTENT DISTRIBUTION UPDATES (refresh platforms)
-- ============================================================
UPDATE content_distributions SET followers = '1.45M', active_campaigns = 4 WHERE platform = 'YouTube';
UPDATE content_distributions SET followers = '620K',  active_campaigns = 7 WHERE platform = 'Instagram';
UPDATE content_distributions SET followers = '310K',  active_campaigns = 1 WHERE platform = 'Twitter/X';
