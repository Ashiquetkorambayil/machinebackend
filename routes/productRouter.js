const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");

router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts); 
router.get("/:id", productController.getProductById); 
router.put("/:id", productController.updateProduct); 
router.delete("/:id", productController.deleteProduct); 

// Subscription Routes
router.post("/product/subscribe", productController.subscribeToProduct); 
router.post("/product/unsubscribe", productController.unsubscribeFromProduct); 

module.exports = router;
