import './App.css'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const Login = React.lazy(() => import('./pages/Auth/Login'))
const Register = React.lazy(() => import('./pages/Auth/Register'))
const Dashboard = React.lazy(() => import('./pages/(protected)/Dashboard'))
const Recommendations = React.lazy(() => import('./pages/(protected)/Recommendations'))
const ArchivedRecommendations = React.lazy(() => import('./pages/(protected)/ArchivedRecommendations'))

function App() {
  return (
  <div className="">
    <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/recommendations' element={<Recommendations />} />
        <Route path='/recommendations/archive' element={<ArchivedRecommendations />} />
    </Routes>
  </div>
  )
}
export default App;

