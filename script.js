// Enhanced WrongHub Script - With Randomization and Real Mega Links
let currentVideos = [];
let filteredVideos = [];
let currentPage = 'home';
let currentVideoId = null;
let videosPerPage = 12;
let currentVideoIndex = 0;
let lastScrollY = 0;
let isHeaderVisible = true;
let sidebarOpen = false;
let isLoading = false;
let currentSearchQuery = '';

// DOM Ready State Handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - Initializing WrongHub with randomization...');
    initializeApp();
});

function initializeApp() {
    console.log('Starting app initialization...');
    
    try {
        // Load and randomize video data
        loadAndRandomizeVideoData();
        
        // Setup all event listeners
        setupEventListeners();
        
        // Setup header scroll animation
        setupHeaderAnimation();
        
        // Initialize pages
        showPage('home');
        
        // Render videos with stability checks
        setTimeout(() => {
            renderVideosWithStability();
        }, 300);
        
        // Initialize ads with proper sequencing
        setTimeout(() => {
            initializeAdSystemWithFixes();
        }, 1500);
        
        console.log('WrongHub initialized successfully with randomized content');
        
    } catch (error) {
        console.error('Error during app initialization:', error);
        handleInitializationError();
    }
}

function loadAndRandomizeVideoData() {
    try {
        if (typeof videos !== 'undefined' && videos.length > 0) {
            // Always randomize videos on load
            currentVideos = shuffleArray([...videos]);
            console.log('Main videos loaded and randomized:', currentVideos.length);
        } else if (typeof window.getRandomizedVideos === 'function') {
            currentVideos = window.getRandomizedVideos();
            console.log('Videos loaded from randomizer function:', currentVideos.length);
        } else {
            console.warn('Videos data not found, using fallback');
            currentVideos = generateFallbackVideos();
        }
        
        filteredVideos = [...currentVideos];
        console.log('Video data loaded and randomized successfully');
        
    } catch (error) {
        console.error('Error loading video data:', error);
        currentVideos = generateFallbackVideos();
        filteredVideos = [...currentVideos];
    }
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function generateFallbackVideos() {
    const fallbackVideos = [];
    for (let i = 1; i <= 12; i++) {
        fallbackVideos.push({
            id: i,
            title: `Sample Video ${i} - Amazing Content`,
            channel: `Channel ${Math.floor(Math.random() * 5) + 1}`,
            views: `${Math.floor(Math.random() * 900) + 100}K views`,
            date: `${Math.floor(Math.random() * 7) + 1} days ago`,
            duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            description: `This is sample video ${i} with amazing content.`,
            megaLink: `https://mega.nz/embed/fallback${i}#key${i}`,
            thumbnail: `https://images.unsplash.com/photo-${1500000000000 + i}?w=480&h=270&fit=crop&crop=center`
        });
    }
    return fallbackVideos;
}

function setupEventListeners() {
    console.log('Setting up enhanced event listeners...');
    
    try {
        // Menu button handlers with improved logic
        setupMenuHandlers();
        
        // Search functionality
        setupSearchHandlers();
        
        // Navigation handlers
        setupNavigationHandlers();
        
        // Load more button
        setupLoadMoreHandler();
        
        // Outside click handler for sidebar
        setupOutsideClickHandler();
        
        // Window resize handler
        setupResizeHandler();
        
        // Page refresh randomization
        setupRefreshRandomization();
        
        console.log('All event listeners setup successfully');
        
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

function setupRefreshRandomization() {
    // Randomize videos when user navigates to home
    window.addEventListener('focus', function() {
        if (currentPage === 'home') {
            setTimeout(() => {
                randomizeCurrentVideos();
            }, 100);
        }
    });
    
    // Also randomize when visibility changes (tab switching)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && currentPage === 'home') {
            setTimeout(() => {
                randomizeCurrentVideos();
            }, 100);
        }
    });
}

function randomizeCurrentVideos() {
    if (typeof window.getRandomizedVideos === 'function') {
        const newVideos = window.getRandomizedVideos();
        if (newVideos && newVideos.length > 0) {
            currentVideos = newVideos;
            filteredVideos = [...currentVideos];
            currentVideoIndex = 0;
            console.log('Videos randomized:', currentVideos.length);
            renderVideosWithStability();
        }
    }
}

function setupMenuHandlers() {
    const menuBtns = ['menu-btn', 'menu-btn-desktop'];
    
    menuBtns.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`${btnId} clicked`);
                toggleSidebarWithAnimation();
            });
            console.log(`Menu handler attached to ${btnId}`);
        } else {
            console.warn(`Menu button ${btnId} not found`);
        }
    });
}

function toggleSidebarWithAnimation() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    
    if (!sidebar || !mainContent) {
        console.error('Sidebar or main content not found');
        return;
    }
    
    sidebarOpen = !sidebarOpen;
    console.log('Toggling sidebar to:', sidebarOpen ? 'open' : 'closed');
    
    if (sidebarOpen) {
        sidebar.classList.add('open');
        if (window.innerWidth > 768) {
            mainContent.classList.add('shifted');
        }
    } else {
        sidebar.classList.remove('open');
        mainContent.classList.remove('shifted');
    }
}

function setupSearchHandlers() {
    const searchInputs = ['search-input', 'search-input-desktop'];
    const searchBtns = ['search-btn', 'search-btn-desktop'];
    
    function performSearch() {
        const query = getSearchQuery().toLowerCase().trim();
        console.log('Performing search for:', query);
        
        currentSearchQuery = query;
        
        if (!query) {
            // If empty search, go back to home
            showPage('home');
            return;
        }
        
        // Filter videos based on search query
        filteredVideos = currentVideos.filter(video => 
            video.title.toLowerCase().includes(query) ||
            video.channel.toLowerCase().includes(query) ||
            (video.description && video.description.toLowerCase().includes(query))
        );
        
        console.log(`Search results: ${filteredVideos.length} videos found`);
        
        // Show search results page
        showSearchResults(query);
    }
    
    function getSearchQuery() {
        const mobileInput = document.getElementById('search-input');
        const desktopInput = document.getElementById('search-input-desktop');
        return (mobileInput?.value || desktopInput?.value || '');
    }
    
    // Attach search button handlers
    searchBtns.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', performSearch);
        }
    });
    
    // Attach enter key handlers
    searchInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }
    });
}

function showSearchResults(query) {
    console.log('Showing search results for:', query);
    currentPage = 'search-results';
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    
    // Show search results page
    const searchResultsPage = document.getElementById('search-results-page');
    if (searchResultsPage) {
        searchResultsPage.classList.add('active');
        
        // Update search results title
        const titleElement = document.getElementById('search-results-title');
        if (titleElement) {
            titleElement.textContent = `Search Results for "${query}"`;
        }
        
        // Render search results
        renderSearchResults();
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768 && sidebarOpen) {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('main-content');
            if (sidebar && mainContent) {
                sidebar.classList.remove('open');
                mainContent.classList.remove('shifted');
                sidebarOpen = false;
            }
        }
    }
}

function renderSearchResults() {
    const searchResultsGrid = document.getElementById('search-results-grid');
    const noResultsDiv = document.getElementById('no-results');
    
    if (!searchResultsGrid || !noResultsDiv) {
        console.error('Search results elements not found');
        return;
    }
    
    // Clear existing content
    searchResultsGrid.innerHTML = '';
    
    if (filteredVideos.length === 0) {
        // Show no results message
        searchResultsGrid.style.display = 'none';
        noResultsDiv.style.display = 'block';
        return;
    }
    
    // Hide no results and show grid
    noResultsDiv.style.display = 'none';
    searchResultsGrid.style.display = 'grid';
    
    // Create document fragment for performance
    const fragment = document.createDocumentFragment();
    
    filteredVideos.forEach((video, index) => {
        const videoCard = createEnhancedVideoCard(video, index);
        if (videoCard) {
            fragment.appendChild(videoCard);
            
            // Add ads between search results
            if ((index + 1) % 8 === 0 && index < filteredVideos.length - 1) {
                const adSpace = createSearchResultAdSpace();
                if (adSpace) {
                    fragment.appendChild(adSpace);
                }
            }
        }
    });
    
    searchResultsGrid.appendChild(fragment);
    console.log('Search results rendered:', filteredVideos.length, 'videos');
}

function createSearchResultAdSpace() {
    const adSpace = document.createElement('div');
    adSpace.className = 'ad-space search-result-ad';
    adSpace.style.cssText = `
        width: 300px;
        height: 250px;
        max-width: 100%;
        margin: 15px auto;
        display: flex;
        align-items: center;
        justify-content: center;
        
        grid-column: 1 / -1;
    `;
    
    // Add the 300x250 ad script
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
}

function setupNavigationHandlers() {
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            console.log('Navigation clicked:', page);
            
            if (page) {
                updateActiveNavLink(page);
                showPage(page);
                
                // Close sidebar on mobile
                if (window.innerWidth <= 768) {
                    const sidebar = document.getElementById('sidebar');
                    const mainContent = document.getElementById('main-content');
                    if (sidebar && mainContent) {
                        sidebar.classList.remove('open');
                        mainContent.classList.remove('shifted');
                        sidebarOpen = false;
                    }
                }
            }
        });
    });
}

function setupLoadMoreHandler() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            console.log('Load more button clicked');
            loadMoreVideos();
        });
    }
}

function setupOutsideClickHandler() {
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const menuBtns = document.querySelectorAll('[id^="menu-btn"]');
        
        if (sidebar && sidebarOpen) {
            let clickedMenuBtn = false;
            menuBtns.forEach(btn => {
                if (btn && btn.contains(e.target)) {
                    clickedMenuBtn = true;
                }
            });
            
            if (!sidebar.contains(e.target) && !clickedMenuBtn) {
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    sidebar.classList.remove('open');
                    mainContent.classList.remove('shifted');
                    sidebarOpen = false;
                }
            }
        }
    });
}

function setupResizeHandler() {
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            handleWindowResize();
        }, 250);
    });
}

function handleWindowResize() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    
    if (sidebar && mainContent) {
        if (window.innerWidth > 768 && sidebarOpen) {
            mainContent.classList.add('shifted');
        } else if (window.innerWidth <= 768) {
            mainContent.classList.remove('shifted');
        }
    }
}

function setupHeaderAnimation() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    if (isHeaderVisible) {
                        header.classList.add('hidden');
                        isHeaderVisible = false;
                    }
                } else {
                    if (!isHeaderVisible) {
                        header.classList.remove('hidden');
                        isHeaderVisible = true;
                    }
                }
                
                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

function updateActiveNavLink(page) {
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    sidebarLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function showPage(page) {
    console.log('Showing page:', page);
    currentPage = page;
    
    // Clear search inputs when navigating away from search
    if (page !== 'search-results') {
        const searchInputs = ['search-input', 'search-input-desktop'];
        searchInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = '';
            }
        });
        currentSearchQuery = '';
    }
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById(page + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        console.log('Page activated:', page);
    } else {
        console.error('Target page not found:', page + '-page');
    }
    
    // Load page-specific content
    switch(page) {
        case 'home':
            loadHomeContent();
            break;
        case 'trending':
            loadTrendingContent();
            break;
        case 'search-results':
            // Search results are handled by showSearchResults function
            break;
        default:
            console.log('No specific content loader for page:', page);
    }
}

function loadHomeContent() {
    if (typeof window.getRandomizedVideos === 'function') {
        currentVideos = window.getRandomizedVideos();
    } else if (typeof videos !== 'undefined') {
        currentVideos = shuffleArray([...videos]);
    } else {
        currentVideos = generateFallbackVideos();
    }
    filteredVideos = [...currentVideos];
    currentVideoIndex = 0;
    
    setTimeout(() => {
        renderVideosWithStability();
    }, 100);
}

function loadTrendingContent() {
    if (typeof window.getRandomizedTrendingVideos === 'function') {
        currentVideos = window.getRandomizedTrendingVideos();
    } else if (typeof trendingVideos !== 'undefined') {
        currentVideos = shuffleArray([...trendingVideos]);
    } else {
        currentVideos = currentVideos.slice(0, 12);
    }
    filteredVideos = [...currentVideos];
    
    setTimeout(() => {
        renderTrendingVideos();
    }, 100);
}

function renderVideosWithStability() {
    const videoGrid = document.getElementById('video-grid');
    if (!videoGrid) {
        console.error('Video grid element not found');
        return;
    }
    
    console.log('Rendering videos with stability checks...');
    
    // Show loading state
    if (!isLoading) {
        isLoading = true;
        videoGrid.classList.add('loading');
    }
    
    // Clear existing content safely
    const fragment = document.createDocumentFragment();
    
    if (filteredVideos.length === 0) {
        const noVideosDiv = document.createElement('div');
        noVideosDiv.className = 'no-videos';
        noVideosDiv.textContent = 'No videos found';
        fragment.appendChild(noVideosDiv);
    } else {
        const videosToShow = filteredVideos.slice(0, currentVideoIndex + videosPerPage);
        console.log('Rendering', videosToShow.length, 'videos');
        
        videosToShow.forEach((video, index) => {
            const videoCard = createEnhancedVideoCard(video, index);
            if (videoCard) {
                fragment.appendChild(videoCard);
                
                // Add ads between videos
                if ((index + 1) % 6 === 0 && index < videosToShow.length - 1) {
                    const adSpace = createFixedAdSpace('300x250', 'video-grid');
                    if (adSpace) {
                        fragment.appendChild(adSpace);
                    }
                }
            }
        });
        
        // Update load more button
        updateLoadMoreButton(videosToShow.length >= filteredVideos.length);
    }
    
    // Apply changes
    videoGrid.innerHTML = '';
    videoGrid.appendChild(fragment);
    
    // Remove loading state
    setTimeout(() => {
        videoGrid.classList.remove('loading');
        isLoading = false;
        console.log('Video rendering completed successfully');
    }, 200);
}

function renderTrendingVideos() {
    const trendingGrid = document.getElementById('trending-grid');
    if (!trendingGrid) {
        console.error('Trending grid element not found');
        return;
    }
    
    console.log('Rendering trending videos...');
    const fragment = document.createDocumentFragment();
    
    filteredVideos.forEach((video, index) => {
        const videoCard = createEnhancedVideoCard(video, index);
        if (videoCard) {
            fragment.appendChild(videoCard);
        }
    });
    
    trendingGrid.innerHTML = '';
    trendingGrid.appendChild(fragment);
    console.log('Trending videos rendered:', filteredVideos.length);
}

function createEnhancedVideoCard(video, index) {
    if (!video) {
        console.error('Invalid video data:', video);
        return null;
    }
    
    const card = document.createElement('div');
    card.className = 'video-card hover-scale';
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
            <h3 class="video-title">${video.title}</h3>
            <div class="video-meta-info">
                <div class="channel-name">${video.channel}</div>
                <div class="video-stats">${video.views} • ${video.date}</div>
            </div>
        </div>
    `;
    
    // Enhanced click handler
    card.addEventListener('click', () => {
        console.log('Video card clicked:', video.title);
        playVideoWithEnhancements(video);
    });
    
    return card;
}

function createFixedAdSpace(size, placement) {
    const adSpace = document.createElement('div');
    adSpace.className = 'ad-space grid-ad-space';
    adSpace.setAttribute('data-size', size);
    adSpace.setAttribute('data-placement', placement);
    
    const [width, height] = size.split('x');
    adSpace.style.cssText = `
        width: ${width}px;
        height: ${height}px;
        max-width: 100%;
        margin: 15px auto;
        display: flex;
        align-items: center;
        justify-content: center;
        
        border: 1px solid rgba(255, 215, 0, 0.2);
        border-radius: 6px;
        grid-column: 1 / -1;
    `;
    
    adSpace.innerHTML = `<div>
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
                                </div>`;
    
    return adSpace;
}

function updateLoadMoreButton(hideButton) {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = hideButton ? 'none' : 'block';
    }
}

function loadMoreVideos() {
    console.log('Loading more videos...');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.innerHTML = 'Loading...';
        loadMoreBtn.disabled = true;
    }
    
    currentVideoIndex += videosPerPage;
    
    setTimeout(() => {
        renderVideosWithStability();
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = 'Load More Videos';
            loadMoreBtn.disabled = false;
        }
    }, 800);
}

function playVideoWithEnhancements(video) {
    console.log('Playing video with enhancements:', video.title);
    
    // Switch to video player page
    showPage('video-player');
    updateActiveNavLink('video-player');
    
    // Update video information
    updateVideoPlayerInfo(video);
    
    // Set video iframe with enhanced Mega link handling
    updateVideoPlayerIframe(video);
    
    // Load related videos
    setTimeout(() => {
        loadRelatedVideosEnhanced();
    }, 500);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateVideoPlayerInfo(video) {
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
        elements.channelAvatar.textContent = video.channel.charAt(0).toUpperCase();
    }
    
    if (elements.views) {
        elements.views.textContent = video.views;
    }
    
    if (elements.date) {
        elements.date.textContent = video.date;
    }
    
    if (elements.description) {
        elements.description.textContent = video.description || 'No description available.';
        elements.description.classList.add('fade-in');
    }
}

function updateVideoPlayerIframe(video) {
    const videoIframe = document.getElementById('video-iframe');
    if (!videoIframe) {
        console.error('Video iframe not found');
        return;
    }
    
    let embedUrl = video.megaLink;
    
    // Enhanced Mega link processing for real links
    if (embedUrl && embedUrl.includes('mega.nz/file/')) {
        // Convert mega.nz/file/ to mega.nz/embed/ format
        embedUrl = embedUrl.replace('mega.nz/file/', 'mega.nz/embed/');
        console.log('Converted Mega link to embed format:', embedUrl);
    } else if (embedUrl && embedUrl.includes('mega.nz/') && !embedUrl.includes('/embed/')) {
        // Ensure proper embed format for other Mega links
        embedUrl = embedUrl.replace('mega.nz/', 'mega.nz/embed/');
    }
    
    if (embedUrl && embedUrl.includes('mega.nz/embed/')) {
        console.log('Setting video iframe src:', embedUrl);
        videoIframe.src = embedUrl;
    } else {
        console.warn('Invalid Mega link format, using fallback');
        videoIframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    }
}

function loadRelatedVideosEnhanced() {
    const relatedGrid = document.getElementById('related-grid');
    if (!relatedGrid) return;
    
    console.log('Loading related videos...');
    relatedGrid.innerHTML = '';
    
    // Get randomized related videos
    const allVideos = [...currentVideos];
    const relatedVideos = shuffleArray(allVideos).slice(0, 12);
    const fragment = document.createDocumentFragment();
    
    relatedVideos.forEach((video, index) => {
        const videoCard = createEnhancedVideoCard(video, index);
        if (videoCard) {
            videoCard.style.transform = 'scale(0.95)';
            fragment.appendChild(videoCard);
            
            // Add ads after every 4 related videos
            if ((index + 1) % 4 === 0 && index < relatedVideos.length - 1) {
                const adSpace = createFixedAdSpace('300x250', 'related-videos');
                if (adSpace) {
                    fragment.appendChild(adSpace);
                }
            }
        }
    });
    
    relatedGrid.appendChild(fragment);
    console.log('Related videos loaded successfully');
}

function initializeAdSystemWithFixes() {
    console.log('Initializing enhanced ad system...');
    
    try {
        // Initialize ads with proper error handling
        if (window.initializeAllAds && typeof window.initializeAllAds === 'function') {
            window.initializeAllAds()
                .then(() => {
                    console.log('Ad system initialized successfully');
                    // Additional ad fixes
                    fixAdPositioning();
                })
                .catch(error => {
                    console.error('Ad system initialization failed:', error);
                    initializeFallbackAds();
                });
        } else {
            console.warn('Ad system not available, using fallback');
            initializeFallbackAds();
        }
    } catch (error) {
        console.error('Error during ad initialization:', error);
        initializeFallbackAds();
    }
}

function fixAdPositioning() {
    // Fix above video ad positioning
    const aboveVideoAd = document.querySelector('.above-video-ad');
    if (aboveVideoAd) {
        aboveVideoAd.style.position = 'relative';
        aboveVideoAd.style.zIndex = '1';
    }
    
    // Fix 728x90 banner ads
    const bannerAds = document.querySelectorAll('[data-size="728x90"]');
    bannerAds.forEach(ad => {
        ad.style.maxWidth = '100%';
        ad.style.margin = '10px auto';
        ad.style.display = 'block';
        
        // Mobile responsiveness
        if (window.innerWidth <= 768) {
            ad.style.transform = 'scale(0.8)';
            ad.style.transformOrigin = 'center';
        }
    });
    
    console.log('Ad positioning fixes applied');
}

function initializeFallbackAds() {
    const adSpaces = document.querySelectorAll('.ad-space');
    adSpaces.forEach(adSpace => {
        if (!adSpace.innerHTML.trim() || adSpace.innerHTML.includes('Ad Space')) {
            const size = adSpace.getAttribute('data-size') || '300x250';
            adSpace.innerHTML = `<div style="text-align: center; color: #ffd700; padding: 20px;"><script type="text/javascript">
	atOptions = {
		'key' : '9258e0377a9e583db2075fcb66f881bf',
		'format' : 'iframe',
		'height' : 250,
		'width' : 300,
		'params' : {}
	};
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/9258e0377a9e583db2075fcb66f881bf/invoke.js"></script></div>`;
            
            adSpace.style.border = '1px solid rgba(255, 215, 0, 0.2)';
            adSpace.style.borderRadius = '6px';
        }
    });
    console.log('Fallback ads initialized');
}

function handleInitializationError() {
    console.error('Critical initialization error occurred');
    
    // Try to show a basic error message
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div style="text-align: center; color: #ffd700; padding: 50px;">
                <h2>Loading Error</h2>
                <p>Please refresh the page to try again.</p>
                <button onclick="location.reload()" style="background: #ffd700; color: #000; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Refresh Page</button>
            </div>
        `;
    }
}

// Make functions globally accessible
window.showPage = showPage;
window.showSearchResults = showSearchResults;
window.playVideo = playVideoWithEnhancements;
window.createVideoCard = createEnhancedVideoCard;
window.createAdSpace = createFixedAdSpace;
window.initializeAdSystemSafely = initializeAdSystemWithFixes;
window.randomizeVideos = randomizeCurrentVideos;

console.log('Enhanced WrongHub script loaded with search results page and new ad integration');
