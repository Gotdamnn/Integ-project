// ===== Full-Screen Download Page Interactions =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== Mobile Navigation Toggle =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const bottomNav = document.querySelector('.bottom-nav');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Hide/show bottom nav when sidebar opens/closes
            if (bottomNav) {
                bottomNav.classList.toggle('hidden');
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
                
                // Show bottom nav when menu closes
                if (bottomNav) {
                    bottomNav.classList.remove('hidden');
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !hamburger.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
                
                // Show bottom nav when menu closes
                if (bottomNav) {
                    bottomNav.classList.remove('hidden');
                }
            }
        });
    }

    // Bottom Navigation Active State
    if (bottomNav) {
        const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
        
        bottomNavItems.forEach(item => {
            item.addEventListener('click', function(e) {
                // Remove active class from all items
                bottomNavItems.forEach(navItem => navItem.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
            });
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Parallax effect on mouse move
    const hero = document.querySelector('.download-fullscreen');
    const foodShapes = document.querySelectorAll('.food-shape');
    const particles = document.querySelectorAll('.particles .particle');
    
    if (hero) {
        hero.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            // Parallax for food shapes
            foodShapes.forEach((shape, index) => {
                const speed = parseFloat(shape.dataset.speed) || 0.5;
                const x = (mouseX - 0.5) * speed * 100;
                const y = (mouseY - 0.5) * speed * 100;
                shape.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.1}deg)`;
            });
            
            // Parallax for particles
            particles.forEach((particle, index) => {
                const speed = 0.3 + (index * 0.1);
                const x = (mouseX - 0.5) * speed * 50;
                const y = (mouseY - 0.5) * speed * 50;
                particle.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
    
    // Download button interactions
    const downloadBtn = document.querySelector('.btn-download');
    
    if (downloadBtn) {
        // Click effect with notification
        downloadBtn.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('click-ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
            
            // Show download notification
            showNotification('🎉 Downloading Bud Budots App...', 'success');
        });

        // 3D tilt effect on hover
        downloadBtn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.05)`;
        });
        
        downloadBtn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    }
    
    // Store badge interactions
    const storeBadges = document.querySelectorAll('.store-badge');
    
    storeBadges.forEach(badge => {
        badge.addEventListener('click', function(e) {
            e.preventDefault();
            const store = this.classList.contains('apple') ? 'App Store' : 'Google Play';
            showNotification(`📱 Redirecting to ${store}...`, 'info');
            
            // Simulate redirect delay
            setTimeout(() => {
                // Add your actual store URLs here
                // window.location.href = this.href;
            }, 1000);
        });

        // Hover effect
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });

        badge.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notification if any
        const existingNotif = document.querySelector('.notification');
        if (existingNotif) {
            existingNotif.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Smooth scroll for scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
        scrollIndicator.style.cursor = 'pointer';
    }

    // Hide scroll indicator on scroll
    window.addEventListener('scroll', function() {
        if (scrollIndicator && window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else if (scrollIndicator) {
            scrollIndicator.style.opacity = '0.7';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });

    // Wave animation on scroll
    const waveLayers = document.querySelectorAll('.wave-layer');
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        waveLayers.forEach((wave, index) => {
            const speed = (index + 1) * 0.05;
            wave.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Food shapes rotation on scroll
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        foodShapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.1;
            const currentTransform = shape.style.transform || '';
            shape.style.transform = currentTransform + ` rotate(${scrolled * speed}deg)`;
        });
    });

    // Keyboard accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement === downloadBtn) {
            downloadBtn.click();
        }
    });
    
    // Performance optimization: Reduce animations on low-end devices
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
    }

    // Easter egg: Console message
    console.log('%c🍜 Bud Budots - SARAP. SULIT. SIGURADO.', 'color: #FCC61D; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
    console.log('%c📱 Download our app for the best Filipino street food experience!', 'color: #3338A0; font-size: 14px;');
    console.log('%c🇵🇭 Masarap na pagkain, mabilis na delivery!', 'color: #666; font-size: 12px;');
});

// CSS for notification and ripple effects
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, #1e3a8a 0%, #3338A0 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2px solid rgba(252, 198, 29, 0.5);
        backdrop-filter: blur(10px);
    }
    
    .notification.show {
        transform: translateX(0);
    }

    .notification.success {
        background: linear-gradient(135deg, #059669 0%, #10b981 100%);
        border-color: rgba(52, 211, 153, 0.5);
    }

    .notification.info {
        background: linear-gradient(135deg, #1e3a8a 0%, #3338A0 100%);
        border-color: rgba(252, 198, 29, 0.5);
    }
    
    .notification i {
        color: #FCC61D;
        font-size: 1.3rem;
    }
    
    .notification span {
        font-weight: 600;
        font-size: 0.95rem;
    }

    .click-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: clickRipple 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes clickRipple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }

    @media (max-width: 768px) {
        .notification {
            top: auto;
            bottom: 2rem;
            right: 1rem;
            left: 1rem;
            width: calc(100% - 2rem);
            max-width: 400px;
            margin: 0 auto;
            transform: translateY(200px);
        }

        .notification.show {
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
