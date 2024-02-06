import { useCallback, useState } from 'react';
import { supabase } from '@/utils/supabaseClient'; // Assurez-vous d'ajuster l'importation selon votre projet
import { convertToWebP } from '@/utils/convertToWebP';
import { Customer, Look } from '@/types'; // Assumez la définition appropriée des types

export const useSaveLook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveLook = useCallback(async (
    lookData: Look,
    customersToSave: Customer[],
    customersToRemove: Customer[],
    lookId?: string
  ): Promise<string | null> => {
    setLoading(true);

    try {
      let savedLookId = lookId;

      if (lookData.image) {
        const webPFile = await convertToWebP(lookData.image);
        // Assurez-vous d'ajuster le chemin selon votre structure de stockage
        await supabase.storage.from('looks-images').upload(`${savedLookId}/thumbnail`, webPFile, { upsert: true });
      }

      if (!savedLookId) {
        const { data, error } = await supabase.from('looks').insert([lookData]).single();
        if (error) throw error;
        savedLookId = data.id;
      } else {
        await supabase.from('looks').update(lookData).match({ id: savedLookId });
      }

      // Logique pour gérer customersToSave et customersToRemove

      setLoading(false);
      return savedLookId;
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
      return null;
    }
  }, []);

  return { saveLook, loading, error };
};