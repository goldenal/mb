function ShimmerRow({ hasThumb = false }) {
  return (
    <div className="shimmer-row">
      {hasThumb && <div className="shimmer-block shimmer-thumb-block" />}
      <div className="shimmer-text-group">
        <div className="shimmer-block shimmer-text-lg" />
        <div className="shimmer-block shimmer-text-sm" />
      </div>
      <div className="shimmer-actions-group">
        <div className="shimmer-block shimmer-btn-block" />
        <div className="shimmer-block shimmer-btn-block" />
      </div>
    </div>
  )
}

export function ShimmerList({ count = 4, hasThumb = false }) {
  return (
    <div className="item-list">
      {Array.from({ length: count }, (_, i) => (
        <ShimmerRow key={i} hasThumb={hasThumb} />
      ))}
    </div>
  )
}

export function ShimmerCountCards({ count = 5 }) {
  return (
    <div className="dashboard-counts">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="shimmer-count-card">
          <div className="shimmer-block" style={{ height: 32, width: 56, borderRadius: 6 }} />
          <div className="shimmer-block" style={{ height: 10, width: 44, borderRadius: 4 }} />
        </div>
      ))}
    </div>
  )
}

export function ShimmerForm({ rows = 4 }) {
  return (
    <div className="manager-form-wrap">
      <div className="shimmer-block" style={{ height: 15, width: 160, marginBottom: 20 }} />
      <div className="manager-form">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="field">
            <div className="shimmer-block" style={{ height: 10, width: 80, marginBottom: 6 }} />
            <div className="shimmer-block" style={{ height: 36, width: '100%' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
