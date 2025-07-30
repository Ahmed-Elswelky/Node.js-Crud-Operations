const express = require("express");
const router = express.Router();
// const courseControllers = require("../controllers/coursesControllersBysql2");
const courseControllers = require("../controllers/coursesControllersBySequelize");
const { body, validationResult } = require("express-validator");
const verifyToken = require("../middlewares/verifyToken");

router
  .route("/")
  .get( verifyToken ,courseControllers.getCourses)
  .post(
    body("title")
      .isString()
      .withMessage("Title must be a string")
      .notEmpty()
      .withMessage("Title is required"),
    body("price")
      .isNumeric()
      .withMessage("Price must be a number")
      .notEmpty()
      .withMessage("Price is required"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const messages = errors.array().map((err) => err.msg);
        return res.status(400).json({ status: 'failed', errors: messages });
      }
      next();
    },
    courseControllers.addCourse
  );

router
  .route("/:id")
  .get(courseControllers.getCourseById)
  .patch(
    body("title")
      .optional()
      .isString()
      .notEmpty()
      .withMessage("Title is required and must be a string"),

    body("price")
      .optional()
      .isNumeric()
      .withMessage("Price must be a number")
      .notEmpty()
      .withMessage("Price is required"),
      
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const messages = errors.array().map((err) => err.msg);

        return res.status(400).json({ status: 'failed', errors: messages });
      }
      if (!("title" in req.body) && !("price" in req.body)) {
        return res
          .status(400)
          .json({ status: 'failed', message: "At least one of title or price must be provided" });
      }
      next();
    },
    courseControllers.editCourse
  )
  .delete(courseControllers.deleteCourse);

module.exports = router;
