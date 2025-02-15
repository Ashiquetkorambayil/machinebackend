const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin Login (Hardcoded)
exports.adminLogin = (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    const token = jwt.sign({ role: "admin" }, "your_jwt_secret");
    return res.json({ success: true, token });
  }
  res.status(401).json({ success: false, message: "Invalid credentials" });
};

// User Signup
exports.signup = async (req, res) => {
    try {
      const { name, username, password } = req.body;
      console.log("Signup request received:", req.body);
  
      // Validate input
      if (!name || !username || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
  
      // Check if username exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Username already exists" });
      }
  
      // Save user with plain text password (Not recommended for production)
      const newUser = new User({ name, username, password });
  
      await newUser.save();
  
      res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
      console.error("Signup Error:", error.message);
      res.status(500).json({ success: false, message: "Error registering user", error: error.message });
    }
  };

// User Login
exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "your_jwt_secret");

    // Send token and userId in response
    res.json({ success: true, token, userId: user._id });
  } catch (error) {
    console.error("Signin Error:", error.message);
    res.status(500).json({ success: false, message: "Error signing in", error: error.message });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from URL parameters

    if (!id) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Find user and populate subscribed products
    const user = await User.findById(id).populate("subscribedProducts");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Error fetching user", error: error.message });
  }
};

exports.toggleNotification = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId,'this ')
    const { isActive } = req.body; // Expecting true or false
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "Invalid value for isActive. Must be true or false." });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Notification preference updated", user });
  } catch (error) {
    console.error("Error updating notification preference:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};