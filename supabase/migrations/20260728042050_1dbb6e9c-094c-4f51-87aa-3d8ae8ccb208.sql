CREATE TABLE public.quiz_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_type TEXT NOT NULL DEFAULT 'conversation-map',
  contact_email TEXT,
  contact_first_name TEXT,
  icp TEXT,
  tier TEXT,
  total_score INTEGER,
  max_score INTEGER,
  export_path TEXT,
  artifact JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.quiz_submissions TO service_role;

ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny all client access to quiz_submissions"
  ON public.quiz_submissions
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE INDEX quiz_submissions_created_at_idx ON public.quiz_submissions (created_at DESC);