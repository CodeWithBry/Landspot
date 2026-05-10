'use client'
import { useMap } from 'react-leaflet'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import L from 'leaflet'

interface Props {
  center?: [number, number] | null;
  setCenter?: Dispatch<SetStateAction<[number, number] | null>>
}

export default function LocateUser({ center, setCenter }: Props) {
  const map = useMap()

  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const locateUser = () => {
    if (setCenter) setCenter(null)
    map.locate({ setView: true, maxZoom: 16 })

    map.on('locationfound', (e: L.LocationEvent) => {
      // Remove previous marker and circle if they exist
      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
      if (userCircleRef.current) {
        map.removeLayer(userCircleRef.current);
        userCircleRef.current = null;
      }

      // Blue dot icon for user location
      const userIcon = L.divIcon({
        className: '',
        html: `
          <div style="
            width: 16px;
            height: 16px;
            background: #2563eb;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 0 3px rgba(37,99,235,0.3);
          "></div>
        `,
        iconAnchor: [8, 8],
        iconSize: [16, 16],
      })

      // Place marker at user location
      const marker = L.marker(e.latlng, { icon: userIcon })
        .addTo(map)
        .bindPopup('You are here')
        .openPopup()

      // Accuracy circle around the user
      const circle = L.circle(e.latlng, {
        radius: e.accuracy,
        color: '#2563eb',
        fillColor: '#2563eb',
        fillOpacity: 0.08,
        weight: 1,
      }).addTo(map)

      userMarkerRef.current = marker;
      userCircleRef.current = circle;
    })

    map.on('locationerror', (e: L.ErrorEvent) => {
      console.error('Location error:', e.message)
      alert('Could not get your location — please allow location access in your browser.')
    })
  }

  // Clean up layers when component unmounts
  useEffect(() => {
    const isDefaultCenter = center && center[0] === 14.5995 && center[1] === 120.9842;

    if (isDefaultCenter) {
      locateUser();
    } else if(center) {
      map.flyTo(center, 14, { animate: true, duration: 1.5 });
    }

    return () => {
      map.stopLocate();
    }
  }, [map])

  return (
    <div className="leaflet-bottom leaflet-right" style={{ marginBottom: '24px', marginRight: '10px' }}>
      <div className="leaflet-control">
        <button
          onClick={locateUser}
          title="Find my location"
          style={{
            width: '36px',
            height: '36px',
            background: 'white',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 1px 5px rgba(0,0,0,0.25)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
          }}
        >
          📍
        </button>
      </div>
    </div>
  )
}