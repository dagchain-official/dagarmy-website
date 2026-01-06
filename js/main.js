/**
 * DAG ARMY Website - Main JavaScript
 * Handles WebFont loading and touch detection
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
    template: "{{wf {\"path\":\"symbol\",\"type\":\"PlainText\"} }} {{wf {\"path\":\"amount\",\"type\":\"CommercePrice\"} }} {{wf {\"path\":\"currencyCode\",\"type\":\"PlainText\"} }}",
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
});

/**
 * Initialize page animations
 */
function initializeAnimations() {
    // Animations are handled by Webflow's built-in system
    // This function can be extended for custom animations
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
