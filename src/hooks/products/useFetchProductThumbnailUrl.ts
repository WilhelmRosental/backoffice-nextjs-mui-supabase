import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient'; // Assurez-vous que ce chemin d'importation est correct pour votre projet

interface UseFetchProductThumbnailUrlResult {
  thumbnailUrl: string | null;
  loading: boolean;
  error: string | null;
}

export const useFetchProductThumbnailUrl = (productId: string | null): UseFetchProductThumbnailUrlResult => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setThumbnailUrl(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchThumbnailUrl = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: imagePublicUrl } = await supabase.storage.from('products-images').getPublicUrl(`${productId}/thumbnail`);

        if (error) throw error;

        setThumbnailUrl(imagePublicUrl?.publicUrl); // Use optional chaining to access the publicUrl property
      } catch (error: any) {
        console.error('Error fetching thumbnail URL:', error.message);
        setError(error?.message || 'Failed to fetch thumbnail URL'); // Use optional chaining to access the error message
        setThumbnailUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchThumbnailUrl();
  }, [productId, error]);

  return { thumbnailUrl, loading, error };
};