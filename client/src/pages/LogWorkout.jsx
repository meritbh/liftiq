import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const MUSCLE_GROUPS = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'core'];

const LogWorkout = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState([
    { name: '', muscleGroup: 'chest', sets: [{ reps: '', weight: '' }] }
  ]);
  const [error, setError] = useState('');

  const addExercise = () => {
    setExercises([...exercises, { name: '', muscleGroup: 'chest', sets: [{ reps: '', weight: '' }] }]);
  };

  const addSet = (exIndex) => {
    const updated = [...exercises];
    updated[exIndex].sets.push({ reps: '', weight: '' });
    setExercises(updated);
  };

  const updateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const updateSet = (exIndex, setIndex, field, value) => {
    const updated = [...exercises];
    updated[exIndex].sets[setIndex][field] = value;
    setExercises(updated);
  };

  const handleSubmit = async () => {
    setError('');
    try {
      await api.post('/workouts', {
        notes,
        date: new Date(),
        exercises: exercises.map((ex) => ({
          ...ex,
          sets: ex.sets.map((s) => ({
            reps: Number(s.reps),
            weight: Number(s.weight),
          })),
        })),
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save workout');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Log Workout</h1>
      {error && <p style={styles.error}>{error}</p>}

      <textarea
        style={styles.textarea}
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
      />

      {exercises.map((ex, exIndex) => (
        <div key={exIndex} style={styles.card}>
          <div style={styles.exHeader}>
            <input
              style={{ ...styles.input, flex: 1 }}
              placeholder="Exercise name (e.g. Bench Press)"
              value={ex.name}
              onChange={(e) => updateExercise(exIndex, 'name', e.target.value)}
            />
            <select
              style={styles.select}
              value={ex.muscleGroup}
              onChange={(e) => updateExercise(exIndex, 'muscleGroup', e.target.value)}
            >
              {MUSCLE_GROUPS.map((mg) => (
                <option key={mg} value={mg}>{mg}</option>
              ))}
            </select>
          </div>

          <div style={styles.setsHeader}>
            <span style={styles.label}>Set</span>
            <span style={styles.label}>Reps</span>
            <span style={styles.label}>Weight (lbs)</span>
          </div>

          {ex.sets.map((set, setIndex) => (
            <div key={setIndex} style={styles.setRow}>
              <span style={styles.setNum}>{setIndex + 1}</span>
              <input
                style={styles.setInput}
                type="number"
                placeholder="0"
                value={set.reps}
                onChange={(e) => updateSet(exIndex, setIndex, 'reps', e.target.value)}
              />
              <input
                style={styles.setInput}
                type="number"
                placeholder="0"
                value={set.weight}
                onChange={(e) => updateSet(exIndex, setIndex, 'weight', e.target.value)}
              />
            </div>
          ))}

          <button style={styles.addSet} onClick={() => addSet(exIndex)}>+ Add Set</button>
        </div>
      ))}

      <button style={styles.addExercise} onClick={addExercise}>+ Add Exercise</button>
      <button style={styles.saveButton} onClick={handleSubmit}>Save Workout</button>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', background: '#0a0a0a', minHeight: '100vh', maxWidth: '600px', margin: '0 auto' },
  title: { color: '#fff', marginBottom: '1.5rem' },
  textarea: {
    width: '100%', padding: '0.75rem', background: '#1a1a1a',
    border: '1px solid #333', borderRadius: '8px', color: '#fff',
    fontSize: '0.9rem', marginBottom: '1rem', resize: 'vertical', boxSizing: 'border-box',
  },
  card: { background: '#1a1a1a', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' },
  exHeader: { display: 'flex', gap: '0.75rem', marginBottom: '1rem' },
  input: {
    padding: '0.6rem 0.75rem', background: '#111', border: '1px solid #333',
    borderRadius: '8px', color: '#fff', fontSize: '0.9rem',
  },
  select: {
    padding: '0.6rem 0.75rem', background: '#111', border: '1px solid #333',
    borderRadius: '8px', color: '#fff', fontSize: '0.9rem',
  },
  setsHeader: { display: 'grid', gridTemplateColumns: '40px 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' },
  label: { color: '#666', fontSize: '0.8rem', textTransform: 'uppercase' },
  setRow: { display: 'grid', gridTemplateColumns: '40px 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' },
  setNum: { color: '#666', display: 'flex', alignItems: 'center', fontSize: '0.9rem' },
  setInput: {
    padding: '0.5rem', background: '#111', border: '1px solid #333',
    borderRadius: '6px', color: '#fff', fontSize: '0.9rem', textAlign: 'center',
  },
  addSet: {
    background: 'transparent', border: '1px solid #333', color: '#888',
    padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer',
    fontSize: '0.8rem', marginTop: '0.5rem',
  },
  addExercise: {
    width: '100%', padding: '0.75rem', background: 'transparent',
    border: '1px dashed #333', color: '#666', borderRadius: '8px',
    cursor: 'pointer', fontSize: '0.9rem', marginBottom: '1rem',
  },
  saveButton: {
    width: '100%', padding: '0.875rem', background: '#3b82f6',
    color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
  },
  error: { color: '#f87171', marginBottom: '1rem' },
};

export default LogWorkout;