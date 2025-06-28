// Complete Ad System Rebuild with Error Fixes
const adConfig = {
    // External ad links - Updated with new profitable direct link
    externalLinks: {
        videoActions: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736',
        subscribe: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736',
        download: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736',
        like: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736',
        dislike: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736',
        comments: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736'
    },

    // Ad placements configuration with new profitable ad codes
    placements: {
        header: {
            enabled: true,
            desktop: {
                size: '728x90',
                key: '23632d040e9ace3cb20615242d28bebd'
            },
            mobile: {
                size: '320x50',
                key: '2483c8ff110bc0a32bcb87316e68fe3b'
            }
        },
        sidebar: {
            enabled: true,
            primary: {
                size: '300x250',
                key: '9258e0377a9e583db2075fcb66f881bf'
            },
            skyscraper: {
                size: '160x600',
                key: '6f68c1a21f3332447aaea9b8b4fd6ec7'
            },
            medium: {
                size: '160x300',
                key: '4acf10535b41ab941d3298879deffbb3'
            }
        },
        videoPlayer: {
            enabled: true,
            above: {
                size: '728x90',
                key: '23632d040e9ace3cb20615242d28bebd'
            },
            beside: {
                size: '300x250',
                key: '9258e0377a9e583db2075fcb66f881bf'
            },
            content: {
                size: '468x60',
                key: '750f82bb6dfa9c1950bb6b2f534e9100'
            }
        },
        videoGrid: {
            enabled: true,
            banner: {
                size: '728x90',
                key: '23632d040e9ace3cb20615242d28bebd'
            },
            rectangle: {
                size: '300x250',
                key: '9258e0377a9e583db2075fcb66f881bf'
            },
            content: {
                size: '468x60',
                key: '750f82bb6dfa9c1950bb6b2f534e9100'
            }
        },
        footer: {
            enabled: true,
            primary: {
                size: '728x90',
                key: '23632d040e9ace3cb20615242d28bebd'
            },
            secondary: {
                size: '300x250',
                key: '9258e0377a9e583db2075fcb66f881bf'
            }
        },
        native: {
            enabled: true,
            containerId: 'container-16bf3c60c71aa096607ad9ef03e8fa98',
            scriptSrc: '//pl26917078.profitableratecpm.com/16bf3c60c71aa096607ad9ef03e8fa98/invoke.js'
        }
    },

    // Popunder ad configuration - Updated
    popunder: {
        enabled: true,
        scriptSrc: '//pl26917075.profitableratecpm.com/89/22/65/892265a32c6a746f8cd6827ec80659f2.js'
    },

    // Social bar ad configuration - Updated
    socialBar: {
        enabled: true,
        scriptSrc: '//pl26917089.profitableratecpm.com/b0/7a/be/b07abeb917e97c254f11b584a7665bb0.js'
    },

    // Revenue optimization settings
    revenue: {
        profitableLink: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736',
        maxTriggersPerSession: 6,
        cooldownPeriod: 45000, // 45 seconds
        sessionResetTime: 1800000 // 30 minutes
    }
};

// Track loaded scripts to prevent duplicates
const loadedScripts = new Set();

// Mobile detection
function isMobile() {
    return window.innerWidth <= 768;
}

// Utility function to wait for element
function waitForElement(elementId, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        function checkElement() {
            const element = document.getElementById(elementId);
            if (element) {
                resolve(element);
                return;
            }
            
            if (Date.now() - startTime > timeout) {
                reject(new Error(`Element ${elementId} not found within ${timeout}ms`));
                return;
            }
            
            setTimeout(checkElement, 100);
        }
        
        checkElement();
    });
}

// Enhanced ad script creation with error handling
function createAdScript(key, width, height) {
    const scriptId = `ad-script-${key}`;
    
    // Check if script already exists
    if (loadedScripts.has(scriptId)) {
        console.log(`Ad script ${key} already loaded`);
        return null;
    }
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = scriptId;
    script.innerHTML = `
        try {
            atOptions = {
                'key': '${key}',
                'format': 'iframe',
                'height': ${height},
                'width': ${width},
                'params': {}
            };
        } catch(e) {
            console.log('Error setting atOptions:', e);
        }
    `;
    
    loadedScripts.add(scriptId);
    return script;
}

function createInvokeScript(key) {
    const invokeId = `invoke-script-${key}`;
    
    // Check if script already exists
    if (loadedScripts.has(invokeId)) {
        console.log(`Invoke script ${key} already loaded`);
        return null;
    }
    
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.id = invokeId;
    invokeScript.src = `//www.highperformanceformat.com/${key}/invoke.js`;
    invokeScript.onerror = function() {
        console.log(`Failed to load invoke script for ${key}`);
        loadedScripts.delete(invokeId);
    };
    
    loadedScripts.add(invokeId);
    return invokeScript;
}

// Enhanced ad injection with proper 728x90 fixes
async function injectResponsiveAd(containerId, placement, adType) {
    try {
        console.log(`Injecting ad: ${containerId} - ${placement}:${adType}`);
        
        // Wait for container with timeout
        const container = await waitForElement(containerId, 5000);
        
        const config = adConfig.placements[placement];
        if (!config || !config.enabled) {
            console.log(`Ad placement ${placement} not enabled`);
            return false;
        }

        // Clear container safely
        container.innerHTML = '';

        let adData;
        if (placement === 'header') {
            adData = isMobile() ? config.mobile : config.desktop;
        } else {
            adData = config[adType] || config.primary || config;
        }

        if (!adData || !adData.key) {
            console.log(`No ad data found for ${placement}:${adType}`);
            return false;
        }

        const [width, height] = adData.size.split('x');
        
        // Create enhanced ad wrapper with 728x90 fixes
        const adWrapper = document.createElement('div');
        adWrapper.className = 'ad-wrapper responsive-ad enhanced-ad-space';
        adWrapper.style.cssText = `
            margin: 15px auto;
            text-align: center;
            max-width: 100%;
            position: relative;
            width: ${width}px;
            height: ${height}px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 215, 0, 0.1);
            border-radius: 6px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Special handling for 728x90 banner ads
        if (adData.size === '728x90') {
            console.log('Applying 728x90 banner ad fixes');
            adWrapper.style.cssText += `
                min-height: 90px;
                max-width: 95%;
            `;
            
            // Mobile responsive handling for 728x90
            if (isMobile()) {
                adWrapper.style.cssText += `
                    transform: scale(0.8);
                    transform-origin: center;
                    width: 100%;
                    max-width: 320px;
                    height: auto;
                    min-height: 60px;
                `;
            }
        }
        
        // Desktop-only ad hiding on mobile
        if (isMobile() && (adData.size === '160x600' || adData.size === '160x300')) {
            adWrapper.style.display = 'none';
            console.log('Hiding desktop-only ad on mobile');
        }

        // Create proper ad content with error handling
        if (adData.key && !adData.key.startsWith('YOUR_')) {
            // Create ad configuration script
            const configScript = createAdScript(adData.key, width, height);
            if (configScript) {
                adWrapper.appendChild(configScript);
            }
            
            // Create invoke script with error handling
            const invokeScript = createInvokeScript(adData.key);
            if (invokeScript) {
                adWrapper.appendChild(invokeScript);
            }
            
            console.log(`Ad scripts created for ${adData.key}`);
        } else {
            // Fallback placeholder
            const placeholder = document.createElement('div');
            placeholder.style.cssText = 'color: #ffd700; font-size: 12px; text-align: center; padding: 10px;';
            placeholder.textContent = `Advertisement ${adData.size}`;
            adWrapper.appendChild(placeholder);
        }
        
        container.appendChild(adWrapper);

        console.log(`Successfully injected ${placement} ad: ${adData.size}`);
        return true;
        
    } catch (error) {
        console.error(`Error injecting ad for ${containerId}:`, error);
        
        // Create fallback ad
        try {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="ad-space" style="
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 215, 0, 0.2);
                        border-radius: 6px;
                        padding: 20px;
                        text-align: center;
                        color: #ffd700;
                        margin: 10px auto;
                        max-width: 100%;
                    ">
                        Advertisement Space
                    </div>
                `;
            }
        } catch (fallbackError) {
            console.error('Fallback ad creation failed:', fallbackError);
        }
        
        return false;
    }
}

// Native ad injection with error handling
async function injectNativeAd() {
    const config = adConfig.placements.native;
    if (!config.enabled) return false;

    try {
        let container = document.getElementById(config.containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = config.containerId;
            container.style.margin = '20px auto';
            container.style.textAlign = 'center';
            container.style.maxWidth = '100%';
            
            // Find a good place to insert it
            const videoPlayer = document.querySelector('.video-player-container');
            const mainContent = document.getElementById('main-content');
            
            if (videoPlayer) {
                videoPlayer.parentNode.insertBefore(container, videoPlayer.nextSibling);
            } else if (mainContent) {
                mainContent.appendChild(container);
            }
        }

        const scriptId = 'native-ad-script';
        if (!loadedScripts.has(scriptId)) {
            const script = document.createElement('script');
            script.async = true;
            script.setAttribute('data-cfasync', 'false');
            script.src = config.scriptSrc;
            script.id = scriptId;
            script.onerror = function() {
                console.log('Failed to load native ad script');
                loadedScripts.delete(scriptId);
            };
            
            document.head.appendChild(script);
            loadedScripts.add(scriptId);
        }

        console.log('Native ad injected successfully');
        return true;
        
    } catch (error) {
        console.log('Error injecting native ad:', error);
        return false;
    }
}

// Enhanced popunder injection
function injectPopunderAd() {
    if (!adConfig.popunder.enabled) return false;
    
    const scriptId = 'popunder-ad-script';
    if (loadedScripts.has(scriptId)) {
        console.log('Popunder already loaded');
        return false;
    }
    
    try {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = adConfig.popunder.scriptSrc;
        script.id = scriptId;
        script.onerror = function() {
            console.log('Failed to load popunder script');
            loadedScripts.delete(scriptId);
        };
        
        document.head.appendChild(script);
        loadedScripts.add(scriptId);
        
        console.log('Popunder ad injected successfully');
        return true;
        
    } catch (error) {
        console.log('Error injecting popunder ad:', error);
        return false;
    }
}

// Enhanced social bar injection
function injectSocialBarAd() {
    if (!adConfig.socialBar.enabled) return false;
    
    const scriptId = 'social-bar-ad-script';
    if (loadedScripts.has(scriptId)) {
        console.log('Social bar already loaded');
        return false;
    }
    
    try {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = adConfig.socialBar.scriptSrc;
        script.id = scriptId;
        script.onerror = function() {
            console.log('Failed to load social bar script');
            loadedScripts.delete(scriptId);
        };
        
        document.head.appendChild(script);
        loadedScripts.add(scriptId);
        
        console.log('Social bar ad injected successfully');
        return true;
        
    } catch (error) {
        console.log('Error injecting social bar ad:', error);
        return false;
    }
}

// Enhanced initialization with proper timing and 728x90 fixes
async function initializeAllAds() {
    console.log('Initializing comprehensive ad system with fixes...');

    try {
        // Phase 1: Critical ads with proper delays
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Initialize header ads with 728x90 fixes
        const headerInitialized = await injectResponsiveAd('header-ad', 'header');
        if (!headerInitialized) {
            console.warn('Header ad initialization failed, creating fallback');
            createFallbackHeaderAd();
        }

        // Phase 2: Sidebar ads
        await new Promise(resolve => setTimeout(resolve, 600));
        await injectResponsiveAd('sidebar-ad', 'sidebar', 'primary');
        
        // Desktop skyscraper ad
        if (!isMobile()) {
            await new Promise(resolve => setTimeout(resolve, 400));
            await ensureSkyscraperContainer();
            await injectResponsiveAd('sidebar-skyscraper', 'sidebar', 'skyscraper');
        }

        // Phase 3: Footer ads with 728x90 priority
        await new Promise(resolve => setTimeout(resolve, 800));
        const footerInitialized = await injectResponsiveAd('footer-ads', 'footer', 'primary');
        if (!footerInitialized) {
            createFallbackFooterAd();
        }

        // Phase 4: Video player ads
        await new Promise(resolve => setTimeout(resolve, 600));
        await initializeVideoPlayerAds();

        // Phase 5: Special ads
        await new Promise(resolve => setTimeout(resolve, 1000));
        injectPopunderAd();
        
        await new Promise(resolve => setTimeout(resolve, 300));
        injectSocialBarAd();
        
        await new Promise(resolve => setTimeout(resolve, 500));
        await injectNativeAd();

        // Apply final fixes
        await new Promise(resolve => setTimeout(resolve, 800));
        applyFinalAdFixes();

        console.log('All ads initialization completed with fixes');
        
    } catch (error) {
        console.error('Error during ad initialization:', error);
        initializeEmergencyFallbackAds();
    }
}

function createFallbackHeaderAd() {
    const headerContainer = document.getElementById('header-ad');
    if (headerContainer) {
        headerContainer.innerHTML = `
            <div class="ad-space" style="
                width: 100%;
                max-width: 728px;
                height: 90px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 215, 0, 0.2);
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffd700;
                margin: 10px auto;
            ">
                Header Advertisement 728x90
            </div>
        `;
        console.log('Fallback header ad created');
    }
}

function createFallbackFooterAd() {
    const footerContainer = document.getElementById('footer-ads');
    if (footerContainer) {
        footerContainer.innerHTML = `
            <div class="ad-space" style="
                width: 100%;
                max-width: 728px;
                height: 90px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 215, 0, 0.2);
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffd700;
                margin: 10px auto;
            ">
                Footer Advertisement 728x90
            </div>
        `;
        console.log('Fallback footer ad created');
    }
}

async function ensureSkyscraperContainer() {
    let skyscraperContainer = document.getElementById('sidebar-skyscraper');
    if (!skyscraperContainer) {
        const sidebarContainer = document.querySelector('.sidebar-ads-container');
        if (sidebarContainer) {
            skyscraperContainer = document.createElement('div');
            skyscraperContainer.id = 'sidebar-skyscraper';
            skyscraperContainer.className = 'desktop-only';
            skyscraperContainer.style.marginTop = '20px';
            sidebarContainer.appendChild(skyscraperContainer);
            console.log('Skyscraper container created');
        }
    }
}

async function initializeVideoPlayerAds() {
    // Above video ad
    await injectResponsiveAd('above-video-ad', 'videoPlayer', 'above');
    
    // Beside video ad (desktop only)
    if (!isMobile()) {
        await injectResponsiveAd('beside-video-ad', 'videoPlayer', 'beside');
    }
    
    // Content break ad
    await injectResponsiveAd('content-break-ad', 'videoPlayer', 'content');
}

function applyFinalAdFixes() {
    console.log('Applying final ad positioning and responsiveness fixes...');
    
    // Fix all 728x90 banner ads
    const bannerAds = document.querySelectorAll('.ad-wrapper');
    bannerAds.forEach(ad => {
        const sizeAttr = ad.querySelector('[data-size]')?.getAttribute('data-size');
        if (sizeAttr === '728x90' || ad.style.width === '728px') {
            ad.style.maxWidth = '100%';
            ad.style.margin = '15px auto';
            ad.style.display = 'flex';
            ad.style.alignItems = 'center';
            ad.style.justifyContent = 'center';
            
            if (isMobile()) {
                ad.style.transform = 'scale(0.85)';
                ad.style.transformOrigin = 'center';
            }
        }
    });
    
    // Fix above video ad positioning
    const aboveVideoAd = document.querySelector('.above-video-ad');
    if (aboveVideoAd) {
        aboveVideoAd.style.position = 'relative';
        aboveVideoAd.style.zIndex = '1';
        aboveVideoAd.style.background = 'rgba(0, 0, 0, 0.8)';
        aboveVideoAd.style.borderBottom = '1px solid #333';
        aboveVideoAd.style.padding = '10px 0';
        aboveVideoAd.style.marginBottom = '15px';
    }
    
    // Apply responsive fixes
    if (isMobile()) {
        const desktopOnlyAds = document.querySelectorAll('.desktop-only');
        desktopOnlyAds.forEach(ad => {
            ad.style.display = 'none';
        });
    }
    
    console.log('Final ad fixes applied successfully');
}

function initializeEmergencyFallbackAds() {
    console.log('Initializing emergency fallback ads...');
    
    const adContainers = [
        'header-ad', 'sidebar-ad', 'footer-ads', 
        'above-video-ad', 'beside-video-ad', 'content-break-ad'
    ];
    
    adContainers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container && !container.innerHTML.trim()) {
            container.innerHTML = `
                <div class="ad-space" style="
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 215, 0, 0.2);
                    border-radius: 6px;
                    padding: 20px;
                    text-align: center;
                    color: #ffd700;
                    margin: 10px auto;
                    max-width: 100%;
                    min-height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    Advertisement Space
                </div>
            `;
        }
    });
}

// Legacy function support with error handling
function getExternalLink(type) {
    return adConfig.externalLinks[type] || adConfig.externalLinks.videoActions;
}

function isAdEnabled(placement) {
    return adConfig.placements[placement] && adConfig.placements[placement].enabled;
}

// Update external links with error handling
function updateExternalLinks() {
    try {
        const elements = document.querySelectorAll('[data-ad-link]');
        elements.forEach(element => {
            const linkType = element.getAttribute('data-ad-link');
            const url = getExternalLink(linkType);
            
            if (element.tagName === 'A') {
                element.href = url;
            } else if (element.tagName === 'BUTTON') {
                element.onclick = () => window.open(url, '_blank');
            }
        });
    } catch (error) {
        console.log('Error updating external links:', error);
    }
}

// Initialize on DOM load with proper error handling
document.addEventListener('DOMContentLoaded', function() {
    try {
        updateExternalLinks();
        
        // Start ad initialization with delay
        setTimeout(() => {
            initializeAllAds().catch(error => {
                console.log('Failed to initialize ads:', error);
            });
        }, 1000);
        
        console.log('Profitable ad system initialized successfully');
        
    } catch (error) {
        console.log('Error during ad system initialization:', error);
    }
});

// Handle window resize for responsive ads
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        console.log('Window resized, updating responsive ads');
        // Re-initialize header ad for mobile/desktop switch
        injectResponsiveAd('header-ad', 'header').catch(error => {
            console.log('Error updating header ad on resize:', error);
        });
    }, 500);
});

// Export functions safely
window.adConfig = adConfig;
window.getExternalLink = getExternalLink;
window.isAdEnabled = isAdEnabled;
window.injectResponsiveAd = injectResponsiveAd;
window.injectNativeAd = injectNativeAd;
window.updateExternalLinks = updateExternalLinks;
window.initializeAllAds = initializeAllAds;
window.waitForElement = waitForElement;
// Complete Ad System Rebuild with Error Fixes
const adConfig = {
    // External ad links - Updated with new profitable direct link
    externalLinks: {
        videoActions: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736',
        subscribe: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736',
        download: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736',
        like: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736',
        dislike: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736',
        comments: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736'
    },

    // Ad placements configuration with new profitable ad codes
    placements: {
        header: {
            enabled: true,
            desktop: {
                size: '728x90',
                key: '23632d040e9ace3cb20615242d28bebd'
            },
            mobile: {
                size: '320x50',
                key: '2483c8ff110bc0a32bcb87316e68fe3b'
            }
        },
        sidebar: {
            enabled: true,
            primary: {
                size: '300x250',
                key: '9258e0377a9e583db2075fcb66f881bf'
            },
            skyscraper: {
                size: '160x600',
                key: '6f68c1a21f3332447aaea9b8b4fd6ec7'
            },
            medium: {
                size: '160x300',
                key: '4acf10535b41ab941d3298879deffbb3'
            }
        },
        videoPlayer: {
            enabled: true,
            above: {
                size: '728x90',
                key: '23632d040e9ace3cb20615242d28bebd'
            },
            beside: {
                size: '300x250',
                key: '9258e0377a9e583db2075fcb66f881bf'
            },
            content: {
                size: '468x60',
                key: '750f82bb6dfa9c1950bb6b2f534e9100'
            }
        },
        videoGrid: {
            enabled: true,
            banner: {
                size: '728x90',
                key: '23632d040e9ace3cb20615242d28bebd'
            },
            rectangle: {
                size: '300x250',
                key: '9258e0377a9e583db2075fcb66f881bf'
            },
            content: {
                size: '468x60',
                key: '750f82bb6dfa9c1950bb6b2f534e9100'
            }
        },
        footer: {
            enabled: true,
            primary: {
                size: '728x90',
                key: '23632d040e9ace3cb20615242d28bebd'
            },
            secondary: {
                size: '300x250',
                key: '9258e0377a9e583db2075fcb66f881bf'
            }
        },
        native: {
            enabled: true,
            containerId: 'container-16bf3c60c71aa096607ad9ef03e8fa98',
            scriptSrc: '//pl26917078.profitableratecpm.com/16bf3c60c71aa096607ad9ef03e8fa98/invoke.js'
        }
    },

    // Popunder ad configuration - Updated
    popunder: {
        enabled: true,
        scriptSrc: '//pl26917075.profitableratecpm.com/89/22/65/892265a32c6a746f8cd6827ec80659f2.js'
    },

    // Social bar ad configuration - Updated
    socialBar: {
        enabled: true,
        scriptSrc: '//pl26917089.profitableratecpm.com/b0/7a/be/b07abeb917e97c254f11b584a7665bb0.js'
    },

    // Revenue optimization settings
    revenue: {
        profitableLink: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736',
        maxTriggersPerSession: 6,
        cooldownPeriod: 45000, // 45 seconds
        sessionResetTime: 1800000 // 30 minutes
    }
};

// Track loaded scripts to prevent duplicates
const loadedScripts = new Set();

// Mobile detection
function isMobile() {
    return window.innerWidth <= 768;
}

// Utility function to wait for element
function waitForElement(elementId, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        function checkElement() {
            const element = document.getElementById(elementId);
            if (element) {
                resolve(element);
                return;
            }
            
            if (Date.now() - startTime > timeout) {
                reject(new Error(`Element ${elementId} not found within ${timeout}ms`));
                return;
            }
            
            setTimeout(checkElement, 100);
        }
        
        checkElement();
    });
}

// Enhanced ad script creation with error handling
function createAdScript(key, width, height) {
    const scriptId = `ad-script-${key}`;
    
    // Check if script already exists
    if (loadedScripts.has(scriptId)) {
        console.log(`Ad script ${key} already loaded`);
        return null;
    }
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = scriptId;
    script.innerHTML = `
        try {
            atOptions = {
                'key': '${key}',
                'format': 'iframe',
                'height': ${height},
                'width': ${width},
                'params': {}
            };
        } catch(e) {
            console.log('Error setting atOptions:', e);
        }
    `;
    
    loadedScripts.add(scriptId);
    return script;
}

function createInvokeScript(key) {
    const invokeId = `invoke-script-${key}`;
    
    // Check if script already exists
    if (loadedScripts.has(invokeId)) {
        console.log(`Invoke script ${key} already loaded`);
        return null;
    }
    
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.id = invokeId;
    invokeScript.src = `//www.highperformanceformat.com/${key}/invoke.js`;
    invokeScript.onerror = function() {
        console.log(`Failed to load invoke script for ${key}`);
        loadedScripts.delete(invokeId);
    };
    
    loadedScripts.add(invokeId);
    return invokeScript;
}

// Enhanced ad injection with proper 728x90 fixes
async function injectResponsiveAd(containerId, placement, adType) {
    try {
        console.log(`Injecting ad: ${containerId} - ${placement}:${adType}`);
        
        // Wait for container with timeout
        const container = await waitForElement(containerId, 5000);
        
        const config = adConfig.placements[placement];
        if (!config || !config.enabled) {
            console.log(`Ad placement ${placement} not enabled`);
            return false;
        }

        // Clear container safely
        container.innerHTML = '';

        let adData;
        if (placement === 'header') {
            adData = isMobile() ? config.mobile : config.desktop;
        } else {
            adData = config[adType] || config.primary || config;
        }

        if (!adData || !adData.key) {
            console.log(`No ad data found for ${placement}:${adType}`);
            return false;
        }

        const [width, height] = adData.size.split('x');
        
        // Create enhanced ad wrapper with 728x90 fixes
        const adWrapper = document.createElement('div');
        adWrapper.className = 'ad-wrapper responsive-ad enhanced-ad-space';
        adWrapper.style.cssText = `
            margin: 15px auto;
            text-align: center;
            max-width: 100%;
            position: relative;
            width: ${width}px;
            height: ${height}px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 215, 0, 0.1);
            border-radius: 6px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Special handling for 728x90 banner ads
        if (adData.size === '728x90') {
            console.log('Applying 728x90 banner ad fixes');
            adWrapper.style.cssText += `
                min-height: 90px;
                max-width: 95%;
            `;
            
            // Mobile responsive handling for 728x90
            if (isMobile()) {
                adWrapper.style.cssText += `
                    transform: scale(0.8);
                    transform-origin: center;
                    width: 100%;
                    max-width: 320px;
                    height: auto;
                    min-height: 60px;
                `;
            }
        }
        
        // Desktop-only ad hiding on mobile
        if (isMobile() && (adData.size === '160x600' || adData.size === '160x300')) {
            adWrapper.style.display = 'none';
            console.log('Hiding desktop-only ad on mobile');
        }

        // Create proper ad content with error handling
        if (adData.key && !adData.key.startsWith('YOUR_')) {
            // Create ad configuration script
            const configScript = createAdScript(adData.key, width, height);
            if (configScript) {
                adWrapper.appendChild(configScript);
            }
            
            // Create invoke script with error handling
            const invokeScript = createInvokeScript(adData.key);
            if (invokeScript) {
                adWrapper.appendChild(invokeScript);
            }
            
            console.log(`Ad scripts created for ${adData.key}`);
        } else {
            // Fallback placeholder
            const placeholder = document.createElement('div');
            placeholder.style.cssText = 'color: #ffd700; font-size: 12px; text-align: center; padding: 10px;';
            placeholder.textContent = `Advertisement ${adData.size}`;
            adWrapper.appendChild(placeholder);
        }
        
        container.appendChild(adWrapper);

        console.log(`Successfully injected ${placement} ad: ${adData.size}`);
        return true;
        
    } catch (error) {
        console.error(`Error injecting ad for ${containerId}:`, error);
        
        // Create fallback ad
        try {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="ad-space" style="
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 215, 0, 0.2);
                        border-radius: 6px;
                        padding: 20px;
                        text-align: center;
                        color: #ffd700;
                        margin: 10px auto;
                        max-width: 100%;
                    ">
                        Advertisement Space
                    </div>
                `;
            }
        } catch (fallbackError) {
            console.error('Fallback ad creation failed:', fallbackError);
        }
        
        return false;
    }
}

// Native ad injection with error handling
async function injectNativeAd() {
    const config = adConfig.placements.native;
    if (!config.enabled) return false;

    try {
        let container = document.getElementById(config.containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = config.containerId;
            container.style.margin = '20px auto';
            container.style.textAlign = 'center';
            container.style.maxWidth = '100%';
            
            // Find a good place to insert it
            const videoPlayer = document.querySelector('.video-player-container');
            const mainContent = document.getElementById('main-content');
            
            if (videoPlayer) {
                videoPlayer.parentNode.insertBefore(container, videoPlayer.nextSibling);
            } else if (mainContent) {
                mainContent.appendChild(container);
            }
        }

        const scriptId = 'native-ad-script';
        if (!loadedScripts.has(scriptId)) {
            const script = document.createElement('script');
            script.async = true;
            script.setAttribute('data-cfasync', 'false');
            script.src = config.scriptSrc;
            script.id = scriptId;
            script.onerror = function() {
                console.log('Failed to load native ad script');
                loadedScripts.delete(scriptId);
            };
            
            document.head.appendChild(script);
            loadedScripts.add(scriptId);
        }

        console.log('Native ad injected successfully');
        return true;
        
    } catch (error) {
        console.log('Error injecting native ad:', error);
        return false;
    }
}

// Enhanced popunder injection
function injectPopunderAd() {
    if (!adConfig.popunder.enabled) return false;
    
    const scriptId = 'popunder-ad-script';
    if (loadedScripts.has(scriptId)) {
        console.log('Popunder already loaded');
        return false;
    }
    
    try {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = adConfig.popunder.scriptSrc;
        script.id = scriptId;
        script.onerror = function() {
            console.log('Failed to load popunder script');
            loadedScripts.delete(scriptId);
        };
        
        document.head.appendChild(script);
        loadedScripts.add(scriptId);
        
        console.log('Popunder ad injected successfully');
        return true;
        
    } catch (error) {
        console.log('Error injecting popunder ad:', error);
        return false;
    }
}

// Enhanced social bar injection
function injectSocialBarAd() {
    if (!adConfig.socialBar.enabled) return false;
    
    const scriptId = 'social-bar-ad-script';
    if (loadedScripts.has(scriptId)) {
        console.log('Social bar already loaded');
        return false;
    }
    
    try {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = adConfig.socialBar.scriptSrc;
        script.id = scriptId;
        script.onerror = function() {
            console.log('Failed to load social bar script');
            loadedScripts.delete(scriptId);
        };
        
        document.head.appendChild(script);
        loadedScripts.add(scriptId);
        
        console.log('Social bar ad injected successfully');
        return true;
        
    } catch (error) {
        console.log('Error injecting social bar ad:', error);
        return false;
    }
}

// Enhanced initialization with proper timing and 728x90 fixes
async function initializeAllAds() {
    console.log('Initializing comprehensive ad system with fixes...');

    try {
        // Phase 1: Critical ads with proper delays
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Initialize header ads with 728x90 fixes
        const headerInitialized = await injectResponsiveAd('header-ad', 'header');
        if (!headerInitialized) {
            console.warn('Header ad initialization failed, creating fallback');
            createFallbackHeaderAd();
        }

        // Phase 2: Sidebar ads
        await new Promise(resolve => setTimeout(resolve, 600));
        await injectResponsiveAd('sidebar-ad', 'sidebar', 'primary');
        
        // Desktop skyscraper ad
        if (!isMobile()) {
            await new Promise(resolve => setTimeout(resolve, 400));
            await ensureSkyscraperContainer();
            await injectResponsiveAd('sidebar-skyscraper', 'sidebar', 'skyscraper');
        }

        // Phase 3: Footer ads with 728x90 priority
        await new Promise(resolve => setTimeout(resolve, 800));
        const footerInitialized = await injectResponsiveAd('footer-ads', 'footer', 'primary');
        if (!footerInitialized) {
            createFallbackFooterAd();
        }

        // Phase 4: Video player ads
        await new Promise(resolve => setTimeout(resolve, 600));
        await initializeVideoPlayerAds();

        // Phase 5: Special ads
        await new Promise(resolve => setTimeout(resolve, 1000));
        injectPopunderAd();
        
        await new Promise(resolve => setTimeout(resolve, 300));
        injectSocialBarAd();
        
        await new Promise(resolve => setTimeout(resolve, 500));
        await injectNativeAd();

        // Apply final fixes
        await new Promise(resolve => setTimeout(resolve, 800));
        applyFinalAdFixes();

        console.log('All ads initialization completed with fixes');
        
    } catch (error) {
        console.error('Error during ad initialization:', error);
        initializeEmergencyFallbackAds();
    }
}

function createFallbackHeaderAd() {
    const headerContainer = document.getElementById('header-ad');
    if (headerContainer) {
        headerContainer.innerHTML = `
            <div class="ad-space" style="
                width: 100%;
                max-width: 728px;
                height: 90px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 215, 0, 0.2);
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffd700;
                margin: 10px auto;
            ">
                Header Advertisement 728x90
            </div>
        `;
        console.log('Fallback header ad created');
    }
}

function createFallbackFooterAd() {
    const footerContainer = document.getElementById('footer-ads');
    if (footerContainer) {
        footerContainer.innerHTML = `
            <div class="ad-space" style="
                width: 100%;
                max-width: 728px;
                height: 90px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 215, 0, 0.2);
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffd700;
                margin: 10px auto;
            ">
                Footer Advertisement 728x90
            </div>
        `;
        console.log('Fallback footer ad created');
    }
}

async function ensureSkyscraperContainer() {
    let skyscraperContainer = document.getElementById('sidebar-skyscraper');
    if (!skyscraperContainer) {
        const sidebarContainer = document.querySelector('.sidebar-ads-container');
        if (sidebarContainer) {
            skyscraperContainer = document.createElement('div');
            skyscraperContainer.id = 'sidebar-skyscraper';
            skyscraperContainer.className = 'desktop-only';
            skyscraperContainer.style.marginTop = '20px';
            sidebarContainer.appendChild(skyscraperContainer);
            console.log('Skyscraper container created');
        }
    }
}

async function initializeVideoPlayerAds() {
    // Above video ad
    await injectResponsiveAd('above-video-ad', 'videoPlayer', 'above');
    
    // Beside video ad (desktop only)
    if (!isMobile()) {
        await injectResponsiveAd('beside-video-ad', 'videoPlayer', 'beside');
    }
    
    // Content break ad
    await injectResponsiveAd('content-break-ad', 'videoPlayer', 'content');
}

function applyFinalAdFixes() {
    console.log('Applying final ad positioning and responsiveness fixes...');
    
    // Fix all 728x90 banner ads
    const bannerAds = document.querySelectorAll('.ad-wrapper');
    bannerAds.forEach(ad => {
        const sizeAttr = ad.querySelector('[data-size]')?.getAttribute('data-size');
        if (sizeAttr === '728x90' || ad.style.width === '728px') {
            ad.style.maxWidth = '100%';
            ad.style.margin = '15px auto';
            ad.style.display = 'flex';
            ad.style.alignItems = 'center';
            ad.style.justifyContent = 'center';
            
            if (isMobile()) {
                ad.style.transform = 'scale(0.85)';
                ad.style.transformOrigin = 'center';
            }
        }
    });
    
    // Fix above video ad positioning
    const aboveVideoAd = document.querySelector('.above-video-ad');
    if (aboveVideoAd) {
        aboveVideoAd.style.position = 'relative';
        aboveVideoAd.style.zIndex = '1';
        aboveVideoAd.style.background = 'rgba(0, 0, 0, 0.8)';
        aboveVideoAd.style.borderBottom = '1px solid #333';
        aboveVideoAd.style.padding = '10px 0';
        aboveVideoAd.style.marginBottom = '15px';
    }
    
    // Apply responsive fixes
    if (isMobile()) {
        const desktopOnlyAds = document.querySelectorAll('.desktop-only');
        desktopOnlyAds.forEach(ad => {
            ad.style.display = 'none';
        });
    }
    
    console.log('Final ad fixes applied successfully');
}

function initializeEmergencyFallbackAds() {
    console.log('Initializing emergency fallback ads...');
    
    const adContainers = [
        'header-ad', 'sidebar-ad', 'footer-ads', 
        'above-video-ad', 'beside-video-ad', 'content-break-ad'
    ];
    
    adContainers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container && !container.innerHTML.trim()) {
            container.innerHTML = `
                <div class="ad-space" style="
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 215, 0, 0.2);
                    border-radius: 6px;
                    padding: 20px;
                    text-align: center;
                    color: #ffd700;
                    margin: 10px auto;
                    max-width: 100%;
                    min-height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    Advertisement Space
                </div>
            `;
        }
    });
}

// Legacy function support with error handling
function getExternalLink(type) {
    return adConfig.externalLinks[type] || adConfig.externalLinks.videoActions;
}

function isAdEnabled(placement) {
    return adConfig.placements[placement] && adConfig.placements[placement].enabled;
}

// Update external links with error handling
function updateExternalLinks() {
    try {
        const elements = document.querySelectorAll('[data-ad-link]');
        elements.forEach(element => {
            const linkType = element.getAttribute('data-ad-link');
            const url = getExternalLink(linkType);
            
            if (element.tagName === 'A') {
                element.href = url;
            } else if (element.tagName === 'BUTTON') {
                element.onclick = () => window.open(url, '_blank');
            }
        });
    } catch (error) {
        console.log('Error updating external links:', error);
    }
}

// Initialize on DOM load with proper error handling
document.addEventListener('DOMContentLoaded', function() {
    try {
        updateExternalLinks();
        
        // Start ad initialization with delay
        setTimeout(() => {
            initializeAllAds().catch(error => {
                console.log('Failed to initialize ads:', error);
            });
        }, 1000);
        
        console.log('Profitable ad system initialized successfully');
        
    } catch (error) {
        console.log('Error during ad system initialization:', error);
    }
});

// Handle window resize for responsive ads
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        console.log('Window resized, updating responsive ads');
        // Re-initialize header ad for mobile/desktop switch
        injectResponsiveAd('header-ad', 'header').catch(error => {
            console.log('Error updating header ad on resize:', error);
        });
    }, 500);
});

// Export functions safely
window.adConfig = adConfig;
window.getExternalLink = getExternalLink;
window.isAdEnabled = isAdEnabled;
window.injectResponsiveAd = injectResponsiveAd;
window.injectNativeAd = injectNativeAd;
window.updateExternalLinks = updateExternalLinks;
window.initializeAllAds = initializeAllAds;
window.waitForElement = waitForElement;
// Complete Ad System Rebuild with Error Fixes
const adConfig = {
    // External ad links - Updated with new profitable direct link
    externalLinks: {
        videoActions: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736',
        subscribe: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736',
        download: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736',
        like: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736',
        dislike: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736',
        comments: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736'
    },

    // Ad placements configuration with new profitable ad codes
    placements: {
        header: {
            enabled: true,
            desktop: {
                size: '728x90',
                key: '23632d040e9ace3cb20615242d28bebd'
            },
            mobile: {
                size: '320x50',
                key: '2483c8ff110bc0a32bcb87316e68fe3b'
            }
        },
        sidebar: {
            enabled: true,
            primary: {
                size: '300x250',
                key: '9258e0377a9e583db2075fcb66f881bf'
            },
            skyscraper: {
                size: '160x600',
                key: '6f68c1a21f3332447aaea9b8b4fd6ec7'
            },
            medium: {
                size: '160x300',
                key: '4acf10535b41ab941d3298879deffbb3'
            }
        },
        videoPlayer: {
            enabled: true,
            above: {
                size: '728x90',
                key: '23632d040e9ace3cb20615242d28bebd'
            },
            beside: {
                size: '300x250',
                key: '9258e0377a9e583db2075fcb66f881bf'
            },
            content: {
                size: '468x60',
                key: '750f82bb6dfa9c1950bb6b2f534e9100'
            }
        },
        videoGrid: {
            enabled: true,
            banner: {
                size: '728x90',
                key: '23632d040e9ace3cb20615242d28bebd'
            },
            rectangle: {
                size: '300x250',
                key: '9258e0377a9e583db2075fcb66f881bf'
            },
            content: {
                size: '468x60',
                key: '750f82bb6dfa9c1950bb6b2f534e9100'
            }
        },
        footer: {
            enabled: true,
            primary: {
                size: '728x90',
                key: '23632d040e9ace3cb20615242d28bebd'
            },
            secondary: {
                size: '300x250',
                key: '9258e0377a9e583db2075fcb66f881bf'
            }
        },
        native: {
            enabled: true,
            containerId: 'container-16bf3c60c71aa096607ad9ef03e8fa98',
            scriptSrc: '//pl26917078.profitableratecpm.com/16bf3c60c71aa096607ad9ef03e8fa98/invoke.js'
        }
    },

    // Popunder ad configuration - Updated
    popunder: {
        enabled: true,
        scriptSrc: '//pl26917075.profitableratecpm.com/89/22/65/892265a32c6a746f8cd6827ec80659f2.js'
    },

    // Social bar ad configuration - Updated
    socialBar: {
        enabled: true,
        scriptSrc: '//pl26917089.profitableratecpm.com/b0/7a/be/b07abeb917e97c254f11b584a7665bb0.js'
    },

    // Revenue optimization settings
    revenue: {
        profitableLink: 'https://www.profitableratecpm.com/ws7waxqy?key=ce86f810365211c634a1f1aed525f736',
        maxTriggersPerSession: 6,
        cooldownPeriod: 45000, // 45 seconds
        sessionResetTime: 1800000 // 30 minutes
    }
};

// Track loaded scripts to prevent duplicates
const loadedScripts = new Set();

// Mobile detection
function isMobile() {
    return window.innerWidth <= 768;
}

// Utility function to wait for element
function waitForElement(elementId, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        function checkElement() {
            const element = document.getElementById(elementId);
            if (element) {
                resolve(element);
                return;
            }
            
            if (Date.now() - startTime > timeout) {
                reject(new Error(`Element ${elementId} not found within ${timeout}ms`));
                return;
            }
            
            setTimeout(checkElement, 100);
        }
        
        checkElement();
    });
}

// Enhanced ad script creation with error handling
function createAdScript(key, width, height) {
    const scriptId = `ad-script-${key}`;
    
    // Check if script already exists
    if (loadedScripts.has(scriptId)) {
        console.log(`Ad script ${key} already loaded`);
        return null;
    }
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = scriptId;
    script.innerHTML = `
        try {
            atOptions = {
                'key': '${key}',
                'format': 'iframe',
                'height': ${height},
                'width': ${width},
                'params': {}
            };
        } catch(e) {
            console.log('Error setting atOptions:', e);
        }
    `;
    
    loadedScripts.add(scriptId);
    return script;
}

function createInvokeScript(key) {
    const invokeId = `invoke-script-${key}`;
    
    // Check if script already exists
    if (loadedScripts.has(invokeId)) {
        console.log(`Invoke script ${key} already loaded`);
        return null;
    }
    
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.id = invokeId;
    invokeScript.src = `//www.highperformanceformat.com/${key}/invoke.js`;
    invokeScript.onerror = function() {
        console.log(`Failed to load invoke script for ${key}`);
        loadedScripts.delete(invokeId);
    };
    
    loadedScripts.add(invokeId);
    return invokeScript;
}

// Enhanced ad injection with proper 728x90 fixes
async function injectResponsiveAd(containerId, placement, adType) {
    try {
        console.log(`Injecting ad: ${containerId} - ${placement}:${adType}`);
        
        // Wait for container with timeout
        const container = await waitForElement(containerId, 5000);
        
        const config = adConfig.placements[placement];
        if (!config || !config.enabled) {
            console.log(`Ad placement ${placement} not enabled`);
            return false;
        }

        // Clear container safely
        container.innerHTML = '';

        let adData;
        if (placement === 'header') {
            adData = isMobile() ? config.mobile : config.desktop;
        } else {
            adData = config[adType] || config.primary || config;
        }

        if (!adData || !adData.key) {
            console.log(`No ad data found for ${placement}:${adType}`);
            return false;
        }

        const [width, height] = adData.size.split('x');
        
        // Create enhanced ad wrapper with 728x90 fixes
        const adWrapper = document.createElement('div');
        adWrapper.className = 'ad-wrapper responsive-ad enhanced-ad-space';
        adWrapper.style.cssText = `
            margin: 15px auto;
            text-align: center;
            max-width: 100%;
            position: relative;
            width: ${width}px;
            height: ${height}px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 215, 0, 0.1);
            border-radius: 6px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Special handling for 728x90 banner ads
        if (adData.size === '728x90') {
            console.log('Applying 728x90 banner ad fixes');
            adWrapper.style.cssText += `
                min-height: 90px;
                max-width: 95%;
            `;
            
            // Mobile responsive handling for 728x90
            if (isMobile()) {
                adWrapper.style.cssText += `
                    transform: scale(0.8);
                    transform-origin: center;
                    width: 100%;
                    max-width: 320px;
                    height: auto;
                    min-height: 60px;
                `;
            }
        }
        
        // Desktop-only ad hiding on mobile
        if (isMobile() && (adData.size === '160x600' || adData.size === '160x300')) {
            adWrapper.style.display = 'none';
            console.log('Hiding desktop-only ad on mobile');
        }

        // Create proper ad content with error handling
        if (adData.key && !adData.key.startsWith('YOUR_')) {
            // Create ad configuration script
            const configScript = createAdScript(adData.key, width, height);
            if (configScript) {
                adWrapper.appendChild(configScript);
            }
            
            // Create invoke script with error handling
            const invokeScript = createInvokeScript(adData.key);
            if (invokeScript) {
                adWrapper.appendChild(invokeScript);
            }
            
            console.log(`Ad scripts created for ${adData.key}`);
        } else {
            // Fallback placeholder
            const placeholder = document.createElement('div');
            placeholder.style.cssText = 'color: #ffd700; font-size: 12px; text-align: center; padding: 10px;';
            placeholder.textContent = `Advertisement ${adData.size}`;
            adWrapper.appendChild(placeholder);
        }
        
        container.appendChild(adWrapper);

        console.log(`Successfully injected ${placement} ad: ${adData.size}`);
        return true;
        
    } catch (error) {
        console.error(`Error injecting ad for ${containerId}:`, error);
        
        // Create fallback ad
        try {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="ad-space" style="
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 215, 0, 0.2);
                        border-radius: 6px;
                        padding: 20px;
                        text-align: center;
                        color: #ffd700;
                        margin: 10px auto;
                        max-width: 100%;
                    ">
                        Advertisement Space
                    </div>
                `;
            }
        } catch (fallbackError) {
            console.error('Fallback ad creation failed:', fallbackError);
        }
        
        return false;
    }
}

// Native ad injection with error handling
async function injectNativeAd() {
    const config = adConfig.placements.native;
    if (!config.enabled) return false;

    try {
        let container = document.getElementById(config.containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = config.containerId;
            container.style.margin = '20px auto';
            container.style.textAlign = 'center';
            container.style.maxWidth = '100%';
            
            // Find a good place to insert it
            const videoPlayer = document.querySelector('.video-player-container');
            const mainContent = document.getElementById('main-content');
            
            if (videoPlayer) {
                videoPlayer.parentNode.insertBefore(container, videoPlayer.nextSibling);
            } else if (mainContent) {
                mainContent.appendChild(container);
            }
        }

        const scriptId = 'native-ad-script';
        if (!loadedScripts.has(scriptId)) {
            const script = document.createElement('script');
            script.async = true;
            script.setAttribute('data-cfasync', 'false');
            script.src = config.scriptSrc;
            script.id = scriptId;
            script.onerror = function() {
                console.log('Failed to load native ad script');
                loadedScripts.delete(scriptId);
            };
            
            document.head.appendChild(script);
            loadedScripts.add(scriptId);
        }

        console.log('Native ad injected successfully');
        return true;
        
    } catch (error) {
        console.log('Error injecting native ad:', error);
        return false;
    }
}

// Enhanced popunder injection
function injectPopunderAd() {
    if (!adConfig.popunder.enabled) return false;
    
    const scriptId = 'popunder-ad-script';
    if (loadedScripts.has(scriptId)) {
        console.log('Popunder already loaded');
        return false;
    }
    
    try {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = adConfig.popunder.scriptSrc;
        script.id = scriptId;
        script.onerror = function() {
            console.log('Failed to load popunder script');
            loadedScripts.delete(scriptId);
        };
        
        document.head.appendChild(script);
        loadedScripts.add(scriptId);
        
        console.log('Popunder ad injected successfully');
        return true;
        
    } catch (error) {
        console.log('Error injecting popunder ad:', error);
        return false;
    }
}

// Enhanced social bar injection
function injectSocialBarAd() {
    if (!adConfig.socialBar.enabled) return false;
    
    const scriptId = 'social-bar-ad-script';
    if (loadedScripts.has(scriptId)) {
        console.log('Social bar already loaded');
        return false;
    }
    
    try {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = adConfig.socialBar.scriptSrc;
        script.id = scriptId;
        script.onerror = function() {
            console.log('Failed to load social bar script');
            loadedScripts.delete(scriptId);
        };
        
        document.head.appendChild(script);
        loadedScripts.add(scriptId);
        
        console.log('Social bar ad injected successfully');
        return true;
        
    } catch (error) {
        console.log('Error injecting social bar ad:', error);
        return false;
    }
}

// Enhanced initialization with proper timing and 728x90 fixes
async function initializeAllAds() {
    console.log('Initializing comprehensive ad system with fixes...');

    try {
        // Phase 1: Critical ads with proper delays
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Initialize header ads with 728x90 fixes
        const headerInitialized = await injectResponsiveAd('header-ad', 'header');
        if (!headerInitialized) {
            console.warn('Header ad initialization failed, creating fallback');
            createFallbackHeaderAd();
        }

        // Phase 2: Sidebar ads
        await new Promise(resolve => setTimeout(resolve, 600));
        await injectResponsiveAd('sidebar-ad', 'sidebar', 'primary');
        
        // Desktop skyscraper ad
        if (!isMobile()) {
            await new Promise(resolve => setTimeout(resolve, 400));
            await ensureSkyscraperContainer();
            await injectResponsiveAd('sidebar-skyscraper', 'sidebar', 'skyscraper');
        }

        // Phase 3: Footer ads with 728x90 priority
        await new Promise(resolve => setTimeout(resolve, 800));
        const footerInitialized = await injectResponsiveAd('footer-ads', 'footer', 'primary');
        if (!footerInitialized) {
            createFallbackFooterAd();
        }

        // Phase 4: Video player ads
        await new Promise(resolve => setTimeout(resolve, 600));
        await initializeVideoPlayerAds();

        // Phase 5: Special ads
        await new Promise(resolve => setTimeout(resolve, 1000));
        injectPopunderAd();
        
        await new Promise(resolve => setTimeout(resolve, 300));
        injectSocialBarAd();
        
        await new Promise(resolve => setTimeout(resolve, 500));
        await injectNativeAd();

        // Apply final fixes
        await new Promise(resolve => setTimeout(resolve, 800));
        applyFinalAdFixes();

        console.log('All ads initialization completed with fixes');
        
    } catch (error) {
        console.error('Error during ad initialization:', error);
        initializeEmergencyFallbackAds();
    }
}

function createFallbackHeaderAd() {
    const headerContainer = document.getElementById('header-ad');
    if (headerContainer) {
        headerContainer.innerHTML = `
            <div class="ad-space" style="
                width: 100%;
                max-width: 728px;
                height: 90px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 215, 0, 0.2);
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffd700;
                margin: 10px auto;
            ">
                Header Advertisement 728x90
            </div>
        `;
        console.log('Fallback header ad created');
    }
}

function createFallbackFooterAd() {
    const footerContainer = document.getElementById('footer-ads');
    if (footerContainer) {
        footerContainer.innerHTML = `
            <div class="ad-space" style="
                width: 100%;
                max-width: 728px;
                height: 90px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 215, 0, 0.2);
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffd700;
                margin: 10px auto;
            ">
                Footer Advertisement 728x90
            </div>
        `;
        console.log('Fallback footer ad created');
    }
}

async function ensureSkyscraperContainer() {
    let skyscraperContainer = document.getElementById('sidebar-skyscraper');
    if (!skyscraperContainer) {
        const sidebarContainer = document.querySelector('.sidebar-ads-container');
        if (sidebarContainer) {
            skyscraperContainer = document.createElement('div');
            skyscraperContainer.id = 'sidebar-skyscraper';
            skyscraperContainer.className = 'desktop-only';
            skyscraperContainer.style.marginTop = '20px';
            sidebarContainer.appendChild(skyscraperContainer);
            console.log('Skyscraper container created');
        }
    }
}

async function initializeVideoPlayerAds() {
    // Above video ad
    await injectResponsiveAd('above-video-ad', 'videoPlayer', 'above');
    
    // Beside video ad (desktop only)
    if (!isMobile()) {
        await injectResponsiveAd('beside-video-ad', 'videoPlayer', 'beside');
    }
    
    // Content break ad
    await injectResponsiveAd('content-break-ad', 'videoPlayer', 'content');
}

function applyFinalAdFixes() {
    console.log('Applying final ad positioning and responsiveness fixes...');
    
    // Fix all 728x90 banner ads
    const bannerAds = document.querySelectorAll('.ad-wrapper');
    bannerAds.forEach(ad => {
        const sizeAttr = ad.querySelector('[data-size]')?.getAttribute('data-size');
        if (sizeAttr === '728x90' || ad.style.width === '728px') {
            ad.style.maxWidth = '100%';
            ad.style.margin = '15px auto';
            ad.style.display = 'flex';
            ad.style.alignItems = 'center';
            ad.style.justifyContent = 'center';
            
            if (isMobile()) {
                ad.style.transform = 'scale(0.85)';
                ad.style.transformOrigin = 'center';
            }
        }
    });
    
    // Fix above video ad positioning
    const aboveVideoAd = document.querySelector('.above-video-ad');
    if (aboveVideoAd) {
        aboveVideoAd.style.position = 'relative';
        aboveVideoAd.style.zIndex = '1';
        aboveVideoAd.style.background = 'rgba(0, 0, 0, 0.8)';
        aboveVideoAd.style.borderBottom = '1px solid #333';
        aboveVideoAd.style.padding = '10px 0';
        aboveVideoAd.style.marginBottom = '15px';
    }
    
    // Apply responsive fixes
    if (isMobile()) {
        const desktopOnlyAds = document.querySelectorAll('.desktop-only');
        desktopOnlyAds.forEach(ad => {
            ad.style.display = 'none';
        });
    }
    
    console.log('Final ad fixes applied successfully');
}

function initializeEmergencyFallbackAds() {
    console.log('Initializing emergency fallback ads...');
    
    const adContainers = [
        'header-ad', 'sidebar-ad', 'footer-ads', 
        'above-video-ad', 'beside-video-ad', 'content-break-ad'
    ];
    
    adContainers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container && !container.innerHTML.trim()) {
            container.innerHTML = `
                <div class="ad-space" style="
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 215, 0, 0.2);
                    border-radius: 6px;
                    padding: 20px;
                    text-align: center;
                    color: #ffd700;
                    margin: 10px auto;
                    max-width: 100%;
                    min-height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    Advertisement Space
                </div>
            `;
        }
    });
}

// Legacy function support with error handling
function getExternalLink(type) {
    return adConfig.externalLinks[type] || adConfig.externalLinks.videoActions;
}

function isAdEnabled(placement) {
    return adConfig.placements[placement] && adConfig.placements[placement].enabled;
}

// Update external links with error handling
function updateExternalLinks() {
    try {
        const elements = document.querySelectorAll('[data-ad-link]');
        elements.forEach(element => {
            const linkType = element.getAttribute('data-ad-link');
            const url = getExternalLink(linkType);
            
            if (element.tagName === 'A') {
                element.href = url;
            } else if (element.tagName === 'BUTTON') {
                element.onclick = () => window.open(url, '_blank');
            }
        });
    } catch (error) {
        console.log('Error updating external links:', error);
    }
}

// Initialize on DOM load with proper error handling
document.addEventListener('DOMContentLoaded', function() {
    try {
        updateExternalLinks();
        
        // Start ad initialization with delay
        setTimeout(() => {
            initializeAllAds().catch(error => {
                console.log('Failed to initialize ads:', error);
            });
        }, 1000);
        
        console.log('Profitable ad system initialized successfully');
        
    } catch (error) {
        console.log('Error during ad system initialization:', error);
    }
});

// Handle window resize for responsive ads
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        console.log('Window resized, updating responsive ads');
        // Re-initialize header ad for mobile/desktop switch
        injectResponsiveAd('header-ad', 'header').catch(error => {
            console.log('Error updating header ad on resize:', error);
        });
    }, 500);
});

// Export functions safely
window.adConfig = adConfig;
window.getExternalLink = getExternalLink;
window.isAdEnabled = isAdEnabled;
window.injectResponsiveAd = injectResponsiveAd;
window.injectNativeAd = injectNativeAd;
window.updateExternalLinks = updateExternalLinks;
window.initializeAllAds = initializeAllAds;
window.waitForElement = waitForElement;
