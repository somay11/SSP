const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:5178',
  'http://localhost:5179',
  'http://localhost:5180'
];

app.use(cors({ 
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.CLIENT_URL === origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, 
  credentials: true 
}));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { success: false, message: 'Too many requests, slow down!' } });
app.use('/api', limiter);

// ── DB Connection ─────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart_study_planner')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',   require('./routes/auth'));
app.use('/api/tasks',  require('./routes/tasks'));
app.use('/api/notes',  require('./routes/notes'));
app.use('/api/timer',  require('./routes/timer'));
app.use('/api/streak', require('./routes/streak'));
app.use('/api/ai',     require('./routes/ai'));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ success: true, message: 'Server is running 🚀', timestamp: new Date() }));

// ── Production Static Serving ──────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the 'public' directory (where Docker Stage 1 copies them)
  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));
  
  // Handle SPA routing: serve index.html for any non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(publicPath, 'index.html'));
    } else {
      res.status(404).json({ success: false, message: 'API route not found' });
    }
  });
} else {
  // ── 404 (Development) ──────────────────────────────────────────────────────────
  app.use((req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` }));
}

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

module.exports = app;
