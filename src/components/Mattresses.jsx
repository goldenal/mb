import { useState, useEffect } from 'react'
import { getMattresses } from '../api/mattresses.js'
import { useSettings } from '../context/SettingsContext'

function MattressShimmer() {
  return (
    <div className="product-shimmer-grid">
      {[0, 1, 2].map((i) => (
        <div key={i} className="product-shimmer-card">
          <div className="product-shimmer-img" />
          <div className="product-shimmer-body">
            <div className="shimmer-block" style={{ height: 12, width: '50%' }} />
            <div className="shimmer-block" style={{ height: 18, width: '72%', marginTop: 8 }} />
            <div className="shimmer-block" style={{ height: 12, width: '90%', marginTop: 8 }} />
            <div className="shimmer-block" style={{ height: 12, width: '80%', marginTop: 4 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Mattresses() {
  const { settings } = useSettings()
  const [mattresses, setMattresses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMattresses()
      .then(({ mattresses }) => setMattresses(mattresses))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="range" className="block">
      <div className="row-head">
        <div>
          <div className="eyebrow">{settings.mattressesEyebrow}</div>
          <h2>{settings.mattressesHeading}</h2>
        </div>
        <p>{settings.mattressesSub}</p>
      </div>
      {loading ? (
        <MattressShimmer />
      ) : (
        <div className="grid-3">
          {mattresses.map((m) => (
            <article key={m.id} className="product-card">
              <div className="product-img" style={{ backgroundImage: m.img ? `url('${m.img}')` : undefined }} />
              <div className="product-body">
                <div className="product-tag">
                  <span className="dot" style={{ background: m.dotColor || '#f97316' }} />
                  <span className="label">{m.tag}</span>
                </div>
                <h3>{m.name}</h3>
                <p>{m.desc}</p>
                <div className="product-foot">
                  <span className="product-price">{m.price}</span>
                  <a href="#contact" className="product-link">Enquire →</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
