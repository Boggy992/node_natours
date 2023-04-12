const express = require('express');
const app = express();
const morgan = require('morgan');
const toursPath = '/api/v1/tours';
const usersPath = '/api/v1/users';
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const generalErrorOutput = require('./controllers/errorController');
const AppError = require('./utils/appError');

app.use(express.static(`${__dirname}/public`));

app.use((req, _, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(morgan('dev'));
app.use(express.json());

app.use(toursPath, tourRouter);
app.use(usersPath, userRouter);

app.all('*', (req, _, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!!`,
    404
  );

  next(err);
});

app.use(generalErrorOutput);

module.exports = app;
