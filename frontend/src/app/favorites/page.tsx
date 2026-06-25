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

export default function Favorites() {
    const { user } = useAuth();
    const { showMenu, setShowMenu } = useContext(navContext) as NavigationContextType;
    const { favorites, getFavorites } = useFavorites();
    const [isFetching, setIsFetching] = useState<boolean>(true);

    async function handleFavoritesFetch() {
        setIsFetching(true);
        try {
            await getFavorites();
            setIsFetching(false);
        } catch (error) {
            throw error;
        } finally {
            setIsFetching(false);
        }
    }

    useEffect(() => {
        if (user?.id) handleFavoritesFetch();
    }, [user?.id])

    return <>
        <div className="w-full h-full relative flex justify-center">
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
                        <span>Favorites</span>
                    </h2>
                    <Link href={`/`} className="btn text-white flex place-items-center bg-accent-400 hover:bg-accent-500"> <Plus size={18} /> Add Favorite</Link>
                </header>

                <div className="w-[90%] h-full relative overflow-x-hidden mx-auto flex flex-col gap-2 mb-5">
                    {
                        isFetching ?
                            Array.from({ length: 5 }).map((_) => <ListingSkeleton />) :
                            favorites.length > 0 ?
                                favorites.map((listing) => <FavoriteCard key={listing.id} listing={listing} />) :
                                <div className="h-full flex flex-col place-items-center gap-2 font-serif">
                                    <div className="h-full justify-center flex flex-col place-items-center gap-2 font-serif text-gray-500">
                                        <HeartCrack size={38} />
                                        <h1>There are no favorites listed above.</h1>
                                    </div>
                                </div>
                    }
                </div>
            </div>
        </div >
    </>
}