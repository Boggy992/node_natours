const Tour = require('../model/tourModel');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

const aliasTopTours = (req, _, next) => {
  req.query.sort = 'price';
  req.query.limit = '5';
  req.query.fields = 'name,duration,difficulty,price,summary';
  req.hasNextOff = true;
  next();
};

const getAllTours = catchAsync(async (req, res) => {
  const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .fields()
    .pagination();

  const tours = await features.model;

  res.status(200).json({
    status: 'success',
    length: tours.length,
    hasNext: req.hasNext,
    data: {
      tours,
    },
  });
});

const getTourById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const features = new ApiFeatures(Tour.findById(id), req.query).fields();
  const tour = await features.model;

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour,
    },
  });
});

const createTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    createdAt: req.requestTime,
    data: {
      tour: newTour,
    },
  });
});

const updateTour = catchAsync(async (req, res) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Tour was updated successfully',
    data: {
      tour,
    },
  });
});

const deleteTour = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Tour.findByIdAndDelete(id);
  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
});

module.exports = {
  aliasTopTours,
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
};
