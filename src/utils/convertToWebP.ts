export const convertToWebP = (file: File, quality = 0.8, maxHeight = 500): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
  
        if (width > maxHeight) {
          const scaleFactor = maxHeight / height;
          width *= scaleFactor;
          height *= scaleFactor;
        }
  
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
  
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
  
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas to Blob conversion failed'));
            return;
          }
  
          const reader = new FileReader();
          reader.onloadend = () => {
            const compressedFile = new File([reader.result!], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' });
            resolve(compressedFile);
          };
  
          reader.onerror = () => reject(new Error('FileReader on blob failed'));
          reader.readAsArrayBuffer(blob);
        }, 'image/webp', quality);
      };
  
      img.onerror = () => reject(new Error('Image loading failed'));
      img.src = URL.createObjectURL(file);
    });
  };