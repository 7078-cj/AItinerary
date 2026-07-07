import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import PrivateRoutes from './context/PrivateRoutes'
import Register from './pages/Register'
import { AuthProvider } from './context/AuthContext'
import DashBoard from './pages/DashBoard'



function App() {
  
  return (
    <>
      
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
              
            <Route element={<PrivateRoutes />} >
              <Route path="/" element={<DashBoard />} />
            </Route>
              
          </Routes>
        </AuthProvider>
      </Router>
      
      
      
    </>
  )
}

export default App