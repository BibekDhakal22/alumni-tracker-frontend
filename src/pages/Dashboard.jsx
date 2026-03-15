import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"

function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [alumniList, setAlumniList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate("/")
      return
    }
    fetchAlumni()
  }, [user])

  const fetchAlumni = async () => {
    try {
      const response = await api.get("/alumni")
      setAlumniList(response.data)
    } catch (err) {
      console.error("Failed to fetch alumni", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  if (!user) return null

  const profile = user.alumni_profile
  const employed = alumniList.filter(a => a.alumni_profile?.status === "employed").length
  const total = alumniList.length
  const batches = [...new Set(alumniList.map(a => a.alumni_profile?.batch_year).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">Alumni Tracker</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, {user.name}</span>
          <button
  onClick={() => navigate("/jobs")}
  className="bg-white text-blue-600 px-4 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
>
  Job Board
</button>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-10 px-4">

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-500">Batch of {profile?.batch_year || "N/A"}</p>
              <p className="text-blue-600 text-sm">{user.email}</p>
            </div>
            <button
              onClick={() => navigate("/profile/edit")}
              className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              Personal Information
            </h3>
            <div className="space-y-3">
              <InfoRow label="Phone" value={profile?.phone || "Not set"} />
              <InfoRow label="Location" value={profile?.address || "Not set"} />
              <InfoRow label="LinkedIn" value={profile?.linkedin || "Not set"} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              Employment Details
            </h3>
            <div className="space-y-3">
              <InfoRow label="Job Title" value={profile?.current_job || "Not set"} />
              <InfoRow label="Company" value={profile?.company || "Not set"} />
              <InfoRow label="Status" value={profile?.status || "Not set"} />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard number={total} label="Total Alumni" color="blue" />
          <StatCard number={employed} label="Employed" color="green" />
          <StatCard number={batches.length} label="Batch Years" color="purple" />
        </div>

        {/* Recent Alumni */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
            Recent Alumni
          </h3>
          {loading ? (
            <p className="text-center text-gray-400 py-6">Loading...</p>
          ) : alumniList.length === 0 ? (
            <p className="text-center text-gray-400 py-6">No alumni found</p>
          ) : (
            <div className="space-y-3">
              {alumniList.slice(0, 5).map((a, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                      {a.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium text-sm">{a.name}</p>
                      <p className="text-gray-400 text-xs">Batch {a.alumni_profile?.batch_year || "N/A"}</p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {a.alumni_profile?.current_job
                      ? `${a.alumni_profile.current_job} at ${a.alumni_profile.company}`
                      : "Not employed"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-700 font-medium">{value}</span>
    </div>
  )
}

function StatCard({ number, label, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  }
  return (
    <div className={`rounded-xl p-4 text-center ${colors[color]}`}>
      <p className="text-2xl font-bold">{number}</p>
      <p className="text-sm mt-1">{label}</p>
    </div>
  )
}

export default Dashboard