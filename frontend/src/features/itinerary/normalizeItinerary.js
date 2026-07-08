function toLatLng(point) {
  const lat = Number(point?.latitude)
  const lng = Number(point?.longitude)

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null
  }

  return [lat, lng]
}

function geometryToLatLng(geometry) {
  if (!geometry || geometry.type !== 'LineString' || !Array.isArray(geometry.coordinates)) {
    return []
  }

  return geometry.coordinates
    .map((coordinate) => {
      if (!Array.isArray(coordinate) || coordinate.length < 2) {
        return null
      }

      const [lng, lat] = coordinate
      return [Number(lat), Number(lng)]
    })
    .filter((coordinate) => coordinate && !Number.isNaN(coordinate[0]) && !Number.isNaN(coordinate[1]))
}

function normalizeDay(day) {
  const places = (day?.to_go_locations || []).map((location) => {
    const routeCoordinates = geometryToLatLng(location?.transport?.geometry)
    return {
      ...location,
      latLng: toLatLng(location),
      routeCoordinates,
    }
  })

  const restaurants = (day?.meal_plan || [])
    .map((meal) => ({
      ...meal,
      name: meal.restaurant,
      latLng: toLatLng(meal),
    }))
    .filter((meal) => meal.latLng)

  return {
    ...day,
    places,
    restaurants,
  }
}

export function normalizeItineraryResult(result) {
  const trip = result?.trip || {}
  const days = (result?.daily_itinerary || []).map(normalizeDay)

  return {
    id: result?.id ?? null,
    trip,
    days,
    budgetBreakdown: result?.budget_breakdown || null,
    travelTips: result?.travel_tips || [],
  }
}
