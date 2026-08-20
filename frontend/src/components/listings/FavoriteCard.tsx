import { type UseListingType } from "@/hooks/useListings";
import { Listing } from "@/types/ListingType"
import { Bookmark, Eye, Map, MapPin } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

type Props = { listing: Listing, deleteFromListing?: UseListingType["deleteFromListing"]}

function FavoriteCard({ listing, deleteFromListing }: Props) {
    const imageStyle = {
        backgroundImage: `url("${listing?.images && listing.images[0]?.cloudinary_url ? listing.images[0].cloudinary_url : "./dummy_apartment.png"}")`,
        backgroundPosition: "center",
        backgroundSize: "cover"
    }

    async function handleDelete(id: string) {
        try {
            if (deleteFromListing) deleteFromListing(id, listing.agent_id);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    return (
        <div className="w-[90%] flex lg:flex-row flex-col lg:h-50 h-fit mx-auto mt-2 overflow-hidden rounded-md shadow-sm shrink-0">
            <div className="relative lg:w-60 w-full shrink-0">
                <span className="absolute top-2 left-2 bg-accent-500 rounded-xl p-3 py-1.5 text-sm font-serif text-white">{listing.property_type.toUpperCase()}</span>
                <div
                    className={`lg:w-full lg:h-full w-full h-70 shrink-0`}
                    style={{ ...imageStyle }} />
            </div>
            <div className="w-full lg:max-w-[calc(98%_-_240px)] max-w-[95%] mx-auto md:max-h-50 h-full flex justify-center place-items-center">
                <div className="w-[98%] h-[90%] flex flex-col gap-2 max-w-full">
                    <div className="flex justify-between font-serif">
                        <h1 className="text-xl font-bold truncate w-[60%]">
                            {listing.title}
                        </h1>
                        <h1 className="text-xl font-bold break-all">₱ {(listing?.price ? Math.floor(listing.price / 1) : 0).toLocaleString("en-US")} </h1>
                    </div>
                    <div className="flex justify-between place-items-start font-serif ">
                        <span className="flex place-items-center text-sm w-3/4 gap-2">
                            <MapPin size={16} />
                            <span className="truncate text-xs">{listing.address}</span>
                        </span>
                        <span className="text-2xs text-wrap ">Listing Price</span>
                    </div>

                    <div className="border-t-2 border-gray-300 py-2 flex flex-col gap-2 mt-auto">
                        <div className="flex gap-4">
                            <Link
                                href={`/listings/${listing.id}`}
                                className="btn bg-accent-400 text-white text-md">
                                <Eye size={16} />
                                <span className="sm:block hidden">View Listing</span>
                            </Link>
                            <Link
                                href={`/?id=${listing.id}`}
                                className="btn bg-gray-200 text-gray-900 text-md">
                                <Map size={16} />
                                <span className="sm:block hidden">See on map</span>
                            </Link>
                        </div>
                        <div className="flex justify-between pb-2">
                            <p className="text-gray-800 flex place-items-center gap-2">
                                <Bookmark size={16} />
                                {new Date(listing.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                            <button className="btn border-2 border-red-600 bg-gray-200 text-red-600 text-md">
                                <Map size={16} />
                                <span>Remove</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FavoriteCard