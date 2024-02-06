import { useState, useEffect } from 'react';
import { Customer } from '@/types/customer';
import { supabase } from '@/utils/supabaseClient'; // Assurez-vous que ce chemin correspond à votre configuration

export const useFetchCustomerByEmail = (email: string) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerByEmail = async () => {
      if (!email) {
        setError('No email provided');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select()
          .eq('email', email)
          .single(); // Utilise .single() pour obtenir directement l'objet au lieu d'un tableau

        if (error) {
          throw error;
        }

        setCustomer(data);
      } catch (error: any) {
        console.error('Error fetching customer by email:', error.message);
        setError('Failed to fetch customer');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerByEmail();
  }, [email]);

  return { customer, loading, error };
};