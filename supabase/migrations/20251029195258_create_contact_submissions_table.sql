/*
  # Contact Submissions Table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text, required) - Full name of the person submitting
      - `email` (text, required) - Email address for follow-up
      - `company` (text, optional) - Company or organization name
      - `project_type` (text, required) - Type of project or service needed
      - `description` (text, required) - Detailed project description
      - `created_at` (timestamptz) - Timestamp of submission
      - `status` (text) - Status of the submission (new, contacted, completed)
  
  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy for inserting new submissions (public access)
    - Add policy for authenticated users to view submissions
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  project_type text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'new' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update submission status"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
