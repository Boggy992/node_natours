const User = require('../model/userModel');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (bodyObj, ...allowedFields) => {
  const newObj = {};
  Object.entries(bodyObj).forEach(([key, value]) => {
    if (allowedFields.includes(key)) newObj[key] = value;
  });
  return newObj;
};

const getAllUsers = catchAsync(async (req, res) => {
  const features = new ApiFeatures(User.find(), req.query)
    .filter()
    .sort()
    .fields()
    .pagination();

  const users = await features.model;

  res.status(200).json({
    status: 'success',
    length: users.length,
    hasNext: req.hasNext,
    data: {
      users,
    },
  });
});

const getUser = catchAsync(async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not define yet',
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Go to /updateMyPassword !',
        400
      )
    );
  }

  // 2) Update user document
  const filteredProperties = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredProperties,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = { getAllUsers, getUser, updateMe, deleteMe };
