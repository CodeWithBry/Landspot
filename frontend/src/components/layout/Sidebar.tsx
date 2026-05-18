'use client';

import { navContext } from "@/context/NavigationProvider";
import { useAuth } from "@/hooks/useAuth";
import { NavigationContextType } from "@/types/NavigationContextType";
import { Bell, Heart, LayoutDashboard, LogIn, LogOut, LucideIcon, Map, Settings, User2, X, Menu } from "lucide-react";
import { useContext, useState } from "react";
import Link from "next/link";

type Tab = {
    tabName: string,
    tabPath: string,
    icon: LucideIcon
}

export function Sidebar() {
    const { user, logout } = useAuth();
    const { showMenu, setShowMenu, path } = useContext(navContext) as NavigationContextType;
    const isAuthPath = path === "/login" || path === "/signup";
    const tabs: Tab[] = [
        { tabName: "Map", tabPath: "/", icon: Map },
        { tabName: "Favorites", tabPath: "/favorites", icon: Heart },
        { tabName: "Dashboard", tabPath: "/dashboard", icon: LayoutDashboard },
        { tabName: "Settings", tabPath: "/settings", icon: Settings },
    ];
    const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

    return (
        <div
            className={`${showMenu ? "md:w-fit w-full absolute" : !isAuthPath ? "w-fit md:relative md:flex hidden" : "relative w-0"} md:relative  h-full bg-semi-transparent z-1 flex`}>
            <div className={`${showMenu ? "w-60 px-3 border-r-2" : !isAuthPath ? "w-13.5 px-3 border-r-2 md:left-0 right-full" : "opacity-0 z-0 w-0 border-r-0"} h-full md:relative overflow z-1 flex flex-col justify-between border-r-gray-400 bg-white`}>
                <div className="flex flex-col gap-5">
                    <h3 className={`flex text-xl font-serif font-bold mt-5 place-items-center  justify-between ${showMenu ? "text-primary-300" : "bg-primary-300 text-white justify-center place-items-center rounded-md"}`}>
                        {showMenu ? "Landspot" : "L"}
                        <button
                            onClick={() => setShowMenu(prev => !prev)}
                            className='md:hidden block p-2 rounded-full transition cursor-pointer  hover:bg-accent-400 hover:text-white'>
                            {
                                !showMenu ? <Menu size={16} /> : <X size={16} />
                            }
                        </button>
                    </h3>
                    <ul className="flex flex-col h-full items-left gap-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = tab.tabPath === path;
                            const element = <li key={tab.tabName}>
                                <Link href={tab.tabPath} className={`flex gap-1 w-full rounded-md px-2 py-2 place-items-center md:text-m cursor-pointer text-md hover:text-accent-500 font-body relative transition-all ${isActive ? "text-white bg-accent-400 hover:text-white hover:opacity-75" : "text-black"}`}>
                                    <Icon size={15} />
                                    {showMenu ? tab.tabName : ""}
                                </Link>
                            </li>

                            if ((user?.role == "agent" && tab.tabName == "Favorites")) return null;
                            else if ((user?.role == "buyer" && tab.tabName == "Dashboard")) return null;
                            else return element;
                        })}
                    </ul>
                </div>

                <div className="flex flex-col mb-5 gap-2">
                    {
                        user?.id ?
                            <div className={`relative flex justify-center place-items-center`}>
                                <div className={`${showMenu && showUserMenu ? "block translate-x-[-50%] left-[50%] bottom-full mb-1 w-full" : !showMenu && showUserMenu ? "w-fit left-full bottom-[-7.5px] ml-4" : "hidden"} absolute bg-white  border-2 cursor-pointer  border-accent-400 rounded-md`}>
                                    <Link
                                        href={"/settings"}
                                        className={`px-3 py-2 w-full shrink-0 btn flex gap-2 place-items-center text-sm hover:opacity-70 hover:bg-gray-200`}>
                                        <Settings
                                            size={showMenu ? 18 : 15}
                                            className="shrink-0 rounded-md shadow-md" />
                                        <p className={`font-semibold font-serif`}>Settings</p>
                                    </Link>
                                    <Link
                                        href={"/notifications"}
                                        className={`px-3 py-2 w-full shrink-0 btn flex gap-2 place-items-center text-sm hover:opacity-70 hover:bg-gray-200`}>
                                        <Bell
                                            size={showMenu ? 18 : 15}
                                            className="shrink-0 rounded-md shadow-md" />
                                        <p className={`font-semibold font-serif`}>Notifications</p>
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className={`px-3 py-2 w-full shrink-0 btn flex gap-2 place-items-center text-red-600 text-sm hover:opacity-70 hover:bg-gray-200`}>
                                        <LogOut
                                            size={showMenu ? 18 : 15}
                                            className="shrink-0 rounded-md shadow-md" />
                                        <p className={`font-semibold font-serif`}>Log out</p>
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowUserMenu(prev => !prev)}
                                    className={`${showMenu ? "w-full px-3 py-2 border-2" : "w-fit justify-center"} flex shrink-0 gap-2 place-items-center   cursor-pointer relative  rounded-md`}>
                                    <img src={'/empty-profile.svg'} className="w-6.5 h-6.5 rounded-md shadow-md " />
                                    <p className={`${showMenu ? 'block' : 'hidden'} font-semibold font-serif`}>{user?.name}</p>
                                </button>
                            </div>

                            :
                            <>
                                <Link
                                    href={"/signup"}
                                    className="flex gap-1 w-full px-2 py-2 place-items-center justify-center md:text-m cursor-pointer text-md hover:opacity-75 active:opacity-90 relative transition-all bg-gray-400 text-white font-serif rounded-md">
                                    <LogIn size={16} className="shrink-0" />
                                    {showMenu ? "Signup" : ""}
                                </Link>
                                <Link
                                    href={"/login"}
                                    className="flex gap-1 w-full px-2 py-2 place-items-center justify-center md:text-m cursor-pointer text-md hover:opacity-75 active:opacity-90 relative transition-all bg-accent-400 text-white font-serif rounded-md">
                                    <User2 size={16} className="shrink-0" />
                                    {showMenu ? "Login" : ""}
                                </Link>
                            </>

                    }

                </div>
            </div>
            <div className={`md:hidden w-full h-full`} onClick={() => setShowMenu(false)}/>
        </div>
    )

}