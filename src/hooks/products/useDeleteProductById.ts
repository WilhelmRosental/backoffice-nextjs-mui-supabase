import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { Product } from '@/types';

interface UseDeleteProductByIdReturn {
  deleteProductById: (product: Product) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useDeleteProductById = (): UseDeleteProductByIdReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProductById = async (product: Product): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // Supposant que `images` est un tableau d'identifiants d'image ou de chemins
      const imagesToRemove = product.images.map((x: { id: string }) => `${product.id}/${x.id}`);

      // Supprimer les images associées au produit
      await supabase.storage.from('products-images').remove(imagesToRemove);

      // Supprimer le produit de la base de données
      const { error: deleteProductError } = await supabase
        .from('products')
        .delete()
        .match({ id: product.id });

      if (deleteProductError) throw deleteProductError;

      setIsLoading(false);
    } catch (error: any) {
      console.error('Error:', error.message);
      setError('Failed to delete product');
      setIsLoading(false);
    }
  };

  return { deleteProductById, isLoading, error };
};