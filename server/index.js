const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://liftiq-kappa.vercel.app',
  ],
  credentials: true,
}));app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/workouts', require('./routes/workouts'));

app.use('/api/ai', require('./routes/ai'));

app.get('/', (req, res) => res.send('LiftIQ API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Keep server warm on Render free tier
if (process.env.NODE_ENV === 'production') {
  const RENDER_URL = 'https://liftiq-api-jeco.onrender.com';
  setInterval(async () => {
    try {
      await fetch(RENDER_URL);
    } catch (err) {
      console.log('Ping failed:', err.message);
    }
  }, 10 * 60 * 1000); // every 10 minutes
}