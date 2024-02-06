import { useState, useCallback } from 'react';
import { supabase } from '@/utils/supabaseClient'; // Assurez-vous que ce chemin d'importation est correct pour votre projet

interface UseCreateLookResult {
  createLook: (userMail: string) => Promise<string | null>;
  loading: boolean;
  error: string | null;
}

export const useCreateLook = (): UseCreateLookResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createLook = useCallback(async (userMail: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data: savedLook, error: insertError } = await supabase
        .from('looks')
        .insert([{}]) // Assurez-vous que l'objet inséré correspond au schéma de votre table `looks`
        .single();

      if (insertError) throw insertError;

      const { error: linkError } = await supabase
        .from('looks_profiles')
        .insert({
          customer_email: userMail,
          look_id: savedLook.id,
        })
        .single();

      if (linkError) throw linkError;

      return savedLook.id;
    } catch (error: any) {
      console.error('Error:', error.message);
      setError('Failed to create look');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createLook, loading, error };
};