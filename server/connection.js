const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(`mongodb://127.0.0.1:27017/b14_project`);
    // await mongoose.connect(`mongodb://localhost/b14_project`);
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(`Error connecting to MongoDB: ${e.message}`);
    process.exit(1);
  }
};
