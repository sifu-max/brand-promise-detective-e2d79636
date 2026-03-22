
-- Remove overly permissive insert policy; edge function uses service role which bypasses RLS
DROP POLICY "Allow inserts to brand exports" ON storage.objects;
