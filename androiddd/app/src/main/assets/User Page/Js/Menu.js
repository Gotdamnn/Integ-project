// ===== Menu Page JavaScript =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== LOADING SCREEN =====
    const loadingScreen = document.querySelector('.loading-screen');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 2000);
    });

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

    // ===== CATEGORY FILTER =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards with fade animation
            menuCards.forEach((card, index) => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    setTimeout(() => {
                        card.classList.remove('hidden');
                        card.style.animation = `fadeUp 0.6s ease ${index * 0.1}s backwards`;
                    }, 100);
                } else {
                    card.classList.add('hidden');
                }
            });

            // Smooth scroll to menu grid
            document.querySelector('.menu-grid-section').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // ===== SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all menu cards, favorite cards, and sections
    const animatedElements = document.querySelectorAll('.menu-card, .favorite-card, .section-title');
    animatedElements.forEach(el => observer.observe(el));

    // ===== ADD TO ORDER BUTTONS =====
    const addBtns = document.querySelectorAll('.add-btn');
    
    addBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get meal details
            const card = this.closest('.menu-card');
            const mealName = card.querySelector('.card-title').textContent;
            const price = card.querySelector('.price').textContent;
            
            // Visual feedback
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            
            // Create floating notification
            const notification = document.createElement('div');
            notification.className = 'order-notification';
            notification.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>${mealName} added to order!</span>
            `;
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(135deg, #4CAF50, #45a049);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-weight: 600;
                z-index: 10000;
                animation: slideInRight 0.5s ease, slideOutRight 0.5s ease 2.5s forwards;
            `;
            
            document.body.appendChild(notification);
            
            // Remove notification after animation
            setTimeout(() => {
                notification.remove();
            }, 3000);
            
            // Reset button after 2 seconds
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-plus"></i> Add to Order';
                this.style.background = 'linear-gradient(135deg, #FCC61D, #f0b800)';
            }, 2000);
            
            // Log to console (in real app, this would add to cart)
            console.log(`Added to order: ${mealName} - ${price}`);
        });
    });

    // ===== PARALLAX EFFECT ON HERO =====
    const heroContent = document.querySelector('.hero-content');
    const floatingFoods = document.querySelectorAll('.floating-food');
    
    window.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        floatingFoods.forEach((food, index) => {
            const speed = (index + 1) * 10;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            food.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // ===== SMOOTH SCROLL FOR ALL LINKS =====
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

    // ===== CARD HOVER GLOW EFFECT =====
    menuCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 15px 40px rgba(252, 198, 29, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        });
    });

    // ===== FLOATING RICE ANIMATION IN CTA =====
    const floatingRice = document.querySelectorAll('.floating-rice');
    
    floatingRice.forEach((grain, index) => {
        grain.style.animationDelay = `${index * 3}s`;
    });

    // ===== LAZY LOADING IMAGES =====
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));

    // ===== PREVENT BODY SCROLL WHEN SIDEBAR IS OPEN =====
    const style = document.createElement('style');
    style.innerHTML = `
        body.sidebar-open {
            overflow: hidden;
        }
        
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
    document.head.appendChild(style);

    // ===== LOG PAGE LOAD =====
    console.log('Menu page loaded successfully! 🍳');
    console.log(`Total menu items: ${menuCards.length}`);
});
