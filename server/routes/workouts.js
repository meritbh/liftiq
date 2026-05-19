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

module.exports = router;