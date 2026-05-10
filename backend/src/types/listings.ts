
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

export interface ListingImage {
    id: string
    listing_id: string
    cloudinary_url: string
    cloudinary_public_id: string
    display_order: number
}