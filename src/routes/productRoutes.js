const express = require('express');
const ProductController = require('../controllers/productController');

const router = express.Router();

router.get('/', ProductController.getAllProducts);
router.get('/categories', ProductController.getCategories);
router.get('/category/:category', ProductController.getProductsByCategory);
router.get('/:id', ProductController.getProductById);

module.exports = router;
