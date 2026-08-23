"use client"
import ListingCard from "@/components/listings/ListingCard";
import ListingSkeleton from "@/components/skeleton/ListingSkeleton";
import { navContext } from "@/context/NavigationProvider";
import { useDebounce } from "@/hooks/useDebounce";
import { useListing } from "@/hooks/useListings";
import { FilterBoxProps, type FilterOptions } from "@/types/FilterOptionsType";
import { type Listing } from "@/types/ListingType";
import { NavigationContextType } from "@/types/NavigationContextType";
import { Filter, List, Menu, Search, X } from "lucide-react";
import { ChangeEvent, useContext, useEffect, useState } from "react";

function Listings() {
    const { showMenu, setShowMenu } = useContext(navContext) as NavigationContextType;
    const [val, debounceVal, setDebounceVal] = useDebounce();
    const { loadListing, loadListingInitially } = useListing();
    const [noResult, setNoResult] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [fetchingAgain, setFetchingAgain] = useState<boolean>(false);
    const [showFilterBox, setShowFilterBox] = useState<boolean>(false);
    const [applyFilter, setApplyFilter] = useState<boolean>(false);
    const [isLastItem, setIslastItem] = useState<boolean>(false);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        property_type: "any",
        min_price: 0,
        max_price: 0,
        bedrooms: 0,
        bathrooms: 0,
        status: "active"
    });
    const [listingResult, setListingResult] = useState<Listing[] | undefined | null>(null);
    const blankFilterOptions: FilterOptions = {
        property_type: "any",
        min_price: 0,
        max_price: 0,
        bedrooms: 0,
        bathrooms: 0,
        status: "active"
    }

    async function filterListings(filterOptions: FilterOptions) {
        setListingResult([]);
        setFetchingAgain(true);
        try {
            const res = await loadListing({...filterOptions}, val, null);
            if (res?.length && !(typeof res === "string")) {
                setListingResult(prev => {
                    if (prev) {
                        if (!val) return [...prev, ...res];
                        else return [...res];
                    }

                    return prev;
                });
                return;
            } else if (typeof res === "string") {
                setIslastItem(true);
                return;
            }
            setListingResult(null);
            setNoResult(true);
        } catch (error) {
            setNoResult(true);
            throw error;
        } finally {
            setFetchingAgain(false);
        }
    }

    async function getListings(filterOptions: FilterOptions) {
        setFetchingAgain(true);
        try {
            const res = await loadListing(applyFilter ? { ...filterOptions } : {...blankFilterOptions}, val, listingResult ? listingResult[listingResult?.length - 1] : null);
            if (res?.length && !(typeof res === "string")) {
                setListingResult(prev => {
                    if (prev) return [...prev, ...res];
                    return prev;
                });
                return;
            } else if (typeof res === "string") {
                setIslastItem(true);
                return;
            }
            setListingResult(null);
            setNoResult(true);
        } catch (error) {
            setNoResult(true);
            throw error;
        } finally {
            setFetchingAgain(false);
        }
    }

    useEffect(() => {
        async function loadListing() {
            try {
                const res = await loadListingInitially();
                if (res) {
                    setListingResult([...res]);
                    return;
                }
                setNoResult(true);
                setIsFetching(false);
            } catch (error) {
                setNoResult(true);
                throw error;
            } finally {
                setIsFetching(false);
            }
        }

        if (!val) loadListing();
        else {
            filterListings(filterOptions);
            setIslastItem(false);
        }
    }, [val])

    const filterBoxArgs: FilterBoxProps = {
        showFilterBox, setShowFilterBox,
        filterOptions, setFilterOptions,
        applyFilter, setApplyFilter,
        setIslastItem, filterListings
    };

    return (<>
        <FilterBox {...filterBoxArgs} />
        <section className="w-full h-full relative flex justify-center overflow-hidden overflow-y-auto">
            <div className="max-w-300 w-full h-full flex flex-col mx-5">
                <header className="flex flex-col md:flex-row md:items-center gap-2 md:my-10 my-2 mx-5">
                    <h2 className="text-black font-serif sm:text-2xl text-xl font-bold flex gap-2 place-items-center">
                        <button
                            onClick={() => setShowMenu(prev => !prev)}
                            className='p-3 rounded-full transition cursor-pointer  hover:bg-accent-400 hover:text-white'>
                            {
                                !showMenu ? <Menu size={18} /> : <X size={18} />
                            }
                        </button>
                        <span>Listings</span>
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
                                    placeholder="Search title, address and etc..."
                                    value={debounceVal}
                                    onChange={(e) => {
                                        setDebounceVal(e.target.value)
                                        setFilterOptions(prev => ({ ...prev, description: e.target.value }))
                                    }} />
                            </label>
                            <button
                                onClick={() => {
                                    setShowFilterBox(prev => !prev);
                                }}
                                className="btn h-full bg-accent-400 text-white hover:opacity-70 active:opacity-90">
                                <Filter size={16} />
                                <span className="md:block hidden">Filter Options</span>
                            </button>
                        </div>
                    </div>
                </header>
                <div className="w-[90%] py-2 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] px-px h-full relative overflow-x-hidden mx-auto flex flex-col gap-2">
                    {
                        isFetching ?
                            Array.from({ length: 5 }).map((_, idx) => <ListingSkeleton key={idx} />) :
                            (noResult && !listingResult) ?
                                <div className="h-full flex flex-col place-items-center gap-2 font-serif">
                                    <div className="h-full justify-center flex flex-col place-items-center gap-2 font-serif text-gray-500">
                                        <List size={38} />
                                        <h1>There are no favorites listed above.</h1>
                                    </div>
                                </div> :
                                listingResult?.map((listing) => <ListingCard key={listing.id} listing={listing} setListingResult={setListingResult} />)
                    }
                    {
                        fetchingAgain ?
                            <div className="border-5 border-accent-500 border-b-transparent w-12 h-12 shrink-0 mx-auto block bg-transparent animate-spin rounded-full" /> :
                            isLastItem ?
                                <span className="text-center mx-auto my-2 font-serif text-gray-400">End of the Lists.</span> : <button
                                    className="btn block mx-auto my-2 border-2 border-gray-600 font-serif"
                                    onClick={() => getListings(filterOptions)}>
                                    Load More
                                </button>
                    }
                </div>
            </div>
        </section>
    </>)
}

function FilterBox({ filterOptions, setFilterOptions, showFilterBox, setShowFilterBox, applyFilter, setApplyFilter, setIslastItem, filterListings }: FilterBoxProps) {
    const propertyOptions: ["any", "house", "apartment", "condo", "lot"] = ["any", "house", "apartment", "condo", "lot"];
    const statusOptions: ['active', 'sold', 'inactive'] = ['active', 'sold', 'inactive'];

    function handleFilterization(bool: boolean) {
        setShowFilterBox(false);
        setIslastItem(false);
        if (bool) {
            filterListings(filterOptions);
        }
    }

    return (<>
        <form
            onSubmit={(e) => e.preventDefault()}
            className={showFilterBox ? "absolute flex justify-center items-center w-full h-full bg-semi-transparent z-1" : "hidden"} >
            <label htmlFor="close-filter-box" className="w-full h-full absolute z-0"></label>
            <div className="w-80 h-fit px-5 py-3 flex flex-col gap-3 bg-white shadow-sm rounded-md relative z-1">
                <h3 className="flex items-center justify-between">
                    <span className="font-semibold font-serif text-lg flex items-center gap-2"> <Filter size={20} /> Filter Options </span>
                    <button
                        className="flex items-center justify-center p-2 rounded-md bg-gray-200 cursor-pointer hover:opacity-70 active:opacity-90"
                        id="close-filter-box"
                        onClick={() => {
                            setShowFilterBox(prev => !prev)
                            setIslastItem(false);
                        }}>
                        <X />
                    </button>
                </h3>
                <div className={`flex flex-col gap-2 relative`}>
                    <div className={`absolute top-0 left-0 bg-white w-full h-full ${!applyFilter ? "opacity-50 block" : "hidden"}`} />
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
                <label
                    htmlFor="apply-filter"
                    className="flex gap-2 w-full justify-baseline cursor-pointer">
                    <input
                        type="checkbox"
                        checked={applyFilter}
                        id="apply-filter"
                        onChange={(e) => setApplyFilter(e.target.checked)} />
                    <span className="text-xs">Apply Filter</span>
                </label>

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
        </form>
    </>)
}

export default Listings;