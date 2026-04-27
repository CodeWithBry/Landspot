'use client'
import { MapType } from "@/types/ListingType";
import { ReactNode } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { ListingMarker } from "./ListingMarker";

function LeafletMap({ listings, center = [14.5995, 120.9842], zoom = 12, children }: MapType & { children?: ReactNode }) {
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
            <ListingMarker key={listing.id} listing={listing} />
        ))}
        {/* <BoundsWatcher onBoundsChange={onBoundsChange} /> */}
    </MapContainer>
}

export default LeafletMap