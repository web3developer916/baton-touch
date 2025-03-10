/*
  # Notifications Schema

  1. New Tables
    - notifications
      - User notifications with type, title, message
      - Tracks read status
      - Stores additional data in JSON format
  
  2. Security
    - RLS enabled
    - Policies for users to manage their own notifications
*/

DO $$ BEGIN
  -- Create notifications table if it doesn't exist
  CREATE TABLE IF NOT EXISTS notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles ON DELETE CASCADE,
    family_group_id uuid REFERENCES family_groups ON DELETE CASCADE,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    read boolean DEFAULT false,
    data jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- Enable RLS
  ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

  -- Create policies within transaction
  CREATE POLICY "Users can view their own notifications"
    ON notifications
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can update their own notifications"
    ON notifications
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can delete their own notifications"
    ON notifications
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

  -- Create trigger for updated_at
  CREATE TRIGGER notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

EXCEPTION WHEN others THEN
  -- Log any errors but allow migration to continue
  RAISE NOTICE 'Error creating notifications schema: %', SQLERRM;
END $$;