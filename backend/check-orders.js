const mongoose = require('mongoose');
const fs = require('fs');

async function test() {
  await mongoose.connect('mongodb://localhost:27017/lmt-backend');
  const db = mongoose.connection.db;
  const orders = await db.collection('orders').find().sort({ created_at: -1 }).limit(1).toArray();
  fs.writeFileSync('orders-latest.json', JSON.stringify(orders, null, 2), 'utf8');
  process.exit(0);
}
test().catch(console.error);
