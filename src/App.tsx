import './App.css'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Policies from './pages/(protected)/Policies'
import EventsPage from './pages/(protected)/Event'
// const CSPDebugger = React.lazy(() => import('./components/CSPDebugger').then(module => ({ default: module.CSPDebugger })))

const Login = React.lazy(() => import('./pages/Auth/Login'))
const Waivers = React.lazy(() => import('./pages/(protected)/Waivers'))
const Register = React.lazy(() => import('./pages/Auth/Register'))
const Dashboard = React.lazy(() => import('./pages/(protected)/Dashboard'))
const Recommendations = React.lazy(() => import('./pages/(protected)/Recommendations'))
const ArchivedRecommendations = React.lazy(() => import('./pages/(protected)/ArchivedRecommendations'))

function App() {
  return (
  <div className="">
    {/* {import.meta.env.DEV && <React.Suspense fallback={null}><CSPDebugger /></React.Suspense>} */}
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route
        element={
        <ProtectedRoute />
        }
      >
        <Route
          path="dashboard"
          element={
            <Dashboard />
          }
        />
      </Route>
      <Route
        element={
        <ProtectedRoute />
        }
      >
        <Route
          path="recommendations"
          element={
            <Recommendations />
          }
        />
      </Route>
      <Route
        element={
        <ProtectedRoute />
        }
      >
        <Route
          path="recommendations/archive"
          element={
            <ArchivedRecommendations />
          }
        />
      </Route>
      <Route
        element={
        <ProtectedRoute />
        }
      >
        <Route
          path="waivers"
          element={
            <Waivers />
          }
        />
      </Route>
      <Route
        element={
        <ProtectedRoute />
        }
      >
        <Route
          path="events"
          element={
            <EventsPage />
          }
        />
      </Route>
      <Route
        element={
        <ProtectedRoute />
        }
      >
        <Route
          path="policies"
          element={
            <Policies />
          }
        />
      </Route>
    </Routes>
  </div>
  )
}
export default App;

