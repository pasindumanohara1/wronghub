// WrongHub Social - Photo Upload and Management System
class SocialMediaApp {
    constructor() {
        this.photos = [];
        this.currentSort = 'newest';
        this.photoIdCounter = 1;
        this.storageKey = 'wronghub_social_photos';
        this.init();
    }

    init() {
        console.log('Initializing WrongHub Social...');
        
        // Load existing photos from localStorage
        this.loadPhotosFromStorage();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Render initial state
        this.renderGallery();
        this.updatePhotoCount();
        
        console.log('WrongHub Social initialized successfully');
    }

    setupEventListeners() {
        // Photo upload
        const photoInput = document.getElementById('photo-input');
        if (photoInput) {
            photoInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
        }

        // Sort buttons
        const sortButtons = document.querySelectorAll('.sort-btn');
        sortButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSort(e));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'u' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                document.getElementById('photo-input').click();
            }
        });
    }

    handlePhotoUpload(event) {
        const file = event.target.file || event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB.');
            return;
        }

        console.log('Uploading photo:', file.name);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const photoData = {
                    id: this.generatePhotoId(),
                    dataUrl: e.target.result,
                    uploadDate: new Date().toISOString(),
                    likes: 0,
                    fileName: file.name,
                    fileSize: file.size
                };

                this.photos.unshift(photoData); // Add to beginning
                this.savePhotosToStorage();
                this.renderGallery();
                this.updatePhotoCount();

                console.log('Photo uploaded successfully:', photoData.id);
                
                // Reset file input
                event.target.value = '';
                
                // Show success feedback
                this.showUploadSuccess();
            } catch (error) {
                console.error('Error uploading photo:', error);
                alert('Error uploading photo. Please try again.');
            }
        };

        reader.onerror = () => {
            console.error('Error reading file');
            alert('Error reading file. Please try again.');
        };

        reader.readAsDataURL(file);
    }

    generatePhotoId() {
        // Get the highest existing ID and increment
        const maxId = this.photos.reduce((max, photo) => {
            const photoId = parseInt(photo.id.replace('photo_', ''));
            return photoId > max ? photoId : max;
        }, 0);
        
        return `photo_${maxId + 1}`;
    }

    handleSort(event) {
        const sortType = event.target.getAttribute('data-sort');
        if (!sortType || sortType === this.currentSort) return;

        console.log('Sorting photos by:', sortType);

        // Update active button
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        this.currentSort = sortType;
        this.sortPhotos();
        this.renderGallery();
    }

    sortPhotos() {
        switch (this.currentSort) {
            case 'newest':
                this.photos.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
                break;
            case 'popular':
                this.photos.sort((a, b) => {
                    if (b.likes === a.likes) {
                        return new Date(b.uploadDate) - new Date(a.uploadDate);
                    }
                    return b.likes - a.likes;
                });
                break;
        }
    }

    handleLike(photoId) {
        const photo = this.photos.find(p => p.id === photoId);
        if (!photo) return;

        photo.likes = (photo.likes || 0) + 1;
        console.log(`Photo ${photoId} liked. Total likes: ${photo.likes}`);

        // Update UI immediately
        const likeBtn = document.querySelector(`[data-photo-id="${photoId}"] .like-btn`);
        const likeCount = document.querySelector(`[data-photo-id="${photoId}"] .like-count`);
        
        if (likeBtn && likeCount) {
            likeBtn.classList.add('liked');
            likeCount.textContent = photo.likes;
            
            // Remove liked class after animation
            setTimeout(() => {
                likeBtn.classList.remove('liked');
            }, 600);
        }

        this.savePhotosToStorage();

        // Re-sort if viewing by popularity
        if (this.currentSort === 'popular') {
            setTimeout(() => {
                this.sortPhotos();
                this.renderGallery();
            }, 300);
        }
    }

    renderGallery() {
        const galleryGrid = document.getElementById('gallery-grid');
        const noPhotos = document.getElementById('no-photos');

        if (!galleryGrid || !noPhotos) {
            console.error('Gallery elements not found');
            return;
        }

        // Clear existing content
        galleryGrid.innerHTML = '';

        if (this.photos.length === 0) {
            noPhotos.classList.add('show');
            galleryGrid.style.display = 'none';
            return;
        }

        noPhotos.classList.remove('show');
        galleryGrid.style.display = 'grid';

        // Sort photos before rendering
        this.sortPhotos();

        // Create document fragment for performance
        const fragment = document.createDocumentFragment();

        this.photos.forEach((photo, index) => {
            const photoCard = this.createPhotoCard(photo, index);
            if (photoCard) {
                fragment.appendChild(photoCard);

                // Add ads after every 3 photos
                if ((index + 1) % 3 === 0 && index < this.photos.length - 1) {
                    const adSpace = this.createAdSpace();
                    if (adSpace) {
                        fragment.appendChild(adSpace);
                    }
                }
            }
        });

        galleryGrid.appendChild(fragment);
        console.log('Gallery rendered with', this.photos.length, 'photos');
    }

    createPhotoCard(photo, index) {
        if (!photo || !photo.dataUrl) {
            console.error('Invalid photo data:', photo);
            return null;
        }

        try {
            const card = document.createElement('div');
            card.className = 'photo-card';
            card.setAttribute('data-photo-id', photo.id);
            card.style.animationDelay = `${(index % 6) * 0.1}s`;

            const uploadDate = new Date(photo.uploadDate);
            const formattedDate = this.formatDate(uploadDate);

            card.innerHTML = `
                <div class="photo-container">
                    <img src="${photo.dataUrl}" alt="Uploaded photo" class="photo-image" loading="lazy">
                </div>
                <div class="photo-info">
                    <div class="photo-meta">
                        <div class="photo-date">${formattedDate}</div>
                        <div class="photo-id">#${photo.id}</div>
                    </div>
                    <div class="like-section">
                        <button class="like-btn" onclick="socialApp.handleLike('${photo.id}')">❤️</button>
                        <span class="like-count">${photo.likes || 0}</span>
                    </div>
                </div>
            `;

            return card;
        } catch (error) {
            console.error('Error creating photo card:', error);
            return null;
        }
    }

    createAdSpace() {
        try {
            const adSpace = document.createElement('div');
            adSpace.className = 'photo-ad';
            adSpace.style.cssText = `
                grid-column: 1 / -1;
                margin: 1rem 0;
                text-align: center;
            `;

            adSpace.innerHTML = `
                <script type="text/javascript">
                    atOptions = {
                        'key' : '9258e0377a9e583db2075fcb66f881bf',
                        'format' : 'iframe',
                        'height' : 250,
                        'width' : 300,
                        'params' : {}
                    };
                </script>
                <script type="text/javascript" src="//www.highperformanceformat.com/9258e0377a9e583db2075fcb66f881bf/invoke.js"></script>
            `;

            return adSpace;
        } catch (error) {
            console.error('Error creating ad space:', error);
            return null;
        }
    }

    formatDate(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffMinutes < 1) {
            return 'Just now';
        } else if (diffMinutes < 60) {
            return `${diffMinutes}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    updatePhotoCount() {
        const photoCountElement = document.getElementById('photo-count');
        if (photoCountElement) {
            const count = this.photos.length;
            photoCountElement.textContent = `${count} ${count === 1 ? 'photo' : 'photos'}`;
        }
    }

    showUploadSuccess() {
        // Create temporary success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        successMsg.textContent = '📷 Photo uploaded successfully!';
        
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            successMsg.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (successMsg.parentNode) {
                    successMsg.parentNode.removeChild(successMsg);
                }
            }, 300);
        }, 3000);
    }

    savePhotosToStorage() {
        try {
            const dataToSave = {
                photos: this.photos,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
            console.log('Photos saved to localStorage');
        } catch (error) {
            console.error('Error saving photos to localStorage:', error);
            // Handle storage quota exceeded
            if (error.name === 'QuotaExceededError') {
                alert('Storage quota exceeded. Please delete some photos to continue.');
            }
        }
    }

    loadPhotosFromStorage() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                this.photos = parsedData.photos || [];
                console.log('Loaded', this.photos.length, 'photos from localStorage');
            }
        } catch (error) {
            console.error('Error loading photos from localStorage:', error);
            this.photos = [];
        }
    }

    // Public method to clear all photos (for testing)
    clearAllPhotos() {
        if (confirm('Are you sure you want to delete all photos? This cannot be undone.')) {
            this.photos = [];
            this.savePhotosToStorage();
            this.renderGallery();
            this.updatePhotoCount();
            console.log('All photos cleared');
        }
    }

    // Get app statistics
    getStats() {
        const totalLikes = this.photos.reduce((sum, photo) => sum + (photo.likes || 0), 0);
        const avgLikes = this.photos.length > 0 ? (totalLikes / this.photos.length).toFixed(1) : 0;
        
        return {
            totalPhotos: this.photos.length,
            totalLikes: totalLikes,
            averageLikes: avgLikes,
            mostLikedPhoto: this.photos.reduce((max, photo) => 
                (photo.likes || 0) > (max.likes || 0) ? photo : max, {}),
            storageUsed: this.calculateStorageUsed()
        };
    }

    calculateStorageUsed() {
        try {
            const dataString = localStorage.getItem(this.storageKey);
            return dataString ? (dataString.length / 1024 / 1024).toFixed(2) + ' MB' : '0 MB';
        } catch (error) {
            return 'Unknown';
        }
    }
}

// Add CSS animations for success message
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is ready
let socialApp;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        socialApp = new SocialMediaApp();
        window.socialApp = socialApp; // Make globally accessible
    });
} else {
    socialApp = new SocialMediaApp();
    window.socialApp = socialApp;
}

console.log('WrongHub Social script loaded successfully');