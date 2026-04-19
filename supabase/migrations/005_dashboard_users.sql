CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS dashboard_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE dashboard_users ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "all_dashboard_users" ON dashboard_users FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Function to verify a dashboard user's password
CREATE OR REPLACE FUNCTION verify_dashboard_user(p_email text, p_password text)
RETURNS TABLE(id uuid, email text, name text) AS $$
  SELECT du.id, du.email, du.name
  FROM dashboard_users du
  WHERE du.email = lower(p_email)
    AND du.password_hash = crypt(p_password, du.password_hash);
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to change a dashboard user's password (verifies current first)
CREATE OR REPLACE FUNCTION change_dashboard_password(p_user_id uuid, p_current_password text, p_new_password text)
RETURNS boolean AS $$
DECLARE
  v_valid boolean;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM dashboard_users
    WHERE dashboard_users.id = p_user_id
      AND password_hash = crypt(p_current_password, password_hash)
  ) INTO v_valid;

  IF NOT v_valid THEN
    RETURN false;
  END IF;

  UPDATE dashboard_users
  SET password_hash = crypt(p_new_password, gen_salt('bf'))
  WHERE dashboard_users.id = p_user_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create/invite a dashboard user
CREATE OR REPLACE FUNCTION invite_dashboard_user(p_email text, p_name text, p_password text)
RETURNS uuid AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO dashboard_users (email, name, password_hash)
  VALUES (lower(p_email), p_name, crypt(p_password, gen_salt('bf')))
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed initial users
INSERT INTO dashboard_users (email, name, password_hash)
VALUES
  ('grow.withgia26@gmail.com', 'Gia', crypt('growwithgia2026', gen_salt('bf'))),
  ('hello@shortlistpass.com', 'Shortlist Admin', crypt('shortlist2026', gen_salt('bf')))
ON CONFLICT (email) DO NOTHING;
