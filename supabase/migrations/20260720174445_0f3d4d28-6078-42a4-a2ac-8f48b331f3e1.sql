
-- Lock down leads: no anon access. Writes/reads go through service-role edge functions.
DROP POLICY IF EXISTS "Allow anonymous inserts on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow anonymous select on leads" ON public.leads;
REVOKE ALL ON public.leads FROM anon;
REVOKE ALL ON public.leads FROM authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Lock down brand_analyses: no anon access.
DROP POLICY IF EXISTS "Allow anonymous inserts on brand_analyses" ON public.brand_analyses;
DROP POLICY IF EXISTS "Allow anonymous select on brand_analyses" ON public.brand_analyses;
DROP POLICY IF EXISTS "Allow anonymous update on brand_analyses" ON public.brand_analyses;
REVOKE ALL ON public.brand_analyses FROM anon;
REVOKE ALL ON public.brand_analyses FROM authenticated;
GRANT ALL ON public.brand_analyses TO service_role;
ALTER TABLE public.brand_analyses ENABLE ROW LEVEL SECURITY;

-- Storage: brand-exports is now private. Remove any prior permissive policies and
-- allow only scoped inserts from the client to the brand-uploads/ folder. Reads
-- and listing go exclusively through service-role edge functions (signed URLs).
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND (
        policyname ILIKE '%brand-export%'
        OR policyname ILIKE '%brand-upload%'
        OR policyname ILIKE '%brand_export%'
        OR policyname ILIKE '%brand_upload%'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END$$;

CREATE POLICY "brand-exports: anon can upload to brand-uploads folder"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'brand-exports'
    AND (storage.foldername(name))[1] = 'brand-uploads'
  );
