"use client"
import SwitchButton from "@/components/ui/SwitchButton";
import { navContext } from "@/context/NavigationProvider";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { NavigationContextType } from "@/types/NavigationContextType";
import { Menu, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
function Notifications() {
    const { showMenu, setShowMenu } = useContext(navContext) as NavigationContextType;
    const { user } = useAuth();
    const [notifcations, setNotifications] = useState<NotificationsType[]>([]);

    async function fetchNotifs() {
        try {
            if (user?.id) {
                const res = await api.post("/api/notifications/get-notifs", { user_id: user.id }) as NotificationsType[];
                setNotifications(res);
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    useEffect(() => { fetchNotifs() }, [user?.id]);

    return (<>
        <section className="w-full h-full relative flex justify-center overflow-x-hidden overflow-y-scroll z-0">
            <div
                className="min-w-70 w-full h-full flex flex-col mx-5 mt-5 ">
                <header className="flex w-full justify-between">
                    <h2 className="text-black font-serif sm:text-2xl text-lg font-bold flex gap-2 place-items-center sticky top-0 z-1 bg-white py-2">
                        <button
                            onClick={() => setShowMenu(prev => !prev)}
                            className='sm:p-3 p-1 rounded-full transition cursor-pointer hover:bg-accent-400 hover:text-white'>
                            {
                                !showMenu ? <Menu size={18} /> : <X size={18} />
                            }
                        </button>
                        <span>Notifications</span>

                    </h2>
                    <div className="flex gap-1.5 place-items-center ml-auto text-md font-serif">
                        <SwitchButton fn={() => { }} />
                        <span className='sm:text-sm text-xs font-serif text-accent-600'>Show only unread</span>
                    </div>
                </header>
                <hr className="w-[95%] h-px text-gray-300 block mx-auto rounded-full" />
                <div className="flex flex-col gap-2">

                </div>
            </div>
        </section>
    </>);
}

export default Notifications