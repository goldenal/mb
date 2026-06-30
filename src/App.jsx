import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './LandingPage.jsx'
import LoginPage from './office/LoginPage.jsx'
import OfficeLayout from './office/index.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/office/login" element={<LoginPage />} />
      <Route path="/office/*" element={<OfficeLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
