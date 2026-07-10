import { useState } from 'react'
import { useWikimediaImage } from './useWikimediaImage'
import DetailField from './DetailField'
import { formatCurrency } from './formatCurrency'

function PlaceCard({
  place,
  currency,
  isSelected,
  onPlaceClick,
}) {
  const { imageUrl, loading } = useWikimediaImage(place.name)
  const [expanded, setExpanded] = useState(false)

  const isClickable = Boolean(place.latitude && place.longitude)
  const transport = place.transport || {}

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
        isSelected
          ? 'trip-border-primary ring-2 ring-[var(--trip-primary)] shadow-[0_0_20px_var(--trip-primary-soft)]'
          : 'border-[#2F5362] bg-[#142833]'
      }`}
    >
      <button
        type="button"
        onClick={() => isClickable && onPlaceClick?.(place)}
        disabled={!isClickable}
        className={`w-full text-left transition ${
          isClickable && !isSelected
            ? 'hover:bg-[#19313D]'
            : ''
        }`}
      >
        {/* Image */}

        <div className="aspect-[16/8] w-full overflow-hidden bg-[#0E1A20]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={place.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center">
              <div>
                <p className="text-base font-medium text-[#D1E1E5]">
                  {loading
                    ? 'Finding image from Wikimedia...'
                    : 'No image available'}
                </p>

                <p className="mt-2 text-sm text-[#9BBCC4]">
                  {place.name}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}

        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-white">
                {place.name}
              </h3>
            </div>

            <span className="trip-bg-soft text-white rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Stop {place.order}
            </span>
          </div>

          <p className="leading-7 text-[#D1E1E5]">
            {place.description}
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[#EEF6F8]">
            <span>
              {place.arrival_time} → {place.departure_time}
            </span>

            <span>
              {place.estimated_duration_minutes} min
            </span>

            <span className="text-white font-semibold">
              {formatCurrency(
                place.estimated_cost,
                currency
              )}
            </span>
          </div>

          {isClickable ? (
            <p className="text-sm font-medium text-[#7FE4D9]">
              Tap to center this stop on the map
            </p>
          ) : (
            <p className="text-sm text-[#9BBCC4]">
              Location unavailable on map
            </p>
          )}
        </div>
      </button>

      {/* Expand */}

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="w-full border-t border-[#2F5362] px-5 py-3 text-left text-sm font-medium text-[#D1E1E5] transition hover:bg-[#19313D] hover:text-[#7FE4D9]"
      >
        {expanded
          ? 'Hide details'
          : 'Show address, accessibility & transport'}
      </button>

      {/* Details */}

      {expanded && (
        <div className="space-y-5 border-t border-[#2F5362] bg-[#0E1A20] p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField
              label="Address"
              value={place.address}
            />

            <DetailField
              label="OSM Query"
              value={place.osm_query}
            />

            <DetailField
              label="Crowd Notes"
              value={place.crowd_level_notes}
            />

            <DetailField
              label="Accessibility"
              value={place.accessibility}
            />

            <DetailField
              label="Coordinates"
              value={
                place.latitude && place.longitude
                  ? `${place.latitude}, ${place.longitude}`
                  : null
              }
            />

            <DetailField
              label="Geocoded"
              value={place.geocoded ? 'Yes' : 'No'}
            />
          </div>

          {transport.type && (
            <div className="rounded-xl border border-[#2F5362] bg-[#142833] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9BBCC4]">
                Transport to next stop
              </p>

              <div className="mt-4 grid gap-3 text-sm text-[#EEF6F8] sm:grid-cols-2">
                <div>
                  <p className="text-[#9BBCC4]">
                    Type
                  </p>

                  <p className="font-medium">
                    {transport.type}
                  </p>
                </div>

                <div>
                  <p className="text-[#9BBCC4]">
                    Distance
                  </p>

                  <p className="font-medium">
                    {transport.distance_km} km
                  </p>
                </div>

                <div>
                  <p className="text-[#9BBCC4]">
                    Duration
                  </p>

                  <p className="font-medium">
                    {transport.duration_minutes} min
                  </p>
                </div>

                <div>
                  <p className="text-[#9BBCC4]">
                    Walking Distance
                  </p>

                  <p className="font-medium">
                    {transport.distance_meters} m
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PlaceCard