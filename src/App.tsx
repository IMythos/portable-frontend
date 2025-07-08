import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

import Login from './pages/Login'
import HomeLayout from './layouts/HomeLayout'
import Dashboard from './views/Dashboard'
import EmployeesView from './views/EmployeesView'
import ProductsView from './views/ProductsView'
import EmployeeWithRole from './views/EmployeeWithRole'
import ProductDetailView from './views/ProductDetail'
import ProvidersView from './views/ProvidersView'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <HomeLayout>
          <Dashboard />
        </HomeLayout>
      } />
      <Route path="/dashboard/employees" element={
        <HomeLayout>
          <EmployeesView />
        </HomeLayout>
      } />
      <Route path="/dashboard/employees/:id" element={
        <HomeLayout>
          <EmployeeWithRole />
        </HomeLayout>
      } />
      <Route path="/dashboard/products" element={
        <HomeLayout>
          <ProductsView />
        </HomeLayout>
      } />
      <Route path="/dashboard/products/:id" element={
        <HomeLayout>
          <ProductDetailView />
        </HomeLayout>
      }/>
      <Route path="/dashboard/providers" element={
        <HomeLayout>
          <ProvidersView />
        </HomeLayout>
      } />
    </Routes>
  )
}

export default App