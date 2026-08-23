import { api } from "@/lib/api";
import { Listing, ListingForm } from "@/types/ListingType";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { defineError } from "@/utils/defineError";
import { FilterOptions } from "@/types/FilterOptionsType";
import { User } from "@/types/AuthContextType";
import { LatLngBounds } from "leaflet";
import { abort } from "process";
import axios from "axios";

export type UseListingType = {
  listings: Listing[],
  setListings: Dispatch<SetStateAction<Listing[]>>,
  loadingListings: boolean,
  error?: Error | string,
  addNewListing: (form: ListingForm) => Promise<Listing | undefined>,
  testAddress: (address: string) => Promise<{ lat: number, lng: number } | undefined>,
  loadListingInitially: () => Promise<Listing[] | undefined>,
  loadMyListings: (user: User, last_item: Listing | null) => Promise<Listing[] | undefined>,
  loadListing: (filterOptions: FilterOptions, search_value: string, last_item: Listing | null) => Promise<Listing[] | undefined>,
  searchListing: (val: string) => Promise<Listing[] | undefined>,
  getListingById: (listing_id: string) => Promise<Listing | undefined>,
  deleteFromListing: (id: string, user_id: string) => void,
  updateListing: (listing: Listing, fileData: { file: File }[]) => Promise<undefined | Listing>,
  onBoundsChange: (bounds: LatLngBounds) => void
}

export function useListing(): UseListingType {
  const { user, isDataLoaded } = useAuth();
  const abortController = useRef<AbortController | null>(null);
  const [loadingListings, setLoadingListings] = useState<boolean>(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [error, setError] = useState<Error | string>();

  const addNewListing = async (form: ListingForm): Promise<Listing | undefined> => {
    try {
      const result = await api.post('/api/listings/add-listing', { ...form });
      setListings(prev => [...prev, result.data.data]);
      return result.data.data;
    } catch (error) {
      setError(defineError(error))
    }
  }

  const testAddress = async (address: string): Promise<{ lat: number, lng: number } | undefined> => {
    try {
      const { data } = await api.post('/api/listings/test-address', { address });
      if (data.data?.lat) return data.data;
      return;
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  const loadListingInitially = async (): Promise<Listing[] | undefined> => {
    try {
      const res = await api.get('/api/listings/load-listings-initially');
      return [...res.data.data];
    } catch (error) {
      console.log(error)
      throw error
    }
  };

  const loadListing = async (filterOptions: FilterOptions, search_value: string, last_item: Listing | null): Promise<Listing[] | undefined> => {
    try {
      console.log(search_value)
      const res = await api.post('/api/listings/load-listings', { ...filterOptions, search_value, last_item });
      return res.data.data;
    } catch (error) {
      console.log(error)
      throw error
    }
  };

  const loadMyListings = async (user: User, last_item: Listing | null): Promise<Listing[] | undefined> => {
    try {
      const { data } = (await api.post('/api/listings/my-listing', { user, last_item })).data;
      return data;
    } catch (error) {
      throw (error);
    } finally {
    }
  }

  const getListingById = async (listing_id: string): Promise<Listing | undefined> => {
    try {
      const result = await api.post("/api/listings/get-listing-by-id", { listing_id, user_id: user?.id });
      if (result.data.data) {
        console.log(result.data.data[0])
        return result.data.data[0];
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  const searchListing = async (val: string): Promise<Listing[] | undefined> => {
    try {
      const { data } = (await api.get(`/api/listings/search/${val}`)).data;
      console.log(data)
      if (data) return data;
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  const updateListing = async (listing: Listing, fileData: { file: File }[]): Promise<undefined | Listing> => {
    try {
      await api.post(`/api/listings/update-listing`, { listing });
      setListings(prev => prev?.map((list) => list.id == listing.id ? ({ ...listing }) : list));
      if (fileData.length > 0 && user?.user_name) {
        const formData = new FormData();
        fileData.forEach((file) => formData.append("images", file.file));
        formData.append("listing_id", listing.id)
        await api.post(`/api/cloudinary/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const { data } = (await api.post('/api/listings/get-listing-by-id', { listing_id: listing.id, user_id: user.id })).data;
        return data[0] as Listing;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const deleteFromListing = async (id: string, user_id: string) => {
    try {
      setListings(prev => {
        const updatedListings = prev.filter((list) => {
          return list.id != id;
        })
        return [...updatedListings]
      })

      await api.post(`/api/listings/delete-list/${id}`, { user_id: user_id });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const onBoundsChange = useCallback(async (bounds: LatLngBounds) => {
    abortController.current?.abort();
    const controller = new AbortController();
    abortController.current = controller;
    const padded = bounds.pad(2);
    try {
      const result = await api.post("/api/listings/get-listings-onbound", {
        north: padded.getNorth(),
        south: padded.getSouth(),
        east: padded.getEast(),
        west: padded.getWest(),
      }, {
        signal: controller.signal,
      });
      const { data } = result.data;
      console.log(data)
      setListings(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return;
      }
      console.log(error)
    }
  }, [])

  useEffect(() => {
    if (!isDataLoaded) return;
    setLoadingListings(true);
  }, [isDataLoaded, user?.id])

  return {
    listings,
    setListings,
    loadingListings,
    error,
    addNewListing,
    testAddress,
    loadListingInitially,
    loadMyListings,
    loadListing,
    searchListing,
    getListingById,
    deleteFromListing,
    updateListing,
    onBoundsChange
  };
}