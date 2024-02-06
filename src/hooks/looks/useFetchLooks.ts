import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient'; // Ajustez ce chemin selon votre structure de projet
import { Look } from '@/types/look';

type LookType = 'all' | 'public' | 'unused';

interface UseFetchLooksResult {
  looks: Look[];
  loading: boolean;
  error: string | null;
}

export const useFetchLooks = (type: LookType = 'all'): UseFetchLooksResult => {
  const [looks, setLooks] = useState<Look[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLooks = async () => {
      setLoading(true);
      setError(null);
      try {
        let data: Look[] | null = null;

        if (type === 'all') {
          const response = await supabase.rpc('get_all_looks');
          data = response.data;
        } else if (type === 'public') {
          const response = await supabase.from('looks').select().eq('is_public', true);
          data = response.data;
        } else if (type === 'unused') {
          const response = await supabase.rpc('get_unused_looks');
          data = response.data;
        }

        if (data) {
          setLooks(data);
        } else {
          setError('No data returned');
        }
      } catch (error: any) {
        console.error('Error :', error.message);
        setError('Failed to fetch looks');
      } finally {
        setLoading(false);
      }
    };

    fetchLooks();
  }, [type]);

  return { looks, loading, error };
};