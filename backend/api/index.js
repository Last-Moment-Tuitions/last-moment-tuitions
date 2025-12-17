const path = require('path');
// Try loading from root if not in backend
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config(); // Fallback to default (current dir)

const express = require('express');
const cors = require('cors');
const dbConnect = require('../db/connect');

const app = express();

// Robust CORS for Vercel
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Trust any origin
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Explicit OPTIONS handler for preflight
app.options('*', cors());
app.use(express.json());

// Connect to DB immediately
dbConnect().catch(err => console.error("Database connection error:", err));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express Backend!' });
});

app.get('/', (req, res) => {
  res.send('Backend is running');
});

const pagesRouter = require('./pages');
app.use('/api/pages', pagesRouter);

const foldersRouter = require('./folders');
app.use('/api/folders', foldersRouter);

// For local development
if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

module.exports = app;
