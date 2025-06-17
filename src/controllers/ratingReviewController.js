const Rating = require('../models/Rating');
const Review = require('../models/Review');
const User = require('../models/User');
const { uploadToCloudinary } = require('../middleware/upload');

class RatingReviewController {
  // Submit rating and/or review
  static async submitRatingAndReview(req, res) {
    try {
      const { user_id, product_id, rating, review_text, title } = req.body;
      let imageUrl = null;

      // If file was uploaded, upload to Cloudinary
      if (req.file) {
        try {
          const cloudinaryResult = await uploadToCloudinary(req.file.buffer, req.file.originalname);
          imageUrl = cloudinaryResult.secure_url;
        } catch (uploadError) {
          console.error('Error uploading to Cloudinary:', uploadError);
          return res.status(500).json({
            success: false,
            message: 'Error uploading image'
          });
        }
      }

      // Check if user exists
      const user = await User.getById(user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const results = {};

      // Handle rating if provided
      if (rating) {
        try {
          // Check if user already has a rating for this product
          const existingRating = await Rating.getUserRating(user_id, product_id);

          if (existingRating) {
            // Update existing rating
            results.rating = await Rating.update(user_id, product_id, rating);
            results.ratingAction = 'updated';
          } else {
            // Create new rating
            results.rating = await Rating.create(user_id, product_id, rating);
            results.ratingAction = 'created';
          }
        } catch (ratingError) {
          console.error('Error handling rating:', ratingError);
          results.ratingError = ratingError.message;
        }
      }

      // Handle review if provided
      if (review_text) {
        try {
          // Extract tags from review text
          const tags = Review.extractTags(review_text);

          const reviewResult = await Review.createOrUpdate(
            user_id,
            product_id,
            review_text,
            title,
            imageUrl,
            tags
          );
          results.review = reviewResult.review;
          results.reviewAction = reviewResult.action;
        } catch (reviewError) {
          console.error('Error handling review:', reviewError);
          results.reviewError = reviewError.message;
        }
      }

      // Determine response status and message
      let status = 200;
      let message = '';
      
      if (results.rating && results.review) {
        status = 201;
        message = `Rating ${results.ratingAction} and review ${results.reviewAction} successfully`;
      } else if (results.rating) {
        status = results.ratingAction === 'created' ? 201 : 200;
        message = `Rating ${results.ratingAction} successfully`;
      } else if (results.review) {
        status = 201;
        message = `Review ${results.reviewAction} successfully`;
      } else {
        status = 400;
        message = 'No rating or review was processed';
      }

      // Check if there were any errors
      if (results.ratingError || results.reviewError) {
        const errors = [];
        if (results.ratingError) errors.push(`Rating: ${results.ratingError}`);
        if (results.reviewError) errors.push(`Review: ${results.reviewError}`);
        
        // If both failed, return error
        if (!results.rating && !results.review) {
          return res.status(400).json({
            success: false,
            message: 'Failed to process rating and review',
            errors: errors
          });
        }
        
        // If only one failed, include warning
        message += ` (with warnings: ${errors.join(', ')})`;
      }

      res.status(status).json({
        success: true,
        message,
        data: results
      });

    } catch (error) {
      console.error('Error submitting rating and review:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get combined product data (ratings, reviews, stats)
  static async getProductData(req, res) {
    try {
      const { productId } = req.params;

      // Get all data in parallel
      const [ratings, reviews, ratingStats] = await Promise.all([
        Rating.getByProductId(productId),
        Review.getByProductId(productId),
        Rating.getProductStats(productId)
      ]);

      res.json({
        success: true,
        data: {
          ratings,
          reviews,
          stats: ratingStats
        }
      });
    } catch (error) {
      console.error('Error fetching product data:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching product data'
      });
    }
  }

  // Check if user has rated a product
  static async checkUserRating(req, res) {
    try {
      const { userId, productId } = req.params;
      const rating = await Rating.getUserRating(userId, productId);
      
      res.json({
        success: true,
        data: {
          hasRated: !!rating,
          rating: rating || null
        }
      });
    } catch (error) {
      console.error('Error checking user rating:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking user rating'
      });
    }
  }

  // Get user's existing review for a product
  static async getUserReview(req, res) {
    try {
      const { userId, productId } = req.params;
      
      const review = await Review.getUserReview(userId, productId);
      
      res.json({
        success: true,
        data: {
          hasReview: !!review,
          review: review || null
        }
      });
    } catch (error) {
      console.error('Error checking user review:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking user review'
      });
    }
  }
}

module.exports = RatingReviewController;
