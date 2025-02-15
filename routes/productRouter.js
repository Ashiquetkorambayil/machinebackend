const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");

router.post("/", productController.createProduct); // Create Product
router.get("/", productController.getAllProducts); // Get All Products
router.get("/:id", productController.getProductById); // Get Product by ID
router.put("/:id", productController.updateProduct); // Update Product
router.delete("/:id", productController.deleteProduct); // Delete Product

// Subscription Routes
router.post("/product/subscribe", productController.subscribeToProduct); // Subscribe to a product
router.post("/product/unsubscribe", productController.unsubscribeFromProduct); // Unsubscribe from a product
router.get("/product/subscribed", productController.getSubscribedProducts); // Get all subscribed products

module.exports = router;
