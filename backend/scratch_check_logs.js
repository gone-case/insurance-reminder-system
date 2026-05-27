require('dotenv').config();
const mongoose = require('mongoose');
const NotificationLog = require('./models/NotificationLog');

async function checkLogs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const logs = await NotificationLog.find().sort({ createdAt: -1 }).limit(10);
    console.log('Recent Logs:', JSON.stringify(logs, null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkLogs();
