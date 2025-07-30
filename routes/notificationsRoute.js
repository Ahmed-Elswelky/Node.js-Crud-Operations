const express = require("express");
const router = express.Router();
const notificationsControllers = require("../controllers/notificationsControllers");
const { body, validationResult } = require("express-validator");

router
  .route("/")
  .get(notificationsControllers.getNotifications)
  .post(
    body("title")
      .isString()
      .notEmpty()
      .withMessage("Title is required and must be a string"),
    body("body")
      .isString()
      .notEmpty()
      .withMessage("Body is required and must be a string"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
    notificationsControllers.addNotification
  );

router
  .route("/:id")
  .get(notificationsControllers.getNotificationById)
  .patch(
    body("title")
      .optional()
      .isString()
      .notEmpty()
      .withMessage("Title is required and must be a string"),

    body("body")
      .optional()
      .isString()
      .withMessage("Body must be a string")
      .notEmpty()
      .withMessage("Body is required"),
      
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      if (!("title" in req.body) && !("body" in req.body)) {
        return res
          .status(400)
          .send("At least one of title or body must be provided");
      }
      next();
    },
    notificationsControllers.editNotification
  )
  .delete(notificationsControllers.deleteNotification);

module.exports = router;
