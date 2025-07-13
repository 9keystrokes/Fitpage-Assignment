# Product Reviews Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-green)](https://fitpage-assignment.onrender.com/)
[![Deployment](https://img.shields.io/badge/Deployed%20on-Render-blue)](https://fitpage-assignment.onrender.com/)

This app is a Product Reviews Platform that allows users to view products, rate them (1-5 stars), and add reviews with text, title, and images. It uses Supabase for the database (storing users, products, reviews, and ratings) and Cloudinary for image uploads. Users can register, browse products, submit ratings and reviews, and view all reviews for each product through a web interface. The app is designed for easy setup and online hosting, leveraging Supabase's PostgreSQL compatibility and Cloudinary's media management.

## 🌐 Live Demo
Visit our platform at: [Live Demo](https://fitpage-assignment.onrender.com/)

## Database Schema

The application uses the following database schema:

<img src="src/utils/schema.png" alt="Database Schema" width="600">

### Tables:
- **users** - Store user information (id, name, email)
- **products** - Store product details (id, name, description, price, category, image_url)
- **reviews** - Store user reviews (id, user_id, product_id, review_text, title, image_url, tags)
- **ratings** - Store product ratings (id, user_id, product_id, rating)

## Setup

### Prerequisites
- Node.js (version 14.x or higher)
- npm
- Supabase account (for database)
- Cloudinary account (for image uploads)

***Note**: This application uses **Supabase instead of a traditional PostgreSQL database**. As we needed to host it on a platform, an online database service like Supabase is preferred. Although **Supabase supports PostgreSQL, it provides a more convenient setup for web applications**.*

### Installation
1. Install dependencies:
```bash
npm install
```

2. Create Supabase project and get your URL and anon key from Settings > API

3. Create Cloudinary account and get your credentials:
   - Go to [Cloudinary](https://cloudinary.com) and create an account
   - Get your Cloud Name, API Key, and API Secret from the dashboard

4. Set up database schema:
   - Go to Supabase SQL Editor
   - Run the contents of `src/utils/db.sql` file

5. Create `.env` file:
```env
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Running the Application

```bash
npm run dev
```

Application will be available at: `http://localhost:3000`

### Web Interface Testing
1. Navigate to `http://localhost:3000`
2. Set up a user (name and email)
3. View products
4. Rate a product (1-5 stars)
5. Add review text and title and images
6. View reviews for products
