require('dotenv').config();
const mongoose = require('mongoose');
const NotificationLog = require('./models/NotificationLog');

async function checkLogs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const logs = await NotificationLog.find().sort({ createdAt: -1 }).limit(50);
    
    const stats = {
      total: logs.length,
      sent: logs.filter(l => l.status === 'sent').length,
      failed: logs.filter(l => l.status === 'failed').length,
    };
    
    console.log('Stats:', stats);
    console.log('Sample Sent Log:', JSON.stringify(logs.find(l => l.status === 'sent'), null, 2));
    console.log('Sample Failed Log:', JSON.stringify(logs.find(l => l.status === 'failed'), null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkLogs();
