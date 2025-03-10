-- Create illnesses table
CREATE TABLE IF NOT EXISTS illnesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id uuid REFERENCES family_groups ON DELETE CASCADE,
  child_id uuid REFERENCES children ON DELETE CASCADE,
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  symptoms jsonb DEFAULT '[]',
  notes text,
  created_by uuid REFERENCES profiles ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE illnesses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view illnesses in their family groups"
  ON illnesses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = illnesses.family_group_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage illnesses"
  ON illnesses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = illnesses.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = illnesses.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER illnesses_updated_at
  BEFORE UPDATE ON illnesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();