require('../settings');
const mongoose = require('mongoose');

async function connectMongoDb() {
  try {
    await mongoose.connect(MONGO_DB_URI); // cukup tanpa opsi deprecated
    console.log('✅ Success connect to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // hentikan proses kalau gagal connect
  }
}

module.exports = { connectMongoDb };