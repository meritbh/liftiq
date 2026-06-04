import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.brand}>LiftIQ</Link>
      <div style={styles.links}>
        {token ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/progress" style={styles.link}>Progress</Link>
            <Link to="/records" style={styles.link}>Records</Link>
            <Link to="/log" style={styles.link}>Log</Link>
            <Link to="/coach" style={styles.link}>Coach</Link>
            <Link to="/import" style={styles.link}>Import</Link>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '1rem 2rem',
    background: '#111', color: '#fff',
  },
  brand: {
    color: '#fff', textDecoration: 'none',
    fontSize: '1.4rem', fontWeight: 'bold', letterSpacing: '2px',
  },
  links: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  link: { color: '#ccc', textDecoration: 'none', fontSize: '0.9rem' },
  button: {
    background: 'transparent', border: '1px solid #555',
    color: '#ccc', padding: '0.4rem 1rem', borderRadius: '4px',
    cursor: 'pointer', fontSize: '0.9rem',
  },
};

export default Navbar;