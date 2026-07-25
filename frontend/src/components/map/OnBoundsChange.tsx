"use client"

import { LatLngBounds } from "leaflet";
import { useMapEvents } from "react-leaflet";

type OnBoundsChangeProps = {
    onBoundsChange: (bounds: LatLngBounds) => void;
}

export default function OnBoundsChange({onBoundsChange}: OnBoundsChangeProps) {

    useMapEvents({
        moveend(mapEvent) {
            const bounds = mapEvent.target.getBounds();
            onBoundsChange(bounds);
        }
    })
    return null
}