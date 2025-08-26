const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const usersController = require("../controllers/usersController");
const verifyToken = require("../middlewares/verifyToken");
const checkAllowedRoles = require("../middlewares/checkAllowedRoles");
const path = require("path");

router.get(
  "/",
  verifyToken,
  checkAllowedRoles("ADMIN"),
  usersController.getUsers
);

module.exports = router;
