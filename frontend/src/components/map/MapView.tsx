'use client'

import dynamic from 'next/dynamic'
import { Listing } from '@/types/ListingType'
import { Dispatch, SetStateAction, useState } from 'react'

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
  const [isUserLocated, setIsUserLocated] = useState<boolean>(false);

  return <div className="w-full h-full relative">
    <div className={`w-full h-full bg-gray-100 ${isUserLocated || center ? "hidden" : "flex"} absolute z-9999 items-center justify-center`}>
      <span className="text-sm text-gray-400">Loading map...</span>
    </div>
    <LeafletMap
      key={center ? `${center[0]}-${center[1]}` : 'default'}
      center={center ?? [14.5995, 120.9842]}
      setCenter={setCenter}
      listings={listings}
      zoom={zoom ?? 12}
      locationIcon={locationIcon}
      onBoundsChange={onBoundsChange}
      setIsUserLocated={setIsUserLocated} />
  </div>


}