import { useState, useEffect } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Beds from './components/Beds'
import Mattresses from './components/Mattresses'
import Pillows from './components/Pillows'
import Duvets from './components/Duvets'
import Delivery from './components/Delivery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import PillowModal from './components/PillowModal'
import AllPillowsModal from './components/AllPillowsModal'
import { getPillows } from './api/pillows.js'

export default function LandingPage() {
  const [pillows, setPillows] = useState([])
  const [pillowModalId, setPillowModalId] = useState(null)
  const [allPillowsOpen, setAllPillowsOpen] = useState(false)

  useEffect(() => {
    getPillows()
      .then(({ pillows }) => setPillows(pillows))
      .catch(console.error)
  }, [])

  const activePillow = pillowModalId ? pillows.find((p) => p.id === pillowModalId) ?? null : null
  const featuredPillows = pillows
    .filter((p) => p.featured)
    .sort((a, b) => (a.featured_order ?? 0) - (b.featured_order ?? 0))

  useEffect(() => {
    document.body.classList.toggle('modal-lock', pillowModalId !== null || allPillowsOpen)
  }, [pillowModalId, allPillowsOpen])

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        setPillowModalId(null)
        setAllPillowsOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const revealSelectors = [
      '.about-intro', '.center-title', '.row-head', '.beds-grid',
      '.delivery-card', '.contact-head', '.stores-card', '.footer-cta h2',
    ]
    const staggerGroupSelectors = [
      '.about-pair', '.about-row2', '.grid-3', '.duvets-grid', '.contact-cards', '.stores-grid',
    ]

    const tracked = []

    document.querySelectorAll(revealSelectors.join(',')).forEach((el) => {
      el.classList.add('reveal')
      tracked.push(el)
    })

    staggerGroupSelectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((group) => {
        Array.from(group.children).forEach((child, i) => {
          child.classList.add('reveal')
          child.style.transitionDelay = `${i * 90}ms`
          tracked.push(child)
        })
      })
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    )

    tracked.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pillows])

  return (
    <div className="wrap">
      <Hero />
      <About />
      <Beds />
      <Mattresses />
      <Pillows featuredPillows={featuredPillows} onOpenPillow={setPillowModalId} onOpenAllPillows={() => setAllPillowsOpen(true)} />
      <Duvets />
      <Delivery />
      <Contact />
      <Footer />

      <PillowModal
        isOpen={pillowModalId !== null}
        pillow={activePillow}
        onClose={() => setPillowModalId(null)}
      />
      <AllPillowsModal
        isOpen={allPillowsOpen}
        pillows={pillows}
        onClose={() => setAllPillowsOpen(false)}
        onOpenPillow={(id) => {
          setAllPillowsOpen(false)
          setPillowModalId(id)
        }}
      />
    </div>
  )
}
