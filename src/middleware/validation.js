const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

const validateUser = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  handleValidationErrors
];

const validateRatingAndReview = [
  body('user_id')
    .notEmpty()
    .withMessage('User ID is required')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  
  body('product_id')
    .notEmpty()
    .withMessage('Product ID is required')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positive integer'),
  
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('review_text')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Review text must be between 10 and 2000 characters'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Title must be less than 255 characters'),
  
  body().custom((value, { req }) => {
    if (!req.body.rating && !req.body.review_text) {
      throw new Error('Either rating or review text must be provided');
    }
    return true;
  }),
  
  handleValidationErrors
];

module.exports = {
  validateUser,
  validateRatingAndReview
};
