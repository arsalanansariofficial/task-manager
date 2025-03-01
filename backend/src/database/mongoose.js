const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const databaseURL = process.env.databaseURL;

const connectDatabase = async () => {
  try {
    return await mongoose.connect(databaseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDatabase;
