export interface Listing {
  id: string
  agent_id: string
  title: string
  description: string
  property_type: 'house' | 'condo' | 'apartment' | 'lot'
  price: number
  bedrooms: number
  bathrooms: number
  lat: number
  lng: number
  address: string
  status: 'active' | 'sold' | 'inactive'
  created_at: string
  images?: ListingImage[]
}

export interface ListingForm {
  title: string
  description: string
  property_type: 'house' | 'condo' | 'apartment' | 'lot'
  price: number
  bedrooms: number
  bathrooms: number
  address: string,
  lat?: number,
  lng?: number
}

export interface ListingImage {
  id: string
  listing_id: string
  cloudinary_url: string
  cloudinary_public_id: string
  display_order: number
}

export type MapType = {
  center: [number, number],
  zoom?: number,
  listings?: Listing[],
  onBoundsChange?: (bbox: { north: number; south: number; east: number; west: number }) => void
}