const express = require("express");
const router = express.Router();
const userController = require("../controller/userController"); 

router.post("/admin/login", userController.adminLogin);
router.post("/signup", userController.signup); 
router.post("/signin", userController.signin); 
router.get("/user/:id", userController.getUserById);
router.put("/notification/:userId", userController.toggleNotification);

module.exports = router;
