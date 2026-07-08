const API_URL = import.meta.env.VITE_API_URL

export function getApiUrl(path = '') {
  return `${API_URL}${path}`
}

export async function apiRequest(path, { method = 'GET', body, token, headers = {} } = {}) {
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(getApiUrl(path), {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const message =
      data?.message ||
      data?.detail ||
      (typeof data === 'object' ? JSON.stringify(data) : null) ||
      `Request failed with status ${response.status}`

    throw new Error(message)
  }

  return data
}
