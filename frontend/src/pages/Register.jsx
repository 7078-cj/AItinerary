import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/client'
import AuthContext from '../context/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { loginUser } = useContext(AuthContext)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const registerUser = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await apiRequest('register/', {
        method: 'POST',
        body: {
          username: event.target.username.value,
          email: event.target.email.value,
          password: event.target.password.value,
        },
      })

      await loginUser(event)
      navigate('/')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Register</h2>
        <form onSubmit={registerUser} className="flex flex-col space-y-4">
          <label className="flex flex-col font-medium text-gray-700">
            Username
            <input
              type="text"
              name="username"
              required
              className="mt-1 rounded-md border-2 border-gray-300 px-3 py-2 text-gray-700 outline-none focus:border-green-500"
            />
          </label>

          <label className="flex flex-col font-medium text-gray-700">
            Email
            <input
              type="email"
              name="email"
              required
              className="mt-1 rounded-md border-2 border-gray-300 px-3 py-2 text-gray-700 outline-none focus:border-green-500"
            />
          </label>

          <label className="flex flex-col font-medium text-gray-700">
            Password
            <input
              type="password"
              name="password"
              required
              className="mt-1 rounded-md border-2 border-gray-300 px-3 py-2 text-gray-700 outline-none focus:border-green-500"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-green-500 py-2 font-semibold text-white transition hover:bg-green-600 active:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        {error ? <p className="mt-3 text-center text-sm text-rose-600">{error}</p> : null}

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
