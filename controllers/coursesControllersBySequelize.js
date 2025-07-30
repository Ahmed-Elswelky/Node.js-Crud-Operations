const { validationResult } = require("express-validator");
const Course = require("../models/course");
const catchAsync = require("../middlewares/catchAsync");
const httpStatus = require("../utils/httpStatus");
const errorCreation = require("../utils/appError");

const getCourses = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const offset = (page - 1) * limit;
  const { count, rows: courses } = await Course.findAndCountAll({
    limit,
    offset,
  });
    res.json({
    status: httpStatus.SUCCESS.code,
    results: courses.length,
    total: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    data: { courses }
  });
});
const getCourseById = catchAsync(async (req, res, next) => {
  const courseId = parseInt(req.params.id, 10);
  const course = await Course.findByPk(courseId);
  if (!course) {
    const error = errorCreation.createError("Course not found", httpStatus.NOT_FOUND.code);
    return next(error);
  }
  res.json({ status: httpStatus.SUCCESS.code, data: { course: course } });
});

const addCourse = catchAsync(async (req, res) => {
  const { title, price } = req.body;
  const course = await Course.create({ title, price });
  res.status(httpStatus.CREATED.code).json({ status: httpStatus.CREATED.message, data: { course: course } });
});

const editCourse = catchAsync(async (req, res) => {
  const courseId = parseInt(req.params.id, 10);
  const { title, price } = req.body;
  const course = await Course.findByPk(courseId);
  if (!course) {
    const error = errorCreation.createError("Course not found", httpStatus.NOT_FOUND.code);
    return next(error);
  }
  course.title = title;
  course.price = price;
  await course.save();
  res.json({ status: httpStatus.SUCCESS.message, data: { course: course } });
});

const deleteCourse = catchAsync(async (req, res) => {
  const courseId = parseInt(req.params.id, 10);
  const course = await Course.findByPk(courseId);
  if (!course) {
    const error = errorCreation.createError("Course not found", httpStatus.NOT_FOUND.code);
    return next(error);
  }
  await course.destroy();
  res.json({
    status: httpStatus.SUCCESS.message,
    data: { message: "Course deleted successfully" },
  });
});

module.exports = {
  getCourses,
  getCourseById,
  addCourse,
  editCourse,
  deleteCourse,
};
