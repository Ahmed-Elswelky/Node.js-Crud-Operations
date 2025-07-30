const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const authController = require("../controllers/authController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage: storage });

router
  .post(
    "/login",
    body("email")
      .isEmail()
      .withMessage("Email must be a valid email address")
      .notEmpty()
      .withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    authController.login
  )
  .post(
    "/register",
    upload.single("profile_picture"),
    body("first_name")
      .isString()
      .withMessage("First name must be a string")
      .notEmpty()
      .withMessage("First name is required"),
    body("second_name")
      .isString()
      .withMessage("Second name must be a string")
      .notEmpty()
      .withMessage("Second name is required"),
    body("email")
      .isEmail()
      .withMessage("Email must be a valid email address")
      .notEmpty()
      .withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const messages = errors.array().map((err) => err.msg);
        return res.status(400).json({ status: "failed", errors: messages });
      }
      next();
    },
    authController.register
  );

module.exports = router;
