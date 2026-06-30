import { useEffect, useRef } from 'react'
import Nav from './Nav'
import { useSettings } from '../context/SettingsContext'

export default function Hero() {
  const { settings } = useSettings()
  const heroRef = useRef(null)
  const lines = Array.isArray(settings.heroLines) ? settings.heroLines : ['Bedding that', 'shapes how', 'you rest']

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const el = heroRef.current
    function onScroll() {
      if (!el) return
      const y = window.scrollY
      if (y < el.offsetHeight) {
        el.style.backgroundPositionY = `calc(38% + ${y * 0.3}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="hero" ref={heroRef}>
      <Nav />
      <div id="top" className="hero-head">
        <svg className="hero-deco-1" width="240" height="150" viewBox="0 0 240 150" fill="none" stroke="#fff" strokeWidth="1">
          <rect x="6" y="34" width="228" height="82" rx="41"></rect>
          <rect x="20" y="46" width="200" height="58" rx="29"></rect>
          <rect x="34" y="58" width="172" height="34" rx="17"></rect>
        </svg>
        <svg className="hero-deco-2" width="200" height="120" viewBox="0 0 200 120" fill="none" stroke="#fff" strokeWidth="1.4">
          <path d="M0 120 L120 0 M30 120 L150 0 M60 120 L180 0 M90 120 L200 10 M120 120 L200 40"></path>
        </svg>
        <h1>
          {lines.map((line, i) => (
            <span key={i} className={i % 2 === 1 ? 'line-right' : ''}>{line}</span>
          ))}
        </h1>
      </div>
    </section>
  )
}
