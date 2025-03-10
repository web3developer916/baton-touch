/*
  # Notes Schema

  1. New Tables
    - `notes`
      - `id` (uuid, primary key)
      - `family_group_id` (uuid, references family_groups)
      - `child_id` (uuid, references children)
      - `genre` (text)
      - `title` (text)
      - `content` (text)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id uuid REFERENCES family_groups ON DELETE CASCADE,
  child_id uuid REFERENCES children ON DELETE CASCADE,
  genre text NOT NULL,
  title text NOT NULL,
  content text,
  created_by uuid REFERENCES profiles ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view notes in their family groups"
  ON notes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = notes.family_group_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage notes"
  ON notes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = notes.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = notes.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();