"use client"
import ListingSkeleton from "@/components/skeleton/ListingSkeleton";
import SwitchButton from "@/components/ui/SwitchButton";
import { navContext } from "@/context/NavigationProvider";
import { useAuth } from "@/hooks/useAuth";
import { useMails } from "@/hooks/useMail";
import { NavigationContextType } from "@/types/NavigationContextType";
import { BellOffIcon, Menu, X } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
function Messages() {
    const { showMenu, setShowMenu, setUnseenMailsLength } = useContext(navContext) as NavigationContextType;
    const { user } = useAuth();
    const { getMails } = useMails();
    const [mails, setMails] = useState<MailType[]>([]);
    const [sortedMails, setSortedMails] = useState<SortedMailType[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    async function getMail() {
        setIsFetching(true);
        try {
            if (user?.id) {
                const result = await getMails(setUnseenMailsLength);
                if (result?.length) setMails([...result]);
            }
        } catch (error) {
            throw error;
        } finally {
            setIsFetching(false);
        }
    }

    function groupNotifications() {
        const copiedMails: MailType[] = [...mails];
        let groupedMails: SortedMailType[] = [...sortedMails];
        copiedMails.forEach((mail) => {
            const label = getRelativeTime(mail);
            if (groupedMails.length == 0) {
                groupedMails = [{ label, mails: [mail] }];
            } else {
                groupedMails.forEach((group, index) => {
                    if (group.label == label) {
                        groupedMails = groupedMails.map((group) => {
                            if (label == group.label) return ({
                                ...group,
                                mails: [...group.mails, mail],
                                label
                            });

                            return group;
                        });
                    } else if (index == groupedMails.length - 1 && group.label != label) {
                        groupedMails = [...groupedMails, { label, mails: [mail] }];
                    }
                })
            }

        })
        setSortedMails([...groupedMails]);
    }

    function getRelativeTime(mail: MailType): string {
        const sent_at = new Date(mail.sent_at);
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

    useEffect(() => { getMail() }, [user?.id]);

    useEffect(() => {
        if (mails.length != 0 && sortedMails.length == 0) {
            groupNotifications();
        }
    }, [mails])

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
                        <span>Mails</span>

                    </h2>
                    <div className="flex gap-1.5 place-items-center ml-auto text-md font-serif">
                        <SwitchButton fn={() => { }} />
                        <span className='sm:text-sm text-xs font-serif text-accent-600'>Show only unread</span>
                    </div>
                </header>
                <hr className="w-[97.5%] h-px text-gray-300 block mx-auto rounded-full" />

                <div className="w-full h-full flex flex-col gap-2 px-4 my-2 font-serif">
                    {
                        isFetching ? <div className="flex flex-col gap-5 mt-2">
                            {
                                Array.from({ length: 3 }).map((_, idx) => {
                                    return <div className="flex flex-col gap-2" key={"listing_div"+idx}>
                                        <ListingSkeleton key={idx} height={25} width={70} />
                                        {Array.from({ length: 5 }).map((_, idx) => {
                                            return <ListingSkeleton key={idx} height={60} />
                                        })}
                                    </div>
                                })
                            }
                        </div> :
                            sortedMails.length > 0 ? (
                                sortedMails.map((group, idx) => {
                                    return <div className="w-full flex flex-col py-2 gap-2" key={idx}>
                                        <h3 className="text-md text-black font-bold">{group.label}</h3>
                                        {group.mails.map((mail) => {
                                            return <Link
                                                className={`flex gap-2 w-full max-h-20 py-2 relative shadow-md px-3 rounded-md hover:bg-gray-200 transition-all cursor-pointer ${!mail.is_seen && "*:font-bold"}`}
                                                key={mail.mail_id}
                                                href={`/mails/${mail.mail_id}`}>
                                                {/* <Link href={`/mails/${mail.id}`} id={mail.id+"mail"} className="hidden"/> */}
                                                <h2 className="w-10 h-10 flex place-items-center justify-center text-white rounded-full primary-gradient shrink-0">{mail.sender_name[0].toLocaleUpperCase()}</h2>
                                                <div className="w-full flex flex-col overflow-hidden">
                                                    <h3 className="text-md truncate w-[60%] shrink-0">{mail.subject}</h3>
                                                    <p className="text-sm h-auto truncate w-[90%]">
                                                        <span className="">Message: </span>
                                                        {mail.message_description}
                                                    </p>
                                                </div>
                                                {!mail.is_seen && <div className="w-2 h-2 absolute top-2 right-2 rounded-full bg-red-600" />}
                                            </Link>
                                        })}
                                    </div>
                                })
                            ) : (
                                <div className="h-full w-full flex flex-col justify-center place-items-center">
                                    <BellOffIcon scale={1} size={30} className="text-gray-500" />
                                    <h1 className="text-xl text-center font-serif text-gray-300">There are no mails.</h1>
                                </div>
                            )
                    }
                </div>
            </div>
        </section>
    </>);
}

export default Messages