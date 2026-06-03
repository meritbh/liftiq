import { useEffect, useState } from 'react';
import api from '../api/axios';

const COLORS = {
  chest: '#3b82f6',
  back: '#10b981',
  shoulders: '#f59e0b',
  biceps: '#8b5cf6',
  triceps: '#ec4899',
  legs: '#ef4444',
  core: '#06b6d4',
};

const BarChart = ({ data }) => {
  const max = Math.max(...data.map((d) => d.sets));
  const height = 200;
  const barWidth = 40;
  const gap = 20;
  const width = data.length * (barWidth + gap) + gap;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height + 40}`}>
      {data.map((d, i) => {
        const barHeight = (d.sets / max) * height;
        const x = gap + i * (barWidth + gap);
        const y = height - barHeight;
        return (
          <g key={d.muscle}>
            <rect
              x={x} y={y} width={barWidth} height={barHeight}
              fill={COLORS[d.muscle] || '#3b82f6'}
              rx={4}
            />
            <text
              x={x + barWidth / 2} y={height + 16}
              textAnchor="middle" fill="#888" fontSize={11}
            >
              {d.muscle}
            </text>
            <text
              x={x + barWidth / 2} y={y - 6}
              textAnchor="middle" fill="#fff" fontSize={11}
            >
              {d.sets}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const Records = () => {
  const [prs, setPrs] = useState({});
  const [volume, setVolume] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prsRes, volumeRes] = await Promise.all([
          api.get('/workouts/stats/prs'),
          api.get('/workouts/stats/volume'),
        ]);
        setPrs(prsRes.data);
        setVolume(volumeRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={styles.container}><p style={styles.muted}>Loading...</p></div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Records & Volume</h1>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Muscle Group Volume — Last 4 Weeks</h2>
        <p style={styles.sub}>Total sets per muscle group</p>
        {volume.length === 0 ? (
          <p style={styles.muted}>No data yet — log some workouts first.</p>
        ) : (
          <div style={styles.chartCard}>
            <BarChart data={volume} />
          </div>
        )}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Personal Records</h2>
        {Object.keys(prs).length === 0 ? (
          <p style={styles.muted}>No records yet.</p>
        ) : (
          <div style={styles.grid}>
            {Object.entries(prs).map(([exercise, pr]) => (
              <div key={exercise} style={styles.prCard}>
                <div style={{ ...styles.prAccent, background: COLORS[pr.muscleGroup] || '#3b82f6' }} />
                <div style={styles.prContent}>
                  <p style={styles.prExercise}>{exercise}</p>
                  <p style={styles.prWeight}>{pr.weight} lbs</p>
                  <p style={styles.prDetail}>{pr.reps} reps · {new Date(pr.date).toLocaleDateString()}</p>
                  <span style={styles.prTag}>{pr.muscleGroup}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', background: '#0a0a0a', minHeight: '100vh' },
  title: { color: '#fff', fontSize: '1.8rem', margin: '0 0 2rem' },
  section: { marginBottom: '3rem' },
  sectionTitle: { color: '#fff', fontSize: '1.2rem', margin: '0 0 0.25rem' },
  sub: { color: '#666', fontSize: '0.875rem', margin: '0 0 1rem' },
  chartCard: { background: '#1a1a1a', borderRadius: '12px', padding: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' },
  prCard: { background: '#1a1a1a', borderRadius: '12px', overflow: 'hidden', display: 'flex' },
  prAccent: { width: '4px', flexShrink: 0 },
  prContent: { padding: '1rem 1.25rem' },
  prExercise: { color: '#fff', fontWeight: '600', margin: '0 0 0.25rem', fontSize: '0.95rem' },
  prWeight: { color: '#3b82f6', fontSize: '1.5rem', fontWeight: '700', margin: '0 0 0.25rem' },
  prDetail: { color: '#666', fontSize: '0.8rem', margin: '0 0 0.5rem' },
  prTag: { background: '#222', color: '#888', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' },
  muted: { color: '#555' },
};

export default Records;