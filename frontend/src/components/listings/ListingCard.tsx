import { Listing } from "@/types/ListingType"

function ListingCard({ listing }: { listing: Listing }) {
  const imageStyle = {
    backgroundImage: `url("${listing?.images ? listing.images[0] : "./dummy_apartment.png"}")`,
    backgroundPosition: "center",
    backgroundSize: "100% 100%"
  }
  return (
    <div className="md:flex-row flex flex-col gap-2 w-full px-5 py-3 text-serif border-2 border-primary-300 hover:border-primary-600">
      <div className="w-30 h-30 shrink-0 rounded-2xl flex justify-center place-items-center">
        <div
          className={`w-full h-full`}
          style={{ ...imageStyle }} />
      </div>
      <div className="flex w-full">
        <div className="flex flex-col gap-1 flex-1">
          <h2 className="font-serif text-black font-bold text-xl">{listing.title}</h2>
          <p>{listing.address}</p>
          <p className="text-text-secondary flex place-items-center gap-2">
            <span>{listing.price}</span>
            <span>•</span>
            <span>{listing.property_type}</span>
            <span>•</span>
            <span >{listing.status}</span>
          </p>
        </div>
        <div className="flex gap-2 w-fit">
          <button className="h-fit border-2 border-accent-400 text-accent-400 hover:bg-accent-400 hover:text-white transition text-md font-serif py-3 px-5 rounded-md cursor-pointer active:bg-accent-600">Edit</button>
          <button className="h-fit border-2 border-danger-500 text-danger-500 hover:bg-danger-500 hover:text-white transition text-md font-serif py-3 px-5 rounded-md cursor-pointer active:bg-accent-600">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default ListingCard