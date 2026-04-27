import { api } from "@/lib/api";
import { Listing } from "@/types/ListingType";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { Form } from "@/app/dashboard/listings/[id]/page";
import { defineError } from "@/utils/defineError";

export type UseListingType = {
  listings: Listing[], myListings: Listing[],
  setListings: Dispatch<SetStateAction<Listing[]>>,
  setMyListings: Dispatch<SetStateAction<Listing[]>>,
  loadingListings: boolean,
  error?: Error | string,
  addNewListing: (form: Form) => Promise<Listing | undefined>;
  testAddressToNominatim: (address: string) => Promise<boolean | undefined>,
  uploadToCloudinary: () => void;
}

export function useListing(): UseListingType {
  const { user, isDataLoaded } = useAuth();
  const [loadingListings, setLoadingListings] = useState<boolean>(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [error, setError] = useState<Error | string>();

  const addNewListing = async (form: Form): Promise<Listing | undefined> => {
    try {
      const result = await api.post('/api/listings/add-listing', { ...form });
      setListings(prev => [...prev, result.data.data]);
      return result.data.data;
    } catch (error) {
      setError(defineError(error))
    }
  }

  const testAddressToNominatim = async (address: string): Promise<boolean | undefined> => {
    try {
      console.log(address)
      const { data } = await api.post('/api/listings/test-address', { address });
      if (data.data == "ok") return true;
      return false;
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
      throw error
      console.log(error)
    }
  };

  const uploadToCloudinary = async () => {

  };

  useEffect(() => {
    if (!isDataLoaded) return;
    setLoadingListings(true);
    api.post('/api/listings/load-listings', { targetMin: 1, targetMax: 10 })
      .then(res => {
        setListings([...res.data.data])
      })
      .catch(err => { console.log(err) })
      .finally(() => {
        if (user?.name) api.post('/api/listings/my-listing', { user })
          .then(res => {
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

  return { listings, myListings, setListings, setMyListings, loadingListings, error, addNewListing, testAddressToNominatim, uploadToCloudinary };
}