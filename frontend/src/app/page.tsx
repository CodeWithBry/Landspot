'use client'
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import MapPage from './MapPage';

function Map() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get("id");
  const FallBack = (<div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
    <span className="text-sm text-gray-400">Loading map...</span>
  </div>)

  return (
    <Suspense fallback={FallBack}>
      <MapPage listingId={listingId} />
    </Suspense>
  )
}

export default Map