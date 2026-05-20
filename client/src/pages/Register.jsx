import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', { email, password });
      login(res.data.token, { email: res.data.email, userId: res.data.userId });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={styles.button} type="submit">Register</button>
        </form>
        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', height: '90vh', background: '#0a0a0a',
  },
  card: {
    background: '#1a1a1a', padding: '2.5rem',
    borderRadius: '12px', width: '100%', maxWidth: '400px',
  },
  title: { color: '#fff', marginBottom: '1.5rem', fontSize: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: {
    padding: '0.75rem 1rem', borderRadius: '8px',
    border: '1px solid #333', background: '#111',
    color: '#fff', fontSize: '1rem',
  },
  button: {
    padding: '0.75rem', background: '#3b82f6',
    color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '1rem', cursor: 'pointer', fontWeight: '600',
  },
  error: { color: '#f87171', marginBottom: '1rem' },
  footer: { color: '#888', marginTop: '1rem', textAlign: 'center' },
  link: { color: '#3b82f6' },
};

export default Register;