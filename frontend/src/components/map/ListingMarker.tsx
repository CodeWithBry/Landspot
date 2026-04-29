'use client'
import { Listing } from "@/types/ListingType";
import Link from "next/link";
import { Marker, Popup } from "react-leaflet";
import L from 'leaflet';

const priceIcon = (price: number, imgURL: string) =>
    L.divIcon({
        className: '',
        html: `<div><img src="${imgURL}" style="width: 40px; height: auto" /></div>`,
        iconAnchor: [24, 12],
    })

export function ListingMarker({ listing }: { listing: Listing }) {

    return <Marker
        position={[listing.lat, listing.lng]}
        icon={priceIcon(listing.price, "./loc.png")}
    >
        <Popup>
            <div className="max-w-[190px] min-w-[150px]">
                <img
                    className="w-full h-auto" 
                    src={listing?.images && listing.images[0]?.cloudinary_url ? listing.images[0].cloudinary_url : "./dummy_apartment.png"} />
                <p style={{ fontWeight: 600, marginBottom: 4 }}>{listing.title}</p>
                <p style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>
                    {listing.bedrooms} bd · {listing.bathrooms} ba · ₱{listing.price.toLocaleString()}
                </p>
                <Link href={`/listings/${listing.id}`} style={{ fontSize: 13, color: '#1a6ef5' }}>
                    View listing →
                </Link>
            </div>
        </Popup>
    </Marker>
}