"use client"

import MyListingCard from "@/components/listings/MyListingCard";
import ListingSkeleton from "@/components/skeleton/ListingSkeleton";
import { navContext } from "@/context/NavigationProvider";
import { useListing } from "@/hooks/useListings"
import { NavigationContextType } from "@/types/NavigationContextType";
import { List, Menu, X } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";

export default function Dashboard() {
    const { myListings, deleteFromListing, isMyListingLoading } = useListing();
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
                                !showMenu ? <Menu size={18} /> : <X size={18} />
                            }
                        </button>
                        <span>Dashboard Listings</span>
                    </h2>
                    <Link href={`/dashboard/listings/new/`} className="btn text-white  bg-accent-400 hover:bg-accent-500">Create Listing</Link>
                </header>

                <div className="w-[90%] px-2 h-full relative overflow-x-hidden mx-auto flex flex-col gap-2">
                    {
                        isMyListingLoading ?
                            Array.from({ length: 5 }).map((_) => <ListingSkeleton />) :
                            myListings.length != 0 ?
                                myListings?.map((listing) => <MyListingCard key={listing.id} listing={listing} deleteFromListing={deleteFromListing} />) :
                                <div className="h-full flex flex-col place-items-center gap-2 font-serif">
                                    <div className="h-full justify-center flex flex-col place-items-center gap-2 font-serif text-gray-500">
                                        <List size={38} />
                                        <h1>There are no favorites listed above.</h1>
                                    </div>
                                </div>
                    }
                </div>
            </div>
        </section>
    </>
}