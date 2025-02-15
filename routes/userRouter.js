const express = require("express");
const router = express.Router();
const userController = require("../controller/userController"); // Make sure this file exists!

router.post("/admin/login", userController.adminLogin);
router.post("/signup", userController.signup); // Fix function name
router.post("/signin", userController.signin); // Fix function name
router.get("/user/:id", userController.getUserById);
router.put("/notification/:userId", userController.toggleNotification);

module.exports = router;
