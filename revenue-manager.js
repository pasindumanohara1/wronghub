
// Revenue Manager - Handles non-intrusive monetization strategies
class RevenueManager {
    constructor() {
        this.profitableLink = 'https://www.profitableratecpm.com/ygkrucu3j?key=0f2b687f8c6bba045b1352e8cd979808';
        this.sessionData = this.getSessionData();
        this.cooldowns = {};
        this.isActive = true;
        this.initialized = false;
        
        // Configuration
        this.config = {
            maxTriggersPerSession: 4,
            cooldownPeriod: 60000, // 1 minute
            logoClickFrequency: 3,
            videoClickFrequency: 5,
            navClickFrequency: 4,
            scrollVideoThreshold: 20,
            timeBasedInterval: 150000, // 2.5 minutes
            searchDelay: 2500 // 2.5 seconds
        };
    }

    init() {
        if (this.initialized) return;
        
        console.log('Initializing Revenue Manager...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupMonetization();
            });
        } else {
            this.setupMonetization();
        }
    }

    setupMonetization() {
        // Add significant delay to ensure all elements are rendered and other scripts loaded
        setTimeout(() => {
            try {
                this.setupLogoMonetization();
                this.setupSearchMonetization();
                this.setupVideoMonetization();
                this.setupNavigationMonetization();
                this.setupScrollMonetization();
                this.setupTimeBasedMonetization();
                this.startSessionCleanup();
                
                this.initialized = true;
                console.log('Revenue Manager initialized successfully');
            } catch (error) {
                console.log('Error during revenue manager setup:', error);
            }
        }, 2000);
    }

    getSessionData() {
        try {
            const stored = localStorage.getItem('revenueSession');
            if (stored) {
                const data = JSON.parse(stored);
                // Reset if session is older than 30 minutes
                if (Date.now() - data.startTime > 1800000) {
                    return this.createNewSession();
                }
                return data;
            }
        } catch (error) {
            console.log('Error reading session data:', error);
        }
        return this.createNewSession();
    }

    createNewSession() {
        const sessionData = {
            startTime: Date.now(),
            logoClicks: 0,
            videoClicks: 0,
            navClicks: 0,
            scrollTriggers: 0,
            timeTriggers: 0,
            totalTriggers: 0,
            videosViewed: 0,
            lastActivity: Date.now()
        };
        try {
            localStorage.setItem('revenueSession', JSON.stringify(sessionData));
        } catch (error) {
            console.log('Error saving session data:', error);
        }
        return sessionData;
    }

    updateSessionData() {
        this.sessionData.lastActivity = Date.now();
        try {
            localStorage.setItem('revenueSession', JSON.stringify(this.sessionData));
        } catch (error) {
            console.log('Error updating session data:', error);
        }
    }

    canTrigger(type) {
        if (!this.isActive || this.sessionData.totalTriggers >= this.config.maxTriggersPerSession) {
            console.log(`Cannot trigger ${type}: inactive or max triggers reached`);
            return false;
        }

        const now = Date.now();
        if (this.cooldowns[type] && now - this.cooldowns[type] < this.config.cooldownPeriod) {
            console.log(`Cannot trigger ${type}: still in cooldown`);
            return false;
        }

        return true;
    }

    triggerRevenue(type, useBackgroundTab = true) {
        if (!this.canTrigger(type)) return false;

        this.sessionData.totalTriggers++;
        this.cooldowns[type] = Date.now();
        this.updateSessionData();

        try {
            if (useBackgroundTab) {
                window.open(this.profitableLink, '_blank');
            } else {
                window.location.href = this.profitableLink;
            }
            console.log(`Revenue triggered: ${type} (background: ${useBackgroundTab})`);
            return true;
        } catch (error) {
            console.log('Error triggering revenue link:', error);
            return false;
        }
    }

    setupLogoMonetization() {
        // Try multiple possible logo selectors that match the actual HTML
        const logoSelectors = ['.logo', '.logo h1', 'h1.logo', '.header-left .logo', '.logo h1 span'];
        let logo = null;
        
        for (const selector of logoSelectors) {
            logo = document.querySelector(selector);
            if (logo) {
                console.log(`Found logo with selector: ${selector}`);
                break;
            }
        }
        
        if (!logo) {
            // Try to find any clickable element in the logo area
            logo = document.querySelector('.header-left');
            if (logo) {
                console.log('Using header-left as logo fallback');
            } else {
                console.log('Logo element not found with any selector');
                return;
            }
        }

        // Store original handler
        const originalHandler = logo.onclick;
        
        logo.addEventListener('click', (e) => {
            try {
                this.sessionData.logoClicks++;
                console.log(`Logo clicked: ${this.sessionData.logoClicks} times`);
                
                if (this.sessionData.logoClicks % this.config.logoClickFrequency === 0) {
                    e.preventDefault();
                    console.log('Logo click triggering revenue');
                    this.triggerRevenue('logo', false);
                    return;
                }

                // Execute original behavior
                if (originalHandler) {
                    originalHandler.call(logo, e);
                } else if (window.showPage) {
                    window.showPage('home');
                }
                
                this.updateSessionData();
            } catch (error) {
                console.log('Error in logo click handler:', error);
            }
        });
        
        console.log('Logo monetization setup complete');
    }

    setupSearchMonetization() {
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('search-input');
        
        if (searchBtn) {
            console.log('Setting up search button monetization');
            searchBtn.addEventListener('click', () => {
                try {
                    setTimeout(() => {
                        console.log('Search button triggering revenue');
                        this.triggerRevenue('search', true);
                    }, this.config.searchDelay);
                } catch (error) {
                    console.log('Error in search button handler:', error);
                }
            });
        }

        if (searchInput) {
            console.log('Setting up search input monetization');
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    try {
                        setTimeout(() => {
                            console.log('Search enter triggering revenue');
                            this.triggerRevenue('search', true);
                        }, this.config.searchDelay);
                    } catch (error) {
                        console.log('Error in search enter handler:', error);
                    }
                }
            });
        }
        
        if (!searchBtn && !searchInput) {
            console.log('Search elements not found');
        }
    }

    setupVideoMonetization() {
        // Store reference to original function if it exists
        const originalPlayVideo = window.playVideo;
        
        // Override the global playVideo function with proper error handling
        window.playVideo = (video) => {
            try {
                this.sessionData.videoClicks++;
                this.sessionData.videosViewed++;
                console.log(`Video played: ${this.sessionData.videoClicks} clicks, ${this.sessionData.videosViewed} viewed`);
                
                if (this.sessionData.videoClicks % this.config.videoClickFrequency === 0) {
                    setTimeout(() => {
                        console.log('Video click triggering revenue');
                        this.triggerRevenue('video', true);
                    }, 1000);
                }
                
                this.updateSessionData();
                
                // Call original function if it exists
                if (originalPlayVideo && typeof originalPlayVideo === 'function') {
                    originalPlayVideo(video);
                }
            } catch (error) {
                console.log('Error in playVideo override:', error);
                // Still call original function on error
                if (originalPlayVideo && typeof originalPlayVideo === 'function') {
                    originalPlayVideo(video);
                }
            }
        };
        
        console.log('Video monetization setup complete');
    }

    setupNavigationMonetization() {
        // Try multiple navigation selectors that match the actual HTML
        const navSelectors = ['.sidebar-menu a', '.sidebar a', 'nav a', '.navigation a', '#sidebar a'];
        let sidebarLinks = [];
        
        for (const selector of navSelectors) {
            sidebarLinks = document.querySelectorAll(selector);
            if (sidebarLinks.length > 0) {
                console.log(`Found ${sidebarLinks.length} navigation links with selector: ${selector}`);
                break;
            }
        }
        
        if (sidebarLinks.length === 0) {
            console.log('Navigation links not found, checking again in 2 seconds...');
            setTimeout(() => this.setupNavigationMonetization(), 2000);
            return;
        }

        sidebarLinks.forEach((link, index) => {
            link.addEventListener('click', () => {
                try {
                    this.sessionData.navClicks++;
                    console.log(`Navigation clicked ${this.sessionData.navClicks} times (link ${index})`);
                    
                    if (this.sessionData.navClicks % this.config.navClickFrequency === 0) {
                        setTimeout(() => {
                            console.log('Navigation click triggering revenue');
                            this.triggerRevenue('navigation', true);
                        }, 500);
                    }
                    
                    this.updateSessionData();
                } catch (error) {
                    console.log('Error in navigation click handler:', error);
                }
            });
        });
        
        console.log('Navigation monetization setup complete');
    }

    setupScrollMonetization() {
        let scrollTriggerTimeout;
        let lastScrollTrigger = 0;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTriggerTimeout);
            scrollTriggerTimeout = setTimeout(() => {
                try {
                    const now = Date.now();
                    // Only trigger if enough time has passed and enough videos viewed
                    if (this.sessionData.videosViewed >= this.config.scrollVideoThreshold && 
                        now - lastScrollTrigger > 300000) { // 5 minutes
                        
                        console.log(`Scroll trigger: ${this.sessionData.videosViewed} videos viewed`);
                        if (this.triggerRevenue('scroll', true)) {
                            this.sessionData.scrollTriggers++;
                            this.sessionData.videosViewed = 0; // Reset counter
                            lastScrollTrigger = now;
                        }
                    }
                } catch (error) {
                    console.log('Error in scroll handler:', error);
                }
            }, 1000);
        });
        
        console.log('Scroll monetization setup complete');
    }

    setupTimeBasedMonetization() {
        setInterval(() => {
            try {
                const timeSinceLastActivity = Date.now() - this.sessionData.lastActivity;
                
                // Only trigger if user has been active in last 5 minutes
                if (timeSinceLastActivity < 300000) {
                    console.log('Time-based trigger attempting');
                    if (this.triggerRevenue('time', true)) {
                        this.sessionData.timeTriggers++;
                    }
                }
            } catch (error) {
                console.log('Error in time-based trigger:', error);
            }
        }, this.config.timeBasedInterval);
        
        console.log('Time-based monetization setup complete');
    }

    startSessionCleanup() {
        // Clean up old session data every 10 minutes
        setInterval(() => {
            try {
                const now = Date.now();
                if (now - this.sessionData.startTime > 1800000) {
                    console.log('Resetting session data');
                    this.sessionData = this.createNewSession();
                }
            } catch (error) {
                console.log('Error in session cleanup:', error);
            }
        }, 600000);
        
        console.log('Session cleanup started');
    }

    // Public methods for manual triggering
    pause() {
        this.isActive = false;
        console.log('Revenue Manager paused');
    }

    resume() {
        this.isActive = true;
        console.log('Revenue Manager resumed');
    }

    getStats() {
        return {
            session: this.sessionData,
            config: this.config,
            cooldowns: this.cooldowns,
            initialized: this.initialized
        };
    }
}

// Initialize revenue manager
const revenueManager = new RevenueManager();

// Make it globally accessible
window.revenueManager = revenueManager;

console.log('Revenue Manager loaded successfully');
