import { useState, useEffect } from 'react'
import { getStores } from '../api/stores.js'
import { useSettings } from '../context/SettingsContext'

export default function Contact() {
  const { settings } = useSettings()
  const [stores, setStores] = useState([])

  useEffect(() => {
    getStores()
      .then(({ stores }) => setStores(stores))
      .catch(console.error)
  }, [])

  return (
    <section id="contact" className="contact-section">
      <div className="contact-head">
        <div className="eyebrow">Visit &amp; Contact</div>
        <h2>{settings.contactHeading}</h2>
        <p>{settings.contactSub}</p>
      </div>

      <div className="contact-cards">
        <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="contact-card">
          <span className="contact-icon whatsapp">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="#1faa5c">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.436-9.884 9.889-9.884a9.82 9.82 0 0 1 6.988 2.898 9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884z"></path>
            </svg>
          </span>
          <div>
            <div className="label">WhatsApp</div>
            <div className="value">{settings.whatsappDisplay}</div>
            <div className="sub">{settings.whatsappSub}</div>
          </div>
        </a>

        <a href={`tel:${settings.phone}`} className="contact-card">
          <span className="contact-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3f7cab" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </span>
          <div>
            <div className="label">Call us</div>
            <div className="value">{settings.phone}</div>
            <div className="sub">{settings.phoneSub}</div>
          </div>
        </a>

        <a href={`mailto:${settings.email}`} className="contact-card">
          <span className="contact-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3f7cab" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </span>
          <div>
            <div className="label">Email</div>
            <div className="value">{settings.email}</div>
            <div className="sub">{settings.emailSub}</div>
          </div>
        </a>
      </div>

      <div className="stores-card">
        <div className="stores-head">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3f7cab" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <h3>{settings.storesHeading}</h3>
        </div>
        <div className="stores-grid">
          {stores.map((store) => (
            <div key={store.id} className="store-card">
              <div className="store-name">{store.name}</div>
              <p style={{ whiteSpace: 'pre-line' }}>{store.address}</p>
              <div className="store-hours">{store.hours}</div>
            </div>
          ))}
        </div>
        <p className="delivery-note">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3f7cab" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
            <path d="M15 18H9"></path>
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
            <circle cx="7" cy="18" r="2"></circle>
            <circle cx="17" cy="18" r="2"></circle>
          </svg>
          {settings.deliveryNote}
        </p>
      </div>
    </section>
  )
}
