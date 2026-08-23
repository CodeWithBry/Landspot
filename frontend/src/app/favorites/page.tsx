'use client'

import { navContext } from "@/context/NavigationProvider"
import { NavigationContextType } from "@/types/NavigationContextType"
import { HeartCrack, Menu, Plus, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import FavoriteCard from "@/components/listings/FavoriteCard";
import ListingSkeleton from "@/components/skeleton/ListingSkeleton";
import { Listing } from "@/types/ListingType";

export default function Favorites() {
    const { user } = useAuth();
    const { showMenu, setShowMenu } = useContext(navContext) as NavigationContextType;
    const { getFavorites, handleFavoriteChange } = useFavorites();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [isLastItem, setIsLastItem] = useState<boolean>(false);
    const [fetchingAgain, setFetchingAgain] = useState<boolean>(false);
    const [favorites, setFavorites] = useState<Listing[]>([]);

    async function handleFavoritesFetch() {
        setIsFetching(true);
        try {
            const result = await getFavorites(null);
            if (result?.map) {
                setFavorites([...result]);
            } else if (typeof result === "string") setIsLastItem(true);
        } catch (error) {
            throw error;
        } finally {
            setIsFetching(false);
        }
    }

    async function fetchMoreFavorites() {
        setFetchingAgain(true);
        try {
            const result = await getFavorites(favorites[favorites.length - 1]);
            if (result?.map) {
                setFavorites(prev => [...prev, ...result]);
            } else if (typeof result === "string") setIsLastItem(true);
        } catch (error) {
            throw error;
        } finally {
            setFetchingAgain(false);
        }
    }

    async function handleRemoveFavorite(listing: Listing) {
        try {
            await handleFavoriteChange(listing, false);
            setFavorites(prev => prev.filter((l) => listing.id != l.id));
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    useEffect(() => {
        if (user?.id) handleFavoritesFetch();
    }, [user?.id])

    return <>
        <section className="w-full h-full relative flex justify-center overflow-hidden overflow-y-auto">
            <div className="max-w-300 w-full h-full flex flex-col mx-5">
                <header className="flex justify-between items-center sm:my-10 mx-3 my-5">
                    <h2 className="text-black font-serif text-2xl font-bold flex gap-2 place-items-center">
                        <button
                            onClick={() => setShowMenu(prev => !prev)}
                            className='p-3 rounded-full transition cursor-pointer  hover:bg-accent-400 hover:text-white'>
                            {
                                !showMenu ? <Menu size={18} /> : <X size={18} />
                            }
                        </button>
                        <span>Favorites</span>
                    </h2>
                    <Link href={`/listings`} className="btn text-white flex place-items-center bg-accent-400 hover:bg-accent-500">
                        <Plus size={18} />
                        <span className="sm:block hidden">Add Favorite</span>
                    </Link>
                </header>

                <div className="w-[90%] py-2 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] px-px h-full relative overflow-x-hidden mx-auto flex flex-col gap-2">
                    {
                        isFetching ?
                            Array.from({ length: 5 }).map((_, idx) => <ListingSkeleton key={idx}/>) :
                            favorites.length > 0 && !(typeof favorites === "string") ?
                                favorites.map((listing) => 
                                    <FavoriteCard key={listing.id} listing={listing} handleRemoveFavorite={(listing: Listing) => handleRemoveFavorite(listing)} />) :
                                <div className="h-full flex flex-col place-items-center gap-2 font-serif">
                                    <div className="h-full justify-center flex flex-col place-items-center gap-2 font-serif text-gray-500">
                                        <HeartCrack size={38} />
                                        <h1>There are no favorites listed above.</h1>
                                    </div>
                                </div>
                    }
                    {
                        fetchingAgain ?
                            <div className="border-5 border-accent-500 border-b-transparent w-12 h-12 shrink-0 mx-auto block bg-transparent animate-spin rounded-full" /> :
                            isLastItem ? 
                            <span className="text-center mx-auto my-2 font-serif text-gray-400">End of the Lists.</span> :
                            <button
                                className="btn block mx-auto my-2 border-2 border-gray-600 font-serif"
                                onClick={() => fetchMoreFavorites()}>
                                Load More
                            </button>
                    }
                </div>
            </div>
        </section >
    </>
}