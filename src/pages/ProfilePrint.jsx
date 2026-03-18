import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

function ProfilePrint() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const printRef = useRef()
  const profile = user?.alumni_profile

  const handleDownloadPDF = async () => {
    const element = printRef.current
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    })
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
    pdf.save(user?.name + "_Alumni_Profile.pdf")
  }

  if (!user) return null

  const statusColors = {
    employed: { bg: '#dcfce7', color: '#15803d' },
    unemployed: { bg: '#fee2e2', color: '#dc2626' },
    studying: { bg: '#dbeafe', color: '#1d4ed8' },
  }
  const st = statusColors[profile?.status] || statusColors.unemployed

  return (
    <div style={styles.wrapper}>
      {/* Action Bar */}
      <div style={styles.actionBar}>
        <button
          onClick={() => navigate("/dashboard")}
          style={styles.backBtn}
          onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
          onMouseLeave={e => e.currentTarget.style.background = 'white'}
        >
          ← Back
        </button>
        <h2 style={styles.actionTitle}>Profile Export</h2>
        <button
          onClick={handleDownloadPDF}
          style={styles.downloadBtn}
          onMouseEnter={e => e.currentTarget.style.background = '#1e40af'}
          onMouseLeave={e => e.currentTarget.style.background = '#1d4ed8'}
        >
          ↓ Download PDF
        </button>
      </div>

      {/* Printable Profile Card */}
      <div style={styles.previewWrapper}>
        <div ref={printRef} style={styles.profileCard}>

          {/* Header */}
          <div style={styles.cardHeader}>
            <div style={styles.headerLeft}>
              <div style={styles.bigAvatar}>{user.name.charAt(0)}</div>
              <div>
                <h1 style={styles.name}>{user.name}</h1>
                <p style={styles.email}>{user.email}</p>
                {profile?.phone && <p style={styles.phone}>📞 {profile.phone}</p>}
              </div>
            </div>
            <div style={styles.headerRight}>
              <div style={styles.collegeName}>Tribhuvan University</div>
              <div style={styles.deptName}>BCA Department</div>
              <div style={{
                ...styles.statusBadge,
                background: st.bg,
                color: st.color
              }}>
                {profile?.status || "Not set"}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={styles.divider} />

          {/* Info Grid */}
          <div style={styles.infoGrid}>
            {/* Personal Info */}
            <div style={styles.infoSection}>
              <h3 style={styles.sectionTitle}>
                <span style={styles.sectionDot} />
                Personal Information
              </h3>
              <div style={styles.infoList}>
                {[
                  { label: "Batch Year", value: profile?.batch_year || "—" },
                  { label: "Phone", value: profile?.phone || "—" },
                  { label: "Address", value: profile?.address || "—" },
                  { label: "LinkedIn", value: profile?.linkedin || "—" },
                ].map((item, i) => (
                  <div key={i} style={styles.infoRow}>
                    <span style={styles.infoLabel}>{item.label}</span>
                    <span style={styles.infoValue}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Employment Info */}
            <div style={styles.infoSection}>
              <h3 style={styles.sectionTitle}>
                <span style={{...styles.sectionDot, background: '#16a34a'}} />
                Employment Details
              </h3>
              <div style={styles.infoList}>
                {[
                  { label: "Job Title", value: profile?.current_job || "—" },
                  { label: "Company", value: profile?.company || "—" },
                  { label: "Industry", value: profile?.industry || "—" },
                  { label: "Status", value: profile?.status || "—" },
                ].map((item, i) => (
                  <div key={i} style={styles.infoRow}>
                    <span style={styles.infoLabel}>{item.label}</span>
                    <span style={styles.infoValue}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={styles.cardFooter}>
            <span style={styles.footerText}>
              Alumni Tracker — Tribhuvan University BCA Department
            </span>
            <span style={styles.footerDate}>
              Generated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', background: '#f1f5f9', fontFamily: 'sans-serif' },
  actionBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 32px', background: 'white', borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  backBtn: {
    padding: '8px 16px', background: 'white', border: '1.5px solid #e2e8f0',
    borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151',
    fontWeight: '500', transition: 'background 0.15s',
  },
  actionTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 },
  downloadBtn: {
    padding: '10px 20px', background: '#1d4ed8', color: 'white',
    border: 'none', borderRadius: '10px', cursor: 'pointer',
    fontSize: '14px', fontWeight: '600', transition: 'background 0.2s',
  },
  previewWrapper: {
    maxWidth: '800px', margin: '32px auto', padding: '0 32px',
  },
  profileCard: {
    background: 'white', borderRadius: '16px', padding: '40px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0',
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '24px',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '20px' },
  bigAvatar: {
    width: '80px', height: '80px', borderRadius: '50%',
    background: '#1d4ed8', color: 'white', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '32px', flexShrink: 0,
  },
  name: { fontSize: '26px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' },
  email: { fontSize: '14px', color: '#64748b', margin: '0 0 4px' },
  phone: { fontSize: '14px', color: '#64748b', margin: 0 },
  headerRight: { textAlign: 'right' },
  collegeName: { fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' },
  deptName: { fontSize: '13px', color: '#64748b', marginBottom: '10px' },
  statusBadge: {
    display: 'inline-block', padding: '5px 14px',
    borderRadius: '20px', fontSize: '13px', fontWeight: '600',
  },
  divider: { height: '1px', background: '#e2e8f0', margin: '24px 0' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' },
  infoSection: {},
  sectionTitle: {
    fontSize: '14px', fontWeight: '700', color: '#0f172a',
    margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  sectionDot: {
    width: '8px', height: '8px', borderRadius: '50%',
    background: '#1d4ed8', display: 'inline-block',
  },
  infoList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  infoRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '8px 0', borderBottom: '1px solid #f8fafc',
  },
  infoLabel: { fontSize: '13px', color: '#94a3b8', fontWeight: '500' },
  infoValue: { fontSize: '13px', color: '#334155', fontWeight: '600' },
  cardFooter: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: '20px', borderTop: '1px solid #e2e8f0',
  },
  footerText: { fontSize: '12px', color: '#94a3b8' },
  footerDate: { fontSize: '12px', color: '#94a3b8' },
}

export default ProfilePrint