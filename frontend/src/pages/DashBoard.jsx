import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { generateItinerary } from '../api/itinerary'
import { createTrip, deleteTrip, getTrip, listTrips } from '../api/trips'
import AppNavbar from '../components/AppNavbar'
import AuthContext from '../context/AuthContext'
import ItineraryViewer from '../features/itinerary/ItineraryViewer'
import { generatedResultToTripPayload, savedTripToResult } from '../features/itinerary/itineraryMappers'
import { normalizeItineraryResult } from '../features/itinerary/normalizeItinerary'
import GenerateItineraryForm from '../features/trips/GenerateItineraryForm'
import TripList from '../features/trips/TripList'

function DashBoard() {
  const { getAccessToken } = useContext(AuthContext)

  const [view, setView] = useState('home')
  const [trips, setTrips] = useState([])
  const [itinerary, setItinerary] = useState(null)
  const [rawResult, setRawResult] = useState(null)
  const [activeDay, setActiveDay] = useState(1)

  const [loadingTrips, setLoadingTrips] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingTripId, setDeletingTripId] = useState(null)
  const [error, setError] = useState('')

  // presentational only — drives the crossfade when `view` changes
  const [viewVisible, setViewVisible] = useState(true)

  const loadTrips = useCallback(async () => {
    const token = getAccessToken()
    if (!token) {
      return
    }

    setLoadingTrips(true)
    setError('')

    try {
      const data = await listTrips(token)
      setTrips(Array.isArray(data) ? data : [])
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoadingTrips(false)
    }
  }, [getAccessToken])

  useEffect(() => {
    loadTrips()
  }, [loadTrips])

  useEffect(() => {
    setViewVisible(false)
    const timeout = setTimeout(() => setViewVisible(true), 20)
    return () => clearTimeout(timeout)
  }, [view])

  // presentational only — derived summary numbers for the hero band, no new fetches
  const stats = useMemo(() => {
    const count = trips.length
    const totalBudget = trips.reduce((sum, trip) => sum + (Number(trip.budget_total) || 0), 0)
    const latest = trips[0] || null

    return { count, totalBudget, latest }
  }, [trips])

  const openItinerary = (result) => {
    const normalized = normalizeItineraryResult(result)
    setRawResult(result)
    setItinerary(normalized)
    setActiveDay(normalized.days[0]?.day || 1)
    setView('itinerary')
    setError('')
  }

  const handleGenerate = async (prompt) => {
    const token = getAccessToken()
    if (!token) {
      return
    }

    setGenerating(true)
    setError('')

    try {
      const response = await generateItinerary(prompt, token)
      if (!response?.success || !response?.result) {
        throw new Error(response?.message || 'Failed to generate itinerary.')
      }

      openItinerary(response.result)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setGenerating(false)
    }
  }

  const handleOpenTrip = async (tripId) => {
    const token = getAccessToken()
    if (!token) {
      return
    }

    setError('')

    try {
      const trip = await getTrip(tripId, token)
      openItinerary(savedTripToResult(trip))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleSaveTrip = async () => {
    const token = getAccessToken()
    if (!token || !rawResult || itinerary?.id) {
      return
    }

    setSaving(true)
    setError('')

    try {
      const payload = generatedResultToTripPayload(rawResult)
      const savedTrip = await createTrip(payload, token)
      const normalized = normalizeItineraryResult(savedTripToResult(savedTrip))

      setRawResult(savedTripToResult(savedTrip))
      setItinerary(normalized)
      await loadTrips()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTrip = async (tripId) => {
    const token = getAccessToken()
    if (!token) {
      return
    }

    setDeletingTripId(tripId)
    setError('')

    try {
      await deleteTrip(tripId, token)
      await loadTrips()

      if (itinerary?.id === tripId) {
        setItinerary(null)
        setRawResult(null)
        setView('home')
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setDeletingTripId(null)
    }
  }

  const handleBackHome = () => {
    setView('home')
    setItinerary(null)
    setRawResult(null)
    setError('')
  }

  return (
    <main className="min-h-screen bg-[#0A1418]">
      <AppNavbar title={view === 'itinerary' ? 'Trip itinerary' : 'Your trips'} />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {error ? (
          <p className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
            {error}
          </p>
        ) : null}

        <div
          className={`transition-all duration-300 ease-out ${
            viewVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
        >
          {view === 'home' ? (
            <div className="space-y-6">
              {/* Hero band */}
              <section className="relative overflow-hidden rounded-2xl border border-[#23414D] bg-[#11202A] px-6 py-8 sm:px-8">
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
                  preserveAspectRatio="none"
                  viewBox="0 0 800 200"
                >
                  <path
                    d="M -20 160 C 120 120, 180 80, 320 90 C 460 100, 520 40, 680 20 C 740 12, 780 20, 830 10"
                    fill="none"
                    stroke="#2CB1A3"
                    strokeWidth="1.5"
                    strokeDasharray="5 7"
                    opacity="0.5"
                  />
                </svg>

                <div className="relative z-10">
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#2CB1A3]">
                    Aitinary
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold text-[#E8F1F2] sm:text-3xl">
                    Where's the next route?
                  </h1>
                  <p className="mt-2 max-w-lg text-sm text-[#8CA7AC]">
                    Describe a trip below and Aitinary generates, geocodes, and routes it for you —
                    or open a saved trip from your manifest.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                    <div className="rounded-xl border border-[#23414D] bg-[#0A1418] px-4 py-3">
                      <p className="text-[11px] uppercase tracking-wide text-[#4E6B72]">Saved trips</p>
                      <p className="mt-1 font-mono text-xl font-semibold text-[#E8F1F2]">
                        {stats.count}
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#23414D] bg-[#0A1418] px-4 py-3">
                      <p className="text-[11px] uppercase tracking-wide text-[#4E6B72]">
                        Total planned
                      </p>
                      <p className="mt-1 font-mono text-xl font-semibold text-[#D9A05B]">
                        {stats.totalBudget.toLocaleString()}
                      </p>
                    </div>
                    <div className="col-span-2 rounded-xl border border-[#23414D] bg-[#0A1418] px-4 py-3 sm:col-span-1">
                      <p className="text-[11px] uppercase tracking-wide text-[#4E6B72]">
                        Latest destination
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-[#E8F1F2]">
                        {stats.latest ? `${stats.latest.destination}, ${stats.latest.country}` : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Console grid */}
              <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
                <div className="lg:sticky lg:top-24 lg:h-fit">
                  <GenerateItineraryForm
                    onGenerate={handleGenerate}
                    loading={generating}
                    error={generating ? '' : error}
                  />
                </div>
                <TripList
                  trips={trips}
                  loading={loadingTrips}
                  onOpenTrip={handleOpenTrip}
                  onDeleteTrip={handleDeleteTrip}
                  deletingTripId={deletingTripId}
                />
              </div>
            </div>
          ) : (
            <ItineraryViewer
              itinerary={itinerary}
              activeDay={activeDay}
              onDayChange={setActiveDay}
              onBack={handleBackHome}
              onSave={handleSaveTrip}
              onDelete={() => handleDeleteTrip(itinerary.id)}
              saving={saving}
              deleting={deletingTripId === itinerary?.id}
              isSaved={Boolean(itinerary?.id)}
            />
          )}
        </div>
      </div>
    </main>
  )
}

export default DashBoard