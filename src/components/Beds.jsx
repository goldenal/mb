import { useState, useEffect } from 'react'
import { getBeds } from '../api/beds.js'
import { useSettings } from '../context/SettingsContext'

export default function Beds() {
  const { settings } = useSettings()
  const [beds, setBeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeBedIdx, setActiveBedIdx] = useState(0)
  const [imgLayers, setImgLayers] = useState({ a: '', b: '' })
  const [activeLayer, setActiveLayer] = useState('a')

  useEffect(() => {
    getBeds()
      .then(({ beds }) => {
        setBeds(beds)
        if (beds.length > 0) setImgLayers({ a: beds[0].img, b: '' })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function showBed(idx) {
    if (beds.length === 0) return
    const next = ((idx % beds.length) + beds.length) % beds.length
    setActiveBedIdx(next)
    if (activeLayer === 'a') {
      setImgLayers((prev) => ({ ...prev, b: beds[next].img }))
      setActiveLayer('b')
    } else {
      setImgLayers((prev) => ({ ...prev, a: beds[next].img }))
      setActiveLayer('a')
    }
  }

  const active = beds[activeBedIdx]

  if (loading) {
    return (
      <section id="beds" className="block">
        <div className="shimmer-block" style={{ height: 56, width: '40%', margin: '0 auto 56px', borderRadius: 8 }} />
        <div className="beds-grid" style={{ gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="shimmer-block" style={{ width: 3, height: 48 }} />
                <div style={{ flex: 1 }}>
                  <div className="shimmer-block" style={{ height: 16, width: '70%', marginBottom: 6 }} />
                  <div className="shimmer-block" style={{ height: 11, width: '50%' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="shimmer-block" style={{ borderRadius: 32, minHeight: 480 }} />
        </div>
      </section>
    )
  }

  if (beds.length === 0) {
    return (
      <section id="beds" className="block">
        <h2 className="center-title">{settings.bedsHeading}</h2>
      </section>
    )
  }

  return (
    <section id="beds" className="block">
      <h2 className="center-title">{settings.bedsHeading}</h2>

      <div className="beds-grid">

        <div className="beds-list">
          {beds.map((bed, idx) => (
            <button
              key={bed.id}
              type="button"
              className={`bed-row${idx === activeBedIdx ? ' active' : ''}`}
              onClick={() => showBed(idx)}
            >
              <div className="bed-bar" />
              <div>
                <div className="bed-name">{bed.name}</div>
                <div className="bed-sub">{bed.sub}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="bed-showcase">
          <div
            className={`bed-img-layer${activeLayer === 'a' ? ' active' : ''}`}
            style={{ backgroundImage: imgLayers.a ? `url('${imgLayers.a}')` : undefined }}
          />
          <div
            className={`bed-img-layer${activeLayer === 'b' ? ' active' : ''}`}
            style={{ backgroundImage: imgLayers.b ? `url('${imgLayers.b}')` : undefined }}
          />
          <div className="bed-img-overlay" />

          <button type="button" className="bed-nav-arrow bed-nav-prev" onClick={() => showBed(activeBedIdx - 1)} aria-label="Previous bed">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14202b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </button>
          <button type="button" className="bed-nav-arrow bed-nav-next" onClick={() => showBed(activeBedIdx + 1)} aria-label="Next bed">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14202b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>

          <div className="bed-info">
            <h3>{active.name}</h3>
            <p>{active.desc}</p>
            <a href="#contact" className="bed-enquire">
              Enquire now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </a>
          </div>

          <div className="bed-dots">
            {beds.map((bed, idx) => (
              <button
                key={bed.id}
                type="button"
                className={`dot-btn${idx === activeBedIdx ? ' active' : ''}`}
                aria-label={`Go to ${bed.name}`}
                onClick={() => showBed(idx)}
              />
            ))}
          </div>

          <div className="bed-stats">
            <div>
              <div className="stat-label">Thickness</div>
              <div className="stat-value">{active.thickness}</div>
            </div>
            <div>
              <div className="stat-label">Feel</div>
              <div className="stat-value">{active.feel}</div>
            </div>
            <div>
              <div className="stat-label">Price</div>
              <div className="stat-value">{active.price}</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
