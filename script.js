// WrongHub Social Media Platform - Photo Sharing
class PhotoSharingApp {
    constructor() {
        this.photos = [];
        this.currentSort = 'newest';
        this.photoIdCounter = 1;
        this.adCounter = 0;
        
        this.init();
    }

    init() {
        console.log('Initializing WrongHub Photo Sharing Platform...');
        
        // Load saved data
        this.loadPhotosFromStorage();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initial render
        this.renderPhotos();
        this.updateStats();
        
        console.log('WrongHub initialized successfully!');
    }

    setupEventListeners() {
        // File input change
        const imageInput = document.getElementById('imageInput');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        }

        // Sort buttons
        const sortNewest = document.getElementById('sortNewest');
        const sortPopular = document.getElementById('sortPopular');
        
        if (sortNewest) {
            sortNewest.addEventListener('click', () => this.setSortMode('newest'));
        }
        
        if (sortPopular) {
            sortPopular.addEventListener('click', () => this.setSortMode('popular'));
        }

        // Modal functionality
        const modal = document.getElementById('photoModal');
        const closeModal = document.querySelector('.close-modal');
        
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        console.log('Event listeners setup complete');
    }

    handleImageUpload(event) {
        const file = event.target.file[0];
        
        if (!file) {
            console.log('No file selected');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showToast('Please select a valid image file', 'error');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showToast('Image size must be less than 10MB', 'error');
            return;
        }

        console.log('Processing image upload:', file.name);
        this.processImageUpload(file);
    }

    processImageUpload(file) {
        const progressContainer = document.getElementById('uploadProgress');
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');

        // Show progress
        if (progressContainer) {
            progressContainer.style.display = 'block';
        }

        // Simulate upload progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 90) progress = 90;
            
            if (progressFill) {
                progressFill.style.width = progress + '%';
            }
        }, 100);

        // Read file as data URL
        const reader = new FileReader();
        
        reader.onload = (e) => {
            clearInterval(progressInterval);
            
            // Complete progress
            if (progressFill) {
                progressFill.style.width = '100%';
            }
            if (progressText) {
                progressText.textContent = 'Upload complete!';
            }

            // Create photo object
            const photo = {
                id: this.photoIdCounter++,
                dataUrl: e.target.result,
                uploadDate: new Date().toISOString(),
                likes: 0,
                liked: false,
                filename: file.name
            };

            // Add to photos array
            this.photos.unshift(photo); // Add to beginning for newest first
            
            // Save to localStorage
            this.savePhotosToStorage();
            
            // Re-render gallery
            this.renderPhotos();
            this.updateStats();
            
            // Hide progress after delay
            setTimeout(() => {
                if (progressContainer) {
                    progressContainer.style.display = 'none';
                }
                if (progressFill) {
                    progressFill.style.width = '0%';
                }
                if (progressText) {
                    progressText.textContent = 'Uploading...';
                }
            }, 1500);

            // Show success message
            this.showToast('Photo uploaded successfully!', 'success');
            
            // Reset file input
            const imageInput = document.getElementById('imageInput');
            if (imageInput) {
                imageInput.value = '';
            }

            console.log('Photo uploaded successfully:', photo.filename);
        };

        reader.onerror = () => {
            clearInterval(progressInterval);
            this.showToast('Error uploading image. Please try again.', 'error');
            
            if (progressContainer) {
                progressContainer.style.display = 'none';
            }
        };

        reader.readAsDataURL(file);
    }

    setSortMode(mode) {
        this.currentSort = mode;
        
        // Update button states
        const sortButtons = document.querySelectorAll('.sort-btn');
        sortButtons.forEach(btn => btn.classList.remove('active'));
        
        const activeButton = document.getElementById(mode === 'newest' ? 'sortNewest' : 'sortPopular');
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Re-render with new sort
        this.renderPhotos();
        
        console.log('Sort mode changed to:', mode);
    }

    renderPhotos() {
        const gallery = document.getElementById('photoGallery');
        const emptyState = document.getElementById('emptyState');
        
        if (!gallery || !emptyState) {
            console.error('Gallery elements not found');
            return;
        }

        // Clear gallery
        gallery.innerHTML = '';

        // Show/hide empty state
        if (this.photos.length === 0) {
            emptyState.style.display = 'block';
            gallery.style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';
        gallery.style.display = 'grid';

        // Sort photos
        const sortedPhotos = this.getSortedPhotos();

        // Reset ad counter
        this.adCounter = 0;

        // Render photos with ads
        sortedPhotos.forEach((photo, index) => {
            // Add photo card
            const photoCard = this.createPhotoCard(photo, index);
            gallery.appendChild(photoCard);

            // Add ad after every 3 photos
            if ((index + 1) % 3 === 0 && index < sortedPhotos.length - 1) {
                const adCard = this.createAdCard();
                gallery.appendChild(adCard);
            }
        });

        console.log('Gallery rendered with', sortedPhotos.length, 'photos');
    }

    getSortedPhotos() {
        const photosCopy = [...this.photos];
        
        if (this.currentSort === 'newest') {
            return photosCopy.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        } else {
            return photosCopy.sort((a, b) => b.likes - a.likes);
        }
    }

    createPhotoCard(photo, index) {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.style.animationDelay = `${(index % 6) * 0.1}s`;

        const uploadDate = new Date(photo.uploadDate);
        const timeAgo = this.getTimeAgo(uploadDate);

        card.innerHTML = `
            <img src="${photo.dataUrl}" alt="Photo ${photo.id}" class="photo-image" onclick="photoApp.openModal(${photo.id})">
            <div class="photo-info">
                <button class="like-btn ${photo.liked ? 'liked' : ''}" onclick="photoApp.toggleLike(${photo.id})">
                    <i class="fas fa-heart"></i>
                    <span>${photo.likes}</span>
                </button>
                <span class="upload-date">${timeAgo}</span>
            </div>
        `;

        return card;
    }

    createAdCard() {
        this.adCounter++;
        const adCard = document.createElement('div');
        adCard.className = 'photo-ad';
        
        // Rotate between different ad sizes for variety
        const adConfigs = [
            {
                key: '9258e0377a9e583db2075fcb66f881bf',
                width: 300,
                height: 250
            }
        ];
        
        const config = adConfigs[this.adCounter % adConfigs.length];
        
        adCard.innerHTML = `
            <script type="text/javascript">
                atOptions = {
                    'key' : '${config.key}',
                    'format' : 'iframe',
                    'height' : ${config.height},
                    'width' : ${config.width},
                    'params' : {}
                };
            </script>
            <script type="text/javascript" src="//www.highperformanceformat.com/${config.key}/invoke.js"></script>
        `;

        return adCard;
    }

    toggleLike(photoId) {
        const photo = this.photos.find(p => p.id === photoId);
        if (!photo) {
            console.error('Photo not found:', photoId);
            return;
        }

        // Toggle like state
        photo.liked = !photo.liked;
        photo.likes += photo.liked ? 1 : -1;

        // Ensure likes don't go below 0
        if (photo.likes < 0) photo.likes = 0;

        // Save to storage
        this.savePhotosToStorage();

        // Update UI
        this.updatePhotoLikeUI(photoId, photo);
        
        // Show feedback
        const message = photo.liked ? 'Photo liked!' : 'Photo unliked!';
        this.showToast(message, 'success');

        console.log('Photo', photoId, photo.liked ? 'liked' : 'unliked', '- Total likes:', photo.likes);
    }

    updatePhotoLikeUI(photoId, photo) {
        // Update gallery like button
        const likeButtons = document.querySelectorAll('.like-btn');
        likeButtons.forEach(btn => {
            const onclick = btn.getAttribute('onclick');
            if (onclick && onclick.includes(`toggleLike(${photoId})`)) {
                btn.className = `like-btn ${photo.liked ? 'liked' : ''}`;
                btn.querySelector('span').textContent = photo.likes;
            }
        });

        // Update modal like button if open
        const modalLikeBtn = document.getElementById('modalLikeBtn');
        const modalLikeCount = document.getElementById('modalLikeCount');
        
        if (modalLikeBtn && modalLikeCount) {
            const modalOnclick = modalLikeBtn.getAttribute('onclick');
            if (modalOnclick && modalOnclick.includes(`toggleLike(${photoId})`)) {
                modalLikeBtn.className = `like-btn ${photo.liked ? 'liked' : ''}`;
                modalLikeCount.textContent = photo.likes;
            }
        }
    }

    openModal(photoId) {
        const photo = this.photos.find(p => p.id === photoId);
        if (!photo) {
            console.error('Photo not found for modal:', photoId);
            return;
        }

        const modal = document.getElementById('photoModal');
        const modalImage = document.getElementById('modalImage');
        const modalLikeBtn = document.getElementById('modalLikeBtn');
        const modalLikeCount = document.getElementById('modalLikeCount');
        const modalUploadDate = document.getElementById('modalUploadDate');

        if (!modal || !modalImage) {
            console.error('Modal elements not found');
            return;
        }

        // Set modal content
        modalImage.src = photo.dataUrl;
        modalImage.alt = `Photo ${photo.id}`;
        
        if (modalLikeBtn) {
            modalLikeBtn.className = `like-btn ${photo.liked ? 'liked' : ''}`;
            modalLikeBtn.setAttribute('onclick', `photoApp.toggleLike(${photo.id})`);
        }
        
        if (modalLikeCount) {
            modalLikeCount.textContent = photo.likes;
        }
        
        if (modalUploadDate) {
            const uploadDate = new Date(photo.uploadDate);
            modalUploadDate.textContent = this.getTimeAgo(uploadDate);
        }

        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        console.log('Modal opened for photo:', photoId);
    }

    closeModal() {
        const modal = document.getElementById('photoModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    updateStats() {
        const photoCount = document.getElementById('photoCount');
        if (photoCount) {
            const count = this.photos.length;
            photoCount.textContent = `${count} photo${count !== 1 ? 's' : ''}`;
        }
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');

        // Auto hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    savePhotosToStorage() {
        try {
            localStorage.setItem('wronghub_photos', JSON.stringify(this.photos));
            localStorage.setItem('wronghub_photo_counter', this.photoIdCounter.toString());
            console.log('Photos saved to localStorage');
        } catch (error) {
            console.error('Error saving photos to localStorage:', error);
            this.showToast('Error saving data. Storage might be full.', 'error');
        }
    }

    loadPhotosFromStorage() {
        try {
            const savedPhotos = localStorage.getItem('wronghub_photos');
            const savedCounter = localStorage.getItem('wronghub_photo_counter');

            if (savedPhotos) {
                this.photos = JSON.parse(savedPhotos);
                console.log('Loaded', this.photos.length, 'photos from localStorage');
            }

            if (savedCounter) {
                this.photoIdCounter = parseInt(savedCounter);
            }
        } catch (error) {
            console.error('Error loading photos from localStorage:', error);
            this.photos = [];
            this.photoIdCounter = 1;
        }
    }

    // Public method to clear all data (for testing/admin)
    clearAllData() {
        if (confirm('Are you sure you want to delete all photos? This cannot be undone.')) {
            this.photos = [];
            this.photoIdCounter = 1;
            localStorage.removeItem('wronghub_photos');
            localStorage.removeItem('wronghub_photo_counter');
            this.renderPhotos();
            this.updateStats();
            this.showToast('All photos deleted', 'success');
            console.log('All data cleared');
        }
    }

    // Get app statistics
    getStats() {
        const totalLikes = this.photos.reduce((sum, photo) => sum + photo.likes, 0);
        const mostLikedPhoto = this.photos.reduce((max, photo) => 
            photo.likes > max.likes ? photo : max, { likes: 0 });

        return {
            totalPhotos: this.photos.length,
            totalLikes: totalLikes,
            mostLikedPhoto: mostLikedPhoto,
            averageLikes: this.photos.length > 0 ? (totalLikes / this.photos.length).toFixed(1) : 0
        };
    }
}

// Initialize the app when DOM is loaded
let photoApp;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - Initializing WrongHub Photo Sharing...');
    photoApp = new PhotoSharingApp();
    
    // Make it globally accessible for onclick handlers
    window.photoApp = photoApp;
});

// Handle page visibility change to refresh relative times
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && photoApp) {
        photoApp.renderPhotos();
    }
});

// Add some demo functionality for testing
window.addEventListener('load', function() {
    // Add keyboard shortcut for clearing data (Ctrl+Shift+Delete)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'Delete' && photoApp) {
            photoApp.clearAllData();
        }
    });
    
    console.log('WrongHub Photo Sharing Platform fully loaded!');
    console.log('Keyboard shortcut: Ctrl+Shift+Delete to clear all data');
});

console.log('WrongHub Photo Sharing script loaded successfully');