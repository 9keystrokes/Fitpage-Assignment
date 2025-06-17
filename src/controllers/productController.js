const Product = require('../models/Product');

class ProductController {
  // Get all products
  static async getAllProducts(req, res) {
    try {
      const products = await Product.getAll();
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching products'
      });
    }
  }

  // Get product by ID
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.getById(id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching product'
      });
    }
  }

  // Get products by category
  static async getProductsByCategory(req, res) {
    try {
      const { category } = req.params;
      const products = await Product.getByCategory(category);
      
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      console.error('Error fetching products by category:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching products by category'
      });
    }
  }

  // Get all categories
  static async getCategories(req, res) {
    try {
      const categories = await Product.getCategories();
      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching categories'
      });
    }
  }
}

module.exports = ProductController;
