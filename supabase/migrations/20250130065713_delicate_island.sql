/*
  # Health Records Schema

  1. New Tables
    - health_records: General health records with type and JSON data
    - vaccinations: Vaccination records with dates and details
    - medications: Medication records with start/end dates
  
  2. Security
    - RLS enabled for all tables
    - Policies for family group access control
*/

DO $$ BEGIN
  -- Create health_records table if it doesn't exist
  CREATE TABLE IF NOT EXISTS health_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    family_group_id uuid REFERENCES family_groups ON DELETE CASCADE,
    child_id uuid REFERENCES children ON DELETE CASCADE,
    type text NOT NULL,
    recorded_at timestamptz NOT NULL,
    data jsonb NOT NULL DEFAULT '{}',
    created_by uuid REFERENCES profiles ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- Create vaccinations table if it doesn't exist
  CREATE TABLE IF NOT EXISTS vaccinations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    family_group_id uuid REFERENCES family_groups ON DELETE CASCADE,
    child_id uuid REFERENCES children ON DELETE CASCADE,
    vaccine_name text NOT NULL,
    date date NOT NULL,
    location text,
    doctor text,
    notes text,
    created_by uuid REFERENCES profiles ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- Create medications table if it doesn't exist
  CREATE TABLE IF NOT EXISTS medications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    family_group_id uuid REFERENCES family_groups ON DELETE CASCADE,
    child_id uuid REFERENCES children ON DELETE CASCADE,
    name text NOT NULL,
    start_date date NOT NULL,
    end_date date,
    dosage text,
    timing text,
    notes text,
    created_by uuid REFERENCES profiles ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- Enable RLS
  ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
  ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
  ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

EXCEPTION WHEN others THEN
  RAISE NOTICE 'Error creating tables: %', SQLERRM;
END $$;

-- Create policies with error handling for each table
DO $$ BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view health records in their family groups" ON health_records;
  DROP POLICY IF EXISTS "Admins can manage health records" ON health_records;
  DROP POLICY IF EXISTS "Users can view vaccinations in their family groups" ON vaccinations;
  DROP POLICY IF EXISTS "Admins can manage vaccinations" ON vaccinations;
  DROP POLICY IF EXISTS "Users can view medications in their family groups" ON medications;
  DROP POLICY IF EXISTS "Admins can manage medications" ON medications;

  -- Create policies for health_records
  CREATE POLICY "Users can view health records in their family groups"
    ON health_records
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM family_members
        WHERE family_group_id = health_records.family_group_id
        AND user_id = auth.uid()
      )
    );

  CREATE POLICY "Admins can manage health records"
    ON health_records
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM family_members
        WHERE family_group_id = health_records.family_group_id
        AND user_id = auth.uid()
        AND role = 'admin'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM family_members
        WHERE family_group_id = health_records.family_group_id
        AND user_id = auth.uid()
        AND role = 'admin'
      )
    );

  -- Create policies for vaccinations
  CREATE POLICY "Users can view vaccinations in their family groups"
    ON vaccinations
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM family_members
        WHERE family_group_id = vaccinations.family_group_id
        AND user_id = auth.uid()
      )
    );

  CREATE POLICY "Admins can manage vaccinations"
    ON vaccinations
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM family_members
        WHERE family_group_id = vaccinations.family_group_id
        AND user_id = auth.uid()
        AND role = 'admin'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM family_members
        WHERE family_group_id = vaccinations.family_group_id
        AND user_id = auth.uid()
        AND role = 'admin'
      )
    );

  -- Create policies for medications
  CREATE POLICY "Users can view medications in their family groups"
    ON medications
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM family_members
        WHERE family_group_id = medications.family_group_id
        AND user_id = auth.uid()
      )
    );

  CREATE POLICY "Admins can manage medications"
    ON medications
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM family_members
        WHERE family_group_id = medications.family_group_id
        AND user_id = auth.uid()
        AND role = 'admin'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM family_members
        WHERE family_group_id = medications.family_group_id
        AND user_id = auth.uid()
        AND role = 'admin'
      )
    );

EXCEPTION WHEN others THEN
  RAISE NOTICE 'Error creating policies: %', SQLERRM;
END $$;

DO $$ BEGIN
  -- Create triggers for updated_at
  DROP TRIGGER IF EXISTS health_records_updated_at ON health_records;
  DROP TRIGGER IF EXISTS vaccinations_updated_at ON vaccinations;
  DROP TRIGGER IF EXISTS medications_updated_at ON medications;

  CREATE TRIGGER health_records_updated_at
    BEFORE UPDATE ON health_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

  CREATE TRIGGER vaccinations_updated_at
    BEFORE UPDATE ON vaccinations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

  CREATE TRIGGER medications_updated_at
    BEFORE UPDATE ON medications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

EXCEPTION WHEN others THEN
  RAISE NOTICE 'Error creating triggers: %', SQLERRM;
END $$;