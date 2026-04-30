"use client"

import { navContext } from "@/context/NavigationProvider";
import { useListing } from "@/hooks/useListings";
import { Listing } from "@/types/ListingType";
import { NavigationContextType } from "@/types/NavigationContextType";
import { Menu, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const LeafletMap = dynamic(() => import('../../../components/map/LeafletMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
            <span className="text-sm text-gray-400">Loading map...</span>
        </div>
    ),
})

export default function ViewListing() {
    const { setShowMenu, showMenu } = useContext(navContext) as NavigationContextType;
    const { getListingById } = useListing();
    const { id } = useParams<{ id: string }>();
    const [listing, setListing] = useState<Listing | null>(null);

    useEffect(() => {
        async function getListing() {
            try {
                const result = await getListingById(id);
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
            <button
                onClick={() => setShowMenu(prev => !prev)}
                className='p-3 rounded-full sticky top-3.5 left-3.5 z-1 transition cursor-pointer  hover:bg-accent-400 hover:text-white'>
                {
                    !showMenu ? <Menu size={18} /> : <X size={18} />
                }
            </button>
            {/* Image slide section */}
            <div className="w-full h-100">
                {/* image slider */}
                <div className="h-[400px] overflow-hidden relative place-item">
                    {listing?.images?.length ? listing.images.map((img, idx) => {
                        const firstImage = idx == 0 && !img.cloudinary_url ? img.cloudinary_url : idx == 0 && "../dummy_apartment.png";
                        if (firstImage) return <img src={firstImage} className={`w-full h-auto object-cover block absolute translate-y-[-50%] top-[50%]`} />
                    }) : <img src={"../dummy_apartment.png"} className={`w-full h-auto object-cover block absolute translate-y-[-50%] top-[50%]`} />}

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

            <div className="flex max-w-350 w-full *:font-serif m-auto p-5">
                <div className="flex flex-col gap-2 flex-1/2 px-2">
                    <span className="text-xs text-black">
                        ABOUT THIS PROPERTY
                    </span>
                    <h2 className="text-2xl text-gray-900">
                        {listing?.title}
                    </h2>
                    <p>
                        {listing?.description.split("\n").map((text) => <>
                            <span className="text-gray-700 text-sm">{text}</span>
                            <br />
                        </>)}
                    </p>
                </div>
                <div className="flex flex-col gap-2 flex-1/2 px-2">
                    <span className="text-xs text-black">
                        LOCATION
                    </span>
                    <div className="max-h-[300px] h-100 w-full">
                        {listing && <LeafletMap listings={[listing]} center={[listing.lat, listing.lng]} />}
                    </div>
                </div>
            </div>
        </div>
    </>;
}