-- =============================================
-- TORUS AI DATABASE MIGRATIONS
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  streak_count INT DEFAULT 0,
  badges JSONB DEFAULT '[]',
  account_type TEXT CHECK (account_type IN ('developer', 'organisation')),
  company_details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  idea TEXT NOT NULL,
  platform TEXT DEFAULT 'web',
  experience TEXT DEFAULT 'intermediate',
  budget TEXT DEFAULT 'free',
  target_users TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','completed','paused')),
  stack JSONB,
  estimated_hours INT DEFAULT 0,
  complexity TEXT DEFAULT 'medium',
  current_phase INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Features
CREATE TABLE IF NOT EXISTS features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  priority TEXT DEFAULT 'must' CHECK (priority IN ('must','nice')),
  complexity TEXT DEFAULT 'medium' CHECK (complexity IN ('low','medium','high')),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Phases
CREATE TABLE IF NOT EXISTS phases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  phase_number INT NOT NULL,
  name TEXT NOT NULL,
  tool TEXT NOT NULL,
  prompt TEXT,
  duration TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','done')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Organisations
CREATE TABLE IF NOT EXISTS organisations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  industry TEXT,
  website TEXT,
  white_label JSONB DEFAULT '{"enabled": false}',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Org Members
CREATE TABLE IF NOT EXISTS org_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organisations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner','admin','member','viewer')),
  invited_by UUID REFERENCES profiles(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

-- 7. Client Portals
CREATE TABLE IF NOT EXISTS client_portals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organisations(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  access_level TEXT DEFAULT 'view' CHECK (access_level IN ('view','comment','approve')),
  portal_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Proposals
CREATE TABLE IF NOT EXISTS proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organisations(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  content TEXT,
  tone TEXT DEFAULT 'professional',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','accepted','rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_portals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users manage own projects" ON projects FOR ALL USING (auth.uid() = user_id);

-- Features policies
CREATE POLICY "Users manage own features" ON features FOR ALL
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- Phases policies
CREATE POLICY "Users manage own phases" ON phases FOR ALL
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- Org policies
CREATE POLICY "Org owners manage org" ON organisations FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Org members read org" ON organisations FOR SELECT
  USING (id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid()));

-- Org members policies
CREATE POLICY "Org members read members" ON org_members FOR SELECT
  USING (org_id IN (SELECT id FROM organisations WHERE owner_id = auth.uid())
      OR user_id = auth.uid());
CREATE POLICY "Org admins manage members" ON org_members FOR ALL
  USING (org_id IN (SELECT id FROM organisations WHERE owner_id = auth.uid()));

-- Client portals policies
CREATE POLICY "Org members manage portals" ON client_portals FOR ALL
  USING (org_id IN (
    SELECT org_id FROM org_members 
    WHERE user_id = auth.uid() AND role IN ('owner','admin','member')
  ));

-- Proposals policies
CREATE POLICY "Org members manage proposals" ON proposals FOR ALL
  USING (org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid()
  ));

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    split_part(NEW.email, '@', 1),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- =============================================
-- REALTIME (enable for live collaboration)
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE phases;
ALTER PUBLICATION supabase_realtime ADD TABLE features;
