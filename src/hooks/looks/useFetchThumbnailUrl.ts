import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient'; // Assurez-vous que ce chemin correspond à votre configuration
import { ThumbnailData, UseFetchThumbnailUrlResult } from '@/types/look';

export const useFetchThumbnailUrl = (lookId: string, isEditor: boolean = false): UseFetchThumbnailUrlResult => {
  const [data, setData] = useState<ThumbnailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThumbnailUrl = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: imagePublicUrl, error: getUrlError } = await supabase.storage.from('looks-images').getPublicUrl(lookId);

        if (getUrlError) throw getUrlError;

        if (isEditor) {
          const { data: imageData, error: downloadError } = await supabase.storage.from('looks-images').download(lookId);
          
          if (downloadError) {
            console.error('Error downloading file:', downloadError.message);
            setError('Error downloading file');
            return;
          }

          const fileType = lookId.split('.').pop();
          const imageFile = new File([imageData], lookId, { type: `image/${fileType}` });

          setData({
            fileUrl: imagePublicUrl.publicUrl,
            file: imageFile,
          });
        } else {
          setData({
            fileUrl: imagePublicUrl.publicUrl,
          });
        }
      } catch (error: any) {
        console.log('Error:', error.message);
        setError('Failed to fetch thumbnail URL');
      } finally {
        setLoading(false);
      }
    };

    if (lookId) {
      fetchThumbnailUrl();
    }
  }, [lookId, isEditor]);

  return { data, loading, error };
};