function ItineraryHeader({ trip }) {
  return (
    <header className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 p-6 text-white shadow-md">
      <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Generated Itinerary</p>
      <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
        {trip.destination}, {trip.country}
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">{trip?.vibe?.description}</p>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white/10 p-3">
          <p className="text-slate-300">Trip Duration</p>
          <p className="font-semibold text-white">
            {trip.days} days / {trip.nights} nights
          </p>
        </div>
        <div className="rounded-lg bg-white/10 p-3">
          <p className="text-slate-300">Budget</p>
          <p className="font-semibold text-white">
            {trip.currency} {trip?.budget?.total?.toLocaleString?.() ?? trip?.budget?.total}
          </p>
        </div>
        <div className="rounded-lg bg-white/10 p-3">
          <p className="text-slate-300">Hotel</p>
          <p className="font-semibold text-white">{trip?.hotel?.name}</p>
        </div>
        <div className="rounded-lg bg-white/10 p-3">
          <p className="text-slate-300">Transport</p>
          <p className="font-semibold text-white">{trip?.transportation?.type}</p>
        </div>
      </div>
    </header>
  )
}

export default ItineraryHeader
