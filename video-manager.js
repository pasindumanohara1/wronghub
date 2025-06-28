
// Video Manager - Handles video playback and related functionality
class VideoManager {
    constructor() {
        this.currentVideo = null;
        this.relatedVideos = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.goBack();
            });
        }
    }

    playVideo(video) {
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
        if (videoIframe) {
            // Handle different video link formats
            let embedUrl = video.megaLink;
            
            // Convert regular Mega links to embed format
            if (embedUrl.includes('mega.nz/file/')) {
                embedUrl = embedUrl.replace('mega.nz/file/', 'mega.nz/embed/');
            }
            
            videoIframe.src = embedUrl;
            console.log('Video iframe src updated:', embedUrl);
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

        if (elements.title) {
            elements.title.textContent = video.title;
            elements.title.classList.add('slide-in-left');
        }
        
        if (elements.channelName) {
            elements.channelName.textContent = video.channel;
        }
        
        if (elements.channelAvatar) {
            elements.channelAvatar.textContent = video.channel.charAt(0);
        }
        
        if (elements.views) {
            elements.views.textContent = video.views;
        }
        
        if (elements.date) {
            elements.date.textContent = video.date;
        }
        
        if (elements.description) {
            elements.description.textContent = video.description;
            elements.description.classList.add('fade-in');
        }
    }

    loadRelatedVideos(currentVideo) {
        const relatedGrid = document.getElementById('related-grid');
        if (!relatedGrid) return;

        // Get all videos except current one
        const allVideos = [...videos, ...trendingVideos];
        this.relatedVideos = allVideos
            .filter(v => v.id !== currentVideo.id)
            .slice(0, 12);

        relatedGrid.innerHTML = '';

        this.relatedVideos.forEach((video, index) => {
            const videoCard = this.createVideoCard(video);
            videoCard.classList.add('stagger-animation');
            relatedGrid.appendChild(videoCard);

            // Add ads after every 4 related videos
            if ((index + 1) % 4 === 0 && index < this.relatedVideos.length - 1) {
                const adSpace = this.createAdSpace('300x250', 'Related Video Ad');
                relatedGrid.appendChild(adSpace);
            }
        });
    }

    createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card hover-scale';
        card.onclick = () => this.playVideo(video);
        
        card.innerHTML = `
            <div class="video-thumbnail">
                <div class="thumbnail-placeholder">📹</div>
                <div class="video-duration">${video.duration || '10:30'}</div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <div class="video-meta-info">
                    <div class="channel-name">${video.channel}</div>
                    <div class="video-stats">${video.views} • ${video.date}</div>
                </div>
            </div>
        `;
        
        return card;
    }

    createAdSpace(size, label) {
        const adSpace = document.createElement('div');
        adSpace.className = 'ad-space';
        adSpace.setAttribute('data-size', size);
        adSpace.style.gridColumn = '1 / -1';
        adSpace.style.margin = '20px 0';
        
        adSpace.innerHTML = `
            <div class="ad-placeholder">${label || 'Advertisement'} ${size}</div>
        `;
        
        return adSpace;
    }

    showVideoPlayerPage() {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));
        
        // Show video player page
        const videoPlayerPage = document.getElementById('video-player-page');
        if (videoPlayerPage) {
            videoPlayerPage.classList.add('active');
            
            // Add entrance animation
            setTimeout(() => {
                videoPlayerPage.style.animation = 'fadeIn 0.5s ease-out';
            }, 50);
        }
    }

    goBack() {
        // Stop video playback
        const videoIframe = document.getElementById('video-iframe');
        if (videoIframe) {
            videoIframe.src = '';
        }
        
        // Show home page
        window.showPage('home');
        
        console.log('Returned to home page');
    }

    // Get video by ID
    getVideoById(id) {
        const allVideos = [...videos, ...trendingVideos];
        return allVideos.find(video => video.id === parseInt(id));
    }
}

// Initialize video manager
const videoManager = new VideoManager();

// Make it globally accessible
window.videoManager = videoManager;
window.playVideo = (video) => videoManager.playVideo(video);
