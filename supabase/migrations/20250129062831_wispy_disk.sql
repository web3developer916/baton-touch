/*
  # Children Schema

  1. New Tables
    - `children`
      - `id` (uuid, primary key)
      - `family_group_id` (uuid, references family_groups)
      - `name` (text)
      - `birth_date` (date)
      - `gender` (text)
      - `image_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create children table
CREATE TABLE IF NOT EXISTS children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id uuid REFERENCES family_groups ON DELETE CASCADE,
  name text NOT NULL,
  birth_date date,
  gender text CHECK (gender IN ('male', 'female', 'other')),
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE children ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view children in their family groups"
  ON children
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = children.family_group_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage children"
  ON children
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = children.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = children.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER children_updated_at
  BEFORE UPDATE ON children
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();