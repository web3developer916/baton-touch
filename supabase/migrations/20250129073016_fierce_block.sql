/*
  # Add child related tables

  1. New Tables
    - `kindergarten_info`: 幼稚園・保育園情報
    - `allergies`: アレルギー情報
    - `medical_conditions`: 持病情報
    - `doctors`: かかりつけ医情報
    - `growth_records`: 成長記録
    - `development_records`: 発達記録

  2. Security
    - Enable RLS on all tables
    - Add policies for family group members
*/

-- Create kindergarten_info table
CREATE TABLE IF NOT EXISTS kindergarten_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id uuid REFERENCES family_groups ON DELETE CASCADE,
  child_id uuid REFERENCES children ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  class text,
  teacher text,
  contact text,
  start_time time,
  end_time time,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create allergies table
CREATE TABLE IF NOT EXISTS allergies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id uuid REFERENCES family_groups ON DELETE CASCADE,
  child_id uuid REFERENCES children ON DELETE CASCADE,
  name text NOT NULL,
  onset_date date,
  symptoms text,
  severity text CHECK (severity IN ('mild', 'moderate', 'severe')),
  treatment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create medical_conditions table
CREATE TABLE IF NOT EXISTS medical_conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id uuid REFERENCES family_groups ON DELETE CASCADE,
  child_id uuid REFERENCES children ON DELETE CASCADE,
  name text NOT NULL,
  onset_date date,
  treatment text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id uuid REFERENCES family_groups ON DELETE CASCADE,
  child_id uuid REFERENCES children ON DELETE CASCADE,
  hospital_name text NOT NULL,
  department text,
  doctor_name text,
  phone text,
  address text,
  hours text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create growth_records table
CREATE TABLE IF NOT EXISTS growth_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id uuid REFERENCES family_groups ON DELETE CASCADE,
  child_id uuid REFERENCES children ON DELETE CASCADE,
  date date NOT NULL,
  height numeric(5,2),
  weight numeric(5,2),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create development_records table
CREATE TABLE IF NOT EXISTS development_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id uuid REFERENCES family_groups ON DELETE CASCADE,
  child_id uuid REFERENCES children ON DELETE CASCADE,
  milestone text NOT NULL,
  achieved_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE kindergarten_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE development_records ENABLE ROW LEVEL SECURITY;

-- Create policies for kindergarten_info
CREATE POLICY "Users can view kindergarten info in their family groups"
  ON kindergarten_info
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = kindergarten_info.family_group_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage kindergarten info"
  ON kindergarten_info
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = kindergarten_info.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = kindergarten_info.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create policies for allergies
CREATE POLICY "Users can view allergies in their family groups"
  ON allergies
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = allergies.family_group_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage allergies"
  ON allergies
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = allergies.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = allergies.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create policies for medical_conditions
CREATE POLICY "Users can view medical conditions in their family groups"
  ON medical_conditions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = medical_conditions.family_group_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage medical conditions"
  ON medical_conditions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = medical_conditions.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = medical_conditions.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create policies for doctors
CREATE POLICY "Users can view doctors in their family groups"
  ON doctors
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = doctors.family_group_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage doctors"
  ON doctors
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = doctors.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = doctors.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create policies for growth_records
CREATE POLICY "Users can view growth records in their family groups"
  ON growth_records
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = growth_records.family_group_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage growth records"
  ON growth_records
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = growth_records.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = growth_records.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create policies for development_records
CREATE POLICY "Users can view development records in their family groups"
  ON development_records
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = development_records.family_group_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage development records"
  ON development_records
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = development_records.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = development_records.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER kindergarten_info_updated_at
  BEFORE UPDATE ON kindergarten_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER allergies_updated_at
  BEFORE UPDATE ON allergies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER medical_conditions_updated_at
  BEFORE UPDATE ON medical_conditions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER doctors_updated_at
  BEFORE UPDATE ON doctors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER growth_records_updated_at
  BEFORE UPDATE ON growth_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER development_records_updated_at
  BEFORE UPDATE ON development_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();