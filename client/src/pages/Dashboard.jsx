import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await api.get('/workouts');
        setWorkouts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.sub}>{user?.email}</p>
        </div>
        <Link to="/log" style={styles.logButton}>+ Log Workout</Link>
      </div>

      {loading ? (
        <p style={styles.muted}>Loading...</p>
      ) : workouts.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.muted}>No workouts yet.</p>
          <Link to="/log" style={styles.logButton}>Log your first workout</Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {workouts.map((workout) => (
            <div key={workout._id} style={styles.card}>
              <p style={styles.date}>
                {new Date(workout.date).toLocaleDateString()}
              </p>
              {workout.notes && (
                <p style={styles.notes}>{workout.notes}</p>
              )}
              <div style={styles.exercises}>
                {workout.exercises.map((ex, i) => (
                  <div key={i} style={styles.exercise}>
                    <span style={styles.exName}>{ex.name}</span>
                    <span style={styles.exSets}>{ex.sets.length} sets</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '2rem', background: '#0a0a0a', minHeight: '100vh' },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '2rem',
  },
  title: { color: '#fff', fontSize: '1.8rem', margin: 0 },
  sub: { color: '#666', margin: '0.25rem 0 0' },
  logButton: {
    background: '#3b82f6', color: '#fff', padding: '0.6rem 1.2rem',
    borderRadius: '8px', textDecoration: 'none', fontWeight: '600',
  },
  muted: { color: '#555' },
  empty: { textAlign: 'center', marginTop: '4rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' },
  card: { background: '#1a1a1a', borderRadius: '12px', padding: '1.25rem' },
  date: { color: '#3b82f6', fontWeight: '600', margin: '0 0 0.5rem' },
  notes: { color: '#aaa', fontSize: '0.875rem', margin: '0 0 0.75rem' },
  exercises: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  exercise: { display: 'flex', justifyContent: 'space-between' },
  exName: { color: '#fff', fontSize: '0.9rem' },
  exSets: { color: '#666', fontSize: '0.9rem' },
};

export default Dashboard;