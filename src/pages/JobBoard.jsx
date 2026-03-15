import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"

function JobBoard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [filterType, setFilterType] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    type: "full-time",
    industry: "",
    deadline: "",
    contact_email: "",
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs")
      setJobs(response.data)
    } catch (err) {
      console.error("Failed to fetch jobs", err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await api.post("/jobs", formData)
      setJobs([response.data, ...jobs])
      setShowForm(false)
      setSuccess("Job posted successfully!")
      setFormData({
        title: "", description: "", company: "",
        location: "", type: "full-time", industry: "",
        deadline: "", contact_email: "",
      })
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("Failed to post job", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job post?")) return
    try {
      await api.delete(`/jobs/${id}`)
      setJobs(jobs.filter(j => j.id !== id))
    } catch (err) {
      alert("Failed to delete job")
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const filtered = filterType
    ? jobs.filter(j => j.type === filterType)
    : jobs

  const typeColors = {
    "full-time":  "bg-blue-100 text-blue-700",
    "part-time":  "bg-purple-100 text-purple-700",
    "internship": "bg-green-100 text-green-700",
    "freelance":  "bg-amber-100 text-amber-700",
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">Alumni Tracker</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-white text-sm hover:underline"
          >
            Dashboard
          </button>
          <span className="text-sm">Welcome, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-10 px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Job Board</h2>
            <p className="text-gray-500 text-sm mt-1">
              Opportunities posted by alumni for students and fellow alumni
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            {showForm ? "Cancel" : "+ Post a Job"}
          </button>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {success}
          </div>
        )}

        {/* Post Job Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Post a New Job
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Frontend Developer"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Tech Nepal Pvt. Ltd."
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Kathmandu, Nepal"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-1">
                    Job Type *
                  </label>
                  <select
                    name="type"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
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
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-600 text-sm font-medium mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="hr@company.com"
                    value={formData.contact_email}
                    onChange={handleChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-600 text-sm font-medium mb-1">
                    Job Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Describe the role, requirements, and responsibilities..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {submitting ? "Posting..." : "Post Job"}
              </button>
            </form>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["", "full-time", "part-time", "internship", "freelance"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                filterType === type
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {type === "" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Job Cards */}
        {loading ? (
          <p className="text-center text-gray-400 py-12">Loading jobs...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-12 bg-white rounded-xl shadow-md">
            <p className="text-4xl mb-3">💼</p>
            <p className="font-medium">No jobs posted yet</p>
            <p className="text-sm mt-1">Be the first to post an opportunity!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {job.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[job.type]}`}>
                        {job.type}
                      </span>
                    </div>
                    <p className="text-blue-600 font-medium text-sm">{job.company}</p>
                    <div className="flex gap-4 text-gray-400 text-xs mt-1">
                      <span>📍 {job.location}</span>
                      {job.industry && <span>🏢 {job.industry}</span>}
                      {job.deadline && <span>📅 Deadline: {job.deadline}</span>}
                    </div>
                    <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                      {job.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      {job.contact_email && (
                        
                      <a href={"mailto:" + job.contact_email}
                       className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition"
                        >
                        Apply Now
                        </a>
                      )}
                      <span className="text-gray-400 text-xs">
                        Posted by {job.posted_by?.name} •{" "}
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {(user?.role === "admin" || user?.id === job.posted_by?.id) && (
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="text-red-400 hover:text-red-600 text-xs ml-4"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default JobBoard