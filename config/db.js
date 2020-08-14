const mongoose = require('mongoose');

const config = require('config');

const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('MongoDB Connected =O)');
  } catch(err) {
    console.error(err.message);

    // exiting the process with fail
    process.exit(1);
  }
}

module.exports = connectDB;
