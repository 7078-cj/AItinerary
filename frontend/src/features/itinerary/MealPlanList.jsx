function MealPlanList({ meals }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Meal Plan</h2>
      <ul className="mt-3 space-y-3">
        {meals.map((meal) => (
          <li key={`${meal.type}-${meal.time}`} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-800">
                {meal.type} - {meal.time}
              </p>
              <p className="text-sm font-semibold text-emerald-700">PHP {meal.estimated_cost}</p>
            </div>
            <p className="mt-1 text-sm text-slate-600">{meal.restaurant}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default MealPlanList
