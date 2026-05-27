require('dotenv').config();

const mongoose = require('mongoose');
const faker = require('@faker-js/faker').faker;

const Lead = require('./models/Lead');

mongoose.connect(process.env.MONGODB_URI);

const policyTypes = [
  'Life',
  'Health',
  'Motor',
  'Home',
  'Travel',
  'Term',
  'ULIP',
  'Other'
];

const statuses = [
  'Interested',
  'Pending',
  'Purchased',
  'Not Interested',
  'Paused'
];

const User = require('./models/User');

async function generateLeads(count = 500) {
  try {
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('No admin user found. Please run npm run seed first.');
      process.exit(1);
    }

    const leads = [];

    for (let i = 0; i < count; i++) {
      const lead = {
        customerName: faker.person.fullName(),
        phoneNumber: Math.floor(6000000000 + Math.random() * 3999999999).toString(),
        policyNumber: `POL${Date.now()}${i}`,
        interestedPolicyType: policyTypes[Math.floor(Math.random() * policyTypes.length)],
        tentativePurchaseDate: faker.date.soon({ days: 90 }),
        premiumAmount: faker.number.int({ min: 1000, max: 100000 }),
        notes: faker.lorem.sentence(),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        pausedUntil: faker.date.future(),
        lastReminderSent: faker.date.recent(),
        reminderCount: faker.number.int({ min: 0, max: 10 }),
        createdBy: admin._id
      };
      leads.push(lead);
    }

    const batchSize = 1000;
    for (let i = 0; i < leads.length; i += batchSize) {
      const batch = leads.slice(i, i + batchSize);
      await Lead.insertMany(batch);
      console.log(`Inserted ${i + batch.length} / ${count} leads...`);
    }

    console.log(`Successfully inserted ${count} leads`);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
}

const count = parseInt(process.argv[2]) || 5000;
generateLeads(count);