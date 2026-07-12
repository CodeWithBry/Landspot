import { api } from "@/lib/api";
import { Listing, ListingForm } from "@/types/ListingType";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { defineError } from "@/utils/defineError";
import { FilterOptions } from "@/types/FilterOptionsType";

export type UseListingType = {
  listings: Listing[], myListings: Listing[],
  setListings: Dispatch<SetStateAction<Listing[]>>,
  setMyListings: Dispatch<SetStateAction<Listing[]>>,
  loadingListings: boolean,
  error?: Error | string,
  addNewListing: (form: ListingForm) => Promise<Listing | undefined>,
  testAddress: (address: string) => Promise<{ lat: number, lng: number } | undefined>,
  loadListingInitially: () => Promise<Listing[] | undefined>
  loadListing: (filterOptions: FilterOptions) => Promise<Listing[] | undefined>
  searchListing: (val: string) => Promise<Listing[] | undefined>
  getListingById: (listing_id: string) => Promise<Listing | undefined>,
  uploadToCloudinary: () => void,
  deleteFromListing: (id: string, user_id: string) => void,
  updateListing: (listing: Listing, fileData: { file: File }[]) => Promise<undefined | Listing>
}

export function useListing(): UseListingType {
  const { user, isDataLoaded } = useAuth();
  const [loadingListings, setLoadingListings] = useState<boolean>(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [myListings, setMyListings] = useState<Listing[]>([]);
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

  const loadListing = async (filterOptions: FilterOptions): Promise<Listing[] | undefined> => {
    try {
      const res = await api.post('/api/listings/load-listings', { ...filterOptions });
      return [...res.data.data];
    } catch (error) {
      console.log(error)
      throw error
    }
  };

  const getListingById = async (listing_id: string): Promise<Listing | undefined> => {
    try {
      const result = await api.post("/api/listings/get-listing-by-id", { listing_id, user_id: user?.id });
      if (result.data.data) {
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
      if (fileData.length >= 0 && user?.name) {
        const formData = new FormData();
        fileData.forEach((file) => formData.append("images", file.file));
        formData.append("listing_id", listing.id)
        await api.post(`/api/cloudinary/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const { data } = (await api.post('/api/listings/get-listing-by-id', { listing_id: listing.id, user_id: user.id })).data;
        return data[0] as Listing
      } 
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const uploadToCloudinary = async () => {

  };

  const deleteFromListing = async (id: string, user_id: string) => {
    try {
      setListings(prev => {
        const updatedListings = prev.filter((list) => {
          return list.id != id;
        })
        return [...updatedListings]
      })
      setMyListings(prev => prev.filter((list) => list.id != id));

      await api.post(`/api/listings/delete-list/${id}`, { user_id: user_id });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  useEffect(() => {
    if (!isDataLoaded) return;
    setLoadingListings(true);
    api.post('/api/listings/get-listings', { targetMin: 1, targetMax: 10 })
      .then(res => {
        setListings([...res.data.data])
      })
      .catch(err => { console.log(err) })
      .finally(() => {
        if (user?.name) api.post('/api/listings/my-listing', { user })
          .then(result => {
            setMyListings(result.data.data)
          })
          .catch(err => {
            console.log(err)
            throw err
          })
          .finally(() => setLoadingListings(false));
        setLoadingListings(false)
      });
  }, [isDataLoaded, user?.id])


  return {
    listings, myListings,
    setListings, setMyListings,
    getListingById, loadingListings,
    error, addNewListing,
    testAddress, loadListingInitially,
    searchListing,
    loadListing, uploadToCloudinary,
    deleteFromListing, updateListing
  };
}