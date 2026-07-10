import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

function AppNavbar({ title = 'Travel Planner' }) {
  const { user, logOut } = useContext(AuthContext)
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logOut()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[#23414D] bg-[#0A1418]/90 backdrop-blur">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 transition-all duration-500 ease-out sm:px-6 lg:px-8 ${
          mounted ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#2CB1A3]/40 bg-[#2CB1A3]/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 12l7-2 2-7 2 7 7 2-7 2-2 7-2-7-7-2z"
                stroke="#2CB1A3"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold tracking-tight text-[#E8F1F2]">
                Aitinerary
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-[#4E6B72] sm:block" />
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-[#4E6B72] sm:block">
                {title}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-[#4E6B72] sm:hidden">{title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user?.username ? (
            <div className="hidden items-center gap-2 rounded-full border border-[#23414D] px-3 py-1.5 sm:flex">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2CB1A3]/15 font-mono text-[10px] font-semibold text-[#2CB1A3]">
                {user.username.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm text-[#8CA7AC]">{user.username}</span>
            </div>
          ) : null}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-[#23414D] px-3 py-2 text-sm font-medium text-[#8CA7AC] transition-all duration-200 hover:border-rose-400/60 hover:text-rose-400 active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default AppNavbar