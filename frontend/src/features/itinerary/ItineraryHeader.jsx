import { formatCurrency } from './formatCurrency'

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/

function ItineraryHeader({ trip, theme }) {
  const palette = trip?.vibe?.color_palette ?? []
  const validHexes = palette.filter((hex) => HEX_PATTERN.test(hex))
  const accentColor = theme?.colors?.[0] || validHexes[0] || '#2CB1A3'

  // Build a low-opacity gradient wash from the palette so the header
  // reflects the trip's vibe without sacrificing text contrast.
  const paletteColors = validHexes.length > 0 ? validHexes : [accentColor]
  const backgroundGradient =
    paletteColors.length > 1
      ? `linear-gradient(135deg, ${paletteColors
          .map((hex, i) => `${hex}26 ${(i / (paletteColors.length - 1)) * 100}%`) // 26 = ~15% alpha in hex
          .join(', ')})`
      : `linear-gradient(135deg, ${paletteColors[0]}26, transparent)`

  return (
    <header
      className="relative overflow-hidden rounded-2xl border border-[#23414D] bg-[#11202A] p-6 sm:p-8"
      style={{ backgroundImage: backgroundGradient }}
    >
      {/* faint route-thread motif, decorative only */}
      <svg
        className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-20"
        preserveAspectRatio="none"
        viewBox="0 0 400 200"
      >
        <path
          d="M 0 160 C 100 140, 140 100, 220 90 C 300 80, 320 40, 400 20"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeDasharray="5 7"
        />
      </svg>

      <div className="relative z-10">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#8CA7AC]">
            Generated itinerary
          </p>
        </div>

        <h1 className="mt-2 text-2xl font-semibold text-[#E8F1F2] sm:text-3xl">
          {trip?.destination}
          {trip?.country ? `, ${trip.country}` : ''}
        </h1>

        <p className="mt-3 max-w-2xl text-sm italic leading-relaxed text-[#8CA7AC] sm:text-base">
          {trip?.vibe?.description}
        </p>

        <p className="mt-2 font-mono text-xs text-[#4E6B72]">
          {trip?.vibe?.mood} · {trip?.travelers ?? 0} traveler{trip?.travelers === 1 ? '' : 's'}
          {trip?.budget?.recommended ? ' · Recommended budget' : ''}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-[#23414D] bg-[#0A1418] p-3">
            <p className="text-[11px] uppercase tracking-wide text-[#4E6B72]">Trip duration</p>
            <p className="mt-1 font-mono text-sm font-semibold text-[#E8F1F2]">
              {trip?.days ?? '–'}d / {trip?.nights ?? '–'}n
            </p>
          </div>
          <div className="rounded-lg border border-[#23414D] bg-[#0A1418] p-3">
            <p className="text-[11px] uppercase tracking-wide text-[#4E6B72]">Budget</p>
            <p className="mt-1 font-mono text-sm font-semibold text-[#D9A05B]">
              {formatCurrency(trip?.budget?.total, trip?.currency)}
            </p>
          </div>
          <div className="rounded-lg border border-[#23414D] bg-[#0A1418] p-3">
            <p className="text-[11px] uppercase tracking-wide text-[#4E6B72]">Hotel</p>
            <p className="mt-1 truncate text-sm font-semibold text-[#E8F1F2]">
              {trip?.hotel?.name ?? 'TBD'}
            </p>
          </div>
          <div className="rounded-lg border border-[#23414D] bg-[#0A1418] p-3">
            <p className="text-[11px] uppercase tracking-wide text-[#4E6B72]">Transport</p>
            <p className="mt-1 truncate text-sm font-semibold text-[#E8F1F2]">
              {trip?.transportation?.type ?? 'TBD'}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default ItineraryHeader