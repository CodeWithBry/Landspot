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
                console.log(result)
                if (result) setListing(result);
            } catch (error) {
                console.log(error)
                throw error;
            }
        }

        if (id) getListing();
        else return;
    }, [id])

    return <>
        <div className="transition w-full h-full overflow-auto overflow-x-hidden relative">
            {/* Image slide section */}
            <div className="w-full h-[400px]">
                {/* image slider */}
                <div className="h-[400px] overflow-hidden relative place-item">
                    {listing?.images && listing.images.map((img, idx) => {
                        const firstImage = idx == 0 && !img.cloudinary_url ? img.cloudinary_url : idx == 0 && "../dummy_apartment.png";
                        if (firstImage) return <img src={firstImage} className={`w-full h-auto object-cover block absolute translate-y-[-50%] top-[50%]`} />
                    })}

                    {/* HERO */}
                    <div className="gradient absolute bottom-0 flex justify-between p-5 w-full mask-gradient">
                        <div className="*:font-serif *:w-fit flex flex-col gap-3">
                            <span className="px-3 py-2 rounded-xl text-xs text-white bg-accent-500">
                                FOR SALE
                            </span>
                            <h2 className="text-xl text-gray-200">
                                {listing?.title}
                            </h2>
                            <p className="text-sm text-gray-400">
                                {listing?.address}
                            </p>
                        </div>
                        <div className="place-items-end justify-end *:font-serif *:w-fit flex flex-col gap-1">
                            <span className="text-xs text-white">
                                LISTING PRICE
                            </span>
                            <h2 className="text-xl  text-warning-500">
                                ₱{(listing?.price ? Math.floor(listing.price / 1) : 0).toLocaleString("en-US")}
                            </h2>
                            <p className="text-sm text-gray-400">
                                Est. ₱{" "}
                                {(listing?.price
                                    ? Math.floor(listing.price / 12)
                                    : 0
                                ).toLocaleString("en-US")}
                                /month
                            </p>
                        </div>
                    </div>
                </div>
                {/* bottom */}
                <div className="">

                </div>
            </div>
        </div>
    </>;
}