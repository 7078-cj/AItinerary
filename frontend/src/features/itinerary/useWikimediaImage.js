import { useEffect, useState } from 'react'

const imageCache = new Map()

async function fetchImageFromWikimedia(placeName) {
  if (!placeName) {
    return null
  }

  const cacheKey = placeName.toLowerCase()
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)
  }

  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(placeName)}`
  const response = await fetch(url)

  if (!response.ok) {
    imageCache.set(cacheKey, null)
    return null
  }

  const data = await response.json()
  const imageUrl = data?.thumbnail?.source || null
  imageCache.set(cacheKey, imageUrl)
  return imageUrl
}

export function useWikimediaImage(placeName) {
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(Boolean(placeName))

  useEffect(() => {
    let cancelled = false

    async function loadImage() {
      setLoading(true)
      try {
        const image = await fetchImageFromWikimedia(placeName)
        if (!cancelled) {
          setImageUrl(image)
        }
      } catch {
        if (!cancelled) {
          setImageUrl(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadImage()

    return () => {
      cancelled = true
    }
  }, [placeName])

  return { imageUrl, loading }
}
