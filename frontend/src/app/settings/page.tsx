'use client'
import { navContext } from "@/context/NavigationProvider";
import { NavigationContextType } from "@/types/NavigationContextType";
import { Menu, X } from "lucide-react";
import { useContext } from "react";

export default function Settings() {
    const { showMenu, setShowMenu } = useContext(navContext) as NavigationContextType;

    return (<>
        <section className="w-full h-full relative flex justify-center overflow-x-hidden overflow-y-scroll z-0">
            <div
                className="min-w-70 w-full h-full flex flex-col mx-5 mt-5 ">
                <h2 className="text-black font-serif text-2xl font-bold flex gap-2 place-items-center sticky top-0 z-1 bg-white py-2">
                    <button
                        onClick={() => setShowMenu(prev => !prev)}
                        className='p-3 rounded-full transition cursor-pointer hover:bg-accent-400 hover:text-white'>
                        {
                            !showMenu ? <Menu size={18} /> : <X size={18} />
                        }
                    </button>
                    <span>Settings</span>
                </h2>
            </div>
        </section>
    </>);
}