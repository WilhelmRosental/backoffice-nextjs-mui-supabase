import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabaseClient';
import { formatFilter } from '@/utils/formatFilter';
import { Range, Product } from '@/types';

export const useFetchFilteredProducts = (range: Range) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const queryProducts = supabase
          .from('products')
          .select()
          .order('created_at', { ascending: true })
          .range(range.from, range.to);

        const filters = ['types', 'brands', 'colors', 'materials', 'details', 'sizes', 'shoesizes'];
        filters.forEach((filter) => {
          const filterValues = formatFilter(router.query, filter);
          if (filterValues) {
            queryProducts.in(filter, filterValues);
          }
        });

        const minPriceFilter = parseFloat(router.query.minprice as string);
        const maxPriceFilter = parseFloat(router.query.maxprice as string);
        if (!isNaN(minPriceFilter)) {
          queryProducts.gte('final_price', minPriceFilter);
        }
        if (!isNaN(maxPriceFilter)) {
          queryProducts.lte('final_price', maxPriceFilter);
        }

        const { data: filteredProducts, error: queryError } = await queryProducts;

        if (queryError) throw queryError;

        setProducts(filteredProducts);
      } catch (error) {
        console.error('An error occurred:', error);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [router.query, range.from, range.to]);

  return { products, loading, error };
};