const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

mongoose.set('strictQuery', false);
mongoose.connect(
  process.env.DATABASE,
  {
    serverSelectionTimeoutMS: 5000,
  },
  () => console.log('Database connected 🙃🙃🙃')
);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
