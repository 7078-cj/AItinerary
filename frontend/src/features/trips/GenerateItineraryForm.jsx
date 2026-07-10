import { useEffect, useRef, useState } from 'react'

const SUGGESTIONS = [
  {
    label: 'Tropical island escape',
    prompt:
      '5-day tropical escape in El Nido for 1 traveler, budget PHP 75,000, focus on beaches and island hopping',
  },
  {
    label: 'Tokyo neon and temples',
    prompt:
      '3-day trip to Tokyo, Japan for 1 traveler, mix of modern nightlife and traditional temples, moderate budget',
  },
  {
    label: 'Romantic European getaway',
    prompt:
      '4-day romantic trip to Paris, France for 2 travelers, cozy cafes, art museums, and golden-hour photo spots',
  },
  {
    label: 'Family beach & theme parks',
    prompt:
      '6-day family trip to Cebu, Philippines for 4 travelers (2 adults, 2 kids), beaches and kid-friendly activities',
  },
]

function GenerateItineraryForm({ onGenerate, loading, error }) {
  const [mounted, setMounted] = useState(false)
  const [focused, setFocused] = useState(false)
  const [promptValue, setPromptValue] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const applySuggestion = (prompt) => {
    setPromptValue(prompt)
    textareaRef.current?.focus()
  }

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-[#23414D] bg-[#11202A] p-6 transition-all duration-500 ease-out sm:p-8 ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2CB1A3]" />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8CA7AC]">
            New route
          </p>
        </div>
        <h2 className="mt-2 text-2xl font-semibold text-[#E8F1F2] sm:text-[26px]">
          Where to next?
        </h2>
        <p className="mt-2 max-w-xl text-sm text-[#8CA7AC]">
          Describe your dream trip and Aitinerary generates, finds location, and routes for you.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            const prompt = event.target.prompt.value.trim()
            if (prompt) {
              onGenerate(prompt)
            }
          }}
        >
          <label className="block text-sm font-medium text-[#8CA7AC]">
            Trip prompt
            <textarea
              ref={textareaRef}
              name="prompt"
              rows={4}
              required
              value={promptValue}
              onChange={(event) => setPromptValue(event.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="5-day tropical escape in El Nido for 1 traveler, budget PHP 75,000, focus on beaches and island hopping..."
              className={`mt-2 w-full rounded-xl border bg-[#0A1418] px-4 py-3 text-sm text-[#E8F1F2] outline-none transition-all duration-200 placeholder:text-[#4E6B72] ${
                focused ? 'border-[#2CB1A3] shadow-[0_0_0_3px_rgba(44,177,163,0.15)]' : 'border-[#23414D]'
              }`}
            />
          </label>

          <div>
            <p className="text-xs font-medium text-[#4E6B72]">Need inspiration?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion.label}
                  type="button"
                  onClick={() => applySuggestion(suggestion.prompt)}
                  className="rounded-full border border-[#23414D] bg-[#0A1418] px-3 py-1.5 text-xs font-medium text-[#8CA7AC] transition-all duration-200 hover:border-[#2CB1A3]/50 hover:text-[#2CB1A3] active:scale-95"
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2CB1A3] px-4 py-3 text-sm font-semibold text-[#0A1418] transition-all duration-200 hover:bg-[#25998D] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#1F857A]/40 disabled:text-[#8CA7AC] sm:w-auto"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin text-[#8CA7AC]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating itinerary...
              </>
            ) : (
              'Generate itinerary'
            )}
          </button>
        </form>
      </div>
    </section>
  )
}

export default GenerateItineraryForm