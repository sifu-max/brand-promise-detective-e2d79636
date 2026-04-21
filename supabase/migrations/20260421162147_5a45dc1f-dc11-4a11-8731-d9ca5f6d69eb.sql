-- Allow anonymous uploads under the brand-uploads/ prefix of the brand-exports bucket
CREATE POLICY "Anonymous can upload brand files"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'brand-exports'
  AND (storage.foldername(name))[1] = 'brand-uploads'
);

CREATE POLICY "Anonymous can read brand uploads"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'brand-exports'
  AND (storage.foldername(name))[1] = 'brand-uploads'
);