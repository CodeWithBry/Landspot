import { useState, useEffect } from 'react'
import {api} from '@/lib/api'
import { Listing } from '@/types/ListingType'

export function useFavorites() {
  const [favorites, setFavorites] = useState<Listing[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/favorites')
      .then(res => {
        setFavorites(res.data.data)
        setFavoriteIds(new Set(res.data.data.map((l: Listing) => l.id)))
      })
      .finally(() => setLoading(false))
  }, [])

  const toggle = async (listingId: string) => {
    if (favoriteIds.has(listingId)) {
      await api.delete(`/api/favorites/${listingId}`)
      setFavoriteIds(prev => { const s = new Set(prev); s.delete(listingId); return s })
      setFavorites(prev => prev.filter(l => l.id !== listingId))
    } else {
      await api.post('/api/favorites', { listingId })
      setFavoriteIds(prev => new Set(prev).add(listingId))
    }
  }

  return { favorites, favoriteIds, toggle, loading }
}