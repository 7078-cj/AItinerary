function DayTabs({ days, activeDay, onDayChange }) {
  return (
    <nav className="sticky top-[68px] z-10 -mx-4 mb-4 overflow-x-auto border-b border-[#23414D] bg-[#0A1418]/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border">
      <ul className="flex min-w-max gap-2">
        {days.map((day) => {
          const isActive = day.day === activeDay
          return (
            <li key={day.day}>
              <button
                type="button"
                onClick={() => onDayChange(day.day)}
                className={`rounded-full border px-4 py-2 font-mono text-sm font-medium transition ${
                  isActive
                    ? 'trip-tab-active'
                    : 'trip-tab-inactive border-[#23414D] bg-[#11202A] text-[#8CA7AC]'
                }`}
              >
                Day {day.day}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default DayTabs