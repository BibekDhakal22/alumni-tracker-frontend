import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import api from "../services/api"
import Sidebar from "../components/Sidebar"
import Avatar from "../components/Avatar"

function EditProfile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isDark } = useTheme()
  const profile = user?.alumni_profile

  const [uploading, setUploading] = useState(false)
  const [photoSuccess, setPhotoSuccess] = useState("")

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

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // ── theme tokens ────────────────────────────────────────────────────────────
  const bg         = isDark ? "#0f172a" : "#f1f5f9"
  const card       = isDark ? "#1e293b" : "#ffffff"
  const text       = isDark ? "#f1f5f9" : "#0f172a"
  const subtext    = isDark ? "#94a3b8" : "#64748b"
  const border     = isDark ? "#334155" : "#e2e8f0"
  const inputBg    = isDark ? "#0f172a" : "#f8fafc"
  const inputBorder= isDark ? "#334155" : "#e2e8f0"

  // ── helpers ─────────────────────────────────────────────────────────────────
  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    border: `1.5px solid ${inputBorder}`,
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    background: inputBg,
    color: text,
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.15s",
  }

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    color: subtext,
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  }

  const sectionHeader = (color, title) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0 }} />
      <h3 style={{ fontSize: "15px", fontWeight: "700", color: text, margin: 0 }}>{title}</h3>
    </div>
  )

  const Alert = ({ type, msg }) => {
    if (!msg) return null
    const isSuccess = type === "success"
    return (
      <div style={{
        background: isSuccess ? "#f0fdf4" : "#fef2f2",
        border: `1px solid ${isSuccess ? "#bbf7d0" : "#fecaca"}`,
        color: isSuccess ? "#15803d" : "#dc2626",
        padding: "11px 16px",
        borderRadius: "10px",
        marginBottom: "18px",
        fontSize: "13.5px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <span>{isSuccess ? "✓" : "⚠"}</span> {msg}
      </div>
    )
  }

  // ── handlers ─────────────────────────────────────────────────────────────────
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      await api.put("/profile/update", formData)
      setSuccess("Profile updated successfully!")
      const updatedUser = { ...user, alumni_profile: { ...profile, ...formData } }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setTimeout(() => navigate("/dashboard"), 1500)
    } catch {
      setError("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwordData.current_password || !passwordData.new_password) {
      setPasswordError("Please fill in all password fields.")
      return
    }
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setPasswordError("New passwords do not match.")
      return
    }
    if (passwordData.new_password.length < 6) {
      setPasswordError("New password must be at least 6 characters.")
      return
    }
    setChangingPassword(true)
    setPasswordError("")
    setPasswordSuccess("")
    try {
      await api.post("/change-password", passwordData)
      setPasswordSuccess("Password changed successfully!")
      setPasswordData({ current_password: "", new_password: "", new_password_confirmation: "" })
      setTimeout(() => setPasswordSuccess(""), 4000)
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password.")
    } finally {
      setChangingPassword(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setPhotoSuccess("")
    try {
      const formDataPhoto = new FormData()
      formDataPhoto.append("photo", file)
      const token = localStorage.getItem("token")
      const response = await fetch("http://127.0.0.1:8000/api/profile/photo", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formDataPhoto,
      })
      const data = await response.json()
      if (response.ok) {
        const updatedUser = { ...user, alumni_profile: { ...profile, photo: data.photo } }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setPhotoSuccess("Photo updated!")
        setTimeout(() => setPhotoSuccess(""), 3000)
        window.location.reload()
      }
    } catch {
      console.error("Photo upload failed")
    } finally {
      setUploading(false)
    }
  }

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <Sidebar />

      <main style={{ marginLeft: "240px", flex: 1, padding: "32px", maxWidth: "1100px" }}>

        {/* ── Header ── */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: text, margin: "0 0 4px" }}>Edit Profile</h1>
            <p style={{ fontSize: "14px", color: subtext, margin: 0 }}>Update your personal and employment information</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            style={{ padding: "9px 16px", background: card, border: `1.5px solid ${inputBorder}`, borderRadius: "10px", cursor: "pointer", fontSize: "14px", color: text, fontWeight: "500", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = isDark ? "#334155" : "#f1f5f9"}
            onMouseLeave={e => e.currentTarget.style.background = card}
          >← Back to Dashboard</button>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px", alignItems: "start" }}>

          {/* ── Profile Card ── */}
          <div style={{ background: card, borderRadius: "16px", padding: "28px", textAlign: "center", border: `1px solid ${border}`, position: "sticky", top: "32px" }}>
            {/* Avatar + upload */}
            <div style={{ position: "relative", width: "80px", margin: "0 auto 16px" }}>
              <Avatar name={user?.name} photo={profile?.photo} size={80} fontSize={32} />
              <label style={{
                position: "absolute", bottom: 0, right: 0,
                width: "28px", height: "28px", borderRadius: "50%",
                background: "#1d4ed8", color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: "13px", border: "2px solid white",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              }}>
                📷
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />
              </label>
            </div>

            {uploading && <p style={{ fontSize: "12px", color: subtext, margin: "0 0 8px" }}>Uploading…</p>}
            {photoSuccess && <p style={{ fontSize: "12px", color: "#15803d", margin: "0 0 8px", fontWeight: "600" }}>✓ {photoSuccess}</p>}

            <h3 style={{ fontSize: "17px", fontWeight: "700", color: text, margin: "0 0 5px" }}>{user?.name}</h3>
            <p style={{ fontSize: "13px", color: subtext, margin: "0 0 12px", wordBreak: "break-all" }}>{user?.email}</p>

            <span style={{
              display: "inline-block",
              background: isDark ? "rgba(29,78,216,0.2)" : "#dbeafe",
              color: isDark ? "#93c5fd" : "#1d4ed8",
              padding: "4px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "600",
            }}>
              Batch {profile?.batch_year || "Not set"}
            </span>

            <div style={{ height: "1px", background: border, margin: "20px 0" }} />

            <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "13px", fontWeight: "600", color: text, textTransform: "capitalize" }}>
                  {profile?.status || "—"}
                </div>
                <div style={{ fontSize: "11px", color: subtext, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "2px" }}>Status</div>
              </div>
              <div style={{ width: "1px", background: border }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "13px", fontWeight: "600", color: text }}>{profile?.industry || "—"}</div>
                <div style={{ fontSize: "11px", color: subtext, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "2px" }}>Industry</div>
              </div>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* ── Profile Form Card ── */}
            <div style={{ background: card, borderRadius: "16px", padding: "28px", border: `1px solid ${border}` }}>
              <Alert type="success" msg={success} />
              <Alert type="error"   msg={error} />

              <form onSubmit={handleSubmit}>
                {/* Personal Info */}
                {sectionHeader("#1d4ed8", "Personal Information")}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  <div>
                    <label style={labelStyle}>Batch Year</label>
                    <select name="batch_year" style={inputStyle} value={formData.batch_year} onChange={handleChange}>
                      <option value="">Select batch year</option>
                      {Array.from({ length: 15 }, (_, i) => 2010 + i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input type="text" name="phone" style={inputStyle} placeholder="98XXXXXXXX" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Address</label>
                    <input type="text" name="address" style={inputStyle} placeholder="Kathmandu, Nepal" value={formData.address} onChange={handleChange} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>LinkedIn Profile URL</label>
                    {/* prefix hint wrapper */}
                    <div style={{ display: "flex", border: `1.5px solid ${inputBorder}`, borderRadius: "10px", overflow: "hidden", background: inputBg }}>
                      <span style={{ padding: "10px 12px", fontSize: "13px", color: subtext, background: isDark ? "#1e293b" : "#f1f5f9", borderRight: `1px solid ${inputBorder}`, whiteSpace: "nowrap", userSelect: "none" }}>
                        linkedin.com/in/
                      </span>
                      <input
                        type="text" name="linkedin"
                        style={{ ...inputStyle, border: "none", borderRadius: 0, background: inputBg, flex: 1 }}
                        placeholder="yourname"
                        value={formData.linkedin.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//i, "")}
                        onChange={e => setFormData({ ...formData, linkedin: "linkedin.com/in/" + e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Employment */}
                <div style={{ paddingTop: "20px", borderTop: `1px solid ${border}` }}>
                  {sectionHeader("#16a34a", "Employment Details")}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
                  {[
                    { name: "current_job", label: "Current Job Title",  placeholder: "Software Developer" },
                    { name: "company",     label: "Company Name",       placeholder: "Tech Nepal Pvt. Ltd." },
                  ].map(f => (
                    <div key={f.name}>
                      <label style={labelStyle}>{f.label}</label>
                      <input type="text" name={f.name} style={inputStyle} placeholder={f.placeholder} value={formData[f.name]} onChange={handleChange} />
                    </div>
                  ))}
                  <div>
                    <label style={labelStyle}>Industry</label>
                    <select name="industry" style={inputStyle} value={formData.industry} onChange={handleChange}>
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
                    <label style={labelStyle}>Employment Status</label>
                    <select name="status" style={inputStyle} value={formData.status} onChange={handleChange}>
                      <option value="employed">Employed</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="studying">Studying</option>
                    </select>
                  </div>
                </div>

                {/* Save / Cancel */}
                <div style={{ display: "flex", gap: "12px", paddingTop: "20px", borderTop: `1px solid ${border}` }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ flex: 1, padding: "12px", background: loading ? "#3b5fc0" : "#1d4ed8", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", transition: "background 0.15s" }}
                    onMouseEnter={e => !loading && (e.currentTarget.style.background = "#1e40af")}
                    onMouseLeave={e => !loading && (e.currentTarget.style.background = "#1d4ed8")}
                  >
                    {loading ? "Saving…" : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    style={{ flex: 1, padding: "12px", background: isDark ? "#334155" : "white", color: text, border: `1.5px solid ${inputBorder}`, borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = isDark ? "#475569" : "#f1f5f9"}
                    onMouseLeave={e => e.currentTarget.style.background = isDark ? "#334155" : "white"}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            {/* ── Change Password Card (separate from form) ── */}
            <div style={{ background: card, borderRadius: "16px", padding: "28px", border: `1px solid ${border}` }}>
              {sectionHeader("#dc2626", "Change Password")}

              <Alert type="success" msg={passwordSuccess} />
              <Alert type="error"   msg={passwordError} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={labelStyle}>Current Password</label>
                  <input
                    type="password"
                    style={inputStyle}
                    placeholder="••••••••"
                    value={passwordData.current_password}
                    onChange={e => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  />
                </div>
                <div>
                  <label style={labelStyle}>New Password</label>
                  <input
                    type="password"
                    style={inputStyle}
                    placeholder="Min 6 characters"
                    value={passwordData.new_password}
                    onChange={e => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Confirm Password</label>
                  <input
                    type="password"
                    style={inputStyle}
                    placeholder="Repeat new password"
                    value={passwordData.new_password_confirmation}
                    onChange={e => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleChangePassword}
                disabled={changingPassword}
                style={{
                  padding: "10px 22px",
                  background: isDark ? "#334155" : "#f1f5f9",
                  color: text,
                  border: `1.5px solid ${inputBorder}`,
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: changingPassword ? "not-allowed" : "pointer",
                  opacity: changingPassword ? 0.7 : 1,
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => !changingPassword && (e.currentTarget.style.background = isDark ? "#475569" : "#e2e8f0")}
                onMouseLeave={e => !changingPassword && (e.currentTarget.style.background = isDark ? "#334155" : "#f1f5f9")}
              >
                {changingPassword ? "Changing…" : "Change Password"}
              </button>
            </div>

          </div>{/* end right column */}
        </div>
      </main>
    </div>
  )
}

export default EditProfile