const catchAsync = require("../middlewares/catchAsync");
const User = require("../models/user");
const errorCreation = require("../utils/appError");
const httpStatus = require("../utils/httpStatus");

const getUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll();
  if (!users) {
    const error = errorCreation.createError(
      "Users not found",
      httpStatus.NOT_FOUND.code
    );
    return next(error);
  }
  res.status(httpStatus.SUCCESS.code).json({
    status: httpStatus.SUCCESS.message,
    data: { users },
  });
});

module.exports = {
  getUsers
};
