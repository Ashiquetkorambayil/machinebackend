const Product = require("../model/productModel");
const User = require("../model/userModel");
const { sendNotification } = require("../socket");


// Create Product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, amount } = req.body;
    const product = new Product({ name, amount });
    await product.save();

    // Fetch only activated users
    const activatedUsers = await User.find({ isActive: true });

    console.log(`🔍 Found ${activatedUsers.length} active users.`);

    activatedUsers.forEach((user) => {
      sendNotification(user._id.toString(), `New product "${name}" added.`);
      console.log(`📢 Notification sent to ${user._id}`);
    });

    res.json({ success: true, product });
  } catch (error) {
    console.error("❌ Error creating product:", error);
    res.status(500).json({ message: "Error creating product", error });
  }
};

// Update Product Amount (Admin only) + Real-time Notification
exports.updateProduct = async (req, res) => {
  try {
    const { amount } = req.body;
    const product = await Product.findById(req.params.id);
    console.log(req.params,req.body,'jhj')
    if (!product) return res.status(404).json({ message: "Product not found" });

    const oldAmount = product.amount;
    product.amount = amount;
    await product.save();

    // Notify subscribed users
    const subscribedUsers = await User.find({ subscribedProducts: req.params.id });
    subscribedUsers.forEach(user =>
      sendNotification(user._id.toString(), `Product "${product.name}" updated from ${oldAmount} to ${amount}.`)
    );

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// Delete Product (Admin only) + Notify Subscribed Users
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Find subscribed users before deleting
    const subscribedUsers = await User.find({ subscribedProducts: req.params.id });

    // Delete product
    await Product.findByIdAndDelete(req.params.id);

    // Notify subscribed users
    subscribedUsers.forEach(user =>
      sendNotification(user._id.toString(), `Product "${product.name}" has been removed.`)
    );

    // Remove product from subscribed lists
    await User.updateMany(
      { subscribedProducts: req.params.id },
      { $pull: { subscribedProducts: req.params.id } }
    );

    res.json({ success: true, message: `Product "${product.name}" deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

  

// Subscribe to Product
exports.subscribeToProduct = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId || req.headers.userId; // Extract userId
    console.log(userId,'this is the user id')
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { productId } = req.body;
    if (!user.subscribedProducts.includes(productId)) {
      user.subscribedProducts.push(productId);
      await user.save();
    }

    res.json({ success: true, message: "Subscribed to product successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error subscribing to product", error });
  }
};

// Unsubscribe from Product
exports.unsubscribeFromProduct = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId || req.headers.userId;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { productId } = req.body;
    user.subscribedProducts = user.subscribedProducts.filter(id => id.toString() !== productId);
    await user.save();

    res.json({ success: true, message: "Unsubscribed from product successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unsubscribing from product", error });
  }
};

// Get All Subscribed Products for a User
exports.getSubscribedProducts = async (req, res) => {
  try {
    const userId = req.userId || req.headers.userid || req.headers["userId"]; // Handle different cases

    console.log(userId, "this is the user id received in backend");

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).populate("subscribedProducts");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, subscribedProducts: user.subscribedProducts });
  } catch (error) {
    console.error("Error fetching subscribed products:", error);
    res.status(500).json({ message: "Error fetching subscribed products", error });
  }
};
