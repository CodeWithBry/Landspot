"use client"
import MapView from "@/components/map/MapView";
import { useListing } from "@/hooks/useListings";
import { api } from "@/lib/api";
import { Listing } from "@/types/ListingType";
import { Heart, Send } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

type Agent = { email: string, name: string };

export default function ViewListing() {
    const { getListingById } = useListing();
    const { id } = useParams<{ id: string }>();
    const [isSending, setIsSending] = useState<boolean>(false);
    const [isSent, setIsSent] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [listing, setListing] = useState<Listing | null>(null);
    const [agent, setAgent] = useState<Agent | null>(null);

    const getAgentById = async (agent_id: string): Promise<Agent | undefined> => {
        try {
            const result = (await api.get(`/api/listings/get-agent/${agent_id}`)).data.data as Agent;
            return result;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    useEffect(() => {
        async function getListing() {
            try {
                const listingResult = await getListingById(id);
                if (listingResult) {
                    setListing(listingResult);
                    const agentResult = await getAgentById(listingResult.agent_id);
                    if (agentResult) setAgent(agentResult);
                }
            } catch (error) {
                console.log(error)
                throw error;
            }
        }

        if (id) getListing();
        else return;
    }, [id])

    return <>
        <div className="overflow-hidden">
            <div className="transition w-full h-full overflow-auto overflow-x-hidden relative">
                {/* Image slide section */}
                <div className="w-full h-[400px]">
                    {/* image slider */}
                    <div className="h-[400px] flex relative overflow-hidden overflow-x-auto">
                        <Link
                            href="/"
                            className="font-serif z-1 text-xs px-3 py-1.5 cursor-pointer rounded-md bg-accent-500 text-white hover:opacity-70 active:opacity-100 absolute right-2 top-2">Back</Link>
                        <div className="w-full h-[430px] flex overflow-x-scroll overflow-y-hidden snap-x snap-mandatory absolute translate-y-[-50%] top-[50%]">
                            {listing?.images && listing.images.map((img, idx) => {
                                const src = idx === 0
                                    ? (img.cloudinary_url || "../dummy_apartment.png")
                                    : img.cloudinary_url;

                                return (
                                    <img
                                        src={src}
                                        key={img.cloudinary_url + idx}
                                        className="w-full h-full object-cover block snap-center shrink-0"
                                    />
                                );
                            })}
                        </div>

                        {/* HERO */}
                        <div className="gradient absolute bottom-0 flex justify-between p-5 w-full mask-gradient">
                            <div className="*:font-serif *:w-fit flex flex-col gap-2">
                                <span className="px-3 py-2 rounded-xl md:text-xs text-2xs text-white bg-accent-500">
                                    FOR SALE
                                </span>
                                <h2 className="md:text-xl text-sm text-gray-200 ">
                                    {listing?.title}
                                </h2>
                            </div>
                            <div className="place-items-end justify-end *:font-serif *:w-fit flex flex-col gap-1">
                                <span className="md:text-xs text-2xs text-white">
                                    LISTING PRICE
                                </span>
                                <h2 className="md:text-xl text-sm  text-warning-500">
                                    ₱{(listing?.price ? Math.floor(listing.price / 1) : 0).toLocaleString("en-US")}
                                </h2>
                                <p className="md:text-md md:text-xs text-2xs text-gray-400 text-right">
                                    Est. ₱{" "}
                                    {(listing?.price
                                        ? Math.floor(listing.price / 12)
                                        : 0
                                    ).toLocaleString("en-US")}
                                    /month
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* bottom */}
                <div className="max-w-280 w-full flex md:flex-row  mx-auto flex-col gap-5 py-3 px-8 my-5 *:font-serif">
                    <div className="flex flex-col gap-1.5 md:w-1/2 w-full">
                        <span className="text-xs text-primary-300">
                            ABOUT THIS PROPERTY
                        </span>
                        <h1 className="font-black md:text-2xl text-sm">{listing?.title}</h1>
                        <div className="*:text-gray-700 flex flex-col">
                            {
                                listing?.description.split("\n").map((text, idx) => {
                                    return <p key={text + idx}>{text} <br /></p>
                                })
                            }
                        </div>
                    </div>
                    <div className="flex flex-col md:w-1/2 w-full gap-2">
                        <span className="text-xs text-primary-300">
                            LOCATION
                        </span>
                        <h4 className="font-black text-md">Full Address: {listing?.address}</h4>
                        <div className="max-h-100 h-70 rounded-2xl overflow-hidden">
                            {
                                listing && <MapView listings={[listing]} locationIcon="../loc.png" center={[listing.lat, listing.lng]} />
                            }
                        </div>
                    </div>
                </div>

                <div className="*:font-serif max-w-280 w-full flex flex-col gap-2 mx-auto mb-5 px-8" >
                    <span className="text-xs text-primary-300">Contact Agent</span>
                    <div className="flex gap-2">
                        <h2 className="w-10 h-10 flex place-items-center justify-center text-white rounded-full primary-gradient">{agent?.name[0].toLocaleUpperCase()}</h2>
                        <div className="flex flex-col">
                            <p className="font-semibold">{agent?.name}</p>
                            <span className="text-gray-500 text-sm">{agent?.email}</span>
                        </div>
                    </div>
                    <textarea
                        className="w-[clamp(100% - 24px)] py-2 px-3 border border-gray-600 rounded-md resize-none"
                        placeholder="Description"
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                        rows={5} />
                    <button className="btn bg-accent-400 text-white flex justify-center place-items-center gap-2">
                        {
                            !isSending && !isSent ?
                                <>
                                    <Send size={18} />
                                    <span>Send Message</span>
                                </> : 
                                    isSending && !isSent ? 
                                        <div className="w-4 h-4  border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /> :
                                        <span className="text-white">Message Sent!</span>
                        }
                    </button>
                </div>
            </div>
            <button
                className="absolute bottom-5 right-5 p-3 rounded-xl text-white bg-accent-400 cursor-pointer hover:opacit-70 active:opacity-90">
                <Heart size={25} />
            </button>
        </div>
    </>;
}