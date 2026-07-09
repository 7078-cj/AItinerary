import RestaurantCard from './RestaurantCard'

function MealPlanList({ meals, currency, onRestaurantClick, selectedRestaurantKey }) {
  return (
    <section className="rounded-xl border border-[#23414D] bg-[#11202A] p-4">
      <h2 className="text-base font-semibold text-[#E8F1F2]">Meal plan</h2>
      <p className="mt-1 text-xs text-[#4E6B72]">Tap a restaurant to center it on the map.</p>
      <ul className="mt-3 space-y-3">
        {meals.map((meal) => {
          const mealKey = `${meal.type}-${meal.time}-${meal.restaurant}`

          return (
            <RestaurantCard
              key={mealKey}
              meal={meal}
              currency={currency}
              isSelected={selectedRestaurantKey === mealKey}
              onRestaurantClick={onRestaurantClick}
            />
          )
        })}
      </ul>
    </section>
  )
}

export default MealPlanList