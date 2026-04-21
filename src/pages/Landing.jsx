import { useNavigate } from "react-router-dom"

function Landing() {
  const navigate = useNavigate()

  const features = [
    { icon: "👥", title: "Alumni Directory", desc: "Search and connect with graduates from all batches across Nepal and abroad.", accent: "#1d4ed8", bg: "#eff6ff" },
    { icon: "💼", title: "Job Board",         desc: "Alumni post exclusive job opportunities for fellow graduates and current students.", accent: "#0891b2", bg: "#ecfeff" },
    { icon: "🤝", title: "Mentorship",        desc: "Request guidance from experienced alumni working at top companies.", accent: "#d97706", bg: "#fffbeb" },
    { icon: "🗓", title: "Events",            desc: "Stay updated on reunions, seminars, workshops and networking events.", accent: "#7c3aed", bg: "#f5f3ff" },
    { icon: "📊", title: "Analytics",         desc: "Admins get real-time insights on employment trends and alumni distribution.", accent: "#16a34a", bg: "#f0fdf4" },
    { icon: "📄", title: "PDF Export",        desc: "Download your professional alumni profile as a PDF document.", accent: "#dc2626", bg: "#fef2f2" },
  ]

  return (
    <div style={s.wrapper}>

      {/* ── Navbar ── */}
      <nav style={s.nav}>
        <div style={s.navBrand}>
          <div style={s.navLogo}>AT</div>
          <div>
            <div style={s.navTitle}>Alumni Tracker</div>
            <div style={s.navSub}>Tribhuvan University</div>
          </div>
        </div>
        <div style={s.navLinks}>
          {["Features", "About"].map(label => (
            <button key={label} style={s.navLink}
              onClick={() => document.getElementById(label.toLowerCase()).scrollIntoView({ behavior: "smooth" })}
              onMouseEnter={e => { e.currentTarget.style.color = "#1d4ed8"; e.currentTarget.style.background = "#eff6ff" }}
              onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "none" }}
            >{label}</button>
          ))}
          <button style={s.loginBtn} onClick={() => navigate("/login")}
            onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#cbd5e1" }}
            onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#e2e8f0" }}
          >Sign In</button>
          <button style={s.registerBtn} onClick={() => navigate("/register")}
            onMouseEnter={e => e.currentTarget.style.background = "#1e40af"}
            onMouseLeave={e => e.currentTarget.style.background = "#1d4ed8"}
          >Get Started</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={s.hero}>
        <div style={s.heroContent}>
          <div style={s.heroBadge}>🎓 Tribhuvan University — BCA Department</div>
          <h1 style={s.heroTitle}>
            Connect, Grow &<br />
            <span style={s.heroTitleAccent}>Stay Connected</span>
          </h1>
          <p style={s.heroDesc}>
            The official alumni tracking system for BCA graduates.
            Find mentors, discover opportunities, attend events and
            stay connected with your batchmates.
          </p>
          <div style={s.heroBtns}>
            <button style={s.heroPrimaryBtn} onClick={() => navigate("/register")}
              onMouseEnter={e => e.currentTarget.style.background = "#f0f9ff"}
              onMouseLeave={e => e.currentTarget.style.background = "white"}
            >Join Alumni Network →</button>
            <button style={s.heroSecondaryBtn} onClick={() => navigate("/login")}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            >Sign In</button>
          </div>

          {/* Stats with dividers */}
          <div style={s.heroStats}>
            {[
              { num: "500+", label: "Alumni" },
              { num: "50+",  label: "Companies" },
              { num: "10+",  label: "Batch Years" },
              { num: "100%", label: "Free" },
            ].map((stat, i) => (
              <div key={i} style={{ display: "flex", alignItems: "stretch", gap: "32px" }}>
                {i > 0 && <div style={s.statDivider} />}
                <div style={s.heroStat}>
                  <div style={s.heroStatNum}>{stat.num}</div>
                  <div style={s.heroStatLabel}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating cards */}
        <div style={s.heroVisual}>
          <FloatCard style={s.heroCard1}>
            <div style={s.hcAvatar}>B</div>
            <div>
              <div style={s.hcName}>Bibek Sharma</div>
              <div style={s.hcRole}>Frontend Developer · Batch 2021</div>
            </div>
          </FloatCard>
          <FloatCard style={s.heroCard2}>
            <div style={s.hcIcon}>💼</div>
            <div style={s.hcJobTitle}>New Job Posted</div>
            <div style={s.hcJobSub}>React Developer at Leapfrog</div>
          </FloatCard>
          <FloatCard style={s.heroCard3}>
            <div style={s.hcIcon}>🤝</div>
            <div style={s.hcJobTitle}>Mentorship Accepted</div>
            <div style={s.hcJobSub}>Sita Rai accepted your request</div>
          </FloatCard>
          <FloatCard style={s.heroCard4}>
            <div style={s.hcIcon}>🗓</div>
            <div style={s.hcJobTitle}>Upcoming Event</div>
            <div style={s.hcJobSub}>Annual Reunion — July 2026</div>
          </FloatCard>
          <div style={s.decorCircle1} />
          <div style={s.decorCircle2} />
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={s.featuresSection}>
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Everything you need</h2>
          <p style={s.sectionDesc}>A complete platform built specifically for TU BCA alumni</p>
        </div>
        <div style={s.featuresGrid}>
          {features.map((f, i) => (
            <div key={i} style={s.featureCard}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-5px)"
                e.currentTarget.style.boxShadow = `0 16px 40px ${f.accent}22`
                e.currentTarget.style.borderColor = `${f.accent}33`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"
                e.currentTarget.style.borderColor = "#f1f5f9"
              }}
            >
              {/* colored top accent bar */}
              <div style={{ height: "3px", background: f.accent, borderRadius: "3px 3px 0 0", margin: "-28px -28px 20px", borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }} />
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "16px" }}>
                {f.icon}
              </div>
              <h3 style={{ ...s.featureTitle, color: "#0f172a" }}>{f.title}</h3>
              <p style={s.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" style={s.aboutOuter}>
        <div style={s.aboutSection}>
          <div style={s.aboutLeft}>
            <div style={s.aboutBadge}>About the Project</div>
            <h2 style={s.aboutTitle}>Built for TU BCA Graduates</h2>
            <p style={s.aboutDesc}>
              This Alumni Tracking System was developed as a final year BCA project
              at Tribhuvan University. It aims to bridge the gap between current
              students and graduates by providing a centralized platform for
              networking, mentorship and career development.
            </p>
            <div style={s.aboutStats}>
              {[
                { num: "6+",  label: "Core Features" },
                { num: "20+", label: "API Endpoints" },
                { num: "6",   label: "Database Tables" },
              ].map((stat, i) => (
                <div key={i} style={s.aboutStat}>
                  <div style={s.aboutStatNum}>{stat.num}</div>
                  <div style={s.aboutStatLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div style={s.techStack}>
              {["React.js", "Laravel", "MySQL", "Electron", "Tailwind CSS", "REST API"].map((t, i) => (
                <span key={i} style={s.techBadge}>{t}</span>
              ))}
            </div>
          </div>

          <div style={s.aboutRight}>
            <div style={s.aboutCard}>
              <div style={s.aboutCardHeader}>
                <div style={s.aboutCardLogo}>AT</div>
                <div>
                  <div style={s.aboutCardTitle}>Alumni Tracker</div>
                  <div style={s.aboutCardSub}>BCA Final Year Project</div>
                </div>
              </div>
              <div style={s.aboutCardDivider} />
              {[
                { label: "Institution", value: "Tribhuvan University" },
                { label: "Department",  value: "BCA" },
                { label: "Technology",  value: "React + Laravel" },
                { label: "Database",    value: "MySQL" },
                { label: "Platform",    value: "Web + Desktop" },
              ].map((item, i) => (
                <div key={i} style={{ ...s.aboutCardRow, background: i % 2 === 0 ? "#f8fafc" : "white" }}>
                  <span style={s.aboutCardLabel}>{item.label}</span>
                  <span style={s.aboutCardValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={s.ctaSection}>
        <h2 style={s.ctaTitle}>Ready to join the network?</h2>
        <p style={s.ctaDesc}>Create your alumni profile and stay connected with your batchmates</p>
        <div style={s.ctaBtns}>
          <button style={s.ctaPrimaryBtn} onClick={() => navigate("/register")}
            onMouseEnter={e => e.currentTarget.style.background = "#f0f9ff"}
            onMouseLeave={e => e.currentTarget.style.background = "white"}
          >Get Started Free →</button>
          <button style={s.ctaSecondaryBtn} onClick={() => navigate("/login")}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >Sign In</button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={s.footer}>
        <div style={s.footerTop}>
          <div style={s.footerBrand}>
            <div style={s.footerLogo}>AT</div>
            <div>
              <div style={s.footerTitle}>Alumni Tracker</div>
              <div style={s.footerSub}>Tribhuvan University — BCA Department</div>
            </div>
          </div>
          <div style={s.footerLinks}>
            {[
              { label: "Sign In",   action: () => navigate("/login") },
              { label: "Register",  action: () => navigate("/register") },
              { label: "Features",  action: () => document.getElementById("features").scrollIntoView({ behavior: "smooth" }) },
            ].map(link => (
              <button key={link.label} style={s.footerLink} onClick={link.action}
                onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
                onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
              >{link.label}</button>
            ))}
          </div>
        </div>
        <div style={s.footerDivider} />
        <div style={s.footerBottom}>
          <span>© 2026 Alumni Tracker — Tribhuvan University BCA Department</span>
          <span>Built with React + Laravel</span>
        </div>
      </footer>
    </div>
  )
}

// Small helper so float cards share hover lift
function FloatCard({ style, children }) {
  return (
    <div style={{ ...style, transition: "transform 0.2s, box-shadow 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = (style.transform || "") + " translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.18)" }}
      onMouseLeave={e => { e.currentTarget.style.transform = style.transform || ""; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.13)" }}
    >{children}</div>
  )
}

const s = {
  wrapper: { minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", background: "white" },

  // Navbar
  nav: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 48px", background: "white", borderBottom: "1px solid #f1f5f9",
    position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  navBrand: { display: "flex", alignItems: "center", gap: "12px" },
  navLogo: {
    width: "40px", height: "40px", background: "#1d4ed8", borderRadius: "10px",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "white", fontWeight: "700", fontSize: "16px", flexShrink: 0,
  },
  navTitle: { fontSize: "16px", fontWeight: "700", color: "#0f172a" },
  navSub:   { fontSize: "11px", color: "#94a3b8" },
  navLinks: { display: "flex", alignItems: "center", gap: "4px" },
  navLink: {
    padding: "8px 14px", background: "none", border: "none",
    color: "#64748b", cursor: "pointer", fontSize: "14px", fontWeight: "500",
    borderRadius: "8px", transition: "color 0.15s, background 0.15s",
  },
  loginBtn: {
    padding: "8px 20px", background: "white", border: "1.5px solid #e2e8f0",
    borderRadius: "8px", color: "#374151", cursor: "pointer", fontSize: "14px",
    fontWeight: "600", transition: "all 0.15s", marginLeft: "8px",
  },
  registerBtn: {
    padding: "8px 20px", background: "#1d4ed8", border: "none",
    borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "14px",
    fontWeight: "600", transition: "background 0.15s",
  },

  // Hero
  hero: {
    display: "flex", alignItems: "center", gap: "48px",
    padding: "80px 48px",
    background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)",
    minHeight: "580px", position: "relative", overflow: "hidden",
  },
  heroContent: { flex: 1, zIndex: 2 },
  heroBadge: {
    display: "inline-block", background: "rgba(255,255,255,0.15)",
    color: "white", padding: "6px 16px", borderRadius: "20px",
    fontSize: "13px", fontWeight: "600", marginBottom: "24px",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  heroTitle: {
    fontSize: "52px", fontWeight: "800", color: "white",
    margin: "0 0 20px", lineHeight: "1.15", letterSpacing: "-1px",
  },
  heroTitleAccent: { color: "#93c5fd" },
  heroDesc: {
    fontSize: "17px", color: "rgba(255,255,255,0.8)",
    margin: "0 0 32px", lineHeight: "1.7", maxWidth: "480px",
  },
  heroBtns: { display: "flex", gap: "12px", marginBottom: "48px" },
  // White button — pops on the blue hero background
  heroPrimaryBtn: {
    padding: "14px 28px", background: "white", color: "#1d4ed8",
    border: "none", borderRadius: "12px", fontSize: "16px",
    fontWeight: "700", cursor: "pointer", transition: "background 0.15s",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
  },
  heroSecondaryBtn: {
    padding: "14px 28px", background: "rgba(255,255,255,0.08)",
    color: "white", border: "2px solid rgba(255,255,255,0.25)",
    borderRadius: "12px", fontSize: "16px", fontWeight: "600",
    cursor: "pointer", transition: "background 0.15s",
  },
  heroStats: { display: "flex", alignItems: "center", gap: "0" },
  statDivider: { width: "1px", background: "rgba(255,255,255,0.2)", height: "36px", margin: "0 24px" },
  heroStat: {},
  heroStatNum:   { fontSize: "28px", fontWeight: "800", color: "white" },
  heroStatLabel: { fontSize: "11px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "2px" },

  // Hero visual / float cards
  heroVisual: {
    flex: 1, position: "relative", zIndex: 2,
    minHeight: "420px", display: "flex", alignItems: "center", justifyContent: "center",
  },
  heroCard1: {
    position: "absolute", top: "20px", left: "20px",
    background: "white", borderRadius: "14px", padding: "14px 18px",
    display: "flex", alignItems: "center", gap: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.13)", minWidth: "230px",
  },
  heroCard2: {
    position: "absolute", top: "100px", right: "0px",
    background: "white", borderRadius: "14px", padding: "14px 18px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.13)", minWidth: "210px",
  },
  heroCard3: {
    position: "absolute", top: "250px", left: "10px",
    background: "white", borderRadius: "14px", padding: "14px 18px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.13)", minWidth: "210px",
  },
  heroCard4: {
    position: "absolute", bottom: "10px", right: "10px",
    background: "white", borderRadius: "14px", padding: "14px 18px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.13)", minWidth: "210px",
  },
  hcAvatar: {
    width: "40px", height: "40px", borderRadius: "50%", background: "#1d4ed8",
    color: "white", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "700", fontSize: "16px", flexShrink: 0,
  },
  hcName:     { fontSize: "14px", fontWeight: "700", color: "#0f172a" },
  hcRole:     { fontSize: "12px", color: "#64748b" },
  hcIcon:     { fontSize: "20px", marginBottom: "6px" },
  hcJobTitle: { fontSize: "13px", fontWeight: "700", color: "#0f172a" },
  hcJobSub:   { fontSize: "12px", color: "#64748b" },
  decorCircle1: {
    position: "absolute", width: "300px", height: "300px",
    borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)",
    top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none",
  },
  decorCircle2: {
    position: "absolute", width: "480px", height: "480px",
    borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)",
    top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none",
  },

  // Features
  featuresSection: { padding: "80px 48px", background: "#f8fafc" },
  sectionHeader:   { textAlign: "center", marginBottom: "48px" },
  sectionTitle: { fontSize: "36px", fontWeight: "800", color: "#0f172a", margin: "0 0 12px", letterSpacing: "-0.5px" },
  sectionDesc:  { fontSize: "16px", color: "#64748b", margin: 0 },
  featuresGrid: {
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px", maxWidth: "1100px", margin: "0 auto",
  },
  featureCard: {
    background: "white", borderRadius: "16px", padding: "28px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "all 0.2s",
    border: "1px solid #f1f5f9", overflow: "hidden",
  },
  featureTitle: { fontSize: "17px", fontWeight: "700", margin: "0 0 8px" },
  featureDesc:  { fontSize: "14px", color: "#64748b", lineHeight: "1.6", margin: 0 },

  // About
  aboutOuter:   { background: "white" },
  aboutSection: {
    padding: "80px 48px", display: "flex",
    gap: "64px", alignItems: "center",
    maxWidth: "1100px", margin: "0 auto",
  },
  aboutLeft:  { flex: 1 },
  aboutBadge: {
    display: "inline-block", background: "#eff6ff", color: "#1d4ed8",
    padding: "6px 16px", borderRadius: "20px", fontSize: "13px",
    fontWeight: "600", marginBottom: "16px",
  },
  aboutTitle: { fontSize: "36px", fontWeight: "800", color: "#0f172a", margin: "0 0 16px", letterSpacing: "-0.5px" },
  aboutDesc:  { fontSize: "15px", color: "#64748b", lineHeight: "1.7", margin: "0 0 32px" },
  aboutStats: { display: "flex", gap: "32px", marginBottom: "24px" },
  aboutStat:  {},
  aboutStatNum:   { fontSize: "32px", fontWeight: "800", color: "#1d4ed8" },
  aboutStatLabel: { fontSize: "13px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" },
  techStack: { display: "flex", flexWrap: "wrap", gap: "8px" },
  techBadge: {
    background: "#f1f5f9", color: "#334155",
    padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "600",
  },
  aboutRight: { flex: 1, display: "flex", justifyContent: "center" },
  aboutCard: {
    background: "white", borderRadius: "20px", padding: "28px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0",
    width: "100%", maxWidth: "360px", overflow: "hidden",
  },
  aboutCardHeader: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" },
  aboutCardLogo: {
    width: "48px", height: "48px", background: "#1d4ed8", borderRadius: "12px",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "white", fontWeight: "700", fontSize: "18px", flexShrink: 0,
  },
  aboutCardTitle: { fontSize: "16px", fontWeight: "700", color: "#0f172a" },
  aboutCardSub:   { fontSize: "12px", color: "#94a3b8" },
  aboutCardDivider: { height: "1px", background: "#f1f5f9", marginBottom: "8px" },
  aboutCardRow: {
    display: "flex", justifyContent: "space-between",
    padding: "10px 12px", borderRadius: "8px",
  },
  aboutCardLabel: { fontSize: "13px", color: "#94a3b8" },
  aboutCardValue: { fontSize: "13px", fontWeight: "600", color: "#334155" },

  // CTA
  ctaSection: {
    background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
    padding: "80px 48px", textAlign: "center",
  },
  ctaTitle: { fontSize: "40px", fontWeight: "800", color: "white", margin: "0 0 16px", letterSpacing: "-0.5px" },
  ctaDesc:  { fontSize: "16px", color: "rgba(255,255,255,0.75)", margin: "0 0 32px" },
  ctaBtns:  { display: "flex", gap: "12px", justifyContent: "center" },
  ctaPrimaryBtn: {
    padding: "14px 32px", background: "white", color: "#1d4ed8",
    border: "none", borderRadius: "12px", fontSize: "16px",
    fontWeight: "700", cursor: "pointer", transition: "background 0.15s",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
  },
  ctaSecondaryBtn: {
    padding: "14px 32px", background: "transparent", color: "white",
    border: "2px solid rgba(255,255,255,0.35)", borderRadius: "12px",
    fontSize: "16px", fontWeight: "600", cursor: "pointer", transition: "background 0.15s",
  },

  // Footer
  footer: { background: "#0f172a", padding: "40px 48px 24px" },
  footerTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  footerBrand: { display: "flex", alignItems: "center", gap: "12px" },
  footerLogo: {
    width: "40px", height: "40px", background: "#1d4ed8", borderRadius: "10px",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "white", fontWeight: "700", fontSize: "16px",
  },
  footerTitle: { fontSize: "15px", fontWeight: "700", color: "white" },
  footerSub:   { fontSize: "12px", color: "#475569" },
  footerLinks: { display: "flex", gap: "4px" },
  footerLink: {
    padding: "8px 14px", background: "none", border: "none",
    color: "#64748b", cursor: "pointer", fontSize: "14px",
    transition: "color 0.15s", borderRadius: "6px",
  },
  footerDivider: { height: "1px", background: "#1e293b", marginBottom: "20px" },
  footerBottom: {
    display: "flex", justifyContent: "space-between",
    fontSize: "13px", color: "#475569",
  },
}

export default Landing