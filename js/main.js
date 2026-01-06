/**
 * DAG ARMY Website - Main JavaScript
 * Handles WebFont loading and touch detection
 * Performance optimized version
 */

// WebFont Loader Configuration
(function () {
    'use strict';

    // Load Google Fonts
    if (typeof WebFont !== 'undefined') {
        WebFont.load({
            google: {
                families: ["Inter Tight:regular,500,600,700"]
            }
        });
    }
})();

// Touch Detection and Modernizr-style class additions
(function (window, document) {
    'use strict';

    const documentElement = document.documentElement;
    const classPrefix = ' w-mod-';

    // Add JavaScript enabled class
    documentElement.className += classPrefix + 'js';

    // Add touch support class if available
    const isTouchDevice = ('ontouchstart' in window) ||
        (window.DocumentTouch && document instanceof DocumentTouch);

    if (isTouchDevice) {
        documentElement.className += classPrefix + 'touch';
    }
})(window, document);

// Currency Settings for Webflow Commerce
window.__WEBFLOW_CURRENCY_SETTINGS = {
    currencyCode: "USD",
    symbol: "$",
    decimal: ".",
    fractionDigits: 2,
    group: ",",
    template: "{{wf {\\\"path\\\":\\\"symbol\\\",\\\"type\\\":\\\"PlainText\\\"} }} {{wf {\\\"path\\\":\\\"amount\\\",\\\"type\\\":\\\"CommercePrice\\\"} }} {{wf {\\\"path\\\":\\\"currencyCode\\\",\\\"type\\\":\\\"PlainText\\\"} }}",
    hideDecimalForWholeNumbers: false
};

/**
 * Initialize animations and interactions when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('DAG ARMY Website Loaded Successfully');

    // Add any custom initialization code here
    initializeAnimations();
    initializeNavigation();
    optimizePerformance();
});

/**
 * Initialize page animations
 */
function initializeAnimations() {
    // Animations are handled by Webflow's built-in system
    // This function can be extended for custom animations

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // Disable heavy animations for users who prefer reduced motion
        document.body.classList.add('reduce-motion');
    }
}

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    // Handle smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Performance optimization function
 */
function optimizePerformance() {
    const isMobile = window.innerWidth < 768;

    // Disable heavy Lottie animations on mobile for better performance
    if (isMobile) {
        const lottieElements = document.querySelectorAll('[data-animation-type="lottie"]');
        lottieElements.forEach(el => {
            // Reduce animation complexity on mobile
            el.setAttribute('data-loop', '0'); // Disable looping
            el.style.willChange = 'auto'; // Reduce GPU usage
        });

        console.log('Mobile optimizations applied');
    }

    // Add passive event listeners for better scroll performance
    document.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('touchstart', handleTouch, { passive: true });
}

/**
 * Optimized scroll handler
 */
let scrollTimeout;
function handleScroll() {
    // Debounce scroll events
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }

    scrollTimeout = window.requestAnimationFrame(() => {
        // Add scroll-based optimizations here
        const scrollY = window.scrollY;

        // Example: Lazy load elements when they come into view
        // This is handled by the browser's native lazy loading
    });
}

/**
 * Touch event handler
 */
function handleTouch(e) {
    // Optimize touch interactions
    // Passive listener already set for better performance
}

/**
 * Utility function to handle responsive behavior
 */
function handleResponsive() {
    const width = window.innerWidth;

    // Add responsive classes based on viewport width
    if (width < 768) {
        document.body.classList.add('mobile');
        document.body.classList.remove('tablet', 'desktop');
    } else if (width < 992) {
        document.body.classList.add('tablet');
        document.body.classList.remove('mobile', 'desktop');
    } else {
        document.body.classList.add('desktop');
        document.body.classList.remove('mobile', 'tablet');
    }
}

// Initialize responsive handling
window.addEventListener('load', handleResponsive);
window.addEventListener('resize', handleResponsive);

// Performance monitoring (optional - can be removed in production)
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;

            console.log('Performance Metrics:');
            console.log(`Page Load Time: ${pageLoadTime}ms`);
            console.log(`Server Response Time: ${connectTime}ms`);
            console.log(`DOM Render Time: ${renderTime}ms`);
        }, 0);
    });
}
