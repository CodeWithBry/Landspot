import { Dispatch, SetStateAction } from "react"

export type FilterOptions = {
    property_type: 'any' | 'house' | 'condo' | 'apartment' | 'lot'
    min_price: number
    max_price: number
    bedrooms: number
    bathrooms: number
    status: 'active' | 'sold' | 'inactive'
    description?: string
}

export type FilterBoxProps = {
    filterOptions: FilterOptions;
    setFilterOptions: Dispatch<SetStateAction<FilterOptions>>;
    showFilterBox: boolean;
    setShowFilterBox: Dispatch<SetStateAction<boolean>>;
    applyFilter: boolean,
    setApplyFilter: Dispatch<SetStateAction<boolean>>;
    setIslastItem: Dispatch<SetStateAction<boolean>>
    filterListings: (filterOptions: FilterOptions) => void
}