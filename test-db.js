import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const uri = process.argv[2] || process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ Error: No connection string provided.');
  console.log('Usage: node test-db.js "your_mongodb_connection_string"');
  process.exit(1);
}

const maskedUri = uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)[^@]+(@)/, '$1****$2');
console.log(`⏳ Testing connection to: ${maskedUri}...`);

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log('✅ Success! Successfully connected to MongoDB Atlas database.');
  console.log(`   Database Name: ${mongoose.connection.name}`);
  console.log(`   Host: ${mongoose.connection.host}`);
  await mongoose.disconnect();
  console.log('🔌 Disconnected cleanly. Your database is ready for deployment!');
  process.exit(0);
} catch (err) {
  console.error('❌ Connection failed:', err.message);
  if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
    console.error('👉 Hint: Check your database username and password in the connection string.');
  } else if (err.message.includes('ETIMEDOUT') || err.message.includes('Could not connect') || err.message.includes('querySrv')) {
    console.error('👉 Hint: Make sure Network Access in Atlas is set to allow access from anywhere (0.0.0.0/0).');
  }
  process.exit(1);
}
