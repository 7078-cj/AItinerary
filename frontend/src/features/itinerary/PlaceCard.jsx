import { useWikimediaImage } from './useWikimediaImage'

function PlaceCard({ place }) {
  const { imageUrl, loading } = useWikimediaImage(place.name)

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="h-40 w-full bg-slate-100">
        {imageUrl ? (
          <img src={imageUrl} alt={place.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-500">
            {loading ? 'Finding image from Wikimedia...' : 'No Wikimedia image found'}
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-slate-900">{place.name}</h3>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Stop {place.order}
          </span>
        </div>
        <p className="text-sm text-slate-600">{place.description}</p>
        <div className="grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
          <p>
            <span className="font-semibold text-slate-700">Arrival:</span> {place.arrival_time}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Departure:</span> {place.departure_time}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Duration:</span> {place.estimated_duration_minutes} min
          </p>
          <p>
            <span className="font-semibold text-slate-700">Cost:</span> PHP {place.estimated_cost}
          </p>
        </div>
      </div>
    </article>
  )
}

export default PlaceCard
