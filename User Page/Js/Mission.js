// ===== Mission Page JavaScript =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MOBILE NAVIGATION TOGGLE =====
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
    }

    // ===== BOTTOM NAVIGATION ACTIVE STATE =====
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

    // ===== STICKY NAVBAR WITH BLUR EFFECT =====
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.background = 'linear-gradient(135deg, rgba(51, 56, 160, 0.95) 0%, rgba(42, 47, 133, 0.95) 100%)';
        } else {
            navbar.style.backdropFilter = 'none';
            navbar.style.background = 'linear-gradient(135deg, #3338A0 0%, #2a2f85 100%)';
        }
    });

    // ===== SCROLL REVEAL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections and cards
    const animatedElements = document.querySelectorAll(
        '.statement-card, .value-card, .vision-content, .story-content, .section-header'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // ===== PARALLAX STEAM EFFECT =====
    const steamElements = document.querySelectorAll('.floating-steam');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        steamElements.forEach((steam, index) => {
            const speed = (index + 1) * 0.3;
            steam.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ===== VALUE CARDS STAGGER ANIMATION =====
    const valueCards = document.querySelectorAll('.value-card');
    
    valueCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeUp 0.8s ease backwards';
    });

    // Add keyframe animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== COUNTER ANIMATION (if you want to add stats later) =====
    function animateCounter(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start).toLocaleString();
            
            if (start >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            }
        }, 16);
    }

    // ===== GLOW EFFECT ON MOUSE MOVE =====
    const cards = document.querySelectorAll('.statement-card, .value-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(252, 198, 29, 0.2) 0%, transparent 50%)`;
            }
        });
    });

    // ===== BUTTON RIPPLE EFFECT =====
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple effect styles
    const rippleStyle = document.createElement('style');
    rippleStyle.innerHTML = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ===== VISION IMAGE TILT EFFECT =====
    const visionImage = document.querySelector('.vision-image');
    
    if (visionImage) {
        visionImage.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            const imageCard = this.querySelector('.image-card');
            imageCard.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
        
        visionImage.addEventListener('mouseleave', function() {
            const imageCard = this.querySelector('.image-card');
            imageCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }

    // ===== PREVENT BODY SCROLL WHEN SIDEBAR IS OPEN =====
    const sidebarStyle = document.createElement('style');
    sidebarStyle.innerHTML = `
        body.sidebar-open {
            overflow: hidden;
        }
    `;
    document.head.appendChild(sidebarStyle);

    // ===== LOG PAGE LOAD =====
    console.log('Mission page loaded successfully! 🎯');
    console.log('Sarap. Sulit. Sigurado.');
});
