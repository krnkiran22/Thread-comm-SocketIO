const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });
const User = require('../models/User');

const users = [
  {
    email: 'kiranper4@gmail.com',
    password: 'hello',
    role: 'Investor',
  },
  {
    email: 'kirandev2210@gmail.com',
    password: 'hello',
    role: 'Admin',
  },
];

async function seed() {
  await mongoose.connect("mongodb+srv://kiranper4:dbuser@socketio.1acecmz.mongodb.net/?retryWrites=true&w=majority&appName=socketio", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  for (const userData of users) {
    const existing = await User.findOne({ email: userData.email });
    if (!existing) {
      const hashed = await bcrypt.hash(userData.password, 10);
      await User.create({ ...userData, password: hashed });
      console.log(`Created user: ${userData.email}`);
    } else {
      console.log(`User already exists: ${userData.email}`);
    }
  }
  await mongoose.disconnect();
  console.log('Seeding complete.');
}

seed(); 