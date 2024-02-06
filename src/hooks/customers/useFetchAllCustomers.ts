import { useState, useEffect } from 'react';
import { Customer } from '@/types/customer';
import { supabase } from '@/utils/supabaseClient'; // Assurez-vous que ce chemin correspond à votre configuration

export const useFetchAllCustomers = () => {
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllCustomers = async () => {
      try {
        const { data, error } = await supabase.rpc('get_nb_looks_users');
        
        if (error) {
          throw error;
        }

        setCustomers(data);
      } catch (error: any) {
        console.error('Error fetching all customers:', error.message);
        setError('Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };

    fetchAllCustomers();
  }, []);

  return { customers, loading, error };
};