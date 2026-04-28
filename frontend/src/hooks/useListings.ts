import { api } from "@/lib/api";
import { Listing, ListingForm } from "@/types/ListingType";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { defineError } from "@/utils/defineError";

export type UseListingType = {
  listings: Listing[], myListings: Listing[],
  setListings: Dispatch<SetStateAction<Listing[]>>,
  setMyListings: Dispatch<SetStateAction<Listing[]>>,
  loadingListings: boolean,
  error?: Error | string,
  addNewListing: (form: ListingForm) => Promise<Listing | undefined>;
  testAddress: (address: string) => Promise<{ lat: number, lng: number } | undefined>,
  getListingById: (listing_id: string) => Promise<Listing | undefined>
  uploadToCloudinary: () => void;
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

  const loadListing = async (targetMin: number, targetMax: number): Promise<Listing[] | undefined> => {
    try {
      const res = await api.post('/api/listings/load-listings', { targetMin, targetMax })
      setListings(prev => [...prev, ...res.data.data]);
      return;
    } catch (error) {
      console.log(error)
      throw error
    }
  };

  const getListingById = async (listing_id: string): Promise<Listing | undefined> => {
    try {
      const result = await api.post("/api/listings/get-listing-by-id", listing_id);
      if(result.data.data) {
        return result.data.data;
      }
      return;
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  const uploadToCloudinary = async () => {

  };

  useEffect(() => {
    if (!isDataLoaded) return;
    setLoadingListings(true);
    api.post('/api/listings/get-listings', { targetMin: 1, targetMax: 10 })
      .then(res => {
        console.log(res.data.data)
        setListings([...res.data.data])
      })
      .catch(err => { console.log(err) })
      .finally(() => {
        if (user?.name) api.post('/api/listings/my-listing', { user })
          .then(res => {
            console.log(myListings)
            setMyListings(res.data.data)
          })
          .catch(err => {
            console.log(err)
            throw err
          })
          .finally(() => setLoadingListings(false));
        setLoadingListings(false)
      });
  }, [isDataLoaded, user?.id])

  return { listings, myListings, setListings, setMyListings, getListingById, loadingListings, error, addNewListing, testAddress, uploadToCloudinary };
}