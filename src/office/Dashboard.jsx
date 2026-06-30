import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBeds } from '../api/beds.js'
import { getMattresses } from '../api/mattresses.js'
import { getPillows } from '../api/pillows.js'
import { getDuvets } from '../api/duvets.js'
import { getStores } from '../api/stores.js'
import { ShimmerCountCards } from './components/Shimmer.jsx'

const SECTIONS = [
  { key: 'beds', label: 'Beds', to: '/office/beds' },
  { key: 'mattresses', label: 'Mattresses', to: '/office/mattresses' },
  { key: 'pillows', label: 'Pillows', to: '/office/pillows' },
  { key: 'duvets', label: 'Duvets', to: '/office/duvets' },
  { key: 'stores', label: 'Stores', to: '/office/stores' },
]

export default function Dashboard() {
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getBeds(), getMattresses(), getPillows(), getDuvets(), getStores()])
      .then(([b, m, p, d, s]) => {
        setCounts({
          beds: b.beds.length,
          mattresses: m.mattresses.length,
          pillows: p.pillows.length,
          duvets: d.duvets.length,
          stores: s.stores.length,
        })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>Dashboard</h2>
        <p className="muted">Overview of all landing page content</p>
      </div>

      {loading ? (
        <ShimmerCountCards count={5} />
      ) : (
        <div className="dashboard-counts">
          {SECTIONS.map(({ key, label, to }) => (
            <Link key={key} to={to} className="count-card">
              <div className="count-num">{counts[key] ?? 0}</div>
              <div className="count-label">{label}</div>
            </Link>
          ))}
        </div>
      )}

      <div className="dashboard-links">
        <h3>Manage content</h3>
        <div className="dashboard-link-grid">
          {SECTIONS.map(({ key, label, to }) => (
            <Link key={key} to={to} className="dashboard-link-card">
              <span>{label}</span>
              <span className="arrow">→</span>
            </Link>
          ))}
          <Link to="/office/settings" className="dashboard-link-card">
            <span>Site Settings</span>
            <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
