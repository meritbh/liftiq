import { useState } from 'react';
import Papa from 'papaparse';
import api from '../api/axios';

const Import = () => {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState([]);
  const [parsed, setParsed] = useState([]);
  const [loading, setLoading] = useState(false);

  const parseStrong = (rows) => {
    const workoutMap = {};

    rows.forEach((row) => {
      if (!row.Date || !row['Exercise Name']) return;
      const date = row.Date;
      const key = date;

      if (!workoutMap[key]) {
        workoutMap[key] = { date, notes: '', exercises: {} };
      }

      const exName = row['Exercise Name'];
      if (!workoutMap[key].exercises[exName]) {
        workoutMap[key].exercises[exName] = {
          name: exName,
          muscleGroup: 'other',
          sets: [],
        };
      }

      workoutMap[key].exercises[exName].sets.push({
        reps: Number(row.Reps) || 0,
        weight: Number(row.Weight) || 0,
        unit: 'lbs',
      });
    });

    return Object.values(workoutMap).map((w) => ({
      ...w,
      exercises: Object.values(w.exercises),
    }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStatus('');
    setError('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const workouts = parseStrong(results.data);
        setParsed(workouts);
        setPreview(workouts.slice(0, 3));
        setStatus(`Found ${workouts.length} workouts ready to import`);
      },
      error: () => setError('Failed to parse CSV. Make sure it is a Strong export.'),
    });
  };

  const handleImport = async () => {
    if (parsed.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/workouts/import', { workouts: parsed });
      setStatus(`Successfully imported ${res.data.imported} workouts!`);
      setParsed([]);
      setPreview([]);
    } catch (err) {
      setError('Import failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Import Workouts</h1>
      <p style={styles.sub}>
        Import your existing workout history from the Strong app.
        Export your data from Strong → Settings → Export Data, then upload the CSV here.
      </p>

      <div style={styles.uploadArea}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFile}
          style={styles.fileInput}
          id="csvUpload"
        />
        <label htmlFor="csvUpload" style={styles.uploadLabel}>
          📂 Choose CSV File
        </label>
      </div>

      {status && <p style={styles.success}>{status}</p>}
      {error && <p style={styles.error}>{error}</p>}

      {preview.length > 0 && (
        <>
          <h2 style={styles.previewTitle}>Preview (first 3 workouts)</h2>
          <div style={styles.grid}>
            {preview.map((w, i) => (
              <div key={i} style={styles.card}>
                <p style={styles.date}>{new Date(w.date).toLocaleDateString()}</p>
                {w.exercises.map((ex, j) => (
                  <p key={j} style={styles.exercise}>
                    {ex.name} — {ex.sets.length} sets
                  </p>
                ))}
              </div>
            ))}
          </div>

          <button
            style={styles.importButton}
            onClick={handleImport}
            disabled={loading}
          >
            {loading ? 'Importing...' : `Import All ${parsed.length} Workouts`}
          </button>
        </>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '2rem', background: '#0a0a0a', minHeight: '100vh', maxWidth: '700px', margin: '0 auto' },
  title: { color: '#fff', fontSize: '1.8rem', margin: '0 0 0.5rem' },
  sub: { color: '#666', margin: '0 0 2rem', lineHeight: '1.6' },
  uploadArea: { marginBottom: '1.5rem' },
  fileInput: { display: 'none' },
  uploadLabel: {
    display: 'inline-block', padding: '0.75rem 1.5rem',
    background: '#1a1a1a', border: '1px dashed #444',
    borderRadius: '8px', color: '#ccc', cursor: 'pointer', fontSize: '0.9rem',
  },
  success: { color: '#10b981', marginBottom: '1rem' },
  error: { color: '#f87171', marginBottom: '1rem' },
  previewTitle: { color: '#fff', fontSize: '1rem', margin: '0 0 1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  card: { background: '#1a1a1a', borderRadius: '10px', padding: '1rem' },
  date: { color: '#3b82f6', fontWeight: '600', margin: '0 0 0.5rem', fontSize: '0.9rem' },
  exercise: { color: '#888', fontSize: '0.8rem', margin: '0 0 0.25rem' },
  importButton: {
    padding: '0.875rem 2rem', background: '#3b82f6', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '1rem',
    fontWeight: '600', cursor: 'pointer',
  },
};

export default Import;