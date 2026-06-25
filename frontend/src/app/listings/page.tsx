"use client"
import ListingCard from "@/components/listings/ListingCard";
import ListingSkeleton from "@/components/skeleton/ListingSkeleton";
import { navContext } from "@/context/NavigationProvider";
import { useDebounce } from "@/hooks/useDebounce";
import { useListing } from "@/hooks/useListings";
import { FilterBoxProps, type FilterOptions } from "@/types/FilterOptionsType";
import { type Listing } from "@/types/ListingType";
import { NavigationContextType } from "@/types/NavigationContextType";
import { Filter, Menu, Search, X } from "lucide-react";
import { ChangeEvent, useContext, useEffect, useState } from "react";

function Listings() {
    const { showMenu, setShowMenu } = useContext(navContext) as NavigationContextType;
    const [val, debounceVal, setDebounceVal] = useDebounce();
    const { loadListing, loadListingInitially, searchListing } = useListing();
    const [noResult, setNoResult] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [showFilterBox, setShowFilterBox] = useState<boolean>(false);
    const [applyFilter, setApplyFilter] = useState<boolean>(false);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        property_type: "any",
        min_price: 0,
        max_price: 0,
        bedrooms: 0,
        bathrooms: 0,
        status: "active"
    });
    const [listingResult, setListingResult] = useState<Listing[] | undefined | null>(null);
    const filterBoxArgs: FilterBoxProps = {
        showFilterBox, setShowFilterBox,
        filterOptions, setFilterOptions,
        setApplyFilter
    };

    async function getListings(filterOptions: FilterOptions) {
        try {
            const res = await loadListing({ ...filterOptions });
            if (res) {
                setListingResult([...res]);
                return;
            }
            setListingResult(null);
            setNoResult(true);
        } catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        if (applyFilter) getListings(filterOptions);
    }, [applyFilter, filterOptions])

    useEffect(() => {
        async function loadListing() {
            try {
                const res = await loadListingInitially();
                if (res) setListingResult([...res]);
                setIsFetching(false);
            } catch (error) {
                throw error;
            } finally {
                setIsFetching(false);
            }
        }

        if (!val) loadListing();
        else getListings(filterOptions);
    }, [val])


    return (<>
        <FilterBox {...filterBoxArgs} />
        <section className="w-full h-full relative flex justify-center overflow-hidden overflow-y-auto">
            <div className="max-w-300 w-full h-full flex flex-col mx-5">
                <header className="flex items-center gap-2 my-10">
                    <h2 className="text-black font-serif text-2xl font-bold flex gap-2 place-items-center">
                        <button
                            onClick={() => setShowMenu(prev => !prev)}
                            className='p-3 rounded-full transition cursor-pointer  hover:bg-accent-400 hover:text-white'>
                            {
                                !showMenu ? <Menu size={18} /> : <X size={18} />
                            }
                        </button>
                        <span>Listings</span>
                    </h2>
                    <label 
                        htmlFor="search-input" 
                        className="flex items-center gap-2 w-60 ml-auto px-3 py-1.5 border-2 rounded-md border-gray-400" >
                        <Search size={16} />
                        <input
                            id="search-input"
                            type="text"
                            className="md:w-full text-md outline-0"
                            placeholder="Search title, address and etc..."
                            value={debounceVal}
                            onChange={(e) => {
                                setDebounceVal(e.target.value)
                                setFilterOptions(prev => ({ ...prev, description: e.target.value }))
                            }} />
                    </label>
                    <button
                        onClick={() => setShowFilterBox(prev => !prev)}
                        className="btn h-full bg-accent-400 text-white hover:opacity-70 active:opacity-90">
                        <Filter size={16} />
                        <span className="md:block hidden">Filter Options</span>
                    </button>
                </header>
                <div className="">

                </div>

                <div className="w-[90%] py-2 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] px-2 h-full relative overflow-x-hidden mx-auto flex flex-col gap-2">
                    {
                        isFetching ?
                            Array.from({ length: 5 }).map((_, idx) => <ListingSkeleton key={idx}/>) :
                            noResult && !listingResult ?
                                <p className="text-md text-gray-700 font-serif">
                                    No existing result.
                                </p> :
                                listingResult?.map((listing) => <ListingCard key={listing.id} listing={listing} setListingResult={setListingResult} />)
                    }
                </div>
            </div>
        </section>
    </>)
}

function FilterBox({ filterOptions, setFilterOptions, showFilterBox, setShowFilterBox, setApplyFilter }: FilterBoxProps) {
    const propertyOptions: ["any", "house", "apartment", "condo", "lot"] = ["any", "house", "apartment", "condo", "lot"];
    const statusOptions: ['active', 'sold', 'inactive'] = ['active', 'sold', 'inactive'];

    function handleFilterization(bool: boolean) {
        setApplyFilter(bool);
        setShowFilterBox(false);
    }

    return (<>
        <div
            className={showFilterBox ? "absolute flex justify-center items-center w-full h-full bg-semi-transparent z-1" : "hidden"}>
            <label htmlFor="close-filter-box" className="w-full h-full absolute z-0"></label>
            <div className="w-80 h-fit px-5 py-3 flex flex-col gap-3 bg-white shadow-sm rounded-md relative z-1">
                <h3 className="flex items-center justify-between">
                    <span className="font-semibold font-serif text-lg flex items-center gap-2"> <Filter size={20} /> Filter Options </span>
                    <button
                        className="flex items-center justify-center p-2 rounded-md bg-gray-200 cursor-pointer hover:opacity-70 active:opacity-90"
                        id="close-filter-box"
                        onClick={() => setShowFilterBox(prev => !prev)}>
                        <X />
                    </button>
                </h3>
                <div className="flex flex-col gap-2">
                    <label
                        className="flex w-full items-center justify-between"
                        htmlFor="property_selector">
                        <span className="">Property type:</span>
                        <select
                            onChange={(e) => {
                                const value = e.target.value as FilterOptions["property_type"];
                                setFilterOptions(prev => ({ ...prev, property_type: value }))
                            }}
                            id="property_selector"
                            className="outline-0 border-2 border-gray-800 rounded-md px-2 py-px"
                            value={filterOptions.property_type}>
                            {propertyOptions.map((opt) => {
                                return <option
                                    key={opt}>
                                    {opt}
                                </option>
                            })}
                        </select>
                    </label>
                    <label
                        className="flex w-full items-center justify-between"
                        htmlFor="property_selector">
                        <span className="">Status:</span>
                        <select
                            onChange={(e) => {
                                const value = e.target.value as FilterOptions["status"];
                                setFilterOptions(prev => ({ ...prev, status: value }))
                            }}
                            id="property_selector"
                            className="outline-0 border-2 border-gray-800 rounded-md px-2 py-px"
                            value={filterOptions.status}>
                            {statusOptions.map((opt) => {
                                return <option
                                    key={opt}>
                                    {opt}
                                </option>
                            })}
                        </select>
                    </label>
                    <label className="flex w-full items-center justify-between">
                        <p>Bedrooms:</p>
                        <input
                            className="outline-0 w-30 border-2 border-gray-800 rounded-md px-2 py-px"
                            type="number"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterOptions(prev => ({ ...prev, bedrooms: Number(e.target.value) }))} />
                    </label>
                    <label className="flex w-full items-center justify-between">
                        <p>Bathrooms:</p>
                        <input
                            className="outline-0 border-2 w-30 border-gray-800 rounded-md px-2 py-px"
                            type="number"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterOptions(prev => ({ ...prev, bathrooms: Number(e.target.value) }))} />
                    </label>
                    <label className="flex w-full items-center justify-between">
                        <p>Minimum Price:</p>
                        <input
                            className="outline-0 border-2 w-30 border-gray-800 rounded-md px-2 py-px"
                            type="number"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterOptions(prev => ({ ...prev, min_price: Number(e.target.value) }))} />
                    </label>
                    <label className="flex w-full items-center justify-between">
                        <p>Maximum Price:</p>
                        <input
                            className="outline-0 border-2 w-30 border-gray-800 rounded-md px-2 py-px"
                            type="number"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterOptions(prev => ({ ...prev, max_price: Number(e.target.value) }))} />
                    </label>
                </div>

                <div className="flex w-full gap-2">
                    <button
                        className="btn w-full flex justify-center items-center bg-accent-400 text-white font-serif hover:opacity-70 active:opacity-90"
                        onClick={() => handleFilterization(false)}>
                        Cancel
                    </button>
                    <button
                        className="btn w-full flex justify-center items-center bg-red-500 text-white font-serif hover:opacity-70 active:opacity-90"
                        onClick={() => handleFilterization(true)}>
                        Apply
                    </button>
                </div>
            </div>
        </div>
    </>)
}

export default Listings;