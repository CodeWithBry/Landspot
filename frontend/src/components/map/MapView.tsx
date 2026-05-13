'use client'

import dynamic from 'next/dynamic'
import { Listing } from '@/types/ListingType'
import { Dispatch, SetStateAction } from 'react'

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
      <span className="text-sm text-gray-400">Loading map...</span>
    </div>
  ),
})

interface Props {
  listings: Listing[]
  center?: [number, number] | null,
  zoom?: number | null
  onBoundsChange?: (bbox: { north: number; south: number; east: number; west: number }) => void
  setCenter?: Dispatch<SetStateAction<[number, number] | null>>,
  locationIcon?: string
}

export default function MapView({ listings, onBoundsChange, zoom, center, setCenter, locationIcon }: Props) {
  return (
    <div className="w-full h-full">
      <LeafletMap 
        key={center ? `${center[0]}-${center[1]}` : 'default'}
        center={center ?? [14.5995, 120.9842]}
        setCenter={setCenter} 
        listings={listings} 
        zoom={zoom ?? 12}
        locationIcon={locationIcon}
        onBoundsChange={onBoundsChange} />
    </div>
  )
}