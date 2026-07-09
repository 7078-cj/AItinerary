import { useState } from 'react'
import { useWikimediaImage } from './useWikimediaImage'
import DetailField from './DetailField'
import { formatCurrency } from './formatCurrency'

function PlaceCard({ place, currency, isSelected, onPlaceClick }) {
  const { imageUrl, loading } = useWikimediaImage(place.name)
  const [expanded, setExpanded] = useState(false)
  const isClickable = Boolean(place.latitude && place.longitude)
  const transport = place.transport || {}

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-[#11202A] transition ${
        isSelected ? 'trip-border-primary ring-2 ring-[var(--trip-primary-soft)]' : 'border-[#23414D]'
      }`}
    >
      <button
        type="button"
        onClick={() => isClickable && onPlaceClick?.(place)}
        disabled={!isClickable}
        className={`w-full text-left transition ${
          isClickable && !isSelected ? 'hover:bg-[#16303A]' : ''
        } ${!isClickable ? 'cursor-default' : ''}`}
      >
        <div className="h-40 w-full bg-[#0A1418]">
          {imageUrl ? (
            <img src={imageUrl} alt={place.name} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-[#4E6B72]">
              {loading ? 'Finding image from Wikimedia...' : 'No image found'}
            </div>
          )}
        </div>

        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-[#E8F1F2]">{place.name}</h3>
            <span className="trip-bg-soft trip-text-primary shrink-0 rounded-full px-3 py-1 font-mono text-xs font-semibold">
              Stop {place.order}
            </span>
          </div>

          <p className="text-sm text-[#8CA7AC]">{place.description}</p>

          <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-[#C7D6D9]">
            <span>
              {place.arrival_time} → {place.departure_time}
            </span>
            <span>{place.estimated_duration_minutes} min</span>
            <span className="text-[#D9A05B]">{formatCurrency(place.estimated_cost, currency)}</span>
          </div>

          {isClickable ? (
            <p className="trip-text-primary text-xs font-medium">Tap to center this stop on the map</p>
          ) : (
            <p className="text-xs text-[#4E6B72]">Location unavailable on map</p>
          )}
        </div>
      </button>

      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="w-full border-t border-[#23414D] px-4 py-2.5 text-left text-xs font-medium text-[#8CA7AC] transition hover:text-[#2CB1A3]"
      >
        {expanded ? 'Hide details' : 'Show address, accessibility & transport'}
      </button>

      {expanded ? (
        <div className="space-y-3 border-t border-[#23414D] bg-[#0A1418] p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <DetailField label="Address" value={place.address} />
            <DetailField label="OSM Query" value={place.osm_query} />
            <DetailField label="Crowd Notes" value={place.crowd_level_notes} />
            <DetailField label="Accessibility" value={place.accessibility} />
            <DetailField label="Geocoded" value={place.geocoded ? 'Yes' : 'No'} />
          </div>

          {transport?.type ? (
            <div className="rounded-lg border border-[#23414D] bg-[#11202A] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#4E6B72]">
                Transport to next stop
              </p>
              <div className="mt-2 grid gap-2 font-mono text-xs text-[#C7D6D9] sm:grid-cols-2">
                <p>{transport.type}</p>
                <p>{transport.distance_km} km</p>
                <p>{transport.duration_minutes} min</p>
                <p>{transport.distance_meters} m</p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default PlaceCard