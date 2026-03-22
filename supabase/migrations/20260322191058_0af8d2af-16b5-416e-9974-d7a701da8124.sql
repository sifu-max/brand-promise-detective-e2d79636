
-- Create a public storage bucket for brand export files
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-exports', 'brand-exports', true);

-- Allow anyone to read files (public bucket)
CREATE POLICY "Public read access for brand exports"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'brand-exports');

-- Allow anonymous inserts (edge function uses service role, but also allow anon for flexibility)
CREATE POLICY "Allow inserts to brand exports"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'brand-exports');
