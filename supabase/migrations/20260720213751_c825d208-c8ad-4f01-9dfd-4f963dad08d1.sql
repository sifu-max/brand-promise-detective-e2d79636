
-- Explicit deny-all policies for anon/authenticated on leads and brand_analyses.
-- All legitimate writes/reads go through edge functions using service_role, which bypasses RLS.

REVOKE ALL ON public.leads FROM anon, authenticated;
REVOKE ALL ON public.brand_analyses FROM anon, authenticated;
GRANT ALL ON public.leads TO service_role;
GRANT ALL ON public.brand_analyses TO service_role;

DROP POLICY IF EXISTS "Deny all client access to leads" ON public.leads;
CREATE POLICY "Deny all client access to leads"
  ON public.leads FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "Deny all client access to brand_analyses" ON public.brand_analyses;
CREATE POLICY "Deny all client access to brand_analyses"
  ON public.brand_analyses FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- Storage: explicit deny SELECT/UPDATE/DELETE on brand-exports for clients.
-- Signed URLs (generated via service role) still work; direct object access is denied.
DROP POLICY IF EXISTS "Deny client read on brand-exports" ON storage.objects;
CREATE POLICY "Deny client read on brand-exports"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS "Deny client update on brand-exports" ON storage.objects;
CREATE POLICY "Deny client update on brand-exports"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "Deny client delete on brand-exports" ON storage.objects;
CREATE POLICY "Deny client delete on brand-exports"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (false);
