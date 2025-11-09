// ===================================
// MOBILE NAVIGATION JAVASCRIPT
// Bud Budots - User Dashboard
// Bottom Navigation & Mobile Menu
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileNav();
});

// === MOBILE NAVIGATION INITIALIZATION ===
function initializeMobileNav() {
    setupMobileMenu();
    setupMobileBottomNav();
    setupSidebarOverlay();
    handleResponsive();
}

// === MOBILE HAMBURGER MENU ===
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        });
    }
}

// === SIDEBAR OVERLAY ===
function setupSidebarOverlay() {
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarOverlay && sidebar) {
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

// === MOBILE BOTTOM NAV ===
function setupMobileBottomNav() {
    const navItems = document.querySelectorAll('.mobile-nav-item');
    const currentPage = window.location.pathname.split('/').pop();
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        
        // Set active state based on current page
        if (href === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
        
        // Add click animation
        item.addEventListener('click', function(e) {
            // Add ripple effect
            createRipple(e, this);
        });
    });
}

// === RIPPLE EFFECT ===
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// === RESPONSIVE HANDLING ===
function handleResponsive() {
    let resizeTimer;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const sidebar = document.getElementById('sidebar');
            const sidebarOverlay = document.getElementById('sidebarOverlay');
            
            // Close mobile sidebar on resize to desktop
            if (window.innerWidth > 992) {
                if (sidebar) sidebar.classList.remove('active');
                if (sidebarOverlay) sidebarOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 250);
    });
}

// === PREVENT SCROLL WHEN SIDEBAR OPEN ===
function toggleBodyScroll(disable) {
    if (disable) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    }
}

// === SAFE AREA DETECTION ===
function detectSafeArea() {
    // Check for notch/safe area
    const supportsEnv = CSS.supports('padding-bottom: env(safe-area-inset-bottom)');
    
    if (supportsEnv) {
        document.documentElement.classList.add('has-safe-area');
    }
}

// Call safe area detection
detectSafeArea();

// === HANDLE BACK BUTTON ON MOBILE ===
window.addEventListener('popstate', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// === TOUCH GESTURE SUPPORT ===
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (!sidebar || !sidebarOverlay) return;
    
    // Swipe right to open (from left edge)
    if (touchStartX < 50 && touchEndX > touchStartX + 50) {
        if (window.innerWidth <= 992) {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Swipe left to close
    if (sidebar.classList.contains('active') && touchEndX < touchStartX - 50) {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// === PWA INSTALL PROMPT ===
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallPromotion();
});

function showInstallPromotion() {
    // You can show a custom install button here
    console.log('PWA install available');
}

// === EXPORT FUNCTIONS ===
window.mobileNav = {
    openSidebar: function() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar) sidebar.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    closeSidebar: function() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
};
