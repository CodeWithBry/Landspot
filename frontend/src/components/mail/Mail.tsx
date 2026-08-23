import Link from "next/link"

type Props = {
    group: SortedMailType,
    idx: number
}

function Mail({ group, idx }: Props) {
    return (
        <div className="w-full flex flex-col py-2 gap-2" key={idx}>
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
    )
}

export default Mail