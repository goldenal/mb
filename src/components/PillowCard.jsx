import { bulletsFromDesc, startingPrice } from '../utils/pillow.js'

export default function PillowCard({ pillow, onOpen, compact = true }) {
  const bullets = bulletsFromDesc(pillow.desc)
  const teaser = bullets[0] || 'Ask us for full details on this pillow.'

  return (
    <article className={`product-card${compact ? ' compact' : ''}`}>
      {pillow.img ? (
        <div className="product-img short" style={{ backgroundImage: `url('${pillow.img}')` }} />
      ) : (
        <div className="product-img short pillow-img-placeholder">
          <span>{pillow.name}</span>
        </div>
      )}
      <div className="product-body">
        <h3>{pillow.name}</h3>
        <p>{teaser}</p>
        <div className="product-foot">
          <span className="product-price">{startingPrice(pillow)}</span>
          <button type="button" className="product-link" onClick={() => onOpen(pillow.id)}>
            Learn more →
          </button>
        </div>
      </div>
    </article>
  )
}
