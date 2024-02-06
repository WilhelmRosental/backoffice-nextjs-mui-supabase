import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { ProductImage, UseProductImagesResult } from '@/types';

export const useFetchProductImages = (productId: string, productImages: ProductImage[], isEditor: boolean = false): UseProductImagesResult => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      const productImagesPublicUrl: ProductImage[] = [];

      try {
        productImages.sort((a, b) => a.order - b.order);

        for (const image of productImages) {
          const imagePath = `${productId}/${image.id}`;
          const { data: imagePublicUrl, error } = supabase.storage.from('products-images').getPublicUrl(imagePath);

          if (error) throw error;

          if (isEditor) {
            const { data, error: downloadError } = await supabase.storage.from('products-images').download(imagePath);
            if (downloadError) throw downloadError;

            const fileName = imagePath.split('/').pop()!;
            const fileType = fileName.split('.').pop()!;
            const imageFile = new File([data!], fileName, { type: `image/${fileType}` });

            productImagesPublicUrl.push({
              id: image.id,
              order: image.order,
              fileUrl: imagePublicUrl.publicUrl,
              file: imageFile,
            });
          } else {
            productImagesPublicUrl.push({
              id: image.id,
              order: image.order,
              fileUrl: imagePublicUrl.publicUrl,
            });
          }
        }

        setImages(productImagesPublicUrl);
      } catch (error: any) {
        console.error('Error fetching product images:', error.message);
        setError('Failed to fetch product images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [productId, productImages, isEditor]);

  return { images, loading, error };
};