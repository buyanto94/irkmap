export interface PaginationData {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export type UserRole = 'ADMIN' | 'MODERATOR' | 'BUSINESS' | 'USER';
export type UserStatus = 'ACTIVE' | 'PENDING' | 'ADDITIONAL_VALIDATION' | 'BLOCKED';
export type ObjectStatus = 'DRAFT' | 'MODERATION' | 'REQUIRES_CORRECTION' | 'PUBLISHED' | 'REJECTED';
export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'REJECT' | 'REGISTER';

export interface Region {
  id: number;
  name: string;
  slug: string;
}

export interface User {
  id: number;
  email: string;
  role: UserRole;
  status: UserStatus;
  region_id?: number | null;
  created_at: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
}

export interface BusinessRegistrationRequest {
  id: number;
  user_id: number;
  company_name: string;
  inn: string;
  contact_person: string;
  documents: string[]; // URLs
  status: UserStatus;
  created_at: string;
}

export interface ModerationComment {
  id: number;
  object_id: number;
  moderator_id: number;
  comment: string;
  created_at: string;
}

export interface LogEvent {
  id: number;
  user_id: number;
  user_role: UserRole;
  action_type: ActionType;
  entity_type: string; // 'OBJECT' | 'USER' | 'CATEGORY'
  entity_id: number;
  created_at: string;
  details?: string;
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
  category_id?: number;
  region_id?: number;
  description: string;
  rating: number;
  distance: number;
  lat: number;
  lng: number;
  image: string;
  photos: string[];
  isOpen: boolean;
  contacts: Contacts;
  status?: ObjectStatus;
  owner_id?: number;
  created_at?: string;
  updated_at?: string;
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
