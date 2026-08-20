"use client"
import MapView from "@/components/map/MapView";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { useListing } from "@/hooks/useListings";
import { api } from "@/lib/api";
import { Listing } from "@/types/ListingType";
import { Heart, HeartHandshake, HeartIcon, Send } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

type Agent = { email: string, user_name: string };

export default function ViewListing() {
    const { user } = useAuth();
    const { getListingById, onBoundsChange } = useListing();
    const { id } = useParams<{ id: string }>();
    const { handleFavoriteChange } = useFavorites();
    const [isSending, setIsSending] = useState<boolean>(false);
    const [isSent, setIsSent] = useState<boolean>(false);
    const [listing, setListing] = useState<Listing | undefined>(undefined);
    const [form, setForm] = useState<{ subject: string, message: string }>({
        subject: "",
        message: ""
    })

    const sendMessage = async () => {
        setIsSending(true);
        try {
            const subject = form.subject;
            const user_id = listing?.agent_id;
            const agent_name = listing?.agent_name;
            const agent_email = listing?.agent_email;
            const sender_email = user?.email;
            const sender_id = user?.id;
            const sender_name = user?.user_name;
            const message_description = form.message;
            const html = `
                <div style="background:#f4f4f4; padding:2rem; font-family:Arial,sans-serif;">
                    <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e0e0e0;">

                    <!-- Header -->
                    <div style="background:#185FA5; padding:1.5rem 2rem;">
                        <span style="color:#E6F1FB; font-size:20px; font-weight:600;">Landspot</span>
                    </div>

                    <!-- Body -->
                    <div style="padding:2rem;">
                        <p style="font-size:14px; color:#666; margin:0 0 1.5rem;">
                        You have received a new inquiry regarding one of your listings.
                        </p>

                        <p style="font-size:11px; font-weight:600; color:#999; text-transform:uppercase; letter-spacing:0.06em; margin:0 0 4px;">From</p>
                        <p style="font-size:14px; color:#111; margin:0 0 1.25rem;">${user?.email}</p>

                        <p style="font-size:11px; font-weight:600; color:#999; text-transform:uppercase; letter-spacing:0.06em; margin:0 0 4px;">Date</p>
                        <p style="font-size:14px; color:#111; margin:0 0 1.25rem;">${new Date().toLocaleString("en-PH", { dateStyle: "long", timeStyle: "short" })}</p>

                        <hr style="border:none; border-top:1px solid #e0e0e0; margin:1.25rem 0;" />

                        <p style="font-size:11px; font-weight:600; color:#999; text-transform:uppercase; letter-spacing:0.06em; margin:0 0 8px;">Message</p>
                        <div style="background:#f9f9f9; border-left:3px solid #185FA5; border-radius:0 6px 6px 0; padding:1rem 1.25rem; font-size:14px; line-height:1.7; color:#111;">
                        ${message_description}
                        </div>
                    </div>

                    <div style="padding:1rem 2rem; border-top:1px solid #e0e0e0; display:flex; justify-content:space-between;">
                        <span style="font-size:12px; color:#999;">This message was sent via <a href="#" style="color:#378ADD; text-decoration:none;">Landspot. </a></span>
                        <span style="font-size:12px; color:#999;">Do not reply directly to this email</span>
                    </div>

                    </div>
                </div>
                `;
            if (user_id) {
                await api.post("/api/mails/send-mail", { subject, html, message_description, agent_name, agent_email, user_id, sender_email, sender_id, sender_name });
                setIsSent(true);
            }
        } catch (error) {
            console.log(error);
            throw error
        } finally {
            setIsSending(false);
        }
    }

    const handleAddToFavorites = async () => {
        if (user && listing) {
            setListing(prev => prev ? ({ ...prev, isFavorite: !prev.isFavorite }) : prev);
            await handleFavoriteChange(listing, listing?.isFavorite);
        }
    }

    useEffect(() => {
        async function getListing() {
            try {
                const listingResult = await getListingById(id);
                if (listingResult) {
                    setListing(listingResult);
                }
            } catch (error) {
                throw error;
            }
        }

        if (id && user?.id) getListing();
        return;
    }, [id, user?.id])

    return <>
        <div className="overflow-hidden">
            <div className="transition w-full h-full overflow-auto overflow-x-hidden relative">
                {/* Image slide section */}
                <div className="w-full h-100">
                    {/* image slider */}
                    <div className="h-100 flex relative overflow-hidden overflow-x-auto">
                        <Link
                            href="/"
                            className="font-serif z-1 text-xs px-3 py-1.5 cursor-pointer rounded-md bg-accent-500 text-white hover:opacity-70 active:opacity-100 absolute right-2 top-2">Back</Link>
                        <div className="w-full h-107.5 flex overflow-x-scroll overflow-y-hidden snap-x snap-mandatory absolute translate-y-[-50%] top-[50%]">
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
                        <div className="max-h-100 h-70 rounded-2xl overflow-hidden z-0">
                            {
                                listing && <MapView listings={[listing]} onBoundsChange={onBoundsChange} locationIcon="../loc.png" center={[listing.lat, listing.lng]} />
                            }
                        </div>
                    </div>
                </div>

                <div className="*:font-serif max-w-280 w-full flex flex-col gap-2 mx-auto mb-5 px-8" >
                    <span className="text-xs text-primary-300">Contact Agent</span>
                    <div className="flex gap-2">
                        <h2 className="w-10 h-10 flex place-items-center justify-center text-white rounded-full primary-gradient">{listing?.agent_name ? listing.agent_name[0].toLocaleUpperCase() : "U"}</h2>
                        <div className="flex flex-col">
                            <p className="font-semibold">{listing?.agent_name}</p>
                            <span className="text-gray-500 text-sm">{listing?.agent_email}</span>
                        </div>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Subject"
                        value={form.subject}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setForm(prev => ({...prev, subject: e.target.value}));
                        }}
                        className="w-[clamp(100% - 24px)] py-2 px-3 border border-gray-600 rounded-md"/>
                    <textarea
                        className="w-[clamp(100% - 24px)] py-2 px-3 border border-gray-600 rounded-md resize-none"
                        placeholder="Description"
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            setForm(prev => ({...prev, message: e.target.value}));
                            setIsSent(false);
                        }}
                        rows={5} />
                    <button
                        onClick={sendMessage}
                        className="btn bg-accent-400 text-white flex justify-center place-items-center gap-2">
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
                    onClick={handleAddToFavorites}
                    title="Put this property in your favorites."
                    className="absolute bottom-5 right-5 p-3 rounded-xl text-white bg-accent-400 shadow-lg transition cursor-pointer hover:opacity-80 active:opacity-90">
                    <Heart
                        size={25}
                        fill={listing?.isFavorite ? "white" : "transparent"} />
                </button>
        </div>
    </>;
}