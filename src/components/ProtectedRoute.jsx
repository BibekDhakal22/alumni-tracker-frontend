import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" />
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" />
  }

  return children
}

export default ProtectedRoute