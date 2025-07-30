const catchAsync = require("../middlewares/catchAsync");
const User = require("../models/user");
const errorCreation = require("../utils/appError");
const httpStatus = require("../utils/httpStatus");
const bcrypt = require("bcrypt");
const roleNames = require("../utils/roleNames");
var jwt = require('jsonwebtoken');  

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = errorCreation.createError(
      "Email and password are required",
      httpStatus.BAD_REQUEST.code
    );
    return next(error);
  }
  const existingUser = await User.findOne({ where: { email } });
  if (!existingUser) {
    const error = errorCreation.createError(
      "Invalid email or password",
      httpStatus.UNAUTHORIZED.code
    );
    return next(error);
  }
  const isPasswordMatched = await bcrypt.compare(
    password,
    existingUser.password
  );
  if (!isPasswordMatched) {
    const error = errorCreation.createError(
      "Invalid email or password",
      httpStatus.UNAUTHORIZED.code
    );
    return next(error);
  }
  const userWithoutPassword = existingUser.get({ plain: true });
  delete userWithoutPassword.password;
  const token = jwt.sign({ user: userWithoutPassword }, process.env.JWT_SECRET, { expiresIn: '1m' });
  res.status(httpStatus.SUCCESS.code).json({
    status: httpStatus.SUCCESS.message,
    data: { token },
  });
});

const register = catchAsync(async (req, res, next) => {
  const { first_name, second_name, email, password, role, profile_picture } = req.body;
  const existingUser = await User.findOne({ where: { email } });
  console.log(req);
  

  if (existingUser) {
    const error = errorCreation.createError(
      "Email already exists",
      httpStatus.CONFLICT.code
    );
    return next(error);
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  if(role && !Object.values(roleNames).includes(role)) {
    const error = errorCreation.createError(
      "Invalid role provided",
      httpStatus.BAD_REQUEST.code
    );
    return next(error);
  }

  const user = await User.create({
    first_name,
    second_name,
    email,
    password: hashedPassword,
    role: role || "user",
    profile_picture: req.file ? req.file.filename : null
  });

  if (!user) {
    const error = errorCreation.createError(
      "User could not be created",
      httpStatus.BAD_REQUEST.code
    );
    return next(error);
  }
  const userWithoutPassword = user.get({ plain: true });
  delete userWithoutPassword.password;

  res.status(httpStatus.CREATED.code).json({
    status: httpStatus.CREATED.message,
    data: { user: userWithoutPassword },
  });
});

module.exports = {
  login,
  register,
};
