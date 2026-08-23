import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Listing } from '@/types/ListingType'
import { useAuth } from './useAuth'

export function useFavorites() {
  const { user } = useAuth();
  // const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   api.get('/api/favorites')
  //     .then(res => {
  //       setFavorites(res.data.data)
  //       setFavoriteIds(new Set(res.data.data.map((l: Listing) => l.id)))
  //     })
  //     .finally(() => setLoading(false))
  // }, [])

  // const toggle = async (listingId: string) => {
  //   if (favoriteIds.has(listingId)) {
  //     await api.delete(`/api/favorites/${listingId}`)
  //     setFavoriteIds(prev => { const s = new Set(prev); s.delete(listingId); return s })
  //     setFavorites(prev => prev.filter(l => l.id !== listingId))
  //   } else {
  //     await api.get('/api/favorites', { listingId })
  //     setFavoriteIds(prev => new Set(prev).add(listingId))
  //   }
  // }

  const getFavorites = async (listing: Listing | null): Promise<Listing[] | undefined> => {
    try {
      const results = await api.post("/api/favorites/get-favorites", {last_item: listing});
      if (results.data.data) {
        return results.data.data as Listing[]
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const handleFavoriteChange = async (listing: Listing, isFavorite: boolean | undefined): Promise<string | undefined> => {
    const url = isFavorite ? "/api/favorites/add/" : "/api/favorites/remove/";
    try {
      const response = await api.get(url+listing.id);
      const message = response.data.data as string;
      return message;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  return { getFavorites, handleFavoriteChange };
}