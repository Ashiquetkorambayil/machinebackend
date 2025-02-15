const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  isActive: { type: Boolean, default: false },
  subscribedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
});

module.exports = mongoose.model("User", userSchema);
