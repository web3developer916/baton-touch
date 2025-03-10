/*
  # Family Groups Schema

  1. New Tables
    - `family_groups`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `family_members`
      - `id` (uuid, primary key)
      - `family_group_id` (uuid, references family_groups)
      - `user_id` (uuid, references profiles)
      - `role` (text) - Either 'admin' or 'member'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create family_groups table
CREATE TABLE IF NOT EXISTS family_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create family_members table
CREATE TABLE IF NOT EXISTS family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id uuid REFERENCES family_groups ON DELETE CASCADE,
  user_id uuid REFERENCES profiles ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'member')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(family_group_id, user_id)
);

-- Enable RLS
ALTER TABLE family_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

-- Create policies for family_groups
CREATE POLICY "Users can view family groups they belong to"
  ON family_groups
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = family_groups.id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update family groups"
  ON family_groups
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = family_groups.id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = family_groups.id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create policies for family_members
CREATE POLICY "Users can view members of their family groups"
  ON family_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members AS fm
      WHERE fm.family_group_id = family_members.family_group_id
      AND fm.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage family members"
  ON family_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = family_members.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = family_members.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER family_groups_updated_at
  BEFORE UPDATE ON family_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER family_members_updated_at
  BEFORE UPDATE ON family_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();