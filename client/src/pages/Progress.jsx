import { useState, useEffect } from 'react';
import api from '../api/axios';

const LineChart = ({ data }) => {
  const width = 600;
  const height = 200;
  const padding = 40;

  const weights = data.map((d) => d.weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const range = maxW - minW || 1;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = padding + ((maxW - d.weight) / range) * (height - padding * 2);
    return { x, y, ...d };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height + 40}`}>
      <polyline
        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none" stroke="#3b82f6" strokeWidth={2}
      />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill="#3b82f6" />
          <text x={p.x} y={height + 30} textAnchor="middle" fill="#888" fontSize={10}>
            {p.date}
          </text>
          <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#fff" fontSize={11}>
            {p.weight}
          </text>
        </g>
      ))}
    </svg>
  );
};

const Progress = () => {
  const [exercises, setExercises] = useState([]);
  const [selected, setSelected] = useState('');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await api.get('/workouts');
        const names = new Set();
        res.data.forEach((w) => w.exercises.forEach((ex) => names.add(ex.name)));
        const list = Array.from(names);
        setExercises(list);
        if (list.length > 0) setSelected(list[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWorkouts();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const fetchProgress = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/workouts/stats/progress/${encodeURIComponent(selected)}`);
        setChartData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [selected]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Progress</h1>
      <p style={styles.sub}>Track your strength over time for any lift</p>

      {exercises.length === 0 ? (
        <p style={styles.muted}>No workouts logged yet.</p>
      ) : (
        <>
          <select
            style={styles.select}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {exercises.map((ex) => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>

          {loading ? (
            <p style={styles.muted}>Loading...</p>
          ) : chartData.length < 2 ? (
            <p style={styles.muted}>Log at least 2 sessions of {selected} to see a chart.</p>
          ) : (
            <div style={styles.chartCard}>
              <h2 style={styles.chartTitle}>{selected} — Max Weight Over Time</h2>
              <LineChart data={chartData} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '2rem', background: '#0a0a0a', minHeight: '100vh' },
  title: { color: '#fff', fontSize: '1.8rem', margin: '0 0 0.25rem' },
  sub: { color: '#666', margin: '0 0 1.5rem' },
  select: {
    padding: '0.6rem 1rem', background: '#1a1a1a', border: '1px solid #333',
    borderRadius: '8px', color: '#fff', fontSize: '0.9rem',
    marginBottom: '1.5rem', minWidth: '200px',
  },
  chartCard: { background: '#1a1a1a', borderRadius: '12px', padding: '1.5rem' },
  chartTitle: { color: '#fff', fontSize: '1rem', marginBottom: '1rem' },
  muted: { color: '#555' },
};

export default Progress;