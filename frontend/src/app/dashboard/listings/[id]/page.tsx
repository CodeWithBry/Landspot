'use client'

import { useListing } from "@/hooks/useListings"
import { Listing, ListingForm } from "@/types/ListingType";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react"

function EditListing() {
    const { listings, updateListing } = useListing();
    const { id } = useParams<{ id: string }>();
    const [listing, setListing] = useState<Listing | undefined>(listings.find(list => list.id === id))


    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!listing) return;
        updateListing(listing);
    }

    return (
        <div className="w-full h-full">
            <form
                onSubmit={handleSubmit}
                className="max-w-300 w-full h-full flex flex-col" >

            </form>
        </div>
    )
}

export default EditListing;