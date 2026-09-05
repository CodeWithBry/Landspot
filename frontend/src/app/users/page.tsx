"use client"

import AgentCard from "@/components/user/UserCard";
import AgentSkeleton from "@/components/skeleton/AgentSkeleton";
import { navContext } from "@/context/NavigationProvider"
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { ProfileType } from "@/types/AuthContextType";
import { NavigationContextType } from "@/types/NavigationContextType"
import { Menu, Search, User2, X } from "lucide-react";
import { useContext, useEffect, useState } from "react"

function Users() {
    const [val, debounceVal, setDebounceVal] = useDebounce();
    const { showMenu, setShowMenu } = useContext(navContext) as NavigationContextType;
    const { getUsers, profile } = useAuth();
    const [userLists, setUserLists] = useState<ProfileType[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [isFetchingAgain, setIsFetchingAgain] = useState<boolean>(false);
    const [isLastItem, setIsLastItem] = useState<boolean>(false);

    async function fetchUsers(fetchAgain: boolean, profile_id: string | null, signal: AbortSignal) {
        fetchAgain ? setIsFetchingAgain(true) : setIsFetching(true);
        try {
            const res = await getUsers(userLists[userLists.length - 1], profile_id, signal);
            if (res?.length && !(typeof res === "string")) {
                setUserLists(prev => {
                    if (!fetchAgain) {
                        return res;
                    } else if (fetchAgain && prev) {
                        return [...prev, ...res]
                    }

                    return prev
                });
                return;
            } else if (typeof res === "string") {
                setIsLastItem(true);
                return;
            }
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            fetchAgain ? setIsFetchingAgain(false) : setIsFetching(false);
        }
    }

    useEffect(() => {
        if(!profile?.profile_id) return;
        const controller = new AbortController();

        fetchUsers(
            false,
            profile?.profile_id ?? null,
            controller.signal
        );

        return () => {
            controller.abort();
        };
    }, [profile?.profile_id])

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
                        <span>Users</span>
                    </h2>
                    <div
                        className="flex mx-2 md:ml-auto">
                        <div
                            className="flex gap-2 w-full">
                            <label
                                htmlFor="search-input"
                                className="flex items-center gap-2 w-full md:w-60 ml-auto px-3 py-1.5 border-2 rounded-md border-gray-400" >
                                <Search size={16} />
                                <input
                                    id="search-input"
                                    type="text"
                                    className="w-full text-md outline-0"
                                    placeholder="Search user's name"
                                    value={debounceVal}
                                    onChange={(e) => {
                                        setDebounceVal(e.target.value)
                                        // setFilterOptions(prev => ({ ...prev, description: e.target.value }))
                                    }} />
                            </label>
                            {/* <button
                                onClick={() => {
                                    // setShowFilterBox(prev => !prev);
                                }}
                                className="btn h-full bg-accent-400 text-white hover:opacity-70 active:opacity-90">
                                <Filter size={16} />
                                <span className="md:block hidden">Filter Options</span>
                            </button> */}
                        </div>
                    </div>
                </header>

                <div className="w-[90%] py-2 px-px h-full relative overflow-x-hidden mx-auto gap-2">
                    <div className={`w-full h-[90%] ${userLists.length > 0 && !(typeof userLists === "string") ? "grid" : "flex"} grid-cols-[repeat(auto-fill,minmax(230px,1fr))] mx-auto gap-2`}>
                        {
                            isFetching ?
                                Array.from({ length: 6 }).map((_, idx) => <AgentSkeleton key={idx} />) :
                                userLists.length > 0 && !(typeof userLists === "string") ?
                                    userLists.map((profile) =>
                                        <AgentCard key={profile.user_id} prof={profile} />) :
                                    <div className="w-full h-full flex flex-col place-items-center gap-2 font-serif">
                                        <div className="w-full h-full justify-center flex flex-col place-items-center gap-2 font-serif text-gray-500">
                                            <User2 size={38} />
                                            <h1>There are no users listed above.</h1>
                                        </div>
                                    </div>
                        }
                    </div>
                    {
                        isFetchingAgain ?
                            <div className="border-5 border-accent-500 border-b-transparent w-12 h-12 shrink-0 mx-auto block bg-transparent animate-spin rounded-full" /> :
                            isLastItem ?
                                <span className="block text-center mx-auto my-2 font-serif text-gray-400">End of the Lists.</span> :
                                <button
                                    className="btn block mx-auto my-2 border-2 border-gray-600 font-serif"
                                    onClick={() => {
                                        const controller = new AbortController();

                                        fetchUsers(
                                            true,
                                            profile?.profile_id ?? null,
                                            controller.signal
                                        );
                                    }}>
                                    Load More
                                </button>
                    }
                </div>
            </div>
        </section >
    </>
}

export default Users