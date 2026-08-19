'use client';

import { navContext } from "@/context/NavigationProvider";
import { useAuth } from "@/hooks/useAuth";
import { NavigationContextType } from "@/types/NavigationContextType";
import { Bell, Heart, LayoutDashboard, LogIn, LogOut, LucideIcon, Map, User2, X, Menu, User, List, Users, Settings, Mail } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useMails } from "@/hooks/useMail";

type Tab = {
    tabName: string,
    tabPath: string,
    icon: LucideIcon
}

export function Sidebar() {
    const { showMenu, setShowMenu, path } = useContext(navContext) as NavigationContextType;
    const { user, logout } = useAuth();
    const { getUnseenEmailsLength } = useMails();
    const userMenuRef = useRef<HTMLDivElement | null>(null);
    const isAuthPath = path === "/login" || path === "/signup";
    const tabs: Tab[] = [
        { tabName: "Map", tabPath: "/", icon: Map },
        { tabName: "Listings", tabPath: "/listings", icon: List },
        { tabName: "Favorites", tabPath: "/favorites", icon: Heart },
        { tabName: "Dashboard", tabPath: "/dashboard", icon: LayoutDashboard },
        { tabName: "Mails", tabPath: "/mails", icon: Mail },
    ];
    const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
    const [unseenNotifs, setUnseenNotifs] = useState<number>(0);

    useClickOutside(userMenuRef, () => showUserMenu ? setShowUserMenu(false) : null);

    useEffect(() => {
        if (user?.id) {
            getUnseenEmailsLength(user.id)
                .then((res) => {
                    if (typeof res == "number") setUnseenNotifs(res);
                }).catch((error) => { throw error })
        }
    }, [user?.id])

    return (
        <div
            className={`${showMenu ? "md:w-fit w-full absolute" : !isAuthPath ? "w-fit md:relative md:flex hidden" : "relative w-0 "} md:relative h-full bg-semi-transparent z-1 flex`}>
            <div className={`${showMenu ? "w-60 px-3 border-r-2" : !isAuthPath ? "w-13.5 px-3 border-r-2 md:left-0 right-full" : "opacity-0 z-0 w-0 border-r-0"} h-full md:relative overflow z-1 flex flex-col justify-between border-r-gray-400 bg-white`}>
                <div className="flex flex-col gap-5 h-full">
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
                    <div className="overflow-x-hidden overflow-y-auto h-full mb-2 w-full relative">
                        <div className="flex flex-col h-full absolute w-full">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = tab.tabPath === path;
                                const element = <li key={tab.tabName}>
                                    <Link href={tab.tabPath} className={`flex gap-1 w-full rounded-md px-2 py-2 relative place-items-center md:text-m cursor-pointer text-md hover:text-accent-500 font-body transition-all ${isActive ? "text-white bg-accent-400 hover:text-white hover:opacity-75" : "text-black"}`}>
                                        <Icon size={15} />
                                        {showMenu ? tab.tabName : ""}

                                        {
                                            tab.tabName == "Notifications" && unseenNotifs > 0 &&
                                            <span className={`font-serif text-white bg-red-700 flex justify-center items-center rounded-full ${showMenu ? "text-sm ml-auto w-6 h-6" : "absolute top-0 right-0 text-2xs w-3 h-3"}`} >
                                                {unseenNotifs}
                                            </span>
                                        }
                                    </Link>
                                </li>

                                if ((user?.role == "agent" && tab.tabName == "Favorites")) return null;
                                else if ((user?.role == "buyer" && tab.tabName == "Dashboard")) return null;
                                else return element;
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col mb-5 gap-2 relative">
                    {
                        user?.id ?
                            <div
                                className={`relative flex justify-center place-items-center`} >
                                <div
                                    className={`${showMenu && showUserMenu ? "block translate-x-[-50%] left-[50%] bottom-full mb-1 w-full" : !showMenu && showUserMenu ? "w-fit left-full bottom-[-7.5px] ml-4" : "hidden"} absolute bg-white cursor-pointer p-px shadow-md rounded-md`}
                                    ref={userMenuRef}>
                                    <Link
                                        href={"/profile"}
                                        className={`min-w-32.5 py-2 w-full shrink-0 btn flex gap-2 text-sm hover:opacity-70 hover:bg-gray-300`}
                                        onClick={() => setShowUserMenu(prev => !prev)}>
                                        <User
                                            size={showMenu ? 18 : 15}
                                            className="shrink-0 rounded-md" />
                                        <p className={`font-semibold font-serif`}>Profile</p>
                                    </Link>
                                    <Link
                                        href={"/settings"}
                                        className={`min-w-32.5 py-2 w-full shrink-0 btn flex gap-2 text-sm hover:opacity-70 hover:bg-gray-300`}
                                        onClick={() => setShowUserMenu(prev => !prev)}>
                                        <Settings
                                            size={showMenu ? 18 : 15}
                                            className="shrink-0 rounded-md" />
                                        <p className={`font-semibold font-serif`}>Settings</p>
                                    </Link>
                                    <button
                                        onClick={() => { setShowUserMenu(false), setShowMenu(false), logout() }}
                                        className={`min-w-32.5 py-2 w-full shrink-0 btn flex gap-2 text-red-600 text-sm hover:opacity-70 hover:bg-gray-300`}
                                    >
                                        <LogOut
                                            size={showMenu ? 18 : 15}
                                            className="shrink-0 rounded-md" />
                                        <p className={`font-semibold font-serif`}>Log out</p>
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowUserMenu(prev => !prev)}
                                    className={`${showMenu ? "w-full px-3 py-2 border-2" : "w-fit justify-center"} flex shrink-0 gap-2 place-items-center   cursor-pointer relative  rounded-md`}>
                                    <img src={'/empty-profile.svg'} className="w-6.5 h-6.5 rounded-md shadow-md " />
                                    <p className={`${showMenu ? 'block' : 'hidden'} font-semibold font-serif text-xs md:text-sm truncate`}>{user?.user_name}</p>
                                </button>
                            </div>

                            :
                            <>
                                <Link
                                    onClick={() => setShowMenu(false)}
                                    href={"/signup"}
                                    className="flex gap-1 w-full px-2 py-2 place-items-center justify-center md:text-m cursor-pointer text-md hover:opacity-75 active:opacity-90 relative transition-all bg-gray-400 text-white font-serif rounded-md">
                                    <LogIn size={16} className="shrink-0" />
                                    {showMenu ? "Signup" : ""}
                                </Link>
                                <Link
                                    onClick={() => setShowMenu(false)}
                                    href={"/login"}
                                    className="flex gap-1 w-full px-2 py-2 place-items-center justify-center md:text-m cursor-pointer text-md hover:opacity-75 active:opacity-90 relative transition-all bg-accent-400 text-white font-serif rounded-md">
                                    <User2 size={16} className="shrink-0" />
                                    {showMenu ? "Login" : ""}
                                </Link>
                            </>

                    }

                </div>
            </div>
            <div className={`md:hidden w-full h-full`} onClick={() => setShowMenu(false)} />
        </div>
    )
}