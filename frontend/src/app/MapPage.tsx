'use client'

import MapView from '@/components/map/MapView';
import { navContext } from '@/context/NavigationProvider';
import { useDebounce } from '@/hooks/useDebounce';
import { useListing } from '@/hooks/useListings';
import { api } from '@/lib/api';
import { Listing } from '@/types/ListingType';
import { NavigationContextType } from '@/types/NavigationContextType';
import { LocateIcon, Menu, Search, X } from 'lucide-react';
import { ChangeEvent, Suspense, useContext, useEffect, useRef, useState } from 'react';

function MapPage({listingId}: {listingId: string | null}) {
    const [val, debounceVal, setDebounceVal] = useDebounce();
    const { showMenu, setShowMenu } = useContext(navContext) as NavigationContextType;
    const { listings, getListingById, onBoundsChange } = useListing();
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const wrapper = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [zoom, setZoom] = useState<number | null>(null);
    const [noResults, setNoResults] = useState<boolean>(false);
    const [center, setCenter] = useState<[number, number] | null>(null);
    const [results, setResults] = useState<Listing[] | null>(null);

    async function searchListing() {
        try {
            const { data } = (await api.get(`/api/listings/search/${val}`)).data;
            if (!data?.length) {
                return setNoResults(true)
            }
            setNoResults(false);
            setResults([...data]);
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async function defineListing() {
        setLoading(true);
        try {
            if (listingId == null) return;
            const listing = await getListingById(listingId);

            if (listing) {
                setCenter([listing.lat, listing.lng]);
            }
        } catch (error) {
            throw error;
        } finally { setLoading(false) }
    }

    useEffect(() => {
        if (val) searchListing()
        else setResults(null)
    }, [val])

    useEffect(() => {
        const input = inputRef?.current
        if (!input) return

        const handleFocus = () => {
            if (wrapper.current) {
                setIsFocused(true);
                wrapper.current.style.width = 'calc(100% - 16px)'
            }
        }

        const handleBlur = () => {
            if (wrapper.current) {
                setIsFocused(false);
                wrapper.current.style.width = '300px'
            }
        }

        input.addEventListener('focus', handleFocus)
        input.addEventListener('blur', handleBlur)

        return () => {
            input.removeEventListener('focus', handleFocus)
            input.removeEventListener('blur', handleBlur)
        }
    }, [])

    useEffect(() => {
        if (listingId) defineListing()
    }, [listingId])

    if (loading) {
        return <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
            <span className="text-sm text-gray-400">Loading map...</span>
        </div>
    }

    return (
        <div className="flex transition w-full h-full overflow-auto overflow-x-hidden relative z-0">
            <div
                ref={wrapper}
                className='md:w-90 w-[calc(100%_-_16px)] mx-2 p-2 px-3 font-serif flex place-items-center gap-2 absolute top-3 left-0 z-999 bg-white shadow-xl rounded-xl border-px border-gray-300'
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
                    value={debounceVal}
                    ref={inputRef}
                    type="text"
                    className='w-full outline-0 font-serif text-md px-2'
                    placeholder='Type address or estate title...'
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDebounceVal(e.target.value)} />
                <div
                    onMouseDown={(e) => e.preventDefault()}
                    className={`absolute top-full ${isFocused && val ? "flex flex-col" : "hidden"} p-3 left-0 w-[calc(100%)] max-h-[300px] h-auto shadow-xl rounded-xl bg-white`}>
                    {
                        noResults ?
                            <p className='font-serif text-md'> No Result </p> :
                            results?.map((list) => {
                                return <label
                                    htmlFor='set-center'
                                    className={`flex place-items-center gap-2 p-3 w-full left-0 bg-white hover:bg-gray-300 transition-all cursor-pointer *:text-black`}
                                    key={list.address}
                                    onClick={() => {
                                        setZoom(16)
                                        setCenter([list.lat, list.lng])
                                        setIsFocused(false)
                                    }}>
                                    <button id='set-center' className='hidden' />
                                    <img
                                        className='w-10 h-10 object-cover'
                                        src={list.images && list.images[0]?.cloudinary_url ? list.images[0].cloudinary_url : "./dummy_apartment.png"} />
                                    <div className='flex flex-col gap-px'>
                                        <h2 className='text-md'>{list.title}</h2>
                                        <p className='text-sm'>{list.address}</p>
                                    </div>

                                    <LocateIcon size={26} className='block ml-auto' />
                                </label>
                            })
                    }
                </div>
            </div>
            <MapView listings={listings} onBoundsChange={onBoundsChange} center={center} zoom={zoom} setCenter={setCenter} />
        </div>
    )
}

export default MapPage