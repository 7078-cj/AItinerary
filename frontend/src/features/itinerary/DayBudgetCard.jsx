import { formatCurrency } from './formatCurrency'

function DayBudgetCard({ day, currency }) {
  const budget = day?.daily_budget || {}

  return (
    <div className="rounded-xl border border-[#23414D] bg-[#11202A] p-4">
      <p className="trip-text-primary font-mono text-xs font-semibold uppercase tracking-wide">
        Day {day.day}
      </p>
      <h2 className="mt-1 text-xl font-semibold text-[#E8F1F2]">{day.theme}</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-[#0A1418] p-3">
          <p className="text-xs text-[#8CA7AC]">Food</p>
          <p className="font-mono font-semibold text-[#E8F1F2]">{formatCurrency(budget.food, currency)}</p>
        </div>
        <div className="rounded-lg bg-[#0A1418] p-3">
          <p className="text-xs text-[#8CA7AC]">Transport</p>
          <p className="font-mono font-semibold text-[#E8F1F2]">{formatCurrency(budget.transport, currency)}</p>
        </div>
        <div className="rounded-lg bg-[#0A1418] p-3">
          <p className="text-xs text-[#8CA7AC]">Activities</p>
          <p className="font-mono font-semibold text-[#E8F1F2]">{formatCurrency(budget.activities, currency)}</p>
        </div>
        <div className="trip-bg-soft rounded-lg p-3">
          <p className="trip-text-primary text-xs">Total</p>
          <p className="trip-text-primary font-mono font-semibold">{formatCurrency(budget.total, currency)}</p>
        </div>
      </div>
    </div>
  )
}

export default DayBudgetCard