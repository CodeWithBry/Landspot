'use client'

import { useListing } from "@/hooks/useListings"
import { ListingForm } from "@/types/ListingType";
import { FormEvent, SubmitEventHandler, useState } from "react"

function AddListing() {
    const { addNewListing } = useListing();
    const [form, setForm] = useState<ListingForm>({
        title: "",
        description: "",
        property_type: "house",
        price: 0,
        bedrooms: 0,
        bathrooms: 0,
        address: ""
    });

    function handleSubmit (e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        addNewListing(form);
    }

    return (
        <div className="w-full h-full">
            <form
                onSubmit={handleSubmit} 
                className="max-w-300 w-full h-full flex flex-col">

            </form>
        </div>
    )
}

export default AddListing