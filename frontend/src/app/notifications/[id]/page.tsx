"use client"
import SwitchButton from '@/components/ui/SwitchButton';
import { navContext } from '@/context/NavigationProvider';
import { api } from '@/lib/api';
import { NavigationContextType } from '@/types/NavigationContextType';
import { Menu, MoveLeft, X } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react'

function MessagePreview() {
  const { id } = useParams<{ id: string }>();
  const { setShowMenu, showMenu } = useContext(navContext) as NavigationContextType;
  const [notification, setNotification] = useState<NotificationsType | null>(null);

  useEffect(() => {
    if (id != "") {
      api.get(`/api/notifications/get-notif-by-id/${id}`)
        .then((res) => {
          const data = res.data.data;
          setNotification({ ...data });
        }).catch(e => { throw e });
    }
  }, [id])

  return (
    <section className="w-full h-full relative flex justify-center overflow-x-hidden overflow-y-scroll z-0 font-serif">
      <div className='min-w-70 max-w-200 w-full h-full flex flex-col mx-5 mt-5'>
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
        </header>
        <hr className="w-[97.5%] h-px text-gray-300 block mx-auto rounded-full" />
        <header className='flex place-items-center gap-1 w-[97.5%] mx-auto p-1 bg-gray-100'>
          <Link
            href={"/notifications"}
            className='flex justify-center place-items-center p-2 hover:bg-gray-200 transition cursor-pointer rounded-full'>
            <MoveLeft size={16} scale={1} className='shrink-0' />
          </Link>
          <h2 className='text-md font-semibold max-w-[50%] h-fit truncate'>{notification?.title}</h2>
        </header>
        <hr className="w-[97.5%] h-px text-gray-300 block mx-auto rounded-full" />
        {/* MESSAGE BODY */}
        <div
          className="w-[97.5%] mx-auto"
          dangerouslySetInnerHTML={{ __html: notification?.html ?? "" }}
        />
      </div>
    </section>
  )
}

export default MessagePreview