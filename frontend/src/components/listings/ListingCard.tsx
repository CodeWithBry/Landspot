import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { Listing } from "@/types/ListingType"
import { Eye, Heart, Map, MapPin } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

type Props = { listing: Listing, setListingResult: Dispatch<SetStateAction<Listing[] | undefined | null>> }

function ListingCard({ listing, setListingResult }: Props) {
    const { handleFavoriteChange } = useFavorites();
    const { user } = useAuth();
    const imageStyle = {
        backgroundImage: `url("${listing?.images && listing.images[0]?.cloudinary_url ? listing.images[0].cloudinary_url : "./dummy_apartment.png"}")`,
        backgroundPosition: "center",
        backgroundSize: "cover"
    }

    async function addToFavorite(listing_id: string) {
        try {
            if (user?.id) {
                setListingResult(prev => {
                    return prev ?
                        prev.map((list) => {
                            if (list.id === listing_id) return { ...list, isFavorite: !list.isFavorite }
                            return list
                        }) : prev
                })
                handleFavoriteChange(user?.id, listing, listing.isFavorite)
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    return (
        <div className="w-[95%] flex lg:flex-row flex-col lg:h-50 h-fit mx-auto mt-2 overflow-hidden rounded-md shadow-sm shrink-0">
            <div className="relative lg:w-80 w-full">
                <span className="absolute top-2 left-2 bg-accent-500 rounded-xl p-3 py-1.5 text-sm font-serif text-white">{listing.property_type.toUpperCase()}</span>
                <div
                    className={`lg:w-full lg:h-full md:w-full w-full h-70`}
                    style={{ ...imageStyle }} />
            </div>
            <div className="w-full mx-auto pb-3 h-full flex justify-center place-items-center">
                <div className="w-[90%] h-[90%] flex flex-col">
                    <div className="flex justify-between font-serif">
                        <h1 className="text-xl font-bold truncate w-[60%]">{listing.title}</h1>
                        <h1 className="text-xl font-bold text-nowrap">₱ {(listing?.price ? Math.floor(listing.price / 1) : 0).toLocaleString("en-US")} </h1>
                    </div>
                    <div className="flex justify-between place-items-start font-serif ">
                        <span className="flex place-items-center text-sm w-3/4 gap-px">
                            <MapPin size={16} />
                            <span className="truncate text-md">{listing.address}</span>
                        </span>
                    </div>
                    <div className="flex flex-col gap-1.5 my-2">
                        <span className="font-serif text-xs text-gray-600">
                            Agent Name:
                        </span>
                        <div className="flex gap-2 items-center w-full h-full">
                            <h2 className="w-10 h-10 flex place-items-center justify-center text-white rounded-full primary-gradient">{listing?.agent_name && listing.agent_name[0].toLocaleUpperCase()}</h2>
                            <div className="flex flex-col">
                                <p className="font-semibold tex-black text-sm sm:text-md">{listing?.agent_name}</p>
                                <span className="text-gray-500 text-xs sm:text-sm">{listing?.agent_email}</span>
                            </div>
                        </div>
                    </div>
                    <div className="border-t-2 border-gray-300 py-2 flex flex-col gap-2 mt-auto">
                        <div className="flex sm:gap-4 gap-2 ">
                            <Link
                                href={`/listings/${listing.id}`}
                                className="btn bg-accent-400 text-white [1400px]:text-md text-sm">
                                <Eye size={16} />
                                <span className="sm:block hidden">View Listing</span>
                            </Link>
                            <Link
                                href={`/?id=${listing.id}`}
                                className="btn bg-gray-200 text-gray-900 [1400px]:text-md text-sm">
                                <Map size={16} />
                                <span className="sm:block hidden">See on map</span>
                            </Link>

                            <button
                                onClick={() => addToFavorite(listing.id)}
                                className={`btn ml-auto bg-accent-400 text-white [1400px]:text-md text-sm`}>
                                {listing.isFavorite ? <Heart fill="white" /> : <Heart />}
                                <span className="md:block hidden">Add to favorites</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListingCard