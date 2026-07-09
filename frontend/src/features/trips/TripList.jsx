import { useEffect, useState } from 'react'

function TripList({ trips, loading, onOpenTrip, onDeleteTrip, deletingTripId }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (loading) {
    return (
      <section className="rounded-2xl border border-[#23414D] bg-[#11202A] p-5">
        <div className="flex items-center gap-2 text-sm text-[#8CA7AC]">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading saved trips...
        </div>
      </section>
    )
  }

  return (
    <section
      className={`rounded-2xl border border-[#23414D] bg-[#11202A] p-5 transition-all duration-500 ease-out sm:p-6 ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2CB1A3]" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8CA7AC]">Saved</p>
          </div>
          <h2 className="mt-2 text-xl font-semibold text-[#E8F1F2]">Saved trips</h2>
          <p className="mt-1 text-sm text-[#8CA7AC]">Open, review, or delete itineraries you have saved.</p>
        </div>
        <span className="rounded-full border border-[#23414D] bg-[#0A1418] px-3 py-1 text-xs font-semibold text-[#2CB1A3]">
          {trips.length} total
        </span>
      </div>

      {trips.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-[#23414D] bg-[#0A1418] px-4 py-8 text-center text-sm text-[#8CA7AC]">
          No saved trips yet. Generate an itinerary and save it to see it here.
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {trips.map((trip, index) => (
            <li
              key={trip.id}
              style={{ transitionDelay: mounted ? `${index * 60}ms` : '0ms' }}
              className={`flex flex-col gap-3 rounded-xl border border-[#23414D] bg-[#0A1418] p-4 transition-all duration-500 ease-out hover:border-[#2CB1A3]/50 sm:flex-row sm:items-center sm:justify-between ${
                mounted ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
              }`}
            >
              <div>
                <p className="text-base font-semibold text-[#E8F1F2]">
                  {trip.destination}, {trip.country}
                </p>
                <p className="mt-1 text-sm text-[#8CA7AC]">
                  {trip.days} days / {trip.nights} nights ·{' '}
                  <span className="font-mono text-[#D9A05B]">
                    {trip.currency} {Number(trip.budget_total).toLocaleString()}
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onOpenTrip(trip.id)}
                  className="rounded-lg bg-[#2CB1A3] px-4 py-2 text-sm font-medium text-[#0A1418] transition-all duration-200 hover:bg-[#25998D] active:scale-95"
                >
                  Open
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTrip(trip.id)}
                  disabled={deletingTripId === trip.id}
                  className="rounded-lg border border-rose-500/30 px-4 py-2 text-sm font-medium text-rose-400 transition-all duration-200 hover:bg-rose-500/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingTripId === trip.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default TripList