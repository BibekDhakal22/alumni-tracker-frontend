import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"

function AdminPanel() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [search, setSearch] = useState("")
  const [filterBatch, setFilterBatch] = useState("")
  const [activeTab, setActiveTab] = useState("alumni")
  const [alumniList, setAlumniList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlumni()
  }, [])

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this alumni?")) return
    try {
      await api.delete(`/alumni/${id}`)
      setAlumniList(alumniList.filter(a => a.id !== id))
    } catch (err) {
      alert("Failed to delete alumni")
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  // Filter logic
  const filtered = alumniList.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
    const matchBatch = filterBatch
      ? a.alumni_profile?.batch_year === filterBatch
      : true
    return matchSearch && matchBatch
  })

  const totalAlumni = alumniList.length
  const employed = alumniList.filter(a => a.alumni_profile?.status === "employed").length
  const unemployed = alumniList.filter(a => a.alumni_profile?.status === "unemployed").length
  const batches = [...new Set(alumniList.map(a => a.alumni_profile?.batch_year).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">Alumni Tracker — Admin</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-6xl mx-auto py-10 px-4">

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Alumni" value={totalAlumni} color="blue" />
          <StatCard label="Employed" value={employed} color="green" />
          <StatCard label="Unemployed" value={unemployed} color="red" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["alumni", "pending"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab === "alumni" ? "All Alumni" : "Pending Approvals"}
            </button>
          ))}
        </div>

        {/* Main Table Card */}
        <div className="bg-white rounded-xl shadow-md p-6">

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
            >
              <option value="">All Batches</option>
              {batches.sort().map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition">
              Export CSV
            </button>
          </div>

          {/* Table */}
          {activeTab === "alumni" && (
            <div className="overflow-x-auto">
              {loading ? (
                <p className="text-center text-gray-400 py-8">Loading...</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-left">
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Batch</th>
                      <th className="px-4 py-3">Job</th>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center text-gray-400 py-8">
                          No alumni found
                        </td>
                      </tr>
                    ) : (
                      filtered.map((a, i) => (
                        <tr key={a.id} className="border-t hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                {a.name.charAt(0)}
                              </div>
                              <span className="font-medium text-gray-800">{a.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{a.email}</td>
                          <td className="px-4 py-3 text-gray-600">
                            {a.alumni_profile?.batch_year || "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {a.alumni_profile?.current_job || "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {a.alumni_profile?.company || "-"}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              a.alumni_profile?.status === "employed"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}>
                              {a.alumni_profile?.status || "unknown"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button className="text-blue-600 hover:underline text-xs">
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(a.id)}
                                className="text-red-500 hover:underline text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "pending" && (
            <div className="text-center text-gray-400 py-12">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-medium">No pending approvals</p>
              <p className="text-sm mt-1">New registrations will appear here for review</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
  }
  return (
    <div className={`rounded-xl p-5 text-center ${colors[color]}`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm mt-1">{label}</p>
    </div>
  )
}

export default AdminPanel