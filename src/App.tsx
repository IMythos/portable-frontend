import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import NotFound from './pages/NotFound'
import SalesPage from './pages/SalesPage'
import PurchasesPage from './pages/PurchasesPage'
import LogisticsPage from './pages/LogisticsPage'
import InventoryPage from './pages/InventoryPage'
import LoginPage from './pages/LoginPage'
import RouteGuard from './auth/RouteGuard'
import UnauthorizedPage from './pages/UnauthorizedPage'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={ <LoginPage />} />
      <Route path="/unauthorized" element={ <UnauthorizedPage /> } />
      <Route path="/dashboard" element={
        <RouteGuard routeKey="dashboard">
          <HomePage />
        </RouteGuard>
      } />
      <Route path="/dashboard/sales" element={ 
        <RouteGuard routeKey="sales">
          <SalesPage />
        </RouteGuard>
       } />
      <Route path="/dashboard/purchases" element={ 
        <RouteGuard routeKey="purchases">
          <PurchasesPage />
        </RouteGuard>
       } />
      <Route path="/dashboard/logistics" element={ 
        <RouteGuard routeKey="logistics">
          <LogisticsPage />
        </RouteGuard>
       } />
      <Route path="/dashboard/inventory" element={ 
        <RouteGuard routeKey="inventory">
          <InventoryPage />
        </RouteGuard>
       } />
      <Route path="*" element={ <NotFound /> } />
    </Routes>
  )
}

export default App
