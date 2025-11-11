/*
  # Create songs table for jukebox
  
  1. New Tables
    - `songs`
      - `id` (uuid, primary key)
      - `title` (text) - Song title
      - `artist` (text) - Artist name
      - `file_path` (text) - Path to file in storage bucket
      - `duration` (integer) - Duration in seconds
      - `created_at` (timestamptz)
      - `order_index` (integer) - Display order in jukebox
  
  2. Security
    - Enable RLS on `songs` table
    - Add policy for public read access (jukebox is public)
*/

CREATE TABLE IF NOT EXISTS songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text NOT NULL,
  file_path text NOT NULL,
  duration integer DEFAULT 0,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view songs"
  ON songs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only authenticated users can insert songs"
  ON songs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update songs"
  ON songs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can delete songs"
  ON songs
  FOR DELETE
  TO authenticated
  USING (true);
