const express = require('express');
const userRouter = express.Router();
const {
  getAllUsers,
  getUser,
  updateMe,
  deleteMe,
} = require('../controllers/userController');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = require('../controllers/authController');

userRouter.route('/signup').post(signup);
userRouter.route('/login').post(login);

userRouter.route('/forgotPassword').post(forgotPassword);
userRouter.route('/resetPassword/:token').patch(resetPassword);
userRouter.route('/updateMyPassword').patch(protect, updatePassword);

userRouter.route('/updateMe').patch(protect, updateMe);
userRouter.route('/deleteMe').delete(protect, deleteMe);

userRouter.route('/').get(protect, getAllUsers);
userRouter.route('/:id').get(getUser);

module.exports = userRouter;
