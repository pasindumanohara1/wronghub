
// Pop-up Ad Manager
class PopupAdManager {
    constructor() {
        this.isPopupShown = false;
        this.popupDelay = 3000; // Show after 3 seconds
        this.popupFrequency = 30000; // Show every 30 seconds
        this.lastPopupTime = 0;
        this.popupElement = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        // Wait for DOM and ads.js to be loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.delayedInit();
            });
        } else {
            this.delayedInit();
        }
    }

    delayedInit() {
        // Add delay to ensure ads.js is loaded
        setTimeout(() => {
            this.createPopupHTML();
            this.setupEventListeners();
            this.schedulePopup();
            this.initialized = true;
            console.log('Popup Ad Manager initialized successfully');
        }, 1000);
    }

    getExternalLink(type) {
        // Use global function if available, otherwise fallback
        if (window.getExternalLink && typeof window.getExternalLink === 'function') {
            return window.getExternalLink(type);
        }
        // Fallback URL
        return 'https://www.profitableratecpm.com/ygkrucu3j?key=0f2b687f8c6bba045b1352e8cd979808';
    }

    createPopupHTML() {
        // Remove existing popup if it exists
        const existingPopup = document.getElementById('popup-ad-overlay');
        if (existingPopup) {
            existingPopup.remove();
        }

        // Create popup overlay
        const popupOverlay = document.createElement('div');
        popupOverlay.id = 'popup-ad-overlay';
        popupOverlay.className = 'popup-ad-overlay';
        
        // Create popup container
        const popupContainer = document.createElement('div');
        popupContainer.id = 'popup-ad-container';
        popupContainer.className = 'popup-ad-container';
        
        // Create popup content
        popupContainer.innerHTML = `
            <div class="popup-ad-header">
                <span class="popup-ad-title">Special Offer</span>
                <button class="popup-ad-close" id="popup-close-btn">&times;</button>
            </div>
            <div class="popup-ad-content">
                <div class="popup-ad-banner" id="popup-ad-banner">
                    <div class="ad-space popup-ad-space" data-size="728x90">
                        <div class="ad-placeholder">728x90 Pop-up Advertisement</div>
                    </div>
                </div>
                <div class="popup-ad-actions">
                    <button class="btn-yellow popup-ad-cta" id="popup-ad-cta">Check it out!</button>
                </div>
            </div>
        `;
        
        popupOverlay.appendChild(popupContainer);
        document.body.appendChild(popupOverlay);
        
        this.popupElement = popupOverlay;
        console.log('Popup HTML created successfully');
    }

    setupEventListeners() {
        if (!this.popupElement) {
            console.log('Popup element not found for event listeners');
            return;
        }

        // Close button
        const closeBtn = document.getElementById('popup-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hidePopup());
        }

        // Overlay click to close
        const overlay = document.getElementById('popup-ad-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.hidePopup();
                }
            });
        }

        // CTA button
        const ctaBtn = document.getElementById('popup-ad-cta');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', () => {
                try {
                    // Open external ad link
                    const adUrl = this.getExternalLink('videoActions');
                    window.open(adUrl, '_blank');
                    console.log('Popup CTA clicked, opening:', adUrl);
                } catch (error) {
                    console.log('Error opening popup ad link:', error);
                }
                this.hidePopup();
            });
        }

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isPopupShown) {
                this.hidePopup();
            }
        });

        console.log('Popup event listeners setup complete');
    }

    schedulePopup() {
        // Show popup after initial delay
        setTimeout(() => {
            this.showPopup();
        }, this.popupDelay);

        // Schedule recurring popups
        setInterval(() => {
            const now = Date.now();
            if (now - this.lastPopupTime > this.popupFrequency && !this.isPopupShown) {
                this.showPopup();
            }
        }, 10000); // Check every 10 seconds
        
        console.log('Popup scheduling initialized');
    }

    showPopup() {
        if (this.isPopupShown || !this.popupElement) {
            console.log('Cannot show popup: already shown or element missing');
            return;
        }

        try {
            this.popupElement.classList.add('show');
            this.isPopupShown = true;
            this.lastPopupTime = Date.now();
            
            // Add body scroll lock
            document.body.style.overflow = 'hidden';
            
            // Auto-close after 10 seconds
            setTimeout(() => {
                if (this.isPopupShown) {
                    this.hidePopup();
                }
            }, 10000);

            console.log('Pop-up ad displayed successfully');
        } catch (error) {
            console.log('Error showing popup:', error);
        }
    }

    hidePopup() {
        if (!this.isPopupShown || !this.popupElement) {
            console.log('Cannot hide popup: not shown or element missing');
            return;
        }

        try {
            this.popupElement.classList.remove('show');
            this.isPopupShown = false;
            
            // Remove body scroll lock
            document.body.style.overflow = '';
            
            console.log('Pop-up ad closed');
        } catch (error) {
            console.log('Error hiding popup:', error);
        }
    }

    // Method to trigger popup manually
    triggerPopup() {
        const now = Date.now();
        if (now - this.lastPopupTime > 5000) { // At least 5 seconds between manual triggers
            console.log('Manual popup trigger');
            this.showPopup();
        } else {
            console.log('Manual popup trigger denied: too soon');
        }
    }
}

// Initialize popup ad manager when script loads
let popupAdManager;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        popupAdManager = new PopupAdManager();
        popupAdManager.init();
    });
} else {
    popupAdManager = new PopupAdManager();
    popupAdManager.init();
}

// Make it globally accessible
window.popupAdManager = popupAdManager;

console.log('Popup Ad Manager script loaded');
