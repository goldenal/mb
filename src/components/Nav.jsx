import { useState, useEffect } from 'react'
import { useSettings } from '../context/SettingsContext'

const NAV_LINKS = [
  { href: '#top', label: 'Home', sectionId: 'top' },
  { href: '#beds', label: 'Beds', sectionId: 'beds' },
  { href: '#range', label: 'Mattresses', sectionId: 'range' },
  { href: '#pillows', label: 'Pillows', sectionId: 'pillows' },
  { href: '#duvets', label: 'Duvets', sectionId: 'duvets' },
  { href: '#contact', label: 'Contact Us', sectionId: 'contact' },
]

export default function Nav() {
  const { settings } = useSettings()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeId, setActiveId] = useState('top')

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.sectionId)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className={`nav${scrolled ? ' scrolled' : ''}`}>
      <a href="#top" className="brand">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6"></path>
          <path d="M3 18h18"></path>
          <path d="M7 9V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"></path>
        </svg>
        <span>{settings.siteName}</span>
      </a>

      <button
        type="button"
        className={`nav-toggle${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <svg className="icon-burger" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7h16"></path>
          <path d="M4 12h16"></path>
          <path d="M4 17h16"></path>
        </svg>
        <svg className="icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 6l12 12"></path>
          <path d="M18 6 6 18"></path>
        </svg>
      </button>

      <nav className={`nav-links${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={activeId === link.sectionId ? 'active' : ''}
            onClick={closeMenu}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  )
}
