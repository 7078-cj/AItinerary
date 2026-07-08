import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

function AppNavbar({ title = 'Travel Planner' }) {
  const { user, logOut } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logOut()
    navigate('/login')
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">AMD Hackathon</p>
          <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {user?.username ? (
            <p className="hidden text-sm text-slate-600 sm:block">Hi, {user.username}</p>
          ) : null}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-400 hover:text-rose-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default AppNavbar
