import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'

const links = [
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Experience', to: '/experience' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    if (!isHomePage) {
      setScrolled(true)
      return
    }
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    setScrolled(window.scrollY > 50)
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHomePage])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass-card rounded-none border-x-0 border-t-0 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link
          to="/"
          className="font-mono font-bold text-xl gradient-text tracking-tight"
        >
          TN.
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.label}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium relative group transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`
                }
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 group-hover:w-full transition-all duration-300" />
              </NavLink>
            </li>
          ))}
          <li>
            <Link
              to="/contact"
              className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 transition-opacity"
            >
              Hire Me
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white text-xl"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden glass-card mx-4 mt-2 rounded-2xl px-6 py-4"
          >
            <ul className="flex flex-col gap-4">
              {links.map((l) => (
                <li key={l.label}>
                  <NavLink
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `text-sm font-medium block ${
                        isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="block text-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 to-cyan-500"
                >
                  Hire Me
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
