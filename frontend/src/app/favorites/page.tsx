'use client'

import { navContext } from "@/context/NavigationProvider"
import { NavigationContextType } from "@/types/NavigationContextType"
import { Menu, Plus, X } from "lucide-react";
import { useContext } from "react";
import Link from "next/link";

export default function Favorites() {
    const { showMenu, setShowMenu } = useContext(navContext) as NavigationContextType;
    3
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

                <div className="w-[90%] h-full relative overflow-x-hidden mx-auto flex flex-col gap-2">
                    {/* {myListings?.map((listing) => <ListingCard key={listing.id} listing={listing} />)} */}
                </div>
            </div>
        </div>
    </>
}