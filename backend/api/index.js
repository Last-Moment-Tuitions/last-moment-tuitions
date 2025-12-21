const express = require('express');
const app = express();

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express Backend!' });
});

app.get('/', (req, res) => {
  res.send('Backend is running');
});

// For local development
if (require.main === module) {
  const port = process.env.PORT || 3005;
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

module.exports = app;
