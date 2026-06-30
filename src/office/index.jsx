import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './Dashboard.jsx'
import BedsManager from './managers/BedsManager.jsx'
import MattressesManager from './managers/MattressesManager.jsx'
import PillowsManager from './managers/PillowsManager.jsx'
import DuvetsManager from './managers/DuvetsManager.jsx'
import StoresManager from './managers/StoresManager.jsx'
import SettingsManager from './managers/SettingsManager.jsx'

export default function OfficeLayout() {
  const { admin, logout } = useAuth()

  return (
    <ProtectedRoute>
      <div className="office-layout">
        <Sidebar admin={admin} onLogout={logout} />
        <main className="office-main">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="beds" element={<BedsManager />} />
            <Route path="mattresses" element={<MattressesManager />} />
            <Route path="pillows" element={<PillowsManager />} />
            <Route path="duvets" element={<DuvetsManager />} />
            <Route path="stores" element={<StoresManager />} />
            <Route path="settings" element={<SettingsManager />} />
            <Route path="*" element={<Navigate to="/office" replace />} />
          </Routes>
        </main>
      </div>
    </ProtectedRoute>
  )
}
