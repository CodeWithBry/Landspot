'use client'
import { Listing, MapType } from "@/types/ListingType";
import { ReactNode, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { ListingMarker } from "./ListingMarker";
import LocateUser from "./LocateUser";

interface Props {
    listings: Listing[]
    center?: [number, number]
    zoom?: number
    onBoundsChange?: (bbox: { north: number; south: number; east: number; west: number }) => void
}

function FlyToCenter({ center }: { center: [number, number] }) {
    const map = useMap()

    useEffect(() => {
        map.flyTo(center, 15, {
            animate: true,
            duration: 1.2,
        })
    }, [center, map])

    return null
}


function LeafletMap({
    listings,
    center = [14.5995, 120.9842],
    zoom = 12,
    onBoundsChange,
    children,
    locationIcon
}: Props & { children?: ReactNode, locationIcon?: string }) {
    return <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
    >
        <TileLayer
            attribution=''
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
        {listings?.map(listing => (
            <ListingMarker key={listing.id} listing={listing} locationIcon={locationIcon} />
        ))}
        <LocateUser center={center}/>
        {/* <BoundsWatcher onBoundsChange={onBoundsChange} /> */}
    </MapContainer>
}

export default LeafletMap