'use client'

import { useListing } from "@/hooks/useListings"
import { FormEvent, SubmitEventHandler, useState } from "react"

export type Form = {
    title: string
    description: string
    property_type: 'house' | 'condo' | 'apartment' | 'lot'
    price: number
    bedrooms: number
    bathrooms: number
    address: string
}

function AddListing() {
    const { addNewListing } = useListing();
    const [form, setForm] = useState<Form>({
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