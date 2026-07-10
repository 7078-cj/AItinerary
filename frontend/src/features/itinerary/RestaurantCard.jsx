import { useState } from 'react'
import DetailField from './DetailField'
import { formatCurrency } from './formatCurrency'

function RestaurantCard({
  meal,
  currency,
  isSelected,
  onRestaurantClick,
}) {
  const [expanded, setExpanded] = useState(false)

  const mealKey = `${meal.type}-${meal.time}-${meal.restaurant}`
  const isClickable = Boolean(meal.latitude && meal.longitude)

  return (
    <li className="space-y-2">
      <button
        type="button"
        onClick={() => {
          if (isClickable) {
            onRestaurantClick?.(meal, mealKey)
          }
        }}
        disabled={!isClickable}
        className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
          isSelected
            ? 'trip-border-primary trip-bg-soft ring-2 ring-[var(--trip-primary)] shadow-[0_0_18px_var(--trip-primary-soft)]'
            : 'border-[#2F5362] bg-[#0E1A20] hover:border-[var(--trip-highlight)] hover:bg-[#162730]'
        } ${!isClickable ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-wide text-[#D1E1E5]">
            {meal.type} • {meal.time}
          </p>

          <p className="text-white font-mono text-sm font-semibold">
            {formatCurrency(meal.estimated_cost, currency)}
          </p>
        </div>

        <p className="mt-2 text-base font-semibold text-white">
          {meal.restaurant}
        </p>

        <p className="mt-3 text-sm text-[#7FE4D9]">
          {isClickable
            ? 'Tap to center on map'
            : 'Location unavailable on map'}
        </p>
      </button>

      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="text-white text-sm font-medium transition hover:text-white"
      >
        {expanded ? 'Hide restaurant details' : 'Show restaurant details'}
      </button>

      {expanded && (
        <div className="space-y-4 rounded-xl border border-[#2F5362] bg-[#142833] p-4">
          <DetailField
            label="Address"
            value={meal.address}
          />

          <DetailField
            label="OSM Query"
            value={meal.osm_query}
          />

          <DetailField
            label="Coordinates"
            value={
              meal.latitude && meal.longitude
                ? `${meal.latitude}, ${meal.longitude}`
                : null
            }
          />

          {(meal.recommended_orders || []).length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9BBCC4]">
                Recommended Orders
              </p>

              <ul className="mt-3 space-y-3">
                {meal.recommended_orders.map((order) => (
                  <li
                    key={`${meal.restaurant}-${order.name}`}
                    className="rounded-lg border border-[#2F5362] bg-[#0E1A20] p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-white">
                        {order.name}
                      </p>

                      <p className="text-white font-mono text-xs font-semibold">
                        {formatCurrency(
                          order.estimated_price,
                          currency
                        )}
                      </p>
                    </div>

                    {order.description && (
                      <p className="mt-2 text-sm leading-6 text-[#D1E1E5]">
                        {order.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </li>
  )
}

export default RestaurantCard