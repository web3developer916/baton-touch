/*
  # Tasks Schema

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `family_group_id` (uuid, references family_groups)
      - `title` (text)
      - `description` (text)
      - `due_date` (date)
      - `due_time` (time)
      - `status` (text)
      - `priority` (text)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `task_assignees`
      - `id` (uuid, primary key)
      - `task_id` (uuid, references tasks)
      - `user_id` (uuid, references profiles)
      - `created_at` (timestamptz)

    - `task_checklist`
      - `id` (uuid, primary key)
      - `task_id` (uuid, references tasks)
      - `text` (text)
      - `completed` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id uuid REFERENCES family_groups ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date date,
  due_time time,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_by uuid REFERENCES profiles ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create task_assignees table
CREATE TABLE IF NOT EXISTS task_assignees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks ON DELETE CASCADE,
  user_id uuid REFERENCES profiles ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(task_id, user_id)
);

-- Create task_checklist table
CREATE TABLE IF NOT EXISTS task_checklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks ON DELETE CASCADE,
  text text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_checklist ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks
CREATE POLICY "Users can view tasks in their family groups"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = tasks.family_group_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "All members can create tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = tasks.family_group_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "All members can update tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = tasks.family_group_id
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = tasks.family_group_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_group_id = tasks.family_group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create policies for task_assignees
CREATE POLICY "Users can view task assignees in their family groups"
  ON task_assignees
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN family_members fm ON fm.family_group_id = t.family_group_id
      WHERE t.id = task_assignees.task_id
      AND fm.user_id = auth.uid()
    )
  );

CREATE POLICY "All members can manage task assignees"
  ON task_assignees
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN family_members fm ON fm.family_group_id = t.family_group_id
      WHERE t.id = task_assignees.task_id
      AND fm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN family_members fm ON fm.family_group_id = t.family_group_id
      WHERE t.id = task_assignees.task_id
      AND fm.user_id = auth.uid()
    )
  );

-- Create policies for task_checklist
CREATE POLICY "Users can view task checklist items in their family groups"
  ON task_checklist
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN family_members fm ON fm.family_group_id = t.family_group_id
      WHERE t.id = task_checklist.task_id
      AND fm.user_id = auth.uid()
    )
  );

CREATE POLICY "All members can manage task checklist items"
  ON task_checklist
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN family_members fm ON fm.family_group_id = t.family_group_id
      WHERE t.id = task_checklist.task_id
      AND fm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN family_members fm ON fm.family_group_id = t.family_group_id
      WHERE t.id = task_checklist.task_id
      AND fm.user_id = auth.uid()
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER task_checklist_updated_at
  BEFORE UPDATE ON task_checklist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();