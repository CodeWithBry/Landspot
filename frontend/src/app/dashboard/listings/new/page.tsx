'use client'
import { navContext } from "@/context/NavigationProvider";
import { useAuth } from "@/hooks/useAuth";
import { useListing } from "@/hooks/useListings";
import { api } from "@/lib/api";
import { NavigationContextType } from "@/types/NavigationContextType";
import { Check, Locate, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, DragEvent, FormEvent, MouseEvent, useContext, useEffect, useState } from "react"

export type FormType = {
    title: string
    description: string
    property_type: 'house' | 'condo' | 'apartment' | 'lot'
    price: number
    bedrooms: number
    bathrooms: number
    address: string
};

function AddListing() {
    const { addNewListing, testAddress, uploadToCloudinary } = useListing();
    const { user } = useAuth();
    const { showMenu, setShowMenu } = useContext(navContext) as NavigationContextType;
    const router = useRouter();
    const properties = [
        'house', 'condo', 'apartment', 'lot'
    ]
    const [isRegistring, setIsRegistring] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isProcesed, setIsProcessed] = useState<boolean>(false);
    const [registered, setIsRegistered] = useState<boolean>(false);
    const [coordinates, setCoordinates] = useState<{ lat: number, lng: number }>();
    const [debounceValue, setDebounceValue] = useState<string>("");
    const [geocodeMessage, setGeocodeMessage] = useState<string>("");
    const [form, setForm] = useState<FormType>({
        title: "",
        description: "",
        property_type: "apartment",
        price: 0,
        bedrooms: 0,
        bathrooms: 0,
        address: ""
    });
    const [files, setFiles] = useState<{ file: File, isPreviewed: boolean }[]>([]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const newListing = await addNewListing({ ...form, lat: coordinates?.lat, lng: coordinates?.lng });
            if (files.length && newListing?.id) {
                const formData = new FormData();
                setIsProcessing(true);
                files.map((file) => formData.append('images', file.file));
                formData.append("listing_id", newListing.id)
                await api.post(`/api/cloudinary/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            router.push("/dashboard");
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setIsProcessing(false);
            setIsProcessed(true);
        }
    }

    function removeFromFileList(idx: number) {
        setFiles(prev => prev.filter((_, index) => index != idx))
    }

    function handleChangeAddressValue(e: ChangeEvent<HTMLInputElement>) {
        setForm(prev => ({ ...prev, address: e.target.value }));
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

            console.log(filteredDuplicateFiles);
            return [...prev, ...filteredDuplicateFiles]
        });
    }

    useEffect(() => {
        if (!debounceValue) return;

        let isActive = true; // track if this effect is still valid
        setIsRegistring(true);

        const time = setTimeout(async () => {
            try {
                const res = await testAddress(debounceValue);
                if (isActive && res) {
                    console.log(res)
                    setCoordinates({ lat: res.lat, lng: res.lng });
                    setIsRegistered(true);
                    setGeocodeMessage("Address Registered.")
                }
            } catch (error) {
                setIsRegistring(false);
                setIsRegistered(false);
                setGeocodeMessage("Failed To Register Address, Please try again.")
            } finally {
                if (isActive) {
                    setIsRegistring(false);
                }
            }
        }, 1000);

        return () => {
            isActive = false;
            clearTimeout(time);
        };
    }, [debounceValue]);

    return (
        <section className="w-full h-full relative flex justify-center py-10 overflow-x-hidden overflow-y-scroll">
            <button
                onClick={() => setShowMenu(prev => !prev)}
                className='p-3 rounded-full transition cursor-pointer absolute top-3.5 left-3.5 hover:bg-accent-400 hover:text-white'>
                {
                    !showMenu ? <Menu size={18} /> : <X size={18} />
                }
            </button>
            <div className="max-w-150 min-w-100 w-full h-full flex flex-col mx-5">
                <h1 className="font-bold font-serif text-2xl mt-10 mb-4">New listing</h1>
                <form
                    className="w-full flex flex-col gap-2 py-5 *:font-serif"
                    onSubmit={handleSubmit}>
                    <label
                        onDragOver={(e: DragEvent<HTMLLabelElement>) => e.preventDefault()}
                        onDrop={(e: DragEvent<HTMLLabelElement>) => {
                            e.preventDefault();
                            if (!e.dataTransfer.files) return;
                            handleSaveFile(e.dataTransfer.files);
                        }}
                        htmlFor="fileUploader"
                        className={`${!files.length && "py-10"} max-h-62.5 overflow-hidden w-full flex flex-col justify-center place-items-center border-2 border-primary-300 border-dashed rounded-2xl`}>
                        <input
                            disabled={isProcessing}
                            className="hidden"
                            type="file"
                            id="fileUploader"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSaveFile(e.target.files)} />
                        {
                            !files.length ? <>
                                <img
                                    src={"../../upload.svg"}
                                    width={60} height={60} />
                                <p>Upload Image Here</p>
                            </> :
                                <div className={`flex w-[98%] mx-auto flex-col gap-2 my-2`}>
                                    {
                                        files.length && files.map((img, idx) => {
                                            return <div className="flex place-items-center rounded-md gap-2 w-full px-2 py-1.5 border-2 border-gray-600">
                                                <img src={URL.createObjectURL(img.file)} key={img.file.name + idx} className="w-10 h-10 object-fill" />
                                                <p>{img.file.name}</p>

                                                <button
                                                    onClick={() => removeFromFileList(idx)} 
                                                    className="cursor-pointer w-fit h-fit px-1.5 py-px ml-auto flex justify-center place-items-center"><X size={16}/></button>
                                            </div>
                                        })
                                    }

                                </div>
                        }
                    </label>
                    <input
                        disabled={isProcessing}
                        type="text"
                        className="w-[clamp(100% - 24px)] py-2 px-3 border border-gray-600 rounded-md"
                        placeholder="Title"
                        // accept="image/*"
                        multiple
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, title: e.target.value }))} />
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
                                !registered && !isRegistring ?
                                    <Locate size={18} /> :
                                    isRegistring ? <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /> : <Check size={18} />
                            }
                        </div>
                        <input
                            disabled={isProcessing}
                            type="text"
                            id="address"
                            className="w-full ml-3 outline-0"
                            placeholder="Address"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeAddressValue(e)} />
                    </label>
                    <textarea
                        className="w-[clamp(100% - 24px)] py-2 px-3 border border-gray-600 rounded-md resize-none"
                        placeholder="Description"
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm(prev => ({ ...prev, description: e.target.value }))} rows={5} />

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 w-full md:flex-row flex-col">
                            <label className="flex flex-col gap-2 md:w-1/2 w-full">
                                <p>Pricing</p>
                                <input
                                    disabled={isProcessing}
                                    className="w-[clamp(50% - 24px)] py-2 px-3 border border-gray-600 rounded-md"
                                    type="number"
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, price: Number(e.target.value) }))} />
                            </label>
                            <label className="flex flex-col gap-2 md:w-1/2 w-full">
                                <p>Property</p>
                                <select
                                    name="property_type"
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        const value = e.target.value as FormType['property_type'];
                                        setForm(prev => ({ ...prev, property_type: value }));
                                    }}
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
                                    disabled={isProcessing}
                                    className="w-[clamp(50% - 24px)] py-2 px-3 border border-gray-600 rounded-md"
                                    type="number"
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, bedrooms: Number(e.target.value) }))} />
                            </label>
                            <label className="flex flex-col  md:w-1/2 w-full">
                                <p>Bathrooms</p>
                                <input
                                    disabled={isProcessing}
                                    className="w-[clamp(50% - 24px)] py-2 px-3 border border-gray-600 rounded-md"
                                    type="number"
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, bathrooms: Number(e.target.value) }))} />
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-1 md:flex-row flex-col">
                        <Link
                            href={'/dashboard'}
                            className="btn text-center bg-gray-500 text-white opacity-80 hover:opacity-100 md:w-1/2 w-full">
                            Cancel
                        </Link>
                        <button
                            disabled={isProcessing}
                            className="btn md:w-1/2 w-full text-white flex justify-center place-items-center bg-accent-400 hover:bg-accent-500" >
                            {
                                isProcesed && !isProcessing ?
                                    <Check size={18} /> :
                                    isProcessing ? <>
                                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                    </> : "Confirm"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default AddListing