const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import routes
const productRoutes = require('./src/routes/productRoutes');
const userRoutes = require('./src/routes/userRoutes');
const ratingReviewRoutes = require('./src/routes/ratingReviewRoutes');

// Import database connection
const pool = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// uploads directory existence
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MIME types for static files
express.static.mime.define({
    'application/javascript': ['js'],
    'text/css': ['css'],
    'text/html': ['html'],
    'image/png': ['png'],
    'image/jpeg': ['jpg', 'jpeg'],
    'image/gif': ['gif']
});

// Serve static files with proper headers
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
    }
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rating-review', ratingReviewRoutes);

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/css/style.css', (req, res) => {
  res.type('text/css');
  res.sendFile(path.join(__dirname, 'public', 'css', 'style.css'));
});

app.get('/js/app.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'js', 'app.js'));
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await pool.query('SELECT 1');
    res.json({
      success: true,
      message: 'Server and database are running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Ratings and Reviews API',
    version: '1.0.0',
    endpoints: {
      products: {
        'GET /api/products': 'Get all products',
        'GET /api/products/:id': 'Get product by ID',
        'GET /api/products/category/:category': 'Get products by category',
        'GET /api/products/categories': 'Get all categories'
      },      users: {
        'POST /api/users': 'Create or find user'
      },
      ratingReview: {
        'POST /api/rating-review': 'Submit rating and/or review',
        'GET /api/rating-review/product/:productId': 'Get combined product data',
        'GET /api/rating-review/rating/user/:userId/product/:productId': 'Check user rating',
        'GET /api/rating-review/review/user/:userId/product/:productId': 'Get user review'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Handle 404 for other routes - serve index.html for SPA behavior
app.use('*', (req, res) => {
    if (req.originalUrl.startsWith('/api/') || 
        req.originalUrl.startsWith('/css/') || 
        req.originalUrl.startsWith('/js/') || 
        req.originalUrl.startsWith('/images/') ||
        req.originalUrl.startsWith('/uploads/')) {
        res.status(404).json({
            success: false,
            message: 'Resource not found'
        });
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
