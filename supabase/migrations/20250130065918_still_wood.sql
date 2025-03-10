/*
  # Admin Management Schema

  1. New Tables
    - admin_settings: Global application settings
    - admin_audit_logs: Audit trail for admin actions
    - admin_stats: Usage statistics
  
  2. Security
    - RLS enabled for all tables
    - Policies for admin-only access
*/

DO $$ BEGIN
  -- Create admin_settings table
  CREATE TABLE IF NOT EXISTS admin_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text NOT NULL UNIQUE,
    value jsonb NOT NULL DEFAULT '{}',
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- Create admin_audit_logs table
  CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id uuid REFERENCES admin_users ON DELETE SET NULL,
    action text NOT NULL,
    target_type text NOT NULL,
    target_id uuid,
    details jsonb DEFAULT '{}',
    ip_address text,
    created_at timestamptz DEFAULT now()
  );

  -- Create admin_stats table
  CREATE TABLE IF NOT EXISTS admin_stats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    date date NOT NULL,
    stats_type text NOT NULL,
    data jsonb NOT NULL DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(date, stats_type)
  );

  -- Enable RLS
  ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
  ALTER TABLE admin_stats ENABLE ROW LEVEL SECURITY;

EXCEPTION WHEN others THEN
  RAISE NOTICE 'Error creating tables: %', SQLERRM;
END $$;

-- Create policies with error handling
DO $$ BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Admin users can view settings" ON admin_settings;
  DROP POLICY IF EXISTS "Admin users can manage settings" ON admin_settings;
  DROP POLICY IF EXISTS "Admin users can view audit logs" ON admin_audit_logs;
  DROP POLICY IF EXISTS "Admin users can view stats" ON admin_stats;
  DROP POLICY IF EXISTS "Admin users can manage stats" ON admin_stats;

  -- Create policies for admin_settings
  CREATE POLICY "Admin users can view settings"
    ON admin_settings
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE id = auth.uid()
        AND status = 'active'
      )
    );

  CREATE POLICY "Admin users can manage settings"
    ON admin_settings
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE id = auth.uid()
        AND status = 'active'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE id = auth.uid()
        AND status = 'active'
      )
    );

  -- Create policies for admin_audit_logs
  CREATE POLICY "Admin users can view audit logs"
    ON admin_audit_logs
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE id = auth.uid()
        AND status = 'active'
      )
    );

  -- Create policies for admin_stats
  CREATE POLICY "Admin users can view stats"
    ON admin_stats
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE id = auth.uid()
        AND status = 'active'
      )
    );

  CREATE POLICY "Admin users can manage stats"
    ON admin_stats
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE id = auth.uid()
        AND status = 'active'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE id = auth.uid()
        AND status = 'active'
      )
    );

EXCEPTION WHEN others THEN
  RAISE NOTICE 'Error creating policies: %', SQLERRM;
END $$;

DO $$ BEGIN
  -- Create triggers for updated_at
  DROP TRIGGER IF EXISTS admin_settings_updated_at ON admin_settings;
  DROP TRIGGER IF EXISTS admin_stats_updated_at ON admin_stats;

  CREATE TRIGGER admin_settings_updated_at
    BEFORE UPDATE ON admin_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

  CREATE TRIGGER admin_stats_updated_at
    BEFORE UPDATE ON admin_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

EXCEPTION WHEN others THEN
  RAISE NOTICE 'Error creating triggers: %', SQLERRM;
END $$;

-- Insert default settings
INSERT INTO admin_settings (key, value, description)
VALUES
  ('registration_enabled', 'true', 'Allow new user registrations'),
  ('maintenance_mode', 'false', 'Enable maintenance mode'),
  ('maintenance_message', '"システムメンテナンス中です。しばらくお待ちください。"', 'Message to display during maintenance')
ON CONFLICT (key) DO NOTHING;