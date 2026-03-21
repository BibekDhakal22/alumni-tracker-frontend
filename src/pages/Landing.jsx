import { useNavigate } from "react-router-dom"

function Landing() {
  const navigate = useNavigate()

  return (
    <div style={styles.wrapper}>

      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <div style={styles.navLogo}>AT</div>
          <div>
            <div style={styles.navTitle}>Alumni Tracker</div>
            <div style={styles.navSub}>Tribhuvan University</div>
          </div>
        </div>
        <div style={styles.navLinks}>
          <button style={styles.navLink} onClick={() => document.getElementById('features').scrollIntoView({behavior:'smooth'})}>Features</button>
          <button style={styles.navLink} onClick={() => document.getElementById('about').scrollIntoView({behavior:'smooth'})}>About</button>
          <button style={styles.loginBtn} onClick={() => navigate('/login')}>Sign In</button>
          <button style={styles.registerBtn} onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>🎓 Tribhuvan University — BCA Department</div>
          <h1 style={styles.heroTitle}>
            Connect, Grow &<br />
            <span style={styles.heroTitleAccent}>Stay Connected</span>
          </h1>
          <p style={styles.heroDesc}>
            The official alumni tracking system for BCA graduates.
            Find mentors, discover opportunities, attend events and
            stay connected with your batchmates.
          </p>
          <div style={styles.heroBtns}>
            <button style={styles.heroPrimaryBtn}
              onClick={() => navigate('/register')}
              onMouseEnter={e => e.currentTarget.style.background = '#1e40af'}
              onMouseLeave={e => e.currentTarget.style.background = '#1d4ed8'}
            >
              Join Alumni Network →
            </button>
            <button style={styles.heroSecondaryBtn}
              onClick={() => navigate('/login')}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              Sign In
            </button>
          </div>
          <div style={styles.heroStats}>
            {[
              { num: "500+", label: "Alumni" },
              { num: "50+", label: "Companies" },
              { num: "10+", label: "Batch Years" },
              { num: "100%", label: "Free" },
            ].map((s, i) => (
              <div key={i} style={styles.heroStat}>
                <div style={styles.heroStatNum}>{s.num}</div>
                <div style={styles.heroStatLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.heroVisual}>
          <div style={styles.heroCard1}>
            <div style={styles.hcAvatar}>B</div>
            <div>
              <div style={styles.hcName}>Bibek Sharma</div>
              <div style={styles.hcRole}>Frontend Developer · Batch 2021</div>
            </div>
          </div>
          <div style={styles.heroCard2}>
            <div style={styles.hcIcon}>💼</div>
            <div style={styles.hcJobTitle}>New Job Posted</div>
            <div style={styles.hcJobSub}>React Developer at Leapfrog</div>
          </div>
          <div style={styles.heroCard3}>
            <div style={styles.hcIcon}>🤝</div>
            <div style={styles.hcJobTitle}>Mentorship Accepted</div>
            <div style={styles.hcJobSub}>Sita Rai accepted your request</div>
          </div>
          <div style={styles.heroCard4}>
            <div style={styles.hcIcon}>🗓</div>
            <div style={styles.hcJobTitle}>Upcoming Event</div>
            <div style={styles.hcJobSub}>Annual Reunion — July 2026</div>
          </div>
          <div style={styles.decorCircle1} />
          <div style={styles.decorCircle2} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Everything you need</h2>
          <p style={styles.sectionDesc}>
            A complete platform built specifically for TU BCA alumni
          </p>
        </div>
        <div style={styles.featuresGrid}>
          {[
            { icon: "👥", title: "Alumni Directory", desc: "Search and connect with graduates from all batches across Nepal and abroad." },
            { icon: "💼", title: "Job Board", desc: "Alumni post exclusive job opportunities for fellow graduates and current students." },
            { icon: "🤝", title: "Mentorship", desc: "Request guidance from experienced alumni working at top companies." },
            { icon: "🗓", title: "Events", desc: "Stay updated on reunions, seminars, workshops and networking events." },
            { icon: "📊", title: "Analytics", desc: "Admins get real-time insights on employment trends and alumni distribution." },
            { icon: "📄", title: "PDF Export", desc: "Download your professional alumni profile as a PDF document." },
          ].map((f, i) => (
            <div key={i} style={styles.featureCard}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(29,78,216,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={styles.aboutSection}>
        <div style={styles.aboutLeft}>
          <div style={styles.aboutBadge}>About the Project</div>
          <h2 style={styles.aboutTitle}>Built for TU BCA Graduates</h2>
          <p style={styles.aboutDesc}>
            This Alumni Tracking System was developed as a final year BCA project
            at Tribhuvan University. It aims to bridge the gap between current
            students and graduates by providing a centralized platform for
            networking, mentorship and career development.
          </p>
          <div style={styles.aboutStats}>
            {[
              { num: "6+", label: "Core Features" },
              { num: "20+", label: "API Endpoints" },
              { num: "6", label: "Database Tables" },
            ].map((s, i) => (
              <div key={i} style={styles.aboutStat}>
                <div style={styles.aboutStatNum}>{s.num}</div>
                <div style={styles.aboutStatLabel}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={styles.techStack}>
            {["React.js", "Laravel", "MySQL", "Electron", "Tailwind CSS", "REST API"].map((t, i) => (
              <span key={i} style={styles.techBadge}>{t}</span>
            ))}
          </div>
        </div>
        <div style={styles.aboutRight}>
          <div style={styles.aboutCard}>
            <div style={styles.aboutCardHeader}>
              <div style={styles.aboutCardLogo}>AT</div>
              <div>
                <div style={styles.aboutCardTitle}>Alumni Tracker</div>
                <div style={styles.aboutCardSub}>BCA Final Year Project</div>
              </div>
            </div>
            <div style={styles.aboutCardDivider} />
            {[
              { label: "Institution", value: "Tribhuvan University" },
              { label: "Department", value: "BCA" },
              { label: "Technology", value: "React + Laravel" },
              { label: "Database", value: "MySQL" },
              { label: "Platform", value: "Web + Desktop" },
            ].map((item, i) => (
              <div key={i} style={styles.aboutCardRow}>
                <span style={styles.aboutCardLabel}>{item.label}</span>
                <span style={styles.aboutCardValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to join the network?</h2>
        <p style={styles.ctaDesc}>Create your alumni profile and stay connected with your batchmates</p>
        <div style={styles.ctaBtns}>
          <button style={styles.ctaPrimaryBtn}
            onClick={() => navigate('/register')}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >
            Get Started Free →
          </button>
          <button style={styles.ctaSecondaryBtn}
            onClick={() => navigate('/login')}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Sign In
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerTop}>
          <div style={styles.footerBrand}>
            <div style={styles.footerLogo}>AT</div>
            <div>
              <div style={styles.footerTitle}>Alumni Tracker</div>
              <div style={styles.footerSub}>Tribhuvan University — BCA Department</div>
            </div>
          </div>
          <div style={styles.footerLinks}>
            <button style={styles.footerLink} onClick={() => navigate('/login')}>Sign In</button>
            <button style={styles.footerLink} onClick={() => navigate('/register')}>Register</button>
            <button style={styles.footerLink} onClick={() => document.getElementById('features').scrollIntoView({behavior:'smooth'})}>Features</button>
          </div>
        </div>
        <div style={styles.footerDivider} />
        <div style={styles.footerBottom}>
          <span>© 2026 Alumni Tracker — Tribhuvan University BCA Department</span>
          <span>Built with React + Laravel</span>
        </div>
      </footer>

    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', fontFamily: 'sans-serif', background: 'white' },

  // Navbar
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 48px', background: 'white', borderBottom: '1px solid #f1f5f9',
    position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  navBrand: { display: 'flex', alignItems: 'center', gap: '12px' },
  navLogo: {
    width: '40px', height: '40px', background: '#1d4ed8', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: '700', fontSize: '16px',
  },
  navTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a' },
  navSub: { fontSize: '11px', color: '#94a3b8' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '8px' },
  navLink: {
    padding: '8px 16px', background: 'none', border: 'none',
    color: '#64748b', cursor: 'pointer', fontSize: '14px', fontWeight: '500',
  },
  loginBtn: {
    padding: '8px 20px', background: 'white', border: '1.5px solid #e2e8f0',
    borderRadius: '8px', color: '#374151', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
  },
  registerBtn: {
    padding: '8px 20px', background: '#1d4ed8', border: 'none',
    borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
  },

  // Hero
  hero: {
    display: 'flex', alignItems: 'center', gap: '48px',
    padding: '80px 48px', background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)',
    minHeight: '580px', position: 'relative', overflow: 'hidden',
  },
  heroContent: { flex: 1, zIndex: 2 },
  heroBadge: {
    display: 'inline-block', background: 'rgba(255,255,255,0.15)',
    color: 'white', padding: '6px 16px', borderRadius: '20px',
    fontSize: '13px', fontWeight: '600', marginBottom: '24px',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  heroTitle: {
    fontSize: '52px', fontWeight: '800', color: 'white',
    margin: '0 0 20px', lineHeight: '1.15', letterSpacing: '-1px',
  },
  heroTitleAccent: { color: '#93c5fd' },
  heroDesc: {
    fontSize: '17px', color: 'rgba(255,255,255,0.8)', margin: '0 0 32px',
    lineHeight: '1.7', maxWidth: '480px',
  },
  heroBtns: { display: 'flex', gap: '12px', marginBottom: '48px' },
  heroPrimaryBtn: {
    padding: '14px 28px', background: '#1d4ed8', color: 'white',
    border: '2px solid rgba(255,255,255,0.3)', borderRadius: '12px',
    fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s',
  },
  heroSecondaryBtn: {
    padding: '14px 28px', background: 'rgba(255,255,255,0.08)',
    color: 'white', border: '2px solid rgba(255,255,255,0.25)',
    borderRadius: '12px', fontSize: '16px', fontWeight: '600',
    cursor: 'pointer', transition: 'background 0.2s',
  },
  heroStats: { display: 'flex', gap: '32px' },
  heroStat: {},
  heroStatNum: { fontSize: '28px', fontWeight: '800', color: 'white' },
  heroStatLabel: { fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' },

  // Hero Visual
  heroVisual: { flex: 1, position: 'relative', zIndex: 2, minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroCard1: {
    position: 'absolute', top: '10px', left: '20px',
    background: 'white', borderRadius: '14px', padding: '14px 18px',
    display: 'flex', alignItems: 'center', gap: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)', minWidth: '220px',
  },
  hcAvatar: {
    width: '40px', height: '40px', borderRadius: '50%', background: '#1d4ed8',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '16px', flexShrink: 0,
  },
  hcName: { fontSize: '14px', fontWeight: '700', color: '#0f172a' },
  hcRole: { fontSize: '12px', color: '#64748b' },
  heroCard2: {
    position: 'absolute', top: '120px', right: '0px',
    background: 'white', borderRadius: '14px', padding: '14px 18px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)', minWidth: '200px',
  },
  heroCard3: {
    position: 'absolute', top: '240px', left: '10px',
    background: 'white', borderRadius: '14px', padding: '14px 18px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)', minWidth: '200px',
  },
  heroCard4: {
    position: 'absolute', bottom: '20px', right: '20px',
    background: 'white', borderRadius: '14px', padding: '14px 18px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)', minWidth: '200px',
  },
  hcIcon: { fontSize: '20px', marginBottom: '6px' },
  hcJobTitle: { fontSize: '13px', fontWeight: '700', color: '#0f172a' },
  hcJobSub: { fontSize: '12px', color: '#64748b' },
  decorCircle1: {
    position: 'absolute', width: '300px', height: '300px',
    borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)',
    top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  },
  decorCircle2: {
    position: 'absolute', width: '450px', height: '450px',
    borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)',
    top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  },

  // Features
  featuresSection: { padding: '80px 48px', background: '#f8fafc' },
  sectionHeader: { textAlign: 'center', marginBottom: '48px' },
  sectionTitle: { fontSize: '36px', fontWeight: '800', color: '#0f172a', margin: '0 0 12px', letterSpacing: '-0.5px' },
  sectionDesc: { fontSize: '16px', color: '#64748b', margin: 0 },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1100px', margin: '0 auto' },
  featureCard: {
    background: 'white', borderRadius: '16px', padding: '28px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.2s',
    border: '1px solid #f1f5f9',
  },
  featureIcon: { fontSize: '32px', marginBottom: '16px' },
  featureTitle: { fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px' },
  featureDesc: { fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: 0 },

  // About
  aboutSection: {
    padding: '80px 48px', background: 'white',
    display: 'flex', gap: '64px', alignItems: 'center', maxWidth: '1100px', margin: '0 auto',
  },
  aboutLeft: { flex: 1 },
  aboutBadge: {
    display: 'inline-block', background: '#eff6ff', color: '#1d4ed8',
    padding: '6px 16px', borderRadius: '20px', fontSize: '13px',
    fontWeight: '600', marginBottom: '16px',
  },
  aboutTitle: { fontSize: '36px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px', letterSpacing: '-0.5px' },
  aboutDesc: { fontSize: '15px', color: '#64748b', lineHeight: '1.7', margin: '0 0 32px' },
  aboutStats: { display: 'flex', gap: '32px', marginBottom: '24px' },
  aboutStat: {},
  aboutStatNum: { fontSize: '32px', fontWeight: '800', color: '#1d4ed8' },
  aboutStatLabel: { fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' },
  techStack: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  techBadge: {
    background: '#f1f5f9', color: '#334155', padding: '6px 14px',
    borderRadius: '20px', fontSize: '13px', fontWeight: '600',
  },
  aboutRight: { flex: 1, display: 'flex', justifyContent: 'center' },
  aboutCard: {
    background: 'white', borderRadius: '20px', padding: '32px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0',
    width: '100%', maxWidth: '360px',
  },
  aboutCardHeader: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' },
  aboutCardLogo: {
    width: '48px', height: '48px', background: '#1d4ed8', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: '700', fontSize: '18px',
  },
  aboutCardTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a' },
  aboutCardSub: { fontSize: '12px', color: '#94a3b8' },
  aboutCardDivider: { height: '1px', background: '#f1f5f9', marginBottom: '16px' },
  aboutCardRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '10px 0', borderBottom: '1px solid #f8fafc',
  },
  aboutCardLabel: { fontSize: '13px', color: '#94a3b8' },
  aboutCardValue: { fontSize: '13px', fontWeight: '600', color: '#334155' },

  // CTA
  ctaSection: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    padding: '80px 48px', textAlign: 'center',
  },
  ctaTitle: { fontSize: '40px', fontWeight: '800', color: 'white', margin: '0 0 16px', letterSpacing: '-0.5px' },
  ctaDesc: { fontSize: '16px', color: 'rgba(255,255,255,0.75)', margin: '0 0 32px' },
  ctaBtns: { display: 'flex', gap: '12px', justifyContent: 'center' },
  ctaPrimaryBtn: {
    padding: '14px 32px', background: 'white', color: '#1d4ed8',
    border: 'none', borderRadius: '12px', fontSize: '16px',
    fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s',
  },
  ctaSecondaryBtn: {
    padding: '14px 32px', background: 'transparent', color: 'white',
    border: '2px solid rgba(255,255,255,0.3)', borderRadius: '12px',
    fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s',
  },

  // Footer
  footer: { background: '#0f172a', padding: '40px 48px 24px' },
  footerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  footerBrand: { display: 'flex', alignItems: 'center', gap: '12px' },
  footerLogo: {
    width: '40px', height: '40px', background: '#1d4ed8', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: '700', fontSize: '16px',
  },
  footerTitle: { fontSize: '16px', fontWeight: '700', color: 'white' },
  footerSub: { fontSize: '12px', color: '#475569' },
  footerLinks: { display: 'flex', gap: '8px' },
  footerLink: {
    padding: '8px 16px', background: 'none', border: 'none',
    color: '#64748b', cursor: 'pointer', fontSize: '14px',
  },
  footerDivider: { height: '1px', background: '#1e293b', marginBottom: '20px' },
  footerBottom: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: '13px', color: '#475569',
  },
}

export default Landing