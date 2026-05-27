require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function fixAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL || 'tejasviniparne@gmail.com';
    const user = await User.findOne({ email: adminEmail });
    
    if (user) {
      if (!user.phone) {
        user.phone = '9876543210'; // Placeholder, user should update this
        await user.save();
        console.log(`✅ Fixed phone number for ${adminEmail}`);
      } else {
        console.log(`ℹ️ User ${adminEmail} already has phone: ${user.phone}`);
      }
    } else {
      console.log(`❌ User ${adminEmail} not found`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

fixAdmin();
