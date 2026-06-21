import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { token } = useAuth();

  if (token) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div style={styles.page}>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.badge}>AI-Powered Training Analysis</div>
          <h1 style={styles.headline}>
            Your gym log is full.<br />
            <span style={styles.accent}>Your coach is empty.</span>
          </h1>
          <p style={styles.sub}>
            LiftIQ analyzes your workout history and tells you what it actually means —
            stalls, imbalances, and exactly what to fix this week.
          </p>
          <div style={styles.ctaRow}>
            <Link to="/register" style={styles.ctaPrimary}>Start for free</Link>
            <Link to="/login" style={styles.ctaSecondary}>Sign in</Link>
          </div>
          <p style={styles.hint}>No credit card required</p>
        </div>
      </section>

      {/* Stats bar */}
      <section style={styles.statsBar}>
        {[
          { number: '12+', label: 'API endpoints' },
          { number: 'AI', label: 'coaching engine' },
          { number: '∞', label: 'workouts tracked' },
          { number: '0', label: 'generic advice' },
        ].map((stat) => (
          <div key={stat.label} style={styles.stat}>
            <span style={styles.statNumber}>{stat.number}</span>
            <span style={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Everything your other apps miss</h2>
        <div style={styles.featureGrid}>
          {[
            {
              icon: '📈',
              title: 'Strength progress charts',
              desc: 'See exactly how your bench, squat, and deadlift have moved over time. Not guesses — your actual numbers.',
            },
            {
              icon: '🏆',
              title: 'Personal records tracker',
              desc: 'Every PR you\'ve ever hit, organized by exercise and muscle group. Know your bests at a glance.',
            },
            {
              icon: '⚖️',
              title: 'Muscle group balance',
              desc: 'Find out if you\'re doing 3x more chest than back before your shoulders start paying for it.',
            },
            {
              icon: '🤖',
              title: 'AI weekly analysis',
              desc: 'Your personal coach scans your last 4 weeks and tells you exactly what\'s working, what\'s stalling, and what to do next.',
            },
            {
              icon: '💬',
              title: 'Ask your coach anything',
              desc: '"How did I do on legs last month?" Your AI coach has read every workout you\'ve ever logged.',
            },
            {
              icon: '📂',
              title: 'Import from Strong & Hevy',
              desc: 'Already have months of data? Import your CSV and get instant insights on your full history.',
            },
          ].map((f) => (
            <div key={f.title} style={styles.featureCard}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={styles.howItWorks}>
        <h2 style={styles.sectionTitle}>How it works</h2>
        <div style={styles.steps}>
          {[
            { step: '01', title: 'Log your workouts', desc: 'Track every set, rep, and weight. Or import your existing data from Strong or Hevy instantly.' },
            { step: '02', title: 'See your data come alive', desc: 'Progress charts, PR records, and muscle group volume breakdown — all updated in real time.' },
            { step: '03', title: 'Get coached by AI', desc: 'Your AI coach analyzes your full history and tells you exactly what to focus on this week.' },
          ].map((s) => (
            <div key={s.step} style={styles.step}>
              <div style={styles.stepNumber}>{s.step}</div>
              <div>
                <h3 style={styles.stepTitle}>{s.title}</h3>
                <p style={styles.stepDesc}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaHeadline}>Stop logging. Start improving.</h2>
        <p style={styles.ctaSub}>Join athletes who actually know what their data means.</p>
        <Link to="/register" style={styles.ctaPrimary}>Get started free</Link>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <span style={styles.footerBrand}>LiftIQ</span>
        <span style={styles.footerSub}>Built by Merit Bhusal</span>
      </footer>

    </div>
  );
};

const styles = {
  page: {
    background: '#0a0a0a',
    minHeight: '100vh',
    color: '#fff',
    fontFamily: 'inherit',
  },

  // Hero
  hero: {
    padding: '6rem 2rem 4rem',
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  },
  badge: {
    background: 'rgba(59,130,246,0.15)',
    border: '1px solid rgba(59,130,246,0.3)',
    color: '#60a5fa',
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '500',
    letterSpacing: '0.02em',
  },
  headline: {
    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
    fontWeight: '800',
    lineHeight: '1.1',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  accent: {
    color: '#3b82f6',
  },
  sub: {
    fontSize: '1.15rem',
    color: '#888',
    lineHeight: '1.6',
    maxWidth: '560px',
    margin: 0,
  },
  ctaRow: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ctaPrimary: {
    background: '#3b82f6',
    color: '#fff',
    padding: '0.875rem 2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1rem',
    letterSpacing: '0.01em',
  },
  ctaSecondary: {
    background: 'transparent',
    color: '#888',
    padding: '0.875rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1rem',
    border: '1px solid #333',
  },
  hint: {
    color: '#444',
    fontSize: '0.85rem',
    margin: 0,
  },

  // Stats bar
  statsBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0',
    borderTop: '1px solid #1a1a1a',
    borderBottom: '1px solid #1a1a1a',
    padding: '2rem',
    flexWrap: 'wrap',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0 3rem',
    borderRight: '1px solid #1a1a1a',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#3b82f6',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  // Features
  features: {
    padding: '5rem 2rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: '3rem',
    letterSpacing: '-0.01em',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem',
  },
  featureCard: {
    background: '#111',
    border: '1px solid #1a1a1a',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    transition: 'border-color 0.2s',
  },
  featureIcon: {
    fontSize: '1.75rem',
  },
  featureTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    margin: 0,
    color: '#fff',
  },
  featureDesc: {
    fontSize: '0.875rem',
    color: '#666',
    lineHeight: '1.6',
    margin: 0,
  },

  // How it works
  howItWorks: {
    padding: '5rem 2rem',
    maxWidth: '700px',
    margin: '0 auto',
  },
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  step: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'flex-start',
  },
  stepNumber: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#3b82f6',
    letterSpacing: '0.05em',
    background: 'rgba(59,130,246,0.1)',
    border: '1px solid rgba(59,130,246,0.2)',
    borderRadius: '6px',
    padding: '0.3rem 0.6rem',
    flexShrink: 0,
    marginTop: '2px',
  },
  stepTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    margin: '0 0 0.4rem',
    color: '#fff',
  },
  stepDesc: {
    fontSize: '0.875rem',
    color: '#666',
    lineHeight: '1.6',
    margin: 0,
  },

  // CTA section
  ctaSection: {
    padding: '5rem 2rem',
    textAlign: 'center',
    borderTop: '1px solid #1a1a1a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.25rem',
  },
  ctaHeadline: {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: '800',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  ctaSub: {
    color: '#666',
    fontSize: '1rem',
    margin: 0,
  },

  // Footer
  footer: {
    padding: '2rem',
    borderTop: '1px solid #1a1a1a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerBrand: {
    fontWeight: '800',
    fontSize: '1rem',
    letterSpacing: '2px',
  },
  footerSub: {
    color: '#444',
    fontSize: '0.8rem',
  },
};

export default Landing;