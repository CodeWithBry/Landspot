'use client'

import MapView from '@/components/map/MapView';
import { navContext } from '@/context/NavigationProvider';
import { useListing } from '@/hooks/useListings';
import { NavigationContextType } from '@/types/NavigationContextType';
import { Menu, Search, X } from 'lucide-react';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';

function Map() {
  const { showMenu, setShowMenu } = useContext(navContext) as NavigationContextType;
  const { listings } = useListing();
  const wrapper = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");

  useEffect(() => {
    const input = inputRef?.current
    if (!input) return

    const handleFocus = () => {
      if (wrapper.current) wrapper.current.style.width = '98%'
    }

    const handleBlur = () => {
      if (wrapper.current) wrapper.current.style.width = '300px'
    }

    input.addEventListener('focus', handleFocus)
    input.addEventListener('blur', handleBlur)

    return () => {
      input.removeEventListener('focus', handleFocus)
      input.removeEventListener('blur', handleBlur)
    }
  }, [])

  return (
    <div className="transition w-full h-full overflow-auto overflow-x-hidden relative">
      <div
        ref={wrapper}
        className='w-90 mx-2 p-2 px-3 font-serif flex place-items-center gap-2 absolute top-3 left-0 z-9999 bg-white shadow-xl rounded-xl border-px border-gray-300'
      >
        <button
          onClick={() => setShowMenu(prev => !prev)}
          className='p-3 rounded-full transition cursor-pointer  hover:bg-accent-400 hover:text-white'>
          {
            !showMenu ? <Menu size={18} /> : <X size={18} />
          }
        </button>
        <Search size={18} className='opacity-70' />
        <input 
          value={searchInput}
          ref={inputRef} 
          type="text" 
          className='w-full outline-0 font-serif text-md px-2' 
          placeholder='Type address or estate title...'
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)} />
      </div>
      <MapView listings={listings} />
    </div>
  )
}

export default Map