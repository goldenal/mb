import { useSettings } from '../context/SettingsContext'
import { bulletsFromDesc } from '../utils/pillow.js'

export default function PillowModal({ isOpen, pillow, onClose }) {
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className={`modal-overlay${isOpen ? ' is-open' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="modal-content pillow-modal-content">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {pillow && <PillowModalBody pillow={pillow} />}
      </div>
    </div>
  )
}

function PillowModalBody({ pillow }) {
  const { settings } = useSettings()
  const bullets = bulletsFromDesc(pillow.desc)
  const waText = encodeURIComponent(`Hi, I'd like to know more about the ${pillow.name}.`)

  return (
    <div className="pillow-modal-body">
      {pillow.img ? (
        <div className="product-img short" style={{ backgroundImage: `url('${pillow.img}')`, borderRadius: '20px' }} />
      ) : (
        <div className="product-img short pillow-img-placeholder" style={{ borderRadius: '20px' }}>
          <span>{pillow.name}</span>
        </div>
      )}
      <div className="pillow-modal-info">
        <h3>{pillow.name}</h3>
        {pillow.sizes && pillow.sizes.length > 0 ? (
          <ul className="pillow-size-list">
            {pillow.sizes.map((s) => (
              <li key={s.label}>
                <span>{s.label}</span>
                <span>{s.price}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="pillow-single-price">{pillow.price}</div>
        )}
        {bullets.length > 0 && (
          <ul className="pillow-bullets">
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
        <a
          className="pillow-modal-cta"
          href={`https://wa.me/${settings.whatsappNumber}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Enquire on WhatsApp
        </a>
      </div>
    </div>
  )
}
