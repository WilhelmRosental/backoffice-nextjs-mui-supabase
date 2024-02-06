import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient'; // Ajustez selon votre structure de projet
import { LookWithCustomer } from '@/types/look';

export const useFetchLookById = (id: string) => {
  const [look, setLook] = useState<LookWithCustomer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLookById = async () => {
      setLoading(true);
      try {
        const { data: lookProfiles, error: profileError } = await supabase
          .from('looks_profiles')
          .select(`
            customer: customer_email(*),
            look: look_id(
              id,
              created_at,
              title,
              thumbnail,
              univers,
              designer,
              left_top(*),
              left_bottom(*),
              right_top(*),
              right_middle(*),
              right_bottom(*),
              is_public,
              published
            )
          `)
          .eq('look_id', id);

        if (profileError) throw profileError;

        if (lookProfiles && lookProfiles.length > 0) {
          setLook(lookProfiles[0]);
        } else {
          const { data: lookItems, error: lookError } = await supabase
            .from('looks')
            .select(`
              id,
              created_at,
              title,
              thumbnail,
              univers,
              designer,
              left_top(*),
              left_bottom(*),
              right_top(*),
              right_middle(*),
              right_bottom(*),
              is_public,
              published
            `)
            .eq('id', id);

          if (lookError) throw lookError;

          if (lookItems && lookItems.length > 0) {
            setLook({ look: lookItems[0], customer: null });
          }
        }
      } catch (error: any) {
        console.error('Error fetching look: ', error.message);
        setError('Failed to fetch look');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLookById();
    } else {
      setLoading(false);
    }
  }, [id]);

  return { look, loading, error };
};