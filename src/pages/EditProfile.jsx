import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"

function EditProfile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const profile = user?.alumni_profile

  const [formData, setFormData] = useState({
    batch_year: profile?.batch_year || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    current_job: profile?.current_job || "",
    company: profile?.company || "",
    industry: profile?.industry || "",
    linkedin: profile?.linkedin || "",
    status: profile?.status || "unemployed",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      await api.put("/profile/update", formData)
      setSuccess("Profile updated successfully!")
      // Update local storage with new data
      const updatedUser = {
        ...user,
        alumni_profile: { ...profile, ...formData }
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setTimeout(() => navigate("/dashboard"), 1500)
    } catch (err) {
      setError("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">Alumni Tracker</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto py-10 px-4">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">

          {/* Profile Avatar */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>

          {/* Success/Error messages */}
          {success && (
            <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Personal Info Section */}
            <h3 className="text-md font-semibold text-gray-700 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Batch Year
                </label>
                <select
                  name="batch_year"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.batch_year}
                  onChange={handleChange}
                >
                  <option value="">Select batch year</option>
                  {Array.from({ length: 15 }, (_, i) => 2010 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="98XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Kathmandu, Nepal"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="text"
                  name="linkedin"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="linkedin.com/in/yourname"
                  value={formData.linkedin}
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* Employment Section */}
            <h3 className="text-md font-semibold text-gray-700 mb-4 pt-4 border-t">
              Employment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Current Job Title
                </label>
                <input
                  type="text"
                  name="current_job"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Software Developer"
                  value={formData.current_job}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Tech Nepal Pvt. Ltd."
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Industry
                </label>
                <select
                  name="industry"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.industry}
                  onChange={handleChange}
                >
                  <option value="">Select industry</option>
                  <option value="IT/Software">IT / Software</option>
                  <option value="Banking/Finance">Banking / Finance</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Government">Government</option>
                  <option value="NGO/INGO">NGO / INGO</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Employment Status
                </label>
                <select
                  name="status"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="employed">Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="studying">Studying</option>
                </select>
              </div>

            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfile