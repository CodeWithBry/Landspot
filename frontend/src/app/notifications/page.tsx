"use client"
import ListingSkeleton from "@/components/skeleton/ListingSkeleton";
import SwitchButton from "@/components/ui/SwitchButton";
import { navContext } from "@/context/NavigationProvider";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { NavigationContextType } from "@/types/NavigationContextType";
import { BellOffIcon, Menu, X } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
function Notifications() {
    const { showMenu, setShowMenu } = useContext(navContext) as NavigationContextType;
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<NotificationsType[]>([]);
    const [sortedNotifications, setSortedNotifications] = useState<SortedNotificationsType[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    async function fetchNotifs() {
        setIsFetching(true);
        try {
            if (user?.id) {
                const result = (await api.post("/api/notifications/get-notifs", { user_id: user.id })).data;
                const data = result.data as NotificationsType[];
                setNotifications([...data]);
            }
        } catch (error) {
            throw error;
        } finally { setIsFetching(false) }
    }


    function groupNotifications() {
        const notifs: NotificationsType[] = [...notifications];
        let groupedNotifs: SortedNotificationsType[] = [...sortedNotifications];
        console.log(notifs)
        notifs.forEach((notif) => {
            const label = getRelativeTime(notif);
            if (groupedNotifs.length == 0) {
                groupedNotifs = [{ label, notifications: [notif] }];
            } else {
                groupedNotifs.forEach((group, index) => {
                    if (group.label == label) {
                        groupedNotifs = groupedNotifs.map((group) => {
                            if (label == group.label) return ({
                                ...group,
                                notifications: [...group.notifications, notif],
                                label
                            });

                            return group;
                        });
                    } else if (index == groupedNotifs.length - 1 && group.label != label) {
                        groupedNotifs = [...groupedNotifs, { label, notifications: [notif] }];
                    }
                })
            }

        })
        setSortedNotifications([...groupedNotifs]);
    }

    function getRelativeTime(notif: NotificationsType): string {
        const sent_at = new Date(notif.sent_at);
        const today = new Date();

        const dateReceived = new Date(
            sent_at.getFullYear(),
            sent_at.getMonth(),
            sent_at.getDate()
        )
        const dateToday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        )

        const diff = (dateToday.getTime() - dateReceived.getTime()) / (1000 * 60 * 60 * 24);
        const label = diff == 0 ? "Today" : diff == 1 ? "Yesterday" : dateReceived.toDateString().slice(4).trim()
        return label;
    }

    useEffect(() => { fetchNotifs() }, [user?.id]);

    useEffect(() => {
        if (notifications.length != 0 && sortedNotifications.length == 0) {
            groupNotifications();
        }
    }, [notifications])

    return (<>
        <section className="w-full h-full relative flex justify-center overflow-x-hidden overflow-y-scroll z-0">
            <div
                className="min-w-70 max-w-200 w-full h-full flex flex-col mx-5 mt-5 ">
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
                <hr className="w-[97.5%] h-px text-gray-300 block mx-auto rounded-full" />

                <div className="w-full h-full flex flex-col gap-2 px-4 my-2 font-serif">
                    {
                        isFetching ? <div className="flex flex-col gap-1">
                            {Array.from({length: 5}).map((_, idx) => {
                                return <ListingSkeleton key={idx}/>
                            })}
                        </div> :
                            sortedNotifications.length > 0 ? (
                                sortedNotifications.map((group, idx) => {
                                    return <div className="w-full flex flex-col py-2 gap-2" key={idx}>
                                        <h3 className="text-md text-black font-bold">{group.label}</h3>
                                        {group.notifications.map((notif) => {
                                            return <Link
                                                className="flex gap-2 w-full max-h-20 py-2 shadow-md px-3 rounded-md hover:bg-gray-200 transition-all cursor-pointer"
                                                key={notif.id}
                                                // htmlFor={notif.id+"notif"}
                                                href={`/notifications/${notif.id}`}>
                                                {/* <Link href={`/notifications/${notif.id}`} id={notif.id+"notif"} className="hidden"/> */}
                                                <h2 className="w-10 h-10 flex place-items-center justify-center text-white rounded-full primary-gradient shrink-0">{notif.sender_name[0].toLocaleUpperCase()}</h2>
                                                <div className="w-full flex flex-col overflow-hidden">
                                                    <h3 className="text-md truncate w-[60%] shrink-0">{notif.title}</h3>
                                                    <p className="text-sm h-auto truncate w-[90%]">
                                                        <span className="font-semibold">Message: </span>
                                                        {notif.message_description}
                                                    </p>
                                                </div>
                                            </Link>
                                        })}
                                    </div>
                                })
                            ) : (
                                <div className="h-full w-full flex flex-col justify-center place-items-center">
                                    <BellOffIcon scale={1} size={30} className="text-gray-500" />
                                    <h1 className="text-xl text-center font-serif text-gray-300">There are no notifications.</h1>
                                </div>
                            )
                    }
                </div>
            </div>
        </section>
    </>);
}

export default Notifications