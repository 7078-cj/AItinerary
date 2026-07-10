function DayTabs({ days, activeDay, onDayChange }) {
  return (
    <nav className="sticky top-[68px] z-20 -mx-4 mb-6 overflow-x-auto border-y border-[#2F5362] bg-[#0E1A20]/95 px-4 py-4 backdrop-blur-lg sm:mx-0 sm:rounded-2xl sm:border">
      <ul className="flex min-w-max gap-3">
        {days.map((day) => {
          const isActive = day.day === activeDay

          return (
            <li key={day.day}>
              <button
                type="button"
                onClick={() => onDayChange(day.day)}
                className={`group relative rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'trip-tab-active border-[var(--trip-primary)] bg-[var(--trip-primary-soft)] text-white shadow-[0_0_20px_var(--trip-primary-soft)]'
                    : 'trip-tab-inactive border-[#2F5362] bg-[#142833] text-[#D1E1E5] hover:border-[var(--trip-primary)] hover:bg-[var(--trip-primary-soft)] hover:text-white'
                }`}
              >
                <span className="relative z-10">
                  Day {day.day}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default DayTabs