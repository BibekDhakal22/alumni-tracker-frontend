import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import AdminPanel from "./pages/AdminPanel"
import EditProfile from "./pages/EditProfile"
import JobBoard from "./pages/JobBoard"
import ProtectedRoute from "./components/ProtectedRoute"
import Analytics from "./pages/Analytics" 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes - must be logged in */}
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

        {/* Admin only route */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminPanel />
          </ProtectedRoute>
        } />

        <Route path="/analytics" element={
        <ProtectedRoute>
         <Analytics />
        </ProtectedRoute>
} />
      </Routes>
    </BrowserRouter>
  )
}

export default App