const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../../config.env' });
const Tour = require('../../model/tourModel');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`));

mongoose.set('strictQuery', false);
mongoose.connect(
  process.env.DATABASE,
  {
    serverSelectionTimeoutMS: 5000,
  },
  () => console.log('Database connected 🙃🙃🙃')
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Successfully imported data');
    process.exit();
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Successfully deleted data');
    process.exit();
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

// process.argv pokrece komandu po izboru --import ili --delete u ovom slucaju
// node importDevData.js --import / --delete
process.argv.includes('--import') && importData();
process.argv.includes('--delete') && deleteData();
