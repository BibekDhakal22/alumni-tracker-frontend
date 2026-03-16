import { HashRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import AdminPanel from "./pages/AdminPanel"
import EditProfile from "./pages/EditProfile"
import JobBoard from "./pages/JobBoard"
import Analytics from "./pages/Analytics"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile/edit" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />
        <Route path="/jobs" element={
          <ProtectedRoute>
            <JobBoard />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminPanel />
          </ProtectedRoute>
        } />
      </Routes>
    </HashRouter>
  )
}

export default App