"use client"

import MyListingCard from "@/components/listings/MyListingCard";
import ListingSkeleton from "@/components/skeleton/ListingSkeleton";
import { navContext } from "@/context/NavigationProvider";
import { useAuth } from "@/hooks/useAuth";
import { useListing } from "@/hooks/useListings"
import { Listing } from "@/types/ListingType";
import { NavigationContextType } from "@/types/NavigationContextType";
import { List, Menu, X } from "lucide-react";
import Link from "next/link";
import { UIEvent, use, useContext, useEffect, useRef, useState } from "react";

export default function Dashboard() {
    const { deleteFromListing, loadMyListings } = useListing();
    const { showMenu, setShowMenu } = useContext(navContext) as NavigationContextType;
    const [myListings, setMyListings] = useState<Listing[]>([]);
    const [isMyListingLoading, setIsMyListingLoading] = useState<boolean>(false);
    const [fetchingAgain, setFetchingAgain] = useState<boolean>(false);
    const { user } = useAuth();
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    async function initialFetch() {
        setIsMyListingLoading(true);
        try {
            if (user) {
                const result = await loadMyListings(user, myListings[myListings.length - 1]);
                console.log(result)
                if (result?.length) setMyListings([...result]);
            }
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setIsMyListingLoading(false);
        }
    }

    async function handleFetchOnScroll(e: UIEvent<HTMLDivElement>) {
        const element = e.currentTarget;

        const isAtBottom =
            element.scrollTop + element.clientHeight >=
            element.scrollHeight - 10;

        if (!isAtBottom) return;

        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(async () => {
            if (isMyListingLoading || !user) return;

            const lastItem = myListings.at(-1);

            if (!lastItem) return;
            setFetchingAgain(true)
            try {
                setTimeout(async () => {
                    const result = await loadMyListings(user, lastItem);
                    if(result?.length) setMyListings(prev => [...prev, ...result])
                }, 3000); 
            } catch (error) {
                console.log(error);
            } finally {
                setFetchingAgain(false)
            }
        }, 300);
    }

    useEffect(() => {
        if(user) initialFetch();
    }, [user?.id])

    return <>
        <section className="w-full h-full relative flex justify-center overflow-hidden overflow-y-auto">
            <div
                className="max-w-300 w-full h-full flex flex-col mx-5">
                <header className="flex justify-between items-center md:my-10 my-5">
                    <h2 className="text-black font-serif sm:text-2xl text-md font-bold flex sm:gap-2 gap-0.5 place-items-center">
                        <button
                            onClick={() => setShowMenu(prev => !prev)}
                            className='sm:p-3 p-1 rounded-full transition cursor-pointer  hover:bg-accent-400 hover:text-white'>
                            {
                                !showMenu ? <Menu size={18} /> : <X size={18} />
                            }
                        </button>
                        <span>Dashboard Listings</span>
                    </h2>
                    <Link href={`/dashboard/listings/new/`} className="btn text-white sm:text-lg text-xs bg-accent-400 hover:bg-accent-500">Create Listing</Link>
                </header>

                <div
                    className="w-[90%] px-2 pb-5 h-full relative overflow-x-hidden mx-auto flex flex-col gap-2"
                    onScroll={handleFetchOnScroll} >
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
                    {
                        fetchingAgain && <div className="border-5 border-accent-500 border-b-transparent w-12 h-12 shrink-0 mx-auto block bg-transparent animate-spin rounded-full" /> 
                    }
                </div>
            </div>
        </section>
    </>
}