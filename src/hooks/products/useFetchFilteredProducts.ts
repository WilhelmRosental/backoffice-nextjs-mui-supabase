import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { Range, Product } from '@/types';
import _ from 'lodash';

/**
 * Formate les valeurs de filtre extraites des paramètres de l'URL en un tableau.
 * 
 * @param query - Objet contenant les paramètres de requête de l'URL.
 * @param filterName - Le nom du paramètre de filtre à extraire.
 * @returns Un tableau des valeurs de filtre ou null si aucun filtre n'est trouvé ou si le filtre est vide.
 */
const formatFilter = (query: Record<string, any>, filterName: string): Array<string> | null => {
  const filterValue = query[filterName];

  if (_.isArray(filterValue) && !_.isEmpty(filterValue)) {
    return filterValue;
  } else if (filterValue && !_.isArray(filterValue)) {
    return [filterValue];
  } else {
    return null;
  }
};

export const useFetchFilteredProducts = (range: Range) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  console.log('PARAMS : ', searchParams.entries());

  useEffect(() => {

    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const queryProducts = supabase
          .from('products')
          .select()
          .order('created_at', { ascending: true })
          .range(range.from, range.to);

        const typesFilter = formatFilter(searchParams.entries(), 'types')
        const brandsFilter = formatFilter(searchParams.entries(), 'brands')
        const colorsFilter = formatFilter(searchParams.entries(), 'colors')
        const materialsFilter = formatFilter(searchParams.entries(), 'materials')
        const detailsFilter = formatFilter(searchParams.entries(), 'details')
        const sizesFilter = formatFilter(searchParams.entries(), 'sizes')
        const shoeSizesFilter = formatFilter(searchParams.entries(), 'shoesizes')
        // const minPriceFilter = parseFloat(searchParams.minprice)
        // const maxPriceFilter = parseFloat(searchParams.maxprice)

        console.log('TEST', brandsFilter)

        if (typesFilter) queryProducts.in('type', typesFilter);
        if (brandsFilter) queryProducts.in('brand', brandsFilter);
        if (colorsFilter) queryProducts.containedBy('colors', colorsFilter);
        if (materialsFilter) queryProducts.containedBy('materials', materialsFilter);
        if (detailsFilter) queryProducts.containedBy('details', detailsFilter);
        if (sizesFilter) queryProducts.in('size', sizesFilter);
        if (shoeSizesFilter) queryProducts.in('shoeSize', shoeSizesFilter);
        // if (minPriceFilter) queryProducts.gte('price', minPriceFilter);
        // if (maxPriceFilter) queryProducts.lte('price', maxPriceFilter);

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
  }, [searchParams, range.from, range.to]);

  return { products, loading, error };
};