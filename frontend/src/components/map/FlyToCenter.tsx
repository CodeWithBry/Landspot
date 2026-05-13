'use client';

import { LocateIcon } from "lucide-react";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function FlyToCenter({ center }: { center: [number, number] }) {
    const map = useMap();

    function transportToCenter() {
        map.flyTo(center, 15, {
            animate: true,
            duration: 1.2,
        })
    }


    return <>
        <div className="leaflet-bottom leaflet-right" style={{ marginBottom: '24px', marginRight: '10px' }}>
            <div className="leaflet-control">
                <button
                    className="p-3.5 text-red-500 bg-white rounded-2xl shadow-xl"
                    onClick={transportToCenter}>
                    <LocateIcon size={18} />
                </button>
            </div>
        </div>
    </>
}
