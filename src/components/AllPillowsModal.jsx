import PillowCard from './PillowCard'

export default function AllPillowsModal({ isOpen, pillows = [], onClose, onOpenPillow }) {
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className={`modal-overlay${isOpen ? ' is-open' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="modal-content pillows-all-content">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="modal-head">
          <div className="eyebrow">Pillows</div>
          <h2>The full collection</h2>
        </div>
        <div className="grid-3 pillows-all-grid">
          {pillows.map((pillow) => (
            <PillowCard key={pillow.id} pillow={pillow} onOpen={onOpenPillow} />
          ))}
        </div>
      </div>
    </div>
  )
}
