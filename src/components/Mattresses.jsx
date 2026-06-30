import { useState, useEffect } from 'react'
import { getMattresses } from '../api/mattresses.js'
import { useSettings } from '../context/SettingsContext'

export default function Mattresses() {
  const { settings } = useSettings()
  const [mattresses, setMattresses] = useState([])

  useEffect(() => {
    getMattresses()
      .then(({ mattresses }) => setMattresses(mattresses))
      .catch(console.error)
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
      <div className="grid-3">
        {mattresses.map((m) => (
          <article key={m.id} className="product-card">
            <div className="product-img" style={{ backgroundImage: m.img ? `url('${m.img}')` : undefined }} />
            <div className="product-body">
              <div className="product-tag">
                <span className="dot" style={{ background: m.dotColor || '#9ec0df' }} />
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
    </section>
  )
}
