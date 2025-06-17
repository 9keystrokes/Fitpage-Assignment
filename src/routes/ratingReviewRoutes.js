const express = require('express');
const RatingReviewController = require('../controllers/ratingReviewController');
const { validateRatingAndReview } = require('../middleware/validation');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

router.post('/', upload.single('image'), handleUploadError, validateRatingAndReview, RatingReviewController.submitRatingAndReview);
router.get('/product/:productId', RatingReviewController.getProductData);
router.get('/rating/user/:userId/product/:productId', RatingReviewController.checkUserRating);
router.get('/review/user/:userId/product/:productId', RatingReviewController.getUserReview);

module.exports = router;
