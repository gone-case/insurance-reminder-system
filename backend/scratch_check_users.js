require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'name email phone role');
    console.log('Users:', JSON.stringify(users, null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkUsers();
