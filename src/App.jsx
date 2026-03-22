import { HashRouter, Routes, Route } from "react-router-dom"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import AdminPanel from "./pages/AdminPanel"
import EditProfile from "./pages/EditProfile"
import JobBoard from "./pages/JobBoard"
import Analytics from "./pages/Analytics"
import Events from "./pages/Events"
import Mentorship from "./pages/Mentorship"
import ProfilePrint from "./pages/ProfilePrint"
import ProtectedRoute from "./components/ProtectedRoute"
import NotFound from "./pages/NotFound"
import AlumniGallery from "./pages/AlumniGallery"

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/profile/edit" element={
          <ProtectedRoute><EditProfile /></ProtectedRoute>
        } />
        <Route path="/profile/print" element={
          <ProtectedRoute><ProfilePrint /></ProtectedRoute>
        } />
        <Route path="/jobs" element={
          <ProtectedRoute><JobBoard /></ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute><Analytics /></ProtectedRoute>
        } />
        <Route path="/events" element={
          <ProtectedRoute><Events /></ProtectedRoute>
        } />
        <Route path="/mentorship" element={
          <ProtectedRoute><Mentorship /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
        <Route path="/gallery" element={
          <ProtectedRoute>
            <AlumniGallery />
          </ProtectedRoute>
        } />
      </Routes>
    </HashRouter>
  )
}

export default App