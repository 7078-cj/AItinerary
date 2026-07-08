import MealPlanList from './MealPlanList'
import PlaceCard from './PlaceCard'
import RouteMap from './RouteMap'

function DayOverview({ day, hotel }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Day {day.day}</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">{day.theme}</h2>
          <p className="mt-2 text-sm text-slate-600">
            Budget today: <span className="font-semibold text-slate-800">PHP {day?.daily_budget?.total}</span>
          </p>
        </div>

        <MealPlanList meals={day.meal_plan || []} />

        <div className="space-y-3">
          {(day.places || []).map((place) => (
            <PlaceCard key={`${day.day}-${place.order}-${place.name}`} place={place} />
          ))}
        </div>
      </div>

      <div className="lg:sticky lg:top-5 lg:h-fit">
        <RouteMap day={day} hotel={hotel} />
      </div>
    </section>
  )
}

export default DayOverview
