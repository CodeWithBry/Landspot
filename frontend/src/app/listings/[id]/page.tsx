"use client"
import { useListing } from "@/hooks/useListings";
import { Listing } from "@/types/ListingType";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const LeafletMap = dynamic(() => import('../../../components/map/LeafletMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
            <span className="text-sm text-gray-400">Loading map...</span>
        </div>
    ),
})

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
                        const firstImage = img.cloudinary_url ? img.cloudinary_url : "../dummy_apartment.png";
                        if (idx == 0) return <img src={firstImage} className={`w-full h-auto object-cover block absolute translate-y-[-50%] top-[50%]`} />
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
            </div>

            {/* bottom */}
            <div className="max-w-280 w-full flex md:flex-row  mx-auto flex-col py-3 px-8 my-5 *:font-serif">
                <div className="flex flex-col gap-1.5 w-1/2">
                    <span className="text-xs text-primary-300">
                        ABOUT THIS PROPERTY
                    </span>
                    <h1 className="font-black text-2xl">{listing?.title}</h1>
                    <div className="*:text-gray-700 flex flex-col">
                        {
                            listing?.description.split("\n").map((text) => {
                                return <>
                                    <p>{text}</p>
                                    <br />
                                </>
                            })
                        }
                    </div>
                </div>
                <div className="flex flex-col w-1/2 gap-2">
                    <span className="text-xs text-primary-300">
                        LOCATION
                    </span>
                    <h4 className="font-black text-md">Full Address: {listing?.address}</h4>
                    <div className="max-h-100 h-70 rounded-2xl overflow-hidden">
                        {
                            listing && <LeafletMap listings={[listing]} locationIcon="../loc.png" center={[listing.lat, listing.lng]} />
                        }
                    </div>
                </div>
            </div>
        </div>
    </>;
}