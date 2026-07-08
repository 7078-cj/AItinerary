import { useCallback, useContext, useEffect, useState } from 'react'
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
    <main className="min-h-screen bg-slate-50">
      <AppNavbar title={view === 'itinerary' ? 'Trip Itinerary' : 'Your Trips'} />

      <div className="mx-auto max-w-6xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
        ) : null}

        {view === 'home' ? (
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <GenerateItineraryForm onGenerate={handleGenerate} loading={generating} error={generating ? '' : error} />
            <TripList
              trips={trips}
              loading={loadingTrips}
              onOpenTrip={handleOpenTrip}
              onDeleteTrip={handleDeleteTrip}
              deletingTripId={deletingTripId}
            />
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
    </main>
  )
}

export default DashBoard
