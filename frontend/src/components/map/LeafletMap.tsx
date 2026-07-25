'use client'
import { Listing, MapType } from "@/types/ListingType";
import { Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { ListingMarker } from "./ListingMarker";
import LocateUser from "./LocateUser";
import FlyToCenter from "./FlyToCenter";
import { LatLngBounds } from "leaflet";
import OnBoundsChange from "./OnBoundsChange";

interface Props {
    listings: Listing[]
    center?: [number, number]
    zoom?: number,
    setCenter?: Dispatch<SetStateAction<[number, number] | null>>
    onBoundsChange: (bounds: LatLngBounds) => void
    setIsUserLocated: Dispatch<SetStateAction<boolean>>
}

function LeafletMap({
    listings,
    center = [14.5995, 120.9842],
    zoom = 12,
    setCenter,
    onBoundsChange,
    children,
    locationIcon,
    setIsUserLocated
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
        <OnBoundsChange onBoundsChange={onBoundsChange}></OnBoundsChange>
        {children}
        {listings?.map(listing => (
            <ListingMarker key={listing.id} listing={listing} locationIcon={locationIcon} />
        ))}
        {!locationIcon ?
            <LocateUser center={center} setCenter={setCenter} setIsUserLocated={setIsUserLocated}/> :
            <FlyToCenter center={center} />}

        {/* <BoundsWatcher onBoundsChange={onBoundsChange} /> */}
    </MapContainer>
}

export default LeafletMap