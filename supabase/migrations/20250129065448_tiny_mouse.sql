/*
  # Add attachments support to notes table

  1. Changes
    - Add attachments column to notes table to store image URLs
*/

-- Add attachments column to notes table
ALTER TABLE notes ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]';