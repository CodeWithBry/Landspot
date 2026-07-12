import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Listing } from '@/types/ListingType'
import { useAuth } from './useAuth'

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Listing[]>([])
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
  //     await api.post('/api/favorites', { listingId })
  //     setFavoriteIds(prev => new Set(prev).add(listingId))
  //   }
  // }

  const getFavorites = async () => {
    try {
      const results = await api.post("/api/favorites/get-favorites", { user_id: user?.id });
      if (results.data.data) {
        setFavorites(results.data.data);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const handleFavoriteChange = async (user_id: string, listing: Listing, isFavorite: boolean | undefined) => {
    const url = isFavorite ? "/api/favorites/remove" : "/api/favorites/add";
    try {
      await api.post(url, { user_id, listing });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  return { favorites, getFavorites, handleFavoriteChange };
}