const supabase = require('../config/database');

class Rating {
  static async create(userId, productId, rating) {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .insert([{ user_id: userId, product_id: productId, rating }])
        .select()
        .single();
      
      if (error) {
        if (error.code === '23505') {
          throw new Error('User has already rated this product');
        }
        throw error;
      }      return data;
    } catch (error) {
      throw new Error(`Error creating rating: ${error.message}`);
    }
  }

  static async update(userId, productId, rating) {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .update({ rating, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('product_id', productId)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) {
        throw new Error('Rating not found');
      }
        return data;
    } catch (error) {
      throw new Error(`Error updating rating: ${error.message}`);
    }
  }
  static async getByProductId(productId) {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select(`
          *,
          users!inner(name)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
        if (error) throw error;
      
      return data.map(rating => ({
        ...rating,
        user_name: rating.users.name      }));
    } catch (error) {
      throw new Error(`Error fetching ratings: ${error.message}`);
    }
  }

  static async getProductStats(productId) {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('rating')        .eq('product_id', productId);
      if (error) throw error;
      
      const ratings = data.map(r => r.rating);
      const total_ratings = ratings.length;
      const average_rating = total_ratings > 0 ? ratings.reduce((a, b) => a + b, 0) / total_ratings : 0;
      
      const stats = {
        total_ratings,
        average_rating,
        rating_1: ratings.filter(r => r === 1).length,
        rating_2: ratings.filter(r => r === 2).length,
        rating_3: ratings.filter(r => r === 3).length,
        rating_4: ratings.filter(r => r === 4).length,
        rating_5: ratings.filter(r => r === 5).length
      };
        return stats;
    } catch (error) {
      throw new Error(`Error fetching rating stats: ${error.message}`);
    }
  }
  static async getUserRating(userId, productId) {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      throw new Error(`Error checking user rating: ${error.message}`);
    }
  }
}

module.exports = Rating;
