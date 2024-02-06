import { useCallback } from 'react';

interface ConvertToWebPOptions {
  quality?: number;
  maxHeight?: number;
}

export const useConvertToWebP = () => {
  const convertToWebP = useCallback(async (file: File, { quality = 0.8, maxHeight = 400 }: ConvertToWebPOptions = {}): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxHeight) {
          const scaleFactor = maxHeight / height;
          width *= scaleFactor;
          height *= scaleFactor;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx!.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob from canvas'));
            return;
          }

          const reader = new FileReader();
          reader.onloadend = () => {
            const compressedFile = new File([reader.result!], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' });
            resolve(compressedFile);
          };

          reader.onerror = reject;
          reader.readAsArrayBuffer(blob);
        }, 'image/webp', quality);
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }, []);

  return convertToWebP;
};