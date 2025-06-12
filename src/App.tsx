import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import NotFound from './pages/NotFound'
import SalesPage from './pages/SalesPage'
import PurchasesPage from './pages/PurchasesPage'
import LogisticsPage from './pages/LogisticsPage'
import InventoryPage from './pages/InventoryPage'
import LoginPage from './pages/LoginPage'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={ <LoginPage />} />
      <Route path="/dashboard" element={ <HomePage /> } />
      <Route path="/dashboard/sales" element={ <SalesPage /> } />
      <Route path="/dashboard/purchases" element={ <PurchasesPage /> } />
      <Route path="/dashboard/logistics" element={ <LogisticsPage /> } />
      <Route path="/dashboard/inventory" element={ <InventoryPage /> } />
      <Route path="/dashboard/login" element={ <LoginPage /> } />
      <Route path="*" element={ <NotFound /> } />
    </Routes>
  )
}

export default App
