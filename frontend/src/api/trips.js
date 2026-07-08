import { apiRequest } from './client'

export function listTrips(token) {
  return apiRequest('trips/', { token })
}

export function getTrip(tripId, token) {
  return apiRequest(`trips/${tripId}/`, { token })
}

export function createTrip(payload, token) {
  return apiRequest('trips/', {
    method: 'POST',
    token,
    body: payload,
  })
}

export function deleteTrip(tripId, token) {
  return apiRequest(`trips/${tripId}/`, {
    method: 'DELETE',
    token,
  })
}
