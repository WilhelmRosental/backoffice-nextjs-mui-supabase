export interface Product {
  id: string; // UUID
  createdAt: Date; // TIMESTAMP
  title?: string; // TEXT, peut être nullable
  description?: string; // TEXT, peut être nullable
  images: any; // JSONB, vous pouvez définir une interface plus spécifique pour cette structure
  condition?: string; // TEXT, peut être nullable
  brand?: string; // TEXT, peut être nullable
  category?: string; // TEXT, peut être nullable
  type?: string; // TEXT, peut être nullable
  provider?: string; // TEXT, peut être nullable
  colors?: string[]; // TEXT[], peut être nullable
  materials?: string[]; // TEXT[], peut être nullable
  details?: string[]; // TEXT[], peut être nullable
  shoeSize?: string; // TEXT, peut être nullable
  size?: string; // TEXT, peut être nullable
  customFields: any; // JSONB, vous pouvez définir une interface plus spécifique pour cette structure
  instructions?: string; // TEXT, peut être nullable
  price?: number; // REAL, peut être nullable
  finalPrice?: number; // REAL, peut être nullable
  published: boolean; // BOOLEAN
}

export interface UseProductByIdResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

export interface ProductImage {
  id: string;
  order: number;
  fileUrl: string;
  file?: File; // Inclus uniquement en mode éditeur
}

export interface UseProductImagesResult {
  images: ProductImage[];
  loading: boolean;
  error: string | null;
}