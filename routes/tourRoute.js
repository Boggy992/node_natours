const express = require('express');
const tourRouter = express.Router();
const {
  aliasTopTours,
  getAllTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour,
} = require('../controllers/tourContoller');
const { protect, restrictTo } = require('../controllers/authController');

tourRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours);
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter
  .route('/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = tourRouter;
