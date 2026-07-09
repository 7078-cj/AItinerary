import { useState } from 'react'
import DetailField from './DetailField'
import { formatCurrency } from './formatCurrency'

function RestaurantCard({ meal, currency, isSelected, onRestaurantClick }) {
  const [expanded, setExpanded] = useState(false)
  const mealKey = `${meal.type}-${meal.time}-${meal.restaurant}`
  const isClickable = Boolean(meal.latitude && meal.longitude)

  return (
    <li>
      <button
        type="button"
        onClick={() => {
          if (isClickable) {
            onRestaurantClick?.(meal, mealKey)
          }
        }}
        disabled={!isClickable}
        className={`w-full rounded-lg border p-3 text-left transition ${
          isSelected
            ? 'trip-border-primary trip-bg-soft ring-2 ring-[var(--trip-primary-soft)]'
            : 'border-[#23414D] bg-[#0A1418] hover:border-[var(--trip-highlight)]'
        } ${!isClickable ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-xs text-[#8CA7AC]">
            {meal.type} · {meal.time}
          </p>
          <p className="trip-text-primary font-mono text-sm font-semibold">
            {formatCurrency(meal.estimated_cost, currency)}
          </p>
        </div>
        <p className="mt-1 text-sm font-semibold text-[#E8F1F2]">{meal.restaurant}</p>
        <p className="mt-2 text-xs text-[var(--trip-highlight)]">
          {isClickable ? 'Tap to center on map' : 'Location unavailable on map'}
        </p>
      </button>

      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="trip-text-primary mt-2 text-xs font-medium hover:opacity-80"
      >
        {expanded ? 'Hide details' : 'Show restaurant details'}
      </button>

      {expanded ? (
        <div className="mt-3 space-y-3 rounded-lg border border-[#23414D] bg-[#11202A] p-3">
          <DetailField label="Address" value={meal.address} />
          <DetailField label="OSM Query" value={meal.osm_query} />
          <DetailField
            label="Coordinates"
            value={meal.latitude && meal.longitude ? `${meal.latitude}, ${meal.longitude}` : null}
          />

          {(meal.recommended_orders || []).length > 0 ? (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#4E6B72]">
                Recommended orders
              </p>
              <ul className="mt-2 space-y-2">
                {meal.recommended_orders.map((order) => (
                  <li key={`${meal.restaurant}-${order.name}`} className="rounded-md bg-[#0A1418] p-2">
                    <p className="text-sm font-medium text-[#E8F1F2]">{order.name}</p>
                    <p className="mt-1 text-xs text-[#8CA7AC]">{order.description}</p>
                    <p className="trip-text-primary mt-1 font-mono text-xs font-semibold">
                      {formatCurrency(order.estimated_price, currency)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </li>
  )
}

export default RestaurantCard