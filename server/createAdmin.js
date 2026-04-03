// Script to create an admin user in the database
// Usage: node createAdmin.js <name> <email> <password>

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cis4004mern';

async function createAdmin(name, email, password) {
  await mongoose.connect(MONGO_URI);
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('User with this email already exists.');
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hash, role: 'admin' });
  await user.save();
  console.log('Admin user created:', user);
  await mongoose.disconnect();
}

const [,, name, email, password] = process.argv;
if (!name || !email || !password) {
  console.log('Usage: node createAdmin.js <name> <email> <password>');
  process.exit(1);
}

createAdmin(name, email, password).catch(err => {
  console.error(err);
  process.exit(1);
});
