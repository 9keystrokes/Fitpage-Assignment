let currentUser = null, products = [], selectedRating = 0;

document.addEventListener('DOMContentLoaded', init);

async function init() {
    setupEvents();
    await loadProducts();
}

function setupEvents() {
    document.getElementById('userForm').addEventListener('submit', handleUserSubmit);
    document.getElementById('changeUser').addEventListener('click', showUserForm);
    document.getElementById('closeModal').addEventListener('click', () => closeModal('rating'));
    document.getElementById('cancelModal').addEventListener('click', () => closeModal('rating'));
    document.getElementById('closeReviewsModal').addEventListener('click', () => closeModal('reviews'));
    document.getElementById('ratingReviewForm').addEventListener('submit', handleRatingSubmit);
    setupStarRating();
    setupPhotoUpload();
    
    // Setup image modal close event
    document.getElementById('closeImageModal').addEventListener('click', closeImageModal);
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            if (e.target.id === 'imageModal') {
                closeImageModal();
            } else if (e.target.id === 'ratingModal') {
                closeModal('rating');
            } else if (e.target.id === 'reviewsModal') {
                closeModal('reviews');
            }
        }
    });
}

async function apiCall(url, options = {}) {
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
}

async function handleUserSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    
    if (!name || !email) return showMessage('error', 'Enter name and email');
    
    try {
        currentUser = await apiCall('/api/users', {
            method: 'POST',
            body: JSON.stringify({ name, email })
        });
        showCurrentUser();
        showMessage('success', 'User set');
    } catch (err) {
        showMessage('error', err.message);
    }
}

function showCurrentUser() {
    document.getElementById('currentUserName').textContent = `${currentUser.name} (${currentUser.email})`;
    document.getElementById('userForm').style.display = 'none';
    document.getElementById('currentUser').style.display = 'block';
}

function showUserForm() {
    document.getElementById('userForm').style.display = 'block';
    document.getElementById('currentUser').style.display = 'none';
    currentUser = null;
    document.getElementById('userForm').reset();
}

async function loadProducts() {
    products = await apiCall('/api/products');
    displayProducts();
}

function displayProducts() {
    document.getElementById('productsContainer').innerHTML = products.length ? 
        products.map(createProductCard).join('') : 
        '<p>No products found.</p>';
}

function createProductCard(product) {
    const rating = parseFloat(product.average_rating) || 0;
    const total = parseInt(product.total_ratings) || 0;
      return `
        <div class="product-card">
            ${product.image_url ? `<img src="${product.image_url}" alt="${product.name}" class="product-image">` : ''}
            <div class="product-name">${product.name}</div>
            <div>${product.description}</div>
            <div class="price-rating-container">
                <div class="product-price">₹${product.price}</div>
                <div class="rating-info">
                    <div class="stars">${generateStars(rating)}</div>
                    <div>${rating.toFixed(1)} (${total} ratings)</div>
                </div>
            </div>
            <button class="rate-review-btn" onclick="openRatingModal(${product.id}, '${product.name}')">Rate & Review</button>
            <button class="rate-review-btn" onclick="viewReviews(${product.id}, '${product.name}')">View Reviews</button>
        </div>
    `;
}

function generateStars(rating) {
    return Array.from({length: 5}, (_, i) => i < rating ? '★' : '☆').join('');
}

function openRatingModal(productId, productName) {
    if (!currentUser) {
        showUserNotice();
        return;
    }
    
    document.getElementById('modalProductId').value = productId;
    document.getElementById('modalTitle').textContent = `Rate: ${productName}`;
    document.getElementById('ratingReviewForm').reset();
    resetStarRating();
    
    // Reset photo preview
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('previewImg').src = '';
    
    document.getElementById('ratingModal').style.display = 'block';
}

function closeModal(type) {
    document.getElementById(type + 'Modal').style.display = 'none';
}

function setupStarRating() {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, i) => {
        star.onclick = () => {
            selectedRating = i + 1;
            highlightStars(selectedRating);
        };
    });
}

function highlightStars(rating) {
    document.querySelectorAll('.star').forEach((star, i) => {
        star.classList.toggle('active', i < rating);
    });
}

function resetStarRating() {
    selectedRating = 0;
    highlightStars(0);
}

function setupPhotoUpload() {
    const photoInput = document.getElementById('reviewImage');
    const photoPreview = document.getElementById('photoPreview');
    const previewImg = document.getElementById('previewImg');
    const removeBtn = document.getElementById('removePhoto');

    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                showMessage('error', 'File size must be less than 5MB');
                photoInput.value = '';
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                showMessage('error', 'Please select an image file');
                photoInput.value = '';
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                photoPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    removeBtn.addEventListener('click', function() {
        photoInput.value = '';
        photoPreview.style.display = 'none';
        previewImg.src = '';
    });
}

async function handleRatingSubmit(e) {
    e.preventDefault();
    const productId = document.getElementById('modalProductId').value;
    const title = document.getElementById('reviewTitle').value.trim();
    const text = document.getElementById('reviewText').value.trim();
    const photoInput = document.getElementById('reviewImage');
    
    if (!selectedRating && !text) return showMessage('error', 'Provide rating or review');
    
    try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('user_id', currentUser.id);
        formData.append('product_id', productId);
        
        if (selectedRating) formData.append('rating', selectedRating);
        if (text) formData.append('review_text', text);
        if (title) formData.append('title', title);
        if (photoInput.files[0]) formData.append('image', photoInput.files[0]);

        const response = await fetch('/api/rating-review', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        
        showMessage('success', 'Submitted successfully');
        closeModal('rating');
        await loadProducts();
    } catch (err) {
        showMessage('error', err.message);
    }
}

async function viewReviews(productId, productName) {
    try {
        const data = await apiCall(`/api/rating-review/product/${productId}`);
        displayReviews(data, productName);
        document.getElementById('reviewsModal').style.display = 'block';
    } catch (err) {
        showMessage('error', 'Failed to load reviews');
    }
}

function displayReviews(data, productName) {
    const { ratings, reviews, stats } = data;
    document.getElementById('reviewsModalTitle').textContent = `Reviews: ${productName}`;
    
    const reviewItems = reviews.map(review => {
        const userRating = ratings.find(r => r.user_id === review.user_id);
        const ratingStars = userRating ? generateStars(userRating.rating) : '';
        
        return `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-user">${review.user_name}</span>
                    <span class="review-rating">${ratingStars}</span>
                </div>
                ${review.title ? `<div class="review-title">${review.title}</div>` : ''}
                <div class="review-text">${review.review_text}</div>
                ${review.image_url ? `
                    <div class="review-image">
                        <img src="${review.image_url}" alt="Review photo" onclick="openImageModal('${review.image_url}')">
                    </div>
                ` : ''}
                <div class="review-date">${new Date(review.created_at).toLocaleDateString()}</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('reviewsContent').innerHTML = `
        <div style="margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
            <strong>Average Rating: ${stats.average_rating.toFixed(1)} ⭐ (${stats.total_ratings} ratings)</strong>
        </div>
        ${reviews.length ? reviewItems : '<div style="text-align: center; padding: 20px; color: #666;">No reviews yet</div>'}
    `;
}

function showUserNotice() {
    const notice = document.getElementById('userNotice');
    notice.style.display = 'block';
    setTimeout(() => notice.style.display = 'none', 3000);
}

function showMessage(type, message) {
    const el = document.getElementById(type);
    el.textContent = message;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 3000);
}

function openImageModal(imageUrl) {
    document.getElementById('fullSizeImage').src = imageUrl;
    document.getElementById('imageModal').style.display = 'block';
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// Global functions for HTML onclick
window.openRatingModal = openRatingModal;
window.viewReviews = viewReviews;
window.openImageModal = openImageModal;
