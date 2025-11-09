// ===== Smooth Scroll Navigation =====
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const bottomNav = document.querySelector('.bottom-nav');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
            
            // Toggle overlay
            if (sidebarOverlay) {
                sidebarOverlay.classList.toggle('active');
            }
            
            // Hide/show bottom nav when sidebar opens/closes
            if (bottomNav) {
                if (navMenu.classList.contains('active')) {
                    bottomNav.classList.add('hide');
                } else {
                    bottomNav.classList.remove('hide');
                }
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('sidebar-open');
                
                // Hide overlay
                if (sidebarOverlay) {
                    sidebarOverlay.classList.remove('active');
                }
                
                // Show bottom nav when menu closes
                if (bottomNav) {
                    bottomNav.classList.remove('hide');
                }
            });
        });

        // Close menu when clicking overlay
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('sidebar-open');
                sidebarOverlay.classList.remove('active');
                
                // Show bottom nav when menu closes
                if (bottomNav) {
                    bottomNav.classList.remove('hide');
                }
            });
        }

        // Close menu when clicking backdrop (fallback)
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !hamburger.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('sidebar-open');
                
                // Hide overlay
                if (sidebarOverlay) {
                    sidebarOverlay.classList.remove('active');
                }
                
                // Show bottom nav when menu closes
                if (bottomNav) {
                    bottomNav.classList.remove('hide');
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
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    
    // Parallax Effect on Hero Section
    const hero = document.querySelector('.hero-landing');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    const shapes = document.querySelectorAll('.shape');
    
    // Mouse Move Parallax
    if (hero && window.innerWidth > 768) {
        document.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            parallaxLayers.forEach((layer, index) => {
                const speed = (index + 1) * 15;
                const x = (mouseX - 0.5) * speed;
                const y = (mouseY - 0.5) * speed;
                layer.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
            });
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 10;
                const x = (mouseX - 0.5) * speed;
                const y = (mouseY - 0.5) * speed;
                shape.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
    
    // Scroll-triggered animations for sections
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const animateOnScroll = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add CSS class for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Button Click Effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Handle Order Now button
            if (this.textContent.includes('Order Now')) {
                showNotification('Opening order menu...', 'success');
            }
            
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple styles
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // Quick Order Button Click (removed since menu section is gone)
    
    // Notification System
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // Styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #FCC61D 0%, #C59560 100%);
            color: #1a1a1a;
            padding: 1rem 1.5rem;
            border-radius: 50px;
            box-shadow: 0 10px 30px rgba(252, 198, 29, 0.5);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 600;
            z-index: 9999;
            animation: slideInRight 0.4s ease-out, slideOutRight 0.4s ease-in 2.6s;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Add notification animations
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(notificationStyle);
    
    // Smooth scroll for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Wave animation enhancement
    const wave = document.querySelector('.wave-path');
    if (wave) {
        let scrollPosition = 0;
        
        window.addEventListener('scroll', () => {
            scrollPosition = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            if (scrollPosition < heroHeight) {
                const opacity = 1 - (scrollPosition / heroHeight) * 0.5;
                const scale = 1 + (scrollPosition / heroHeight) * 0.1;
                wave.style.opacity = opacity;
                wave.style.transform = `scaleY(${scale})`;
            }
        });
    }
    
    // Add hover sound effect (optional - can be commented out)
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            // Create subtle hover feedback
            button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
    
    // Lazy load images for better performance
    const images = document.querySelectorAll('img[src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease-in';
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                });
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Add touch support for mobile
    if ('ontouchstart' in window) {
        document.documentElement.classList.add('touch-device');
    }
    
    // Performance optimization: Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                // Scroll-based animations here
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Add loading animation fade out
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
    
    console.log('🍜 Bud budots - Landing page initialized successfully!');
});
