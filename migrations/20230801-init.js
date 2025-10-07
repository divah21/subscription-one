const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', async () => {
  const subscriptionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    planId: { type: String, required: true },
    status: { type: String, enum: ['active', 'cancelled', 'paused'], default: 'active' },
    startDate: { type: Date, default: Date.now },
    endDate: Date
  });

  await mongoose.model('Subscription', subscriptionSchema).init();
  console.log('Migration completed');
  process.exit(0);
});