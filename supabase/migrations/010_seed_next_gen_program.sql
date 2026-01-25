-- Seed Next-Gen Tech Architect Program
-- First, delete any existing incomplete data
DELETE FROM lessons WHERE module_id IN (SELECT id FROM modules WHERE course_id IN (SELECT id FROM courses WHERE slug = 'next-gen-tech-architect-program'));
DELETE FROM modules WHERE course_id IN (SELECT id FROM courses WHERE slug = 'next-gen-tech-architect-program');
DELETE FROM courses WHERE slug = 'next-gen-tech-architect-program';
DELETE FROM course_creators WHERE name = 'DAGARMY';

-- Create DAGARMY as organization creator
INSERT INTO course_creators (id, name, email, bio, role, expertise, is_verified, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'DAGARMY',
  'courses@dagarmy.com',
  'Official DAGARMY course platform - Transforming The 3rd Talent Into Market-Ready Tech Leaders through Community Service Resources (CSR)',
  'organization',
  ARRAY['AI Engineering', 'Blockchain', 'Web3', 'Full-Stack Development', 'System Architecture'],
  true,
  true
);

-- Create The Next-Gen Tech Architect Program
INSERT INTO courses (id, creator_id, title, slug, subtitle, description, mission, category, level, language, total_duration, is_free, status, is_featured, tags)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'The Next-Gen Tech Architect Program',
  'next-gen-tech-architect-program',
  'One Unified Journey: AI + Blockchain + Data Visualization',
  'Transforming Tier 2/3 Talent into Market-Ready Tech Leaders through Community Service Resources (CSR)',
  'Transforming Tier 2/3 Talent into Market-Ready Tech Leaders through Community Service Resources (CSR)',
  'Technology',
  'intermediate',
  'English',
  '32 Hours',
  true,
  'published',
  true,
  ARRAY['AI', 'Blockchain', 'Web3', 'Full-Stack', 'Architecture', 'CSR']
);

-- Module 1: The AI Briefing & Vibe Coding Philosophy
INSERT INTO modules (id, course_id, module_number, title, description, duration, track, focus, order_index, is_published)
VALUES (
  '00000000-0000-0000-0001-000000000001',
  '00000000-0000-0000-0000-000000000002',
  1,
  'The AI Briefing & Vibe Coding Philosophy',
  'Understanding the shift from Syntax to Semantics',
  '4 Hours',
  'Yellow',
  'Understanding the shift from Syntax to Semantics',
  1,
  true
);

-- Module 1 Lessons
INSERT INTO lessons (module_id, lesson_number, title, description, type, duration, order_index, is_published) VALUES
('00000000-0000-0000-0001-000000000001', '1.1', 'Theory: The Death of Syntax', 'Evolution of programming from Binary to Natural Language. Why ''Vibing'' is a technical skill.', 'theory', '1 Hour', 1, true),
('00000000-0000-0000-0001-000000000001', '1.2', 'Theory: LLM Architecture for Non-Coders', 'How AI models ''think'' and why prompt structure (R.I.P.E.) dictates output quality.', 'theory', '1 Hour', 2, true),
('00000000-0000-0000-0001-000000000001', '1.3', 'The Drill: UI Alchemy', 'Utilizing v0.dev and DAGGPT to generate world-class, responsive web interfaces via text.', 'drill', '1 Hour', 3, true),
('00000000-0000-0000-0001-000000000001', '1.4', 'The Drill: Visual Branding', 'Creating consistent brand identities using Midjourney Leonardo Ai, Sora and DAGGPT.', 'drill', '1 Hour', 4, true);

-- Module 2: Full-Stack Product Engineering
INSERT INTO modules (id, course_id, module_number, title, description, duration, track, focus, order_index, is_published)
VALUES (
  '00000000-0000-0000-0001-000000000002',
  '00000000-0000-0000-0000-000000000002',
  2,
  'Full-Stack Product Engineering',
  'The logic of software and its real-world deployment',
  '4 Hours',
  'Yellow',
  'The logic of software and its real-world deployment',
  2,
  true
);

-- Module 2 Lessons
INSERT INTO lessons (module_id, lesson_number, title, description, type, duration, order_index, is_published) VALUES
('00000000-0000-0000-0001-000000000002', '2.1', 'Theory: Anatomy of a Web App', 'Understanding the relationship between the Client (Frontend), the Server (Logic), and the Database (Memory).', 'theory', '1 Hour', 1, true),
('00000000-0000-0000-0001-000000000002', '2.2', 'The Drill: The Replit Agent Workflow', 'Watching an AI manage environment variables, file structures, and cloud hosting.', 'drill', '1 Hour', 2, true),
('00000000-0000-0000-0001-000000000002', '2.3', 'The Drill: Persistence Layer', 'Connecting Supabase for user authentication—making your app ''remember'' who users are.', 'drill', '1 Hour', 3, true),
('00000000-0000-0000-0001-000000000002', '2.4', 'The Drill: The Live Launch', 'Troubleshooting ''Vibe-Logic'' errors and deploying to a global URL.', 'drill', '1 Hour', 4, true);

-- Module 3: Autonomous Systems & Agentic Future
INSERT INTO modules (id, course_id, module_number, title, description, duration, track, focus, order_index, is_published)
VALUES (
  '00000000-0000-0000-0001-000000000003',
  '00000000-0000-0000-0000-000000000002',
  3,
  'Autonomous Systems & Agentic Future',
  'Theory of automation and the ''One-Person Agency'' model',
  '4 Hours',
  'Green',
  'Theory of automation and the ''One-Person Agency'' model',
  3,
  true
);

-- Module 3 Lessons
INSERT INTO lessons (module_id, lesson_number, title, description, type, duration, order_index, is_published) VALUES
('00000000-0000-0000-0001-000000000003', '3.1', 'Theory: The AI Agent Economy', 'Moving from ''Chatbots'' to ''Autonomous Agents.'' Understanding the impact on global labor markets.', 'theory', '1 Hour', 1, true),
('00000000-0000-0000-0001-000000000003', '3.2', 'The Drill: Agentic Workflows', 'Building n8n/Zapier loops that connect AI to real-world business tools (Gmail, Slack, Sheets).', 'drill', '1 Hour', 2, true),
('00000000-0000-0000-0001-000000000003', '3.3', 'The Drill: Cinematic Ad Production', 'Producing high-end marketing media with Runway Gen-3 and ElevenLabs.', 'drill', '1 Hour', 3, true),
('00000000-0000-0000-0001-000000000003', '3.4', 'Strategy: The Micro-SaaS Blueprint', 'How to identify ''Small Problems'' in Tier 2/3 cities and solve them with a 48-hour build.', 'strategy', '1 Hour', 4, true);

-- Module 4: Web3 Mechanics & The Trust Economy
INSERT INTO modules (id, course_id, module_number, title, description, duration, track, focus, order_index, is_published)
VALUES (
  '00000000-0000-0000-0001-000000000004',
  '00000000-0000-0000-0000-000000000002',
  4,
  'Web3 Mechanics & The Trust Economy',
  'Why Blockchain is the foundation of the future Internet',
  '4 Hours',
  'Green',
  'Why Blockchain is the foundation of the future Internet',
  4,
  true
);

-- Module 4 Lessons
INSERT INTO lessons (module_id, lesson_number, title, description, type, duration, order_index, is_published) VALUES
('00000000-0000-0000-0001-000000000004', '4.1', 'Theory: The Ledger Revolution', 'Understanding Decentralization, Consensus Mechanisms (PoW vs. PoS), and why Web3 matters.', 'theory', '1 Hour', 1, true),
('00000000-0000-0000-0001-000000000004', '4.2', 'Theory: The Multi-Chain Map', 'Comparing Ecosystems: Ethereum (The Standard), Solana (The Speed), and L2s (The Scalability).', 'theory', '1 Hour', 2, true),
('00000000-0000-0000-0001-000000000004', '4.3', 'The Drill: The Wallet Arsenal', 'Advanced custody (Metamask/Phantom) and the logic of Hardware vs. Software wallets.', 'drill', '1 Hour', 3, true),
('00000000-0000-0000-0001-000000000004', '4.4', 'The Drill: On-Chain Forensics', 'Using Etherscan and Solscan to verify ''Truth'' and detect scams (Rug-pulls/Honey-pots).', 'drill', '1 Hour', 4, true);

-- Module 5: Smart Contracts, Tokens & Security
INSERT INTO modules (id, course_id, module_number, title, description, duration, track, focus, order_index, is_published)
VALUES (
  '00000000-0000-0000-0001-000000000005',
  '00000000-0000-0000-0000-000000000002',
  5,
  'Smart Contracts, Tokens & Security',
  'Creating and securing decentralized value',
  '4 Hours',
  'Green',
  'Creating and securing decentralized value',
  5,
  true
);

-- Module 5 Lessons
INSERT INTO lessons (module_id, lesson_number, title, description, type, duration, order_index, is_published) VALUES
('00000000-0000-0000-0001-000000000005', '5.1', 'Theory: The ''Code is Law'' Philosophy', 'What are Smart Contracts? The logic of self-executing digital agreements.', 'theory', '1 Hour', 1, true),
('00000000-0000-0000-0001-000000000005', '5.2', 'The Drill: Tokenization Mastery', 'Minting your first custom Token (ERC-20/SPL) and designing its ''Tokenomics'' (Supply/Inflation).', 'drill', '1 Hour', 2, true),
('00000000-0000-0000-0001-000000000005', '5.3', 'The Drill: No-Code Smart Contracts', 'Deploying business logic via Thirdweb/OpenZeppelin without writing Solidity.', 'drill', '1 Hour', 3, true),
('00000000-0000-0000-0001-000000000005', '5.4', 'Strategy: Battle-Hardened Security', 'Best practices for building: Auditing contract permissions and protecting project liquidity.', 'strategy', '1 Hour', 4, true);

-- Module 6: Strategic Deployment & Ethical Frontiers
INSERT INTO modules (id, course_id, module_number, title, description, duration, track, focus, order_index, is_published)
VALUES (
  '00000000-0000-0000-0001-000000000006',
  '00000000-0000-0000-0000-000000000002',
  6,
  'Strategic Deployment & Ethical Frontiers',
  'Synthesizing the 3 streams into a global career strategy',
  '4 Hours',
  'Green',
  'Synthesizing the 3 streams into a global career strategy',
  6,
  true
);

-- Module 6 Lessons
INSERT INTO lessons (module_id, lesson_number, title, description, type, duration, order_index, is_published) VALUES
('00000000-0000-0000-0001-000000000006', '6.1', 'Theory: The Intersection of AI & Blockchain', 'How decentralized compute and AI agents will define the next decade (2026-2036).', 'theory', '1.5 Hours', 1, true),
('00000000-0000-0000-0001-000000000006', '6.2', 'Theory: Ethics & The CSR Mission', 'The responsibility of a ''Digital Architect'' in an automated world. Data privacy and AI transparency.', 'theory', '1.5 Hours', 2, true),
('00000000-0000-0000-0001-000000000006', '6.3', 'Strategy: Career Narrative & Placement', 'Navigating the ''Experience Gap.'' How to present a 32-hour portfolio as proof of professional excellence.', 'strategy', '1 Hour', 3, true);

-- Module 7: Data Engineering & Visual Storytelling
INSERT INTO modules (id, course_id, module_number, title, description, duration, track, focus, order_index, is_published)
VALUES (
  '00000000-0000-0000-0001-000000000007',
  '00000000-0000-0000-0000-000000000002',
  7,
  'Data Engineering & Visual Storytelling',
  'The theory of information hierarchy and Data ''Vibe''',
  '4 Hours',
  'Blue',
  'The theory of information hierarchy and Data ''Vibe''',
  7,
  true
);

-- Module 7 Lessons
INSERT INTO lessons (module_id, lesson_number, title, description, type, duration, order_index, is_published) VALUES
('00000000-0000-0000-0001-000000000007', '7.1', 'Theory: The Psychology of Data', 'Why humans trust visuals over rows. Introduction to UX/UI for Data Visualization.', 'theory', '1 Hour', 1, true),
('00000000-0000-0000-0001-000000000007', '7.2', 'The Drill: The Data Bridge', 'Using Power Query to clean and structure messy Excel/CSV files for ''Executive Grade'' reports.', 'drill', '1 Hour', 2, true),
('00000000-0000-0000-0001-000000000007', '7.3', 'The Drill: Power BI Artistry', 'Designing cinematic, high-contrast dashboards that make complex data instantly readable.', 'drill', '1 Hour', 3, true),
('00000000-0000-0000-0001-000000000007', '7.4', 'The Drill: Interactive Narrative', 'Building ''Drill-Down'' flows that allow users to explore the ''Why'' behind the ''What.''', 'drill', '1 Hour', 4, true);

-- Module 8: Business Intelligence & Cloud Ecosystems
INSERT INTO modules (id, course_id, module_number, title, description, duration, track, focus, order_index, is_published)
VALUES (
  '00000000-0000-0000-0001-000000000008',
  '00000000-0000-0000-0000-000000000002',
  8,
  'Business Intelligence & Cloud Ecosystems',
  'Building self-sustaining ''War Rooms'' for businesses',
  '4 Hours',
  'Blue',
  'Building self-sustaining ''War Rooms'' for businesses',
  8,
  true
);

-- Module 8 Lessons
INSERT INTO lessons (module_id, lesson_number, title, description, type, duration, order_index, is_published) VALUES
('00000000-0000-0000-0001-000000000008', '8.1', 'Theory: The Automated Dashboard Life-Cycle', 'Moving from static files to live, cloud-synced intelligence.', 'theory', '0.8 Hours', 1, true),
('00000000-0000-0000-0001-000000000008', '8.2', 'The Drill: The Tableau Narrative', 'Building map-based visuals to track global logistics and geographical trends.', 'drill', '0.8 Hours', 2, true),
('00000000-0000-0000-0001-000000000008', '8.3', 'The Drill: Founder ''North Star'' Tracking', 'Visualizing critical startup metrics: CAC, LTV, Burn Rate, and Churn.', 'drill', '0.8 Hours', 3, true),
('00000000-0000-0000-0001-000000000008', '8.4', 'The Drill: AI-Data Fusion', 'Utilizing AI to predict future trends and Power BI to present them to stakeholders.', 'drill', '0.8 Hours', 4, true),
('00000000-0000-0000-0001-000000000008', '8.5', 'Graduation: The Final Briefing', 'Final briefing on the Global Market. Awarding of On-Chain (NFT) Verified Credentials.', 'graduation', '0.8 Hours', 5, true);
