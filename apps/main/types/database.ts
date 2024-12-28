import { UUID } from 'crypto'

export interface User {
  id: UUID
  email: string
  name: string | null
  credits: number
  profile_picture: string | null
  created_at: Date
  updated_at: Date
}

export interface List {
  id: UUID
  user_id: UUID
  name: string
  description: string | null
  created_at: Date
  updated_at: Date
}

export interface Lead {
  id: UUID
  name: string
  source: string
  external_id: string
  business_phone: string | null
  business_email: string | null
  decision_maker_name: string | null
  decision_maker_linkedin_url: string | null
  decision_maker_email: string | null
  decision_maker_phone: string | null
  source_attributes: Record<string, any> | null
  created_at: Date
  updated_at: Date
}

export interface ListLead {
  list_id: UUID
  lead_id: UUID
}

export interface GoogleMapsLead {
  id: string;
  name: string;
  business_phone?: string;
  formatted_address?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  business_status?: string;
  latitude?: number;
  longitude?: number;
  additional_properties?: Record<string, any>;
  images?: string[];
  reviews?: Record<string, any>[];
  similar_businesses?: Record<string, any>[];
  about?: string;
}
