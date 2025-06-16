// types/collection.d.ts

export interface CollectionItem {
  collectionItemId: number; 
  collectionId: string; 
  contentTitle: string; 
  contentType: string; 
  addedAt: string;
  itemOrder: number;
  contentId?: string; //추가
}

export interface Collection {
  collectionId: string;
  userId?: number;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
  items: CollectionItem[];
  itemCount?: number; 
  userName?: string;
}

