import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient'; // Assurez-vous que ce chemin correspond à votre configuration
import { Look } from '@/types/look';

export const useFetchCustomerLooks = (email: string) => {
  const [customerLooks, setCustomerLooks] = useState<Look[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerLooks = async () => {
      if (!email) {
        setError('No email provided');
        setLoading(false);
        return;
      }

      try {
        const { data: customerLooks, error } = await supabase
          .from('looks_profiles')
          .select(`
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
          .eq('customer_email', email);

        if (error) throw error;

        setCustomerLooks(customerLooks.map(item => item.look));
      } catch (error: any) {
        console.error('Error fetching customer looks:', error.message);
        setError('Failed to fetch customer looks');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerLooks();
  }, [email]);

  return { customerLooks, loading, error };
};