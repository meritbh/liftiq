const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Helper — format workout history into readable text for the AI
const formatWorkoutHistory = (workouts) => {
  if (workouts.length === 0) return 'No workout history yet.';

  return workouts
    .slice(0, 30) // last 30 workouts max to stay within token limits
    .map((w) => {
      const date = new Date(w.date).toLocaleDateString();
      const exercises = w.exercises
        .map((ex) => {
          const sets = ex.sets
            .map((s) => `${s.reps} reps @ ${s.weight}lbs`)
            .join(', ');
          return `  - ${ex.name} (${ex.muscleGroup}): ${sets}`;
        })
        .join('\n');
      return `${date}:\n${exercises}`;
    })
    .join('\n\n');
};

// Helper — compute basic stats to give the AI more context
const computeStats = (workouts) => {
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  const recent = workouts.filter((w) => new Date(w.date) >= fourWeeksAgo);

  const volume = {};
  const exerciseHistory = {};

  recent.forEach((w) => {
    w.exercises.forEach((ex) => {
      // Volume per muscle group
      if (!volume[ex.muscleGroup]) volume[ex.muscleGroup] = 0;
      volume[ex.muscleGroup] += ex.sets.length;

      // Max weight per exercise over time
      const maxWeight = Math.max(...ex.sets.map((s) => s.weight));
      if (!exerciseHistory[ex.name]) exerciseHistory[ex.name] = [];
      exerciseHistory[ex.name].push({ date: w.date, maxWeight });
    });
  });

  // Detect stalls — exercise with no weight increase in last 3 sessions
  const stalls = [];
  Object.entries(exerciseHistory).forEach(([name, sessions]) => {
    if (sessions.length >= 3) {
      const last3 = sessions.slice(-3);
      const weights = last3.map((s) => s.maxWeight);
      if (weights.every((w) => w === weights[0])) {
        stalls.push(`${name} (stuck at ${weights[0]}lbs for ${last3.length} sessions)`);
      }
    }
  });

  return { volume, stalls, recentWorkoutCount: recent.length };
};

// POST /api/ai/analyze — get weekly analysis
router.post('/analyze', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({ date: -1 });
    const history = formatWorkoutHistory(workouts);
    const stats = computeStats(workouts);

    const volumeText = Object.entries(stats.volume)
      .map(([muscle, sets]) => `${muscle}: ${sets} sets`)
      .join(', ');

    const stallText = stats.stalls.length > 0
      ? `Detected stalls: ${stats.stalls.join('; ')}`
      : 'No stalls detected';

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: `You are LiftIQ, an expert AI strength coach. You analyze workout data and give specific, actionable coaching insights. Be direct and specific — reference actual exercises, weights, and dates from the data. Never give generic advice. Format your response with clear sections using emoji headers.`,
      messages: [
        {
          role: 'user',
          content: `Analyze my training for the past 4 weeks and give me a detailed coaching report.

Volume summary (last 4 weeks): ${volumeText || 'No data'}
${stallText}
Total recent workouts: ${stats.recentWorkoutCount}

Full workout history:
${history}

Give me:
💪 Overall Assessment — how is my training looking overall
⚖️ Balance Analysis — am I training muscle groups evenly
📈 Progress Highlights — what's improving
⚠️ Issues to Address — stalls, imbalances, or concerns
🎯 This Week's Focus — 3 specific actionable recommendations`
        }
      ]
    });

    res.json({ analysis: message.content[0].text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'AI analysis failed' });
  }
});

// POST /api/ai/chat — ask the AI coach a question
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    const workouts = await Workout.find({ userId: req.user.id }).sort({ date: -1 });
    const history = formatWorkoutHistory(workouts);
    const stats = computeStats(workouts);

    const volumeText = Object.entries(stats.volume)
      .map(([muscle, sets]) => `${muscle}: ${sets} sets`)
      .join(', ');

    // Build conversation messages
    const messages = [
      // Inject workout context as first message
      {
        role: 'user',
        content: `Here is my complete workout history for context:\n\n${history}\n\nVolume last 4 weeks: ${volumeText}\nStalls: ${stats.stalls.join(', ') || 'none'}`
      },
      {
        role: 'assistant',
        content: "Got it — I've reviewed your complete workout history and I'm ready to help coach you. What would you like to know?"
      },
      // Add previous conversation
      ...conversationHistory,
      // Add new message
      { role: 'user', content: message }
    ];

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: `You are LiftIQ, an expert AI strength coach with access to the user's complete workout history. Always reference their actual data — specific exercises, weights, dates, and trends. Be direct, specific, and actionable. Never give generic fitness advice that ignores their data.`,
      messages
    });

    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'AI chat failed' });
  }
});

module.exports = router;