const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('../config/cloudinary');

// Memory storage for Cloudinary
const storage = multer.memoryStorage();

// Image filter
const fileFilter = (req, file, cb) => {
  // Check image type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer config
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
});

// Error handling
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error'
    });
  }
  
  next();
};

// Upload to Cloudinary
const uploadToCloudinary = (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    // Generate unique filename
    const uniqueName = uuidv4();
    
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        public_id: `ratings-reviews/${uniqueName}`,
        folder: 'ratings-reviews',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' } // Auto-deliver best format
        ],
        overwrite: false,
        invalidate: true,
        use_filename: false,
        unique_filename: true
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(new Error(`Image upload failed: ${error.message}`));
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

// Delete from Cloudinary
const deleteFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error('Cloudinary delete error:', error);
        reject(new Error(`Image deletion failed: ${error.message}`));
      } else {
        resolve(result);
      }
    });
  });
};

// Extract public ID from Cloudinary URL
const extractPublicId = (cloudinaryUrl) => {
  if (!cloudinaryUrl || typeof cloudinaryUrl !== 'string') {
    return null;
  }
  
  // Extract public ID from Cloudinary URL
  const regex = /\/v\d+\/(.+)\.[^.]+$/;
  const match = cloudinaryUrl.match(regex);
  
  if (match && match[1]) {
    return match[1];
  }
  
  // Fallback for URLs without version
  const simpleRegex = /\/upload\/(.+)\.[^.]+$/;
  const simpleMatch = cloudinaryUrl.match(simpleRegex);
  
  return simpleMatch ? simpleMatch[1] : null;
};

module.exports = {
  upload,
  handleUploadError,
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId
};
