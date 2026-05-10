"use client"

import ListingCard from "@/components/listings/ListingCard";
import { navContext } from "@/context/NavigationProvider";
import { useListing } from "@/hooks/useListings"
import { NavigationContextType } from "@/types/NavigationContextType";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";

export default function Dashboard() {
    const { myListings } = useListing();
    const { showMenu, setShowMenu } = useContext(navContext) as NavigationContextType;

    return <>
        <section className="w-full h-full relative flex justify-center overflow-hidden overflow-y-auto">
            <div className="max-w-300 w-full h-full flex flex-col mx-5">
                <header className="flex justify-between items-center my-10">
                    <h2 className="text-black font-serif text-2xl font-bold flex gap-2 place-items-center">
                        <button
                            onClick={() => setShowMenu(prev => !prev)}
                            className='p-3 rounded-full transition cursor-pointer  hover:bg-accent-400 hover:text-white'>
                            {
                                !showMenu  ? <Menu size={18} /> : <X size={18}/> 
                            }
                        </button>
                        <span>Dashboard Listings</span>
                    </h2>
                    <Link href={`/dashboard/listings/new/`} className="btn text-white  bg-accent-400 hover:bg-accent-500">Create Listing</Link>
                </header>

                <div className="w-[90%] h-full relative overflow-x-hidden mx-auto flex flex-col gap-2">
                    {myListings?.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
                </div>
            </div>
        </section>
    </>
}