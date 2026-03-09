
-- Leads table (optional name/email)
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Brand analyses table storing full results
CREATE TABLE public.brand_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  source_url TEXT NOT NULL,
  brand_research JSONB,
  effectiveness JSONB,
  ai_visibility JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- No RLS needed since this is a public-facing tool without auth
-- and data is inserted server-side or from the app without user auth
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_analyses ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anon role (public tool)
CREATE POLICY "Allow anonymous inserts on leads" ON public.leads
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts on brand_analyses" ON public.brand_analyses
  FOR INSERT TO anon WITH CHECK (true);

-- Allow reading own analysis by id (for potential future use)
CREATE POLICY "Allow anonymous select on brand_analyses" ON public.brand_analyses
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous update on brand_analyses" ON public.brand_analyses
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
