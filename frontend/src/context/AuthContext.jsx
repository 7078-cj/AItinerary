import { jwtDecode } from 'jwt-decode'
import React, { createContext, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'

const AuthContext = createContext()

export default AuthContext

export function AuthProvider({ children }) {
  const [authTokens, setAuthTokens] = useState(
    JSON.parse(localStorage.getItem('authTokens')) || null,
  )
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)
  const [loginError, setLoginError] = useState('')

  const nav = useNavigate()
  const url = import.meta.env.VITE_API_URL

  const persistSession = useCallback((tokens) => {
    const decodedUser = jwtDecode(tokens.access)
    setAuthTokens(tokens)
    setUser(decodedUser)
    localStorage.setItem('authTokens', JSON.stringify(tokens))
    localStorage.setItem('user', JSON.stringify(decodedUser))
  }, [])

  const logoutUser = useCallback(() => {
    setUser(null)
    setAuthTokens(null)
    setLoginError('')
    localStorage.removeItem('authTokens')
    localStorage.removeItem('user')
  }, [])

  const loginUser = async (event) => {
    event.preventDefault()
    setLoginError('')

    try {
      const response = await fetch(`${url}token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: event.target.username.value,
          password: event.target.password.value,
        }),
      })

      if (!response.ok) {
        setLoginError('Invalid username or password.')
        return
      }

      const data = await response.json()
      persistSession(data)
      nav('/')
    } catch (error) {
      console.error('Error during login:', error)
      setLoginError('Unable to sign in right now. Please try again.')
    }
  }

  const updateToken = useCallback(async () => {
    if (!authTokens?.refresh) {
      return
    }

    try {
      const data = await apiRequest('token/refresh/', {
        method: 'POST',
        body: { refresh: authTokens.refresh },
      })

      const nextTokens = {
        ...authTokens,
        ...data,
      }

      persistSession(nextTokens)
    } catch (error) {
      console.error('Error updating tokens:', error)
      logoutUser()
    }
  }, [authTokens, logoutUser, persistSession])

  useEffect(() => {
    if (!authTokens?.refresh) {
      return undefined
    }

    const interval = setInterval(() => {
      updateToken()
    }, 600000)

    return () => clearInterval(interval)
  }, [authTokens?.refresh, updateToken])

  const context = {
    loginUser,
    logOut: logoutUser,
    user,
    authTok: authTokens,
    loginError,
    getAccessToken: () => authTokens?.access || null,
  }

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}
