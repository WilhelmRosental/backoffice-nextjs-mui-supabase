import { useCallback } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { Product } from '@/types';
import { convertToWebP } from '@/utils/convertToWebP';

export const useSaveProduct = () => {
  const saveImages = useCallback(async (product: Product, productId: string) => {
    // Assumer que product.images[0]?.file existe et est de type File.
    if (product.images.length > 0 && product.images[0]?.file) {
      const thumbnailFile = await convertToWebP(product.images[0].file);
      await supabase.storage.from('products-images').upload(`${productId}/thumbnail`, thumbnailFile, { upsert: true });
    }

    // Télécharger les autres images
    const uploadPromises = product.images.map(({ id, file }: { id: string, file: File }) => {
      if (!file) return Promise.resolve(); // S'assurer que file existe
      return supabase.storage.from('products-images').upload(`${productId}/${id}`, file, { upsert: true });
    });
    await Promise.all(uploadPromises);
  }, []);

  const saveProduct = useCallback(async (product: Product, productId?: string) => {
    try {
      let savedProductId: string | undefined = productId;
      // Sauvegarder ou mettre à jour le produit dans la base de données
      if (!productId) {
        const { data, error } = await supabase.from('products').insert([product]); // Remove the 'returning' property from the options
        if (error) throw error;
        savedProductId = (data && data[0]?.id) ?? undefined; // Add parentheses to group the logical operations and handle the type issue
      } else {
        const { error } = await supabase.from('products').update(product).eq('id', productId).select();
        if (error) throw error;
      }

      // Sauvegarder les images
      await saveImages(product, savedProductId!);

      console.log('Le produit a été sauvegardé avec succès.', savedProductId);
      return savedProductId;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du produit :', error);
      throw error;
    }
  }, [saveImages]);

  return saveProduct;
};