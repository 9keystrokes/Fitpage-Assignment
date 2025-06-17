const supabase = require('../config/database');

class Review {
  static async getByProductId(productId) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users!inner(name)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform format
      return data.map(review => ({
        ...review,
        user_name: review.users.name
      }));
    } catch (error) {
      throw new Error(`Error fetching reviews: ${error.message}`);
    }
  }

  // Get user review
  static async getUserReview(userId, productId) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      throw new Error(`Error checking user review: ${error.message}`);
    }
  }
  // Create or update review
  static async createOrUpdate(userId, productId, reviewText, title, imageUrl = null, tags = []) {
    try {
      // Check existing review
      const existingReview = await this.getUserReview(userId, productId);

      if (existingReview) {
        // Update review
        const { data, error } = await supabase
          .from('reviews')
          .update({ 
            review_text: reviewText, 
            title, 
            image_url: imageUrl, 
            tags, 
            updated_at: new Date().toISOString() 
          })
          .eq('user_id', userId)
          .eq('product_id', productId)
          .select()
          .single();
        
        if (error) throw error;
        return { review: data, action: 'updated' };
      } else {
        // Create review
        const { data, error } = await supabase
          .from('reviews')
          .insert([{ 
            user_id: userId, 
            product_id: productId, 
            review_text: reviewText, 
            title, 
            image_url: imageUrl, 
            tags 
          }])
          .select()
          .single();
        
        if (error) throw error;
        return { review: data, action: 'created' };
      }
    } catch (error) {
      throw new Error(`Error creating/updating review: ${error.message}`);
    }
  }

  // Extract tags
  static extractTags(reviewText) {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'];
    
    const words = reviewText.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word));
    
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Return top 5 tags
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }
}

module.exports = Review;
