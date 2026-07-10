import DayBudgetCard from './DayBudgetCard'
import MealPlanList from './MealPlanList'
import PlaceCard from './PlaceCard'

function DayOverview({
  day,
  currency = 'PHP',
  selectedRestaurantKey,
  selectedPlaceOrder,
  onRestaurantClick,
  onPlaceClick,
}) {
  return (
    <div className="space-y-6">
      {/* Budget */}
      <DayBudgetCard
        day={day}
        currency={currency}
      />

      {/* Meals */}
      <section className="rounded-2xl border border-[#2F5362] bg-[#142833] p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9BBCC4]">
              Meals
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              Restaurant Plan
            </h2>
          </div>

          <span className="rounded-full bg-[#0E1A20] px-3 py-1 text-xs font-semibold text-[#D1E1E5]">
            {(day.meal_plan || []).length} Meals
          </span>
        </div>

        <MealPlanList
          meals={day.meal_plan || []}
          currency={currency}
          selectedRestaurantKey={selectedRestaurantKey}
          onRestaurantClick={onRestaurantClick}
        />
      </section>

      {/* Stops */}
      <section className="rounded-2xl border border-[#2F5362] bg-[#142833] p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9BBCC4]">
              Attractions
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              Stops in Order
            </h2>
          </div>

          <span className="rounded-full bg-[#0E1A20] px-3 py-1 text-xs font-semibold text-[#D1E1E5]">
            {(day.places || []).length} Stops
          </span>
        </div>

        <div className="space-y-5">
          {(day.places || []).map((place) => (
            <PlaceCard
              key={`${day.day}-${place.order}-${place.name}`}
              place={place}
              currency={currency}
              isSelected={selectedPlaceOrder === place.order}
              onPlaceClick={onPlaceClick}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default DayOverview