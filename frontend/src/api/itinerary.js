import { apiRequest } from './client'

export function generateItinerary(prompt, token) {
  return apiRequest('itinerary/', {
    method: 'POST',
    token,
    body: { prompt },
  })
}
