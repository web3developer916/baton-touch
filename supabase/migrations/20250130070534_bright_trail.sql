/*
  # Update children table schema
  
  1. Changes
    - Rename birth_date column to birthdate
    - Rename image_url column to imageurl
*/

DO $$ BEGIN
  -- Rename birth_date to birthdate
  ALTER TABLE children 
  RENAME COLUMN birth_date TO birthdate;

  -- Rename image_url to imageurl  
  ALTER TABLE children
  RENAME COLUMN image_url TO imageurl;

EXCEPTION WHEN others THEN
  -- Log any errors but allow migration to continue
  RAISE NOTICE 'Error updating children schema: %', SQLERRM;
END $$;