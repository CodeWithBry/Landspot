'use client'

import dynamic from 'next/dynamic'
import { Listing } from '@/types/ListingType'

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
  onBoundsChange?: (bbox: { north: number; south: number; east: number; west: number }) => void
}

export default function MapView({ listings, onBoundsChange }: Props) {


  return (
    <div className="w-full h-full">
      <LeafletMap center={[14.5995, 120.9842]} listings={listings} onBoundsChange={onBoundsChange} />
    </div>
  )
}