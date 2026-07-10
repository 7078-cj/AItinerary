import { useState } from 'react'
import DetailField from './DetailField'

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/

// Picks black or white text based on the swatch's relative luminance,
// so labels stay readable against light or dark palette colors.
function getReadableTextColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#0A1418' : '#F5FAFA'
}

function AccordionSection({ id, title, isOpen, onToggle, children, badge }) {
  return (
    <section className="rounded-xl border border-[#23414D] bg-[#11202A]">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left sm:px-5"
      >
        <span className="text-sm font-semibold text-[#E8F1F2]">{title}</span>
        <span className="flex items-center gap-3">
          {badge}
          <svg
            className={`h-4 w-4 text-[#4E6B72] transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {isOpen ? <div className="border-t border-[#23414D] px-4 py-4 sm:px-5">{children}</div> : null}
    </section>
  )
}

function TripDetailsSections({ trip, budgetBreakdown, travelTips }) {
  const currency = trip.currency || 'PHP'
  const [openSections, setOpenSections] = useState(() => new Set(['trip']))

  const toggleSection = (id) => {
    setOpenSections((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="space-y-3">
      <AccordionSection id="trip" title="Trip details" isOpen={openSections.has('trip')} onToggle={toggleSection}>
        <div className="space-y-4">
          <DetailField label="Travelers" value={trip.travelers} />
          <DetailField label="Vibe mood" value={trip?.vibe?.mood} />
          <DetailField label="Photo style notes" value={trip?.vibe?.photo_style_notes} />
          <DetailField label="Group considerations" value={trip.group_considerations} />
          <DetailField label="Accessibility notes" value={trip.accessibility_notes} />

          {(trip?.vibe?.color_palette || []).length > 0 ? (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#4E6B72]">
                Color palette
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {trip.vibe.color_palette.map((color) => {
                  const isValidHex = HEX_PATTERN.test(color)
                  const swatchColor = isValidHex ? color : '#23414D'
                  const textColor = isValidHex ? getReadableTextColor(color) : '#8CA7AC'

                  return (
                    <span
                      key={color}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-medium"
                      style={{
                        backgroundColor: swatchColor,
                        color: textColor,
                        border: isValidHex ? 'none' : '1px solid #4E6B72',
                      }}
                    >
                      {color}
                    </span>
                  )
                })}
              </div>
            </div>
          ) : null}
        </div>
      </AccordionSection>

      <AccordionSection
        id="hotel"
        title="Hotel"
        badge={<span className="text-xs text-[#8CA7AC]">{trip?.hotel?.name || 'TBD'}</span>}
        isOpen={openSections.has('hotel')}
        onToggle={toggleSection}
      >
        <div className="space-y-3">
          <DetailField label="Name" value={trip?.hotel?.name} />
          <DetailField label="Type" value={trip?.hotel?.type} />
          <DetailField label="Address" value={trip?.hotel?.address} />
          <DetailField label="OSM Query" value={trip?.hotel?.osm_query} />
          <DetailField label="Estimated cost" value={`${currency} ${trip?.hotel?.estimated_cost}`} />
          <DetailField label="Accessibility" value={trip?.hotel?.accessibility} />
          <DetailField label="Geocoded" value={trip?.hotel?.geocoded ? 'Yes' : 'No'} />
        </div>
      </AccordionSection>

      <AccordionSection
        id="transport"
        title="Transportation"
        badge={<span className="text-xs text-[#8CA7AC]">{trip?.transportation?.type || 'TBD'}</span>}
        isOpen={openSections.has('transport')}
        onToggle={toggleSection}
      >
        <div className="space-y-3">
          <DetailField label="Type" value={trip?.transportation?.type} />
          <DetailField label="Recommended" value={trip?.transportation?.recommended ? 'Yes' : 'No'} />
          <DetailField
            label="Estimated carbon"
            value={
              trip?.transportation?.estimated_carbon_kg_co2
                ? `${trip.transportation.estimated_carbon_kg_co2} kg CO2`
                : null
            }
          />
          <DetailField label="Carbon comparison" value={trip?.transportation?.carbon_comparison_notes} />
        </div>
      </AccordionSection>

      {budgetBreakdown ? (
        <AccordionSection
          id="budget"
          title="Budget breakdown"
          badge={
            <span className="font-mono text-xs text-[#D9A05B]">
              {currency} {Number(budgetBreakdown.total || 0).toLocaleString()}
            </span>
          }
          isOpen={openSections.has('budget')}
          onToggle={toggleSection}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(budgetBreakdown).map(([key, value]) => (
              <div key={key} className="rounded-lg bg-[#0A1418] p-3">
                <p className="text-xs capitalize text-[#8CA7AC]">{key}</p>
                <p className="font-mono font-semibold text-[#E8F1F2]">
                  {currency} {Number(value).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </AccordionSection>
      ) : null}

      {(travelTips || []).length > 0 ? (
        <AccordionSection
          id="tips"
          title="Travel tips"
          badge={<span className="text-xs text-[#8CA7AC]">{travelTips.length}</span>}
          isOpen={openSections.has('tips')}
          onToggle={toggleSection}
        >
          <ul className="list-disc space-y-2 pl-5 text-sm text-[#C7D6D9]">
            {travelTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </AccordionSection>
      ) : null}
    </div>
  )
}

export default TripDetailsSections