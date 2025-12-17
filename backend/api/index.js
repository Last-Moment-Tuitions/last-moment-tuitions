const path = require('path');
// Try loading from root if not in backend
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config(); // Fallback to default (current dir)

const app = require('../src/app');

// For local development
if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

module.exports = app;
