const path = require('path');
// Try loading from root if not in backend
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config(); // Fallback to default (current dir)

const express = require('express');
const cors = require('cors');
const dbConnect = require('../db/connect');

const app = express();

app.use(cors());
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
