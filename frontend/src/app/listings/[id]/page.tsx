"use client"

import { useListing } from "@/hooks/useListings";
import { Listing } from "@/types/ListingType";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ViewListing() {
    const { getListingById } = useListing();
    const { id } = useParams<{ id: string }>();
    const [listing, setListing] = useState<Listing | null>(null);

    useEffect(() => {
        console.log(id)
        async function getListing() {
            try {
                const result = await getListingById(id);
                if(result) setListing(result); 
            } catch (error) {
                console.log(error)
                throw error;
            }
        }

        if(id) getListing();
    }, [id])

    return <>
        <div className="transition w-full h-full overflow-auto overflow-x-hidden relative">
            {/* Image slide section */}
            <div className="w-full h-300px">
                {/* image slider */}
                <div className="">
                    {listing?.images && listing.images.map((img) => {
                        return <img src={img.cloudinary_url} className={`w-full h-auto`} />
                    })}
                </div>
                {/* bottom */}
                <div className="">

                </div>
            </div>
        </div>
    </>;
}