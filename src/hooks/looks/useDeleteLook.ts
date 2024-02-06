import { useCallback, useState } from 'react';
import { supabase } from '@/utils/supabaseClient'; // Assurez-vous que ce chemin d'importation est correct pour votre projet

interface UseDeleteLookResult {
  deleteLook: (lookId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useDeleteLook = (): UseDeleteLookResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteLook = useCallback(async (lookId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // Suppression des liens avec les profils des clients
      await supabase.from('looks_profiles').delete().eq('look_id', lookId);

      // Suppression de la miniature associée
      await supabase.storage.from('looks-images').remove([lookId]);

      // Suppression du look
      const { error: deleteError } = await supabase.from('looks').delete().eq('id', lookId);

      if (deleteError) throw deleteError;
    } catch (error: any) {
      console.error('Error:', error.message);
      setError('Failed to delete look');
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteLook, loading, error };
};