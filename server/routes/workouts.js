const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');

// POST /api/workouts — log a new workout
router.post('/', auth, async (req, res) => {
  const { date, notes, exercises } = req.body;

  try {
    const workout = new Workout({
      userId: req.user.id,
      date: date || Date.now(),
      notes,
      exercises
    });

    await workout.save();
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/workouts — get all workouts for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id })
      .sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/workouts/:id — get single workout
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    if (workout.userId.toString() !== req.user.id)
      return res.status(401).json({ message: 'Not authorized' });

    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/workouts/:id — delete a workout
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    if (workout.userId.toString() !== req.user.id)
      return res.status(401).json({ message: 'Not authorized' });

    await workout.deleteOne();
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/workouts/stats/prs — get personal records for each exercise
router.get('/stats/prs', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id });
    const prs = {};

    workouts.forEach((workout) => {
      workout.exercises.forEach((ex) => {
        const maxWeight = Math.max(...ex.sets.map((s) => s.weight));
        const maxReps = ex.sets.find((s) => s.weight === maxWeight)?.reps || 0;

        if (!prs[ex.name] || maxWeight > prs[ex.name].weight) {
          prs[ex.name] = {
            weight: maxWeight,
            reps: maxReps,
            date: workout.date,
            muscleGroup: ex.muscleGroup,
          };
        }
      });
    });

    res.json(prs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/workouts/stats/volume — muscle group volume over last 4 weeks
router.get('/stats/volume', auth, async (req, res) => {
  try {
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const workouts = await Workout.find({
      userId: req.user.id,
      date: { $gte: fourWeeksAgo },
    });

    const volume = {};

    workouts.forEach((workout) => {
      workout.exercises.forEach((ex) => {
        const totalSets = ex.sets.length;
        if (!volume[ex.muscleGroup]) volume[ex.muscleGroup] = 0;
        volume[ex.muscleGroup] += totalSets;
      });
    });

    const result = Object.entries(volume).map(([muscle, sets]) => ({
      muscle,
      sets,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/workouts/stats/progress/:exercise — strength over time for one lift
router.get('/stats/progress/:exercise', auth, async (req, res) => {
  try {
    const exerciseName = decodeURIComponent(req.params.exercise);
    const workouts = await Workout.find({ userId: req.user.id }).sort({ date: 1 });

    const progress = [];

    workouts.forEach((workout) => {
      const match = workout.exercises.find(
        (ex) => ex.name.toLowerCase() === exerciseName.toLowerCase()
      );
      if (match) {
        const maxWeight = Math.max(...match.sets.map((s) => s.weight));
        progress.push({
          date: new Date(workout.date).toLocaleDateString(),
          weight: maxWeight,
        });
      }
    });

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/workouts/import — bulk import from CSV
router.post('/import', auth, async (req, res) => {
  try {
    const { workouts } = req.body;

    const docs = workouts.map((w) => ({
      userId: req.user.id,
      date: new Date(w.date),
      notes: w.notes || '',
      exercises: w.exercises,
    }));

    await Workout.insertMany(docs);
    res.json({ imported: docs.length });
  } catch (err) {
    res.status(500).json({ message: 'Import failed' });
  }
});

module.exports = router;