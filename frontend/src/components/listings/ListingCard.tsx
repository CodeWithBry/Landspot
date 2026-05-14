import { useListing } from "@/hooks/useListings";
import { Listing } from "@/types/ListingType"
import Link from "next/link";

function ListingCard({ listing }: { listing: Listing }) {
  const { deleteFromListing } = useListing();
  const imageStyle = {
    backgroundImage: `url("${listing?.images && listing.images[0]?.cloudinary_url ? listing.images[0].cloudinary_url : "./dummy_apartment.png"}")`,
    backgroundPosition: "center",
    backgroundSize: "cover"
  }

  async function handleDelete(id: string) {
    try {
      deleteFromListing(id, listing.agent_id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  return (
    <div className="md:flex-row flex flex-col gap-2 w-full px-5 py-3 text-serif rounded-xl shadow-lg bg-white">
      <div className="md:w-30 md:h-30 w-full h-70 shrink-0 rounded-2xl flex justify-center place-items-center">
        <div
          className={`md:w-full md:h-full w-full h-70 rounded-md`}
          style={{ ...imageStyle }} />
      </div>
      <div className="md:flex-row flex flex-col w-full gap-2">
        <div className="flex flex-col gap-1 flex-1">
          <h2 className="font-serif text-black font-bold text-xl">{listing.title}</h2>
          <p>{listing.address}</p>
          <p className="text-text-secondary flex place-items-center gap-2">
            <span>₱{(listing?.price ? Math.floor(listing.price / 1) : 0).toLocaleString("en-US")}</span>
            <span>•</span>
            <span>{listing.property_type}</span>
            <span>•</span>
            <span >{listing.status}</span>
          </p>
        </div>
        <div className="flex gap-2 md:w-fit w-full">
          <Link
            href={`/dashboard/listings/${listing.id}`} className="md:w-fit w-full h-fit border-2 flex justify-center place-items-center border-accent-400 text-accent-400 hover:bg-accent-400 hover:text-white transition text-md font-serif py-3 px-5 rounded-md cursor-pointer active:bg-accent-600">Edit</Link>
          <button
            onClick={() => handleDelete(listing.id)}
            className="md:w-fit w-full h-fit border-2 flex justify-center place-items-center border-danger-500 text-danger-500 hover:bg-danger-500 hover:text-white transition text-md font-serif py-3 px-5 rounded-md cursor-pointer active:bg-accent-600">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default ListingCard