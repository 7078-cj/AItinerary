function TripList({ trips, loading, onOpenTrip, onDeleteTrip, deletingTripId }) {
  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-600">Loading saved trips...</p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Saved trips</h2>
          <p className="mt-1 text-sm text-slate-600">Open, review, or delete itineraries you have saved.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {trips.length} total
        </span>
      </div>

      {trips.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
          No saved trips yet. Generate an itinerary and save it to see it here.
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {trips.map((trip) => (
            <li
              key={trip.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-base font-semibold text-slate-900">
                  {trip.destination}, {trip.country}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {trip.days} days / {trip.nights} nights · {trip.currency} {Number(trip.budget_total).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onOpenTrip(trip.id)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                >
                  Open
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTrip(trip.id)}
                  disabled={deletingTripId === trip.id}
                  className="rounded-lg border border-rose-300 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
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
