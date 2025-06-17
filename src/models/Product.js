const supabase = require('../config/database');

class Product {
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from('product_stats')
        .select('*')
        .order('id');
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }  }

  static async getById(id) {
    try {
      const { data, error } = await supabase
        .from('product_stats')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error fetching product: ${error.message}`);
    }  }

  static async getByCategory(category) {
    try {
      const { data, error } = await supabase
        .from('product_stats')
        .select('*')
        .eq('category', category)
        .order('id');
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error fetching products by category: ${error.message}`);
    }  }
  static async getCategories() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .order('category');
      
      if (error) throw error;
      return [...new Set(data.map(row => row.category))];
    } catch (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }
  }
}

module.exports = Product;
