export interface PaginationData {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  sortIndex: number;
}

export interface Contacts {
  phone: string;
  website: string;
  hours: string;
  address: string;
}

export interface TourismObject {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  rating: number;
  distance: number;
  lat: number;
  lng: number;
  image: string;
  photos: string[];
  isOpen: boolean;
  contacts: Contacts;
  region: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface ObjectsResponse {
  success: boolean;
  data: TourismObject[];
  pagination?: PaginationData;
}
