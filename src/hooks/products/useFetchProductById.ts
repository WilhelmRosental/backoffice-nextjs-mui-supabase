import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { Product, UseProductByIdResult } from '@/types';

export const useFetchProductById = (id: number | null): UseProductByIdResult => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setLoading(false);
      return;
    }

    const fetchProductById = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('products')
          .select()
          .eq('id', id);

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedProduct = {
            ...data[0],
            type: data[0].type ? [data[0].type] : null,
            category: data[0].category ? [data[0].category] : null,
            condition: data[0].condition ? [data[0].condition] : null,
            brand: data[0].brand ? [data[0].brand] : null,
            provider: data[0].provider ? [data[0].provider] : null,
            size: data[0].size ? [data[0].size] : null
          };
          setProduct(formattedProduct);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProductById();
  }, [id]);

  return { product, loading, error };
};