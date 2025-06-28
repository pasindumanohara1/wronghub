// Video Manager - Handles video playback and related functionality
class VideoManager {
    constructor() {
        this.currentVideo = null;
        this.relatedVideos = [];
        this.initialized = false;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
            });
        } else {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // Back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.goBack();
            });
        }
        this.initialized = true;
    }

    playVideo(video) {
        if (!video) {
            console.error('Invalid video data provided');
            return;
        }

        console.log('Playing video:', video.title);
        this.currentVideo = video;
        
        // Update video player
        this.updateVideoPlayer(video);
        
        // Update video information
        this.updateVideoInfo(video);
        
        // Load related videos
        this.loadRelatedVideos(video);
        
        // Show video player page with animation
        this.showVideoPlayerPage();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateVideoPlayer(video) {
        const videoIframe = document.getElementById('video-iframe');
        if (!videoIframe) {
            console.error('Video iframe element not found');
            return;
        }

        try {
            // Handle different video link formats
            let embedUrl = video.megaLink;
            
            if (!embedUrl) {
                console.warn('No video link provided, using fallback');
                embedUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
            } else if (embedUrl.includes('mega.nz/file/')) {
                // Convert regular Mega links to embed format
                embedUrl = embedUrl.replace('mega.nz/file/', 'mega.nz/embed/');
            }
            
            videoIframe.src = embedUrl;
            console.log('Video iframe src updated:', embedUrl);
        } catch (error) {
            console.error('Error updating video player:', error);
        }
    }

    updateVideoInfo(video) {
        const elements = {
            title: document.getElementById('video-title'),
            channelName: document.getElementById('channel-name'),
            channelAvatar: document.getElementById('channel-avatar'),
            views: document.getElementById('video-views'),
            date: document.getElementById('video-date'),
            description: document.getElementById('video-description')
        };

        try {
            if (elements.title) {
                elements.title.textContent = video.title || 'Untitled Video';
                elements.title.classList.remove('slide-in-left');
                setTimeout(() => elements.title.classList.add('slide-in-left'), 10);
            }
            
            if (elements.channelName) {
                elements.channelName.textContent = video.channel || 'Unknown Channel';
            }
            
            if (elements.channelAvatar) {
                const channelName = video.channel || 'Unknown';
                elements.channelAvatar.textContent = channelName.charAt(0).toUpperCase();
            }
            
            if (elements.views) {
                elements.views.textContent = video.views || '0 views';
            }
            
            if (elements.date) {
                elements.date.textContent = video.date || 'Unknown date';
            }
            
            if (elements.description) {
                elements.description.textContent = video.description || 'No description available.';
                elements.description.classList.remove('fade-in');
                setTimeout(() => elements.description.classList.add('fade-in'), 10);
            }
        } catch (error) {
            console.error('Error updating video info:', error);
        }
    }

    loadRelatedVideos(currentVideo) {
        const relatedGrid = document.getElementById('related-grid');
        if (!relatedGrid) {
            console.error('Related grid element not found');
            return;
        }

        try {
            // Get all videos from global scope
            let allVideos = [];
            if (typeof window.videos !== 'undefined') {
                allVideos = [...window.videos];
            }
            if (typeof window.trendingVideos !== 'undefined') {
                allVideos = [...allVideos, ...window.trendingVideos];
            }

            // Filter out current video and get random selection
            this.relatedVideos = allVideos
                .filter(v => v && v.id !== currentVideo.id)
                .sort(() => Math.random() - 0.5)
                .slice(0, 12);

            // Clear existing content
            relatedGrid.innerHTML = '';

            if (this.relatedVideos.length === 0) {
                relatedGrid.innerHTML = '<p style="color: #ffd700; text-align: center;">No related videos found</p>';
                return;
            }

            // Create document fragment for performance
            const fragment = document.createDocumentFragment();

            this.relatedVideos.forEach((video, index) => {
                const videoCard = this.createVideoCard(video, index);
                if (videoCard) {
                    fragment.appendChild(videoCard);

                    // Add ads after every 4 related videos
                    if ((index + 1) % 4 === 0 && index < this.relatedVideos.length - 1) {
                        const adSpace = this.createAdSpace('300x250', 'Related Video Ad');
                        if (adSpace) {
                            fragment.appendChild(adSpace);
                        }
                    }
                }
            });

            relatedGrid.appendChild(fragment);
            console.log('Related videos loaded:', this.relatedVideos.length);
        } catch (error) {
            console.error('Error loading related videos:', error);
        }
    }

    createVideoCard(video, index = 0) {
        if (!video) {
            console.error('Invalid video data for card creation');
            return null;
        }

        try {
            const card = document.createElement('div');
            card.className = 'video-card hover-scale stagger-animation';
            card.style.animationDelay = `${(index % 6) * 0.1}s`;
            
            // Enhanced thumbnail with proper error handling
            const thumbnailContent = video.thumbnail 
                ? `<img src="${video.thumbnail}" alt="${video.title}" loading="lazy" 
                     style="width: 100%; height: 100%; object-fit: cover;"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                   <div class="thumbnail-placeholder" style="display: none;">📹</div>`
                : '<div class="thumbnail-placeholder">📹</div>';
            
            card.innerHTML = `
                <div class="video-thumbnail">
                    ${thumbnailContent}
                    <div class="video-duration">${video.duration || '10:30'}</div>
                </div>
                <div class="video-info">
                    <h3 class="video-title">${video.title || 'Untitled Video'}</h3>
                    <div class="video-meta-info">
                        <div class="channel-name">${video.channel || 'Unknown Channel'}</div>
                        <div class="video-stats">${video.views || '0 views'} • ${video.date || 'Unknown date'}</div>
                    </div>
                </div>
            `;
            
            // Add click handler
            card.addEventListener('click', () => {
                console.log('Related video clicked:', video.title);
                this.playVideo(video);
            });
            
            return card;
        } catch (error) {
            console.error('Error creating video card:', error);
            return null;
        }
    }

    createAdSpace(size, label) {
        try {
            const adSpace = document.createElement('div');
            adSpace.className = 'ad-space enhanced-ad-space';
            adSpace.setAttribute('data-size', size);
            
            const [width, height] = size.split('x');
            adSpace.style.cssText = `
                width: ${width}px;
                height: ${height}px;
                max-width: 100%;
                margin: 15px auto;
                grid-column: 1 / -1;
            `;
            
            adSpace.innerHTML = `
                <script type="text/javascript">
                    atOptions = {
                        'key' : '9258e0377a9e583db2075fcb66f881bf',
                        'format' : 'iframe',
                        'height' : ${height},
                        'width' : ${width},
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

    showVideoPlayerPage() {
        try {
            // Hide all pages
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => page.classList.remove('active'));
            
            // Show video player page
            const videoPlayerPage = document.getElementById('video-player-page');
            if (videoPlayerPage) {
                videoPlayerPage.classList.add('active');
                
                // Update navigation
                if (window.updateActiveNavLink) {
                    window.updateActiveNavLink('video-player');
                }
            } else {
                console.error('Video player page element not found');
            }
        } catch (error) {
            console.error('Error showing video player page:', error);
        }
    }

    goBack() {
        try {
            // Stop video playback
            const videoIframe = document.getElementById('video-iframe');
            if (videoIframe) {
                videoIframe.src = '';
            }
            
            // Show home page
            if (window.showPage) {
                window.showPage('home');
            } else {
                console.error('showPage function not available');
            }
            
            console.log('Returned to home page');
        } catch (error) {
            console.error('Error going back:', error);
        }
    }

    // Get video by ID
    getVideoById(id) {
        try {
            let allVideos = [];
            if (typeof window.videos !== 'undefined') {
                allVideos = [...window.videos];
            }
            if (typeof window.trendingVideos !== 'undefined') {
                allVideos = [...allVideos, ...window.trendingVideos];
            }
            return allVideos.find(video => video && video.id === parseInt(id));
        } catch (error) {
            console.error('Error getting video by ID:', error);
            return null;
        }
    }

    // Public method to check if manager is ready
    isReady() {
        return this.initialized;
    }
}

// Initialize video manager with error handling
let videoManager;
try {
    videoManager = new VideoManager();
    
    // Make it globally accessible
    window.videoManager = videoManager;
    window.playVideo = (video) => {
        if (videoManager && videoManager.isReady()) {
            videoManager.playVideo(video);
        } else {
            console.error('Video manager not ready');
        }
    };
    
    console.log('Video Manager initialized successfully');
} catch (error) {
    console.error('Failed to initialize Video Manager:', error);
}