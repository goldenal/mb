import { useState, useEffect } from 'react'
import { getDuvets } from '../api/duvets.js'
import { useSettings } from '../context/SettingsContext'

function DuvetsShimmer() {
  return (
    <div className="product-shimmer-grid">
      {[0, 1, 2].map((i) => (
        <div key={i} className="product-shimmer-card">
          <div className="product-shimmer-img" style={{ height: 240 }} />
          <div className="product-shimmer-body">
            <div className="shimmer-block" style={{ height: 18, width: '70%' }} />
            <div className="shimmer-block" style={{ height: 12, width: '90%', marginTop: 8 }} />
            <div className="shimmer-block" style={{ height: 12, width: '75%', marginTop: 4 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Duvets() {
  const { settings } = useSettings()
  const [duvets, setDuvets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDuvets()
      .then(({ duvets }) => setDuvets(duvets))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const featured = duvets.find((d) => d.is_featured) || duvets[0]
  const cards = duvets.filter((d) => d !== featured)

  return (
    <section id="duvets" className="block">
      <div className="row-head">
        <div>
          <div className="eyebrow">{settings.duvetsEyebrow}</div>
          <h2>{settings.duvetsHeading}</h2>
        </div>
        <p>{settings.duvetsSub}</p>
      </div>
      {loading && <DuvetsShimmer />}
      <div className="duvets-grid" style={{ display: loading ? 'none' : undefined }}>
        {featured && (
          <article className="duvet-feature">
            <div className="duvet-feature-body">
              <h3>{featured.name}</h3>
              <p>{featured.desc}</p>
              <div className="duvet-feature-cta">
                <span>{featured.price}</span>
                <a href="#contact">Enquire</a>
              </div>
            </div>
          </article>
        )}
        {cards.map((d) => (
          <article key={d.id} className="duvet-card">
            <div
              className="duvet-card-img"
              style={{ backgroundImage: d.img ? `url('${d.img}')` : undefined }}
            />
            <div className="duvet-card-body">
              <h3>{d.name}</h3>
              <p>{d.desc}</p>
              <div className="duvet-card-foot">
                <span>{d.price}</span>
                <a href="#contact">Enquire →</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
