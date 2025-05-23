import React from 'react'
import Notification from './components/Notification'
import Loading from './components/Loading';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/dashboard/Dashboard';
import ProtectedRoute from './pages/dashboard/ProtectedRoute';

export default function App() {
  return (
    <>
      <Loading />
      <Notification />
      <BrowserRouter>
        <Routes>
          <Route
            path="dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
