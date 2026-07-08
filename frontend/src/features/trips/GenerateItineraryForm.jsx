function GenerateItineraryForm({ onGenerate, loading, error }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-semibold text-slate-900">Generate a new itinerary</h2>
      <p className="mt-2 text-sm text-slate-600">
        Describe your dream trip and the backend will generate, geocode, optimize, and route it for you.
      </p>

      <form
        className="mt-5 space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          const prompt = event.target.prompt.value.trim()
          if (prompt) {
            onGenerate(prompt)
          }
        }}
      >
        <label className="block text-sm font-medium text-slate-700">
          Trip prompt
          <textarea
            name="prompt"
            rows={4}
            required
            placeholder="5-day tropical escape in El Nido for 1 traveler, budget PHP 75,000, focus on beaches and island hopping..."
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500"
          />
        </label>

        {error ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300 sm:w-auto"
        >
          {loading ? 'Generating itinerary...' : 'Generate itinerary'}
        </button>
      </form>
    </section>
  )
}

export default GenerateItineraryForm
