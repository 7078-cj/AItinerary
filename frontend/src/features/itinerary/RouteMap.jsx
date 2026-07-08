import { useMemo } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'

const markerStyles = {
  hotel: 'bg-indigo-600',
  restaurant: 'bg-rose-600',
  activity: 'bg-emerald-600',
}

function createMarkerIcon(kind) {
  const color = markerStyles[kind] || markerStyles.activity
  return L.divIcon({
    className: 'custom-div-marker',
    html: `<span class="block h-4 w-4 rounded-full ${color} border-2 border-white shadow"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

const mapIcons = {
  hotel: createMarkerIcon('hotel'),
  restaurant: createMarkerIcon('restaurant'),
  activity: createMarkerIcon('activity'),
}

function RouteMap({ day, hotel }) {
  const mapData = useMemo(() => {
    const markers = []
    const routeSegments = []

    const hotelPoint = hotel?.latitude && hotel?.longitude ? [hotel.latitude, hotel.longitude] : null
    if (hotelPoint) {
      markers.push({
        id: 'hotel',
        label: hotel.name,
        latLng: hotelPoint,
        kind: 'hotel',
        subtitle: 'Hotel',
      })
    }

    ;(day.restaurants || []).forEach((restaurant, index) => {
      markers.push({
        id: `restaurant-${index}-${restaurant.type}`,
        label: restaurant.name,
        latLng: restaurant.latLng,
        kind: 'restaurant',
        subtitle: `${restaurant.type} - ${restaurant.time}`,
      })
    })

    day.places.forEach((place) => {
      if (place.latLng) {
        markers.push({
          id: `place-${place.order}`,
          label: place.name,
          latLng: place.latLng,
          kind: 'activity',
          subtitle: `Stop ${place.order}`,
        })
      }

      if (place.routeCoordinates.length > 1) {
        routeSegments.push(place.routeCoordinates)
      }
    })

    if (routeSegments.length === 0) {
      const fallbackLine = markers.map((marker) => marker.latLng).filter(Boolean)
      if (fallbackLine.length > 1) {
        routeSegments.push(fallbackLine)
      }
    }

    const center = markers[0]?.latLng || [11.1800395, 119.390496]
    return { markers, routeSegments, center }
  }, [day, hotel])

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-base font-semibold text-slate-900">MapCN Routing View</h2>
        <p className="text-sm text-slate-500">Using route geometry from the itinerary payload</p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" /> Hotel
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600" /> Restaurant
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> Attraction
          </span>
        </div>
      </header>
      <div className="h-[360px] w-full">
        <MapContainer center={mapData.center} zoom={12} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {mapData.routeSegments.map((segment, index) => (
            <Polyline key={`segment-${index}`} positions={segment} pathOptions={{ color: '#047857', weight: 4 }} />
          ))}

          {mapData.markers.map((marker) => (
            <Marker key={marker.id} position={marker.latLng} icon={mapIcons[marker.kind] || mapIcons.activity}>
              <Popup>
                <p className="font-semibold">{marker.label}</p>
                <p>{marker.subtitle}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  )
}

export default RouteMap
