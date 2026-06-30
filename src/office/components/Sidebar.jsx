import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/office', label: 'Dashboard', end: true },
  { to: '/office/beds', label: 'Beds' },
  { to: '/office/mattresses', label: 'Mattresses' },
  { to: '/office/pillows', label: 'Pillows' },
  { to: '/office/duvets', label: 'Duvets' },
  { to: '/office/stores', label: 'Stores' },
  { to: '/office/settings', label: 'Settings' },
]

export default function Sidebar({ admin, onLogout }) {
  return (
    <aside className="office-sidebar">
      <div className="office-brand">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6"></path>
          <path d="M3 18h18"></path>
          <path d="M7 9V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"></path>
        </svg>
        <span>Mature Office</span>
        <div className="office-brand-dot" />
      </div>
      <nav className="office-nav">
        {NAV.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        {admin && <div className="sidebar-admin">{admin.name || admin.email}</div>}
        <button type="button" className="sidebar-logout" onClick={onLogout}>Log out</button>
      </div>
    </aside>
  )
}
