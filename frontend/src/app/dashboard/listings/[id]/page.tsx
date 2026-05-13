'use client'

import { navContext } from "@/context/NavigationProvider";
import { useDebounce } from "@/hooks/useDebounce";
import { useListing } from "@/hooks/useListings"
import { api } from "@/lib/api";
import { Listing, ListingForm } from "@/types/ListingType";
import { NavigationContextType } from "@/types/NavigationContextType";
import { X, Menu, Save, Locate, Check } from "lucide-react";
import { register } from "module";
import { useParams } from "next/navigation";
import { ChangeEvent, FormEvent, MouseEvent, useContext, useEffect, useState } from "react"


function EditListing() {
    const [val, debounceValue, setDebounceValue] = useDebounce();
    const { listings, updateListing, testAddress, getListingById } = useListing();
    const { setShowMenu, showMenu } = useContext(navContext) as NavigationContextType;
    const { id } = useParams<{ id: string }>();
    const [isRegistring, setIsRegistring] = useState<boolean>(false);
    const [isRegistered, setIsRegistered] = useState<boolean>(false);
    const [isdisabled, setIsdisabled] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [geocodeMessage, setGeocodeMessage] = useState<string>("");
    const [listing, setListing] = useState<Listing | undefined>(listings.find(list => list.id === id));


    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!listing) return;

        try {
            updateListing(listing);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    function handleChangeAddressValue(e: ChangeEvent<HTMLInputElement>) {
        setListing(prev => prev ? ({ ...prev, address: e.target.value }) : prev);
        setDebounceValue(e.target.value);
    }

    useEffect(() => {
        async function registerAddress() {
            setIsRegistring(true);
            try {
                const res = await testAddress(val);
                if (res?.lat) {
                    setIsRegistered(true);
                    setIsRegistring(false);
                }
            } catch (error) {
                console.log(error);
                throw error;
            } finally {
                setIsRegistring(false);
            }
        }

        if (val.length) registerAddress();
    }, [val])

    useEffect(() => {
        async function getListing() {
            try {
                const res = await getListingById(id);
                setListing(res)
            } catch (error) {
                console.log(error);
                throw error;
            }
        }

        getListing();
    }, [])

    return (
        <section className="w-full h-full relative flex justify-center py-5 overflow-x-hidden overflow-y-scroll z-0">
            <div className="min-w-100 w-full h-full flex flex-col mx-5">
                <h2 className="text-black font-serif text-2xl font-bold flex gap-2 place-items-center sticky top-0 z-1 bg-white py-2">
                    <button
                        onClick={() => setShowMenu(prev => !prev)}
                        className='p-3 rounded-full transition cursor-pointer  hover:bg-accent-400 hover:text-white'>
                        {
                            !showMenu ? <Menu size={18} /> : <X size={18} />
                        }
                    </button>
                    <span>Edit Listings</span>
                    <button
                        onClick={() => setShowMenu(prev => !prev)}
                        className='flex place-items-center gap-1 rounded-md ml-auto p-3 text-sm transition cursor-pointer  bg-accent-400 text-white'>
                        {!isSaving && <Save size={16}></Save>}
                        <span className="md:block hidden">{isSaving ? "Saving" : "Save"}</span>
                    </button>
                </h2>
                <form className="w-full max-w-150 mx-auto h-fit flex flex-col gap-2 py-2">
                    <div className="relative h-100 ">
                        <div className="h-full flex rounded-md overflow-x-scroll snap-x snap-mandatory relative">
                            {listing?.images && listing.images.map((img, idx) => {

                                return (
                                    <img
                                        src={img.cloudinary_url}
                                        key={img.cloudinary_url + idx}
                                        className="w-full h-auto object-cover block snap-center shrink-0"
                                    />
                                );
                            })}
                        </div>
                        <div className="absolute bottom-6 right-6 gap-2 px-2 py-2 mx-3 flex flex-nowrap max-w-[180px] h-fit">
                            {listing?.images && listing.images.map((img) => {
                                return <img className="shrink-0 border-2 border-white rounded-md w-[90px] h-[60px]" src={img.cloudinary_url} />
                            })}
                        </div>
                    </div>

                    {/* Inputs */}
                    <label className="flex flex-col gap-2 w-full *:font-serif">
                        <p>Title</p>
                        <input
                            value={listing && listing.title}
                            className="w-[clamp(50% - 24px)] py-2 px-3 border border-gray-600 rounded-md"
                            type="text"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setListing(prev => prev ? ({ ...prev, title: e.target.value }) : prev)} />
                    </label>
                    <label htmlFor="address" className="flex w-full py-2 px-3 border border-gray-600 rounded-md relative">
                        <div className={`${geocodeMessage.length == 0 && "hidden"} ${geocodeMessage.includes("Fail") ? "border-danger-500 text-danger-500" : "border-green-500 text-green-500"} border-r-2 border-b-2 flex gap-2 place-items-center bg-white border-2 rounded-2xl absolute bottom-full mb-2 p-3 shadow-md font-serif text-sm`}>
                            <span className={`${geocodeMessage.includes("Fail") ? "border-danger-500 text-danger-500" : "border-green-500 text-green-500"}`} >{geocodeMessage}</span>
                            <button
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                    e.preventDefault();
                                    setGeocodeMessage("");
                                }}
                                className={`shadow-xl text-black cursor-pointer`}>
                                <X size={18} />
                            </button>

                            <div className={`${geocodeMessage.includes("Fail") ? "border-danger-500" : "border-green-500"} border-r-2 border-b-2 bg-white absolute top-[79%] rotate-z-45 w-5 h-5`}></div>
                        </div>
                        <div className="shrink-0 flex justify-center place-items-center w-7">
                            {
                                !isRegistered && !isRegistring ?
                                    <Locate size={18} /> :
                                    isRegistring ? <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /> : <Check size={18} />
                            }
                        </div>
                        <input
                            disabled={isSaving}
                            value={listing && listing.address}
                            type="text"
                            id="address"
                            className="w-full ml-3 outline-0"
                            placeholder="Address"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeAddressValue(e)} />
                    </label>
                </form>
            </div>
        </section>
    )
}

export default EditListing;