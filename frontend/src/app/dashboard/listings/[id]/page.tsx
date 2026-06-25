'use client'

import { navContext } from "@/context/NavigationProvider";
import { useDebounce } from "@/hooks/useDebounce";
import { useListing } from "@/hooks/useListings"
import { api } from "@/lib/api";
import { Listing, ListingForm, ListingImage } from "@/types/ListingType";
import { NavigationContextType } from "@/types/NavigationContextType";
import { X, Menu, Save, Locate, Check, Images } from "lucide-react";
import { register } from "module";
import { finalizeBundlerFromConfig } from "next/dist/lib/bundler";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChangeEvent, DragEvent, FormEvent, MouseEvent, useContext, useEffect, useState } from "react"
import { FormType } from "../new/page";
const properties = [
    'house', 'condo', 'apartment', 'lot'
]

function EditListing() {
    const [val, _, setDebounceValue] = useDebounce();
    const { myListings, setMyListings, updateListing, testAddress, getListingById } = useListing();
    const { setShowMenu, showMenu } = useContext(navContext) as NavigationContextType;
    const { id } = useParams<{ id: string }>();
    const [isRegistring, setIsRegistring] = useState<boolean>(false);
    const [isRegistered, setIsRegistered] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [geocodeMessage, setGeocodeMessage] = useState<string>("");
    const [listing, setListing] = useState<Listing | undefined>(myListings.find(list => list.id === id));
    const [files, setFiles] = useState<{ file: File }[]>([]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!listing) return;
        setIsSaving(true);
        try {
            const getList = await updateListing(listing, files);
            if (getList) {
                setMyListings(prev => prev.map((list) => {
                    return listing.id == getList.id ? {...getList} : list
                }));
            }
            console.log(getList)
            setListing(prev => getList ? ({...getList}) : prev)
            setFiles([]);
            setIsSaving(false);
            setIsSaved(true);
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setIsSaving(false);
        }
    }

    async function deletePhoto(e: MouseEvent<HTMLButtonElement>, image: ListingImage) {
        e.preventDefault();
        const { listing_id, cloudinary_public_id } = image;
        try {
            const getSelectedImage = listing?.images?.find((img) => img.id == image.id)
            const updatedImages: ListingImage[] | undefined = listing?.images?.filter((img) => image.id != img.id);
            const updatedList: Listing | undefined = listing && { ...listing, images: updatedImages };
            setListing(prev => prev ? updatedList : prev);
            await api.post(
                `/api/listings/delete-image/${getSelectedImage?.id}`,
                {
                    listing_id,
                    public_id: cloudinary_public_id
                }
            );
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    function revealPhoto(idx: number) {
        const container = document.querySelector("#image_container");
        if (container) {
            const getImages = container.querySelectorAll("img");
            if (getImages) getImages.forEach((e, i) => {
                if (i == idx) e.scrollIntoView({ behavior: "smooth" });
            })
        }
    }

    function handleChangeAddressValue(e: ChangeEvent<HTMLInputElement>) {
        setListing(prev => prev ? ({ ...prev, address: e.target.value }) : prev);
        setDebounceValue(e.target.value);
    }

    function handleSaveFile(files: FileList | null) {
        if (!files) return;
        let uploadedFiles: { file: File, isPreviewed: boolean }[] = [];
        const filesLength = files.length;
        for (let i = 0; i < filesLength; i++) {
            const file = files[i];
            if (file) uploadedFiles.push({ file, isPreviewed: i == 0 });
        }


        setFiles(prev => {
            const filteredDuplicateFiles = uploadedFiles.filter((img) =>
                !prev.some((i) => i.file.name == img.file.name)
            );
            return [...prev, ...filteredDuplicateFiles]
        });
    }

    function removeFromFileList(idx: number) {
        setFiles(prev => prev.filter((_, index) => index != idx))
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

    useEffect(() => {
        if (listing) {
            setIsSaved(false);
            setIsSaving(false);
        }
    }, [listing])


    return (
        <section className="w-full h-full relative flex justify-center overflow-x-hidden overflow-y-scroll z-0">
            <form
                onSubmit={handleSubmit}
                className="min-w-70 w-full h-full flex flex-col mx-5 mt-5 ">
                <h2 className="text-black font-serif text-2xl font-bold flex gap-2 place-items-center sticky top-0 z-1 bg-white py-2">
                    <button
                        onClick={() => setShowMenu(prev => !prev)}
                        className='p-3 rounded-full transition cursor-pointer hover:bg-accent-400 hover:text-white'>
                        {
                            !showMenu ? <Menu size={18} /> : <X size={18} />
                        }
                    </button>
                    <span>Edit Listings</span>
                    <Link
                        href={"/dashboard"}
                        className='flex place-items-center gap-1 rounded-md ml-auto p-3 text-sm transition cursor-pointer  bg-accent-400 text-white hover:opacity-70 active:opacity-90'>
                        Cancel
                    </Link>
                    <button
                        className='flex place-items-center gap-1 rounded-md p-3 text-sm transition cursor-pointer  bg-accent-400 text-white  hover:opacity-70 active:opacity-90'>
                        {
                            !isSaving && !isSaved ?
                                <>
                                    <Save size={16} />
                                    <span className="md:block hidden">Save</span>
                                </> :
                                isSaved ? <Check size={18} /> :
                                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        }
                    </button>
                </h2>
                <div
                    className="w-full max-w-150 mx-auto h-fit flex flex-col gap-3 py-2">
                    <div className="relative h-100">
                        <div
                            id="image_container"
                            className="h-full flex rounded-md overflow-x-auto snap-x snap-mandatory relative">
                            {listing?.images && listing.images.length > 0 ?
                            // Saved pictures
                                listing.images.map((img, idx) => {
                                    return (
                                        <img
                                            src={img.cloudinary_url}
                                            key={img.cloudinary_url + idx}
                                            className="w-full h-auto object-cover block snap-center shrink-0"
                                        />
                                    );
                                }) :
                                // Upload Container
                                <div className="w-full h-full flex justify-center items-center">
                                    <label
                                        onDragOver={(e: DragEvent<HTMLLabelElement>) => e.preventDefault()}
                                        onDrop={(e: DragEvent<HTMLLabelElement>) => {
                                            e.preventDefault();
                                            if (!e.dataTransfer.files) return;
                                            handleSaveFile(e.dataTransfer.files);
                                        }}
                                        htmlFor="fileUploader"
                                        className="w-full h-full flex flex-col place-items-center justify-center rounded-xl border-2 border-gray-500 gap-2">
                                        <input
                                            id="fileUploader"
                                            className="hidden"
                                            type="file"
                                            multiple
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSaveFile(e.target.files)}
                                        />
                                        {
                                            files.length != 0 ?
                                                <div className={`flex w-[98%] h-full mx-auto flex-col gap-2 my-2`}>
                                                    {
                                                        files.length && files.map((img, idx) => {
                                                            return <div className="flex place-items-center rounded-md gap-2 w-full px-2 py-1.5 border-2 border-gray-600">
                                                                <img src={URL.createObjectURL(img.file)} key={img.file.name + idx} className="w-10 h-10 object-fill" />
                                                                <p>{img.file.name}</p>

                                                                <button
                                                                    onClick={() => removeFromFileList(idx)}
                                                                    className="cursor-pointer w-fit h-fit px-1.5 py-px ml-auto flex justify-center place-items-center"><X size={16} /></button>
                                                            </div>
                                                        })
                                                    }

                                                </div> :
                                                <div className="flex flex-col gap-2 justify-center place-items-center w-full h-full ">
                                                    <img
                                                        src={"../../upload.svg"}
                                                        width={60} height={60} />
                                                    <p>Upload Image Here</p>
                                                </div>
                                        }
                                    </label>
                                </div>
                            }
                        </div>
                        {/* Uploaded Files Container */}
                        <div className="absolute bottom-6 right-6 gap-2 px-2 py-2 mx-3 flex flex-nowrap max-w-[180px] h-fit">
                            {listing?.images && listing.images.map((img, idx) => {
                                return <div
                                    key={img.id}
                                    className="w-fit h-fit relative">
                                    <img
                                        onClick={() => revealPhoto(idx)}
                                        className="shrink-0 border-2 border-white rounded-md w-[90px] h-[60px]"
                                        src={img.cloudinary_url} />
                                    <button
                                        onClick={(e: MouseEvent<HTMLButtonElement>) => deletePhoto(e, img)}
                                        className="absolute top-1 right-1 cursor-pointer hover:bg-accent-400 hover:text-white rounded-full p-0.5"><X size={12} /></button>
                                </div>
                            })}
                        </div>
                    </div>

                    {/* Inputs */}
                    <label className="flex flex-col gap-2 w-full *:font-serif relative">
                        <p className="text-[10px] absolute top-[-5px] text-gray-500 left-0">Title:</p>
                        <input
                            value={listing?.title ?? ""}
                            className="w-[clamp(50% - 24px)] py-2 px-3 border-0 border-b-2"
                            type="text"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setListing(prev => prev ? ({ ...prev, title: e.target.value }) : prev)} />
                    </label>
                    <label htmlFor="address" className="flex w-full py-2 px-3 border-0 border-b-2 relative">
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
                        <p className="text-[10px] absolute top-[-5px] font-serif text-gray-500 left-0">Address:</p>
                        <div className="shrink-0 flex justify-center place-items-center w-7">
                            {
                                !isRegistered && !isRegistring ?
                                    <Locate size={18} /> :
                                    isRegistring ? <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /> : <Check size={18} />
                            }
                        </div>
                        <input
                            disabled={isSaving}
                            value={listing?.address ?? ""}
                            type="text"
                            id="address"
                            className="w-full ml-3 outline-0"
                            placeholder="Address"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeAddressValue(e)} />
                    </label>
                    <label htmlFor="description" className="flex w-full relative">
                        <p className="text-[10px] absolute top-1.5 left-2 font-serif text-gray-500 left-0">Description:</p>
                        <textarea
                            id="description"
                            value={listing?.description ?? ""}
                            className="w-full pt-5 py-2 px-3 border border-gray-600 rounded-md resize-none relative"
                            placeholder="Description"
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                setListing(prev => prev ?
                                    ({ ...prev, description: e.target.value })
                                    : prev)
                            }
                            rows={5} />
                    </label>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 w-full md:flex-row flex-col">
                            <label className="flex flex-col gap-2 md:w-1/2 w-full">
                                <p>Pricing</p>
                                <input
                                    className="w-[clamp(50% - 24px)] py-2 px-3 border border-gray-600 rounded-md"
                                    type="number"
                                    value={listing?.price ?? ""}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setListing(prev =>
                                        prev ? ({ ...prev, price: Number(e.target.value) }) : prev)
                                    } />
                            </label>
                            <label className="flex flex-col gap-2 md:w-1/2 w-full">
                                <p>Property</p>
                                <select
                                    name="property_type"
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        const value = e.target.value as FormType['property_type'];
                                        setListing(prev =>
                                            prev ? ({ ...prev, property_type: value }) : prev);
                                    }}
                                    value={listing?.property_type ?? ""}
                                    className="w-[clamp(50% - 24px)] py-2 px-3 border border-gray-600 rounded-md"
                                >
                                    {properties.map((prop) => (
                                        <option key={prop} value={prop}>{prop}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="flex gap-2 w-full md:flex-row flex-col">
                            <label className="flex flex-col  md:w-1/2 w-full">
                                <p>Bedrooms</p>
                                <input
                                    className="w-[clamp(50% - 24px)] py-2 px-3 border border-gray-600 rounded-md"
                                    type="number"
                                    value={listing?.bedrooms ?? ""}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setListing(prev =>
                                        prev ? ({ ...prev, bedrooms: Number(e.target.value) }) : prev)
                                    } />
                            </label>
                            <label className="flex flex-col  md:w-1/2 w-full">
                                <p>Bathrooms</p>
                                <input
                                    className="w-[clamp(50% - 24px)] py-2 px-3 border border-gray-600 rounded-md"
                                    type="number"
                                    value={listing?.bathrooms ?? ""}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setListing(prev =>
                                            prev ? ({ ...prev, bathrooms: Number(e.target.value) }) : prev)
                                    } />
                            </label>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    )
}

export default EditListing;