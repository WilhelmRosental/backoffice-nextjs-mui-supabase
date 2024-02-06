import { Customer } from './customer';

export interface Look {
    id: string; // UUID
    createdAt: Date; // TIMESTAMP
    title?: string; // TEXT, peut être nullable
    thumbnail: boolean; // BOOLEAN
    designer?: string; // TEXT, peut être nullable
    univers?: string; // TEXT, peut être nullable
    leftTop?: string; // UUID, référence à Product, peut être nullable
    leftBottom?: string; // UUID, référence à Product, peut être nullable
    rightTop?: string; // UUID, référence à Product, peut être nullable
    rightMiddle?: string; // UUID, référence à Product, peut être nullable
    rightBottom?: string; // UUID, référence à Product, peut être nullable
    isPublic: boolean; // BOOLEAN
    published: boolean; // BOOLEAN, NOT NULL avec une valeur par défaut à FALSE
    image?: File; // Image à convertir et télécharger
}

export interface LookWithCustomer {
    look: Look;
    customer?: Customer;
}

export interface ThumbnailData {
    fileUrl: string;
    file?: File;
}
  
export interface UseFetchThumbnailUrlResult {
    data: ThumbnailData | null;
    loading: boolean;
    error: string | null;
}