// Sidebar Toggle Functionality
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const sidebarOverlay = document.querySelector('.sidebar-overlay');

function toggleSidebar() {
    navMenu.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
    document.body.classList.toggle('sidebar-open');
}

hamburger.addEventListener('click', toggleSidebar);
sidebarOverlay.addEventListener('click', toggleSidebar);

// Close sidebar when clicking nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    });
});

// Scroll Reveal Animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const fadeUpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-up animation to story text
const storyText = document.querySelector('.story-text');
if (storyText) {
    storyText.style.opacity = '0';
    storyText.style.transform = 'translateY(30px)';
    storyText.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    fadeUpObserver.observe(storyText);
}

// Apply fade-up to mission/vision cards
document.querySelectorAll('.mission-card, .vision-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
    fadeUpObserver.observe(card);
});

// Timeline Animation
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.3
});

document.querySelectorAll('.timeline-item').forEach(item => {
    timelineObserver.observe(item);
});

// Team Card Animations
document.querySelectorAll('.team-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
    fadeUpObserver.observe(card);
});

// Promise Card Animations
document.querySelectorAll('.promise-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.8s ease ${index * 0.15}s, transform 0.8s ease ${index * 0.15}s`;
    fadeUpObserver.observe(card);
});

// Add hover glow effect to team cards
document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const photoCircle = card.querySelector('.photo-circle');
        if (photoCircle) {
            photoCircle.style.boxShadow = '0 15px 40px rgba(252, 198, 29, 0.6)';
        }
    });

    card.addEventListener('mouseleave', () => {
        const photoCircle = card.querySelector('.photo-circle');
        if (photoCircle) {
            photoCircle.style.boxShadow = '0 10px 30px rgba(252, 198, 29, 0.3)';
        }
    });
});

// CTA Button Shimmer Effect
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    setInterval(() => {
        ctaButton.style.animation = 'none';
        setTimeout(() => {
            ctaButton.style.animation = 'fadeUp 1s ease-out 0.2s backwards';
        }, 10);
    }, 5000);
}

// Smooth Scroll for CTA
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Parallax effect for hero waves
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroWaves = document.querySelector('.hero-waves');
    const ctaWaves = document.querySelector('.cta-waves');
    
    if (heroWaves && scrolled < window.innerHeight) {
        heroWaves.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    if (ctaWaves) {
        const ctaSection = document.querySelector('.cta-footer');
        const ctaPosition = ctaSection.getBoundingClientRect().top;
        if (ctaPosition < window.innerHeight && ctaPosition > -ctaSection.offsetHeight) {
            ctaWaves.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }
});

// Add active state to bottom nav
const currentPage = window.location.pathname.split('/').pop().split('.')[0].toLowerCase();
document.querySelectorAll('.bottom-nav-item').forEach(item => {
    const page = item.getAttribute('data-page');
    if (page === currentPage || (currentPage === 'about' && page === 'about')) {
        item.classList.add('active');
    } else {
        item.classList.remove('active');
    }
});

// Story image hover effect
const storyImage = document.querySelector('.story-image');
if (storyImage) {
    storyImage.addEventListener('mouseenter', () => {
        const illustration = storyImage.querySelector('.breakfast-illustration i');
        if (illustration) {
            illustration.style.transform = 'scale(1.1) rotate(5deg)';
            illustration.style.transition = 'transform 0.3s ease';
        }
    });

    storyImage.addEventListener('mouseleave', () => {
        const illustration = storyImage.querySelector('.breakfast-illustration i');
        if (illustration) {
            illustration.style.transform = 'scale(1) rotate(0deg)';
        }
    });
}

// Badge interaction
document.querySelectorAll('.badge').forEach(badge => {
    badge.addEventListener('click', () => {
        badge.style.transform = 'scale(0.95)';
        setTimeout(() => {
            badge.style.transform = 'translateY(-3px)';
        }, 100);
    });
});

// Console welcome message
console.log('%c🇵🇭 Bud Budots - About Us ', 'background: #3338A0; color: #FCC61D; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%cSarap ng umaga, sarap ng buhay!', 'color: #3338A0; font-size: 14px; font-style: italic;');
console.log('%cProudly serving Filipino silog meals with love and tradition.', 'color: #4a5568; font-size: 12px;');

// Performance optimization: Lazy load images when implemented
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    // When you add real images, use data-src attribute and they'll lazy load
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add sparkle animation to random team cards periodically
function addRandomSparkle() {
    const teamCards = document.querySelectorAll('.team-card');
    if (teamCards.length > 0) {
        const randomCard = teamCards[Math.floor(Math.random() * teamCards.length)];
        const sparkles = randomCard.querySelectorAll('.sparkle');
        
        sparkles.forEach(sparkle => {
            sparkle.style.opacity = '1';
            sparkle.style.transform = 'scale(1.5)';
            
            setTimeout(() => {
                sparkle.style.opacity = '0.6';
                sparkle.style.transform = 'scale(1)';
            }, 500);
        });
    }
}

// Trigger random sparkles every 3 seconds
setInterval(addRandomSparkle, 3000);

// Accessibility: Keyboard navigation for cards
document.querySelectorAll('.team-card, .promise-card, .mission-card, .vision-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            setTimeout(() => {
                card.style.transform = '';
            }, 200);
        }
    });
});

// Add entrance animation to hero elements on page load
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroTagline = document.querySelector('.hero-tagline');
    
    if (heroTitle) {
        heroTitle.style.animation = 'fadeUp 1s ease-out';
    }
    if (heroSubtitle) {
        heroSubtitle.style.animation = 'fadeUp 1s ease-out 0.2s backwards';
    }
    if (heroTagline) {
        heroTagline.style.animation = 'fadeUp 1s ease-out 0.4s backwards';
    }
});

// Timeline marker pulse on scroll
const markerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const marker = entry.target.querySelector('.timeline-marker');
            if (marker) {
                marker.style.animation = 'markerPulse 2s ease-in-out infinite, markerAppear 0.6s ease-out';
            }
        }
    });
}, {
    threshold: 0.5
});

// Add CSS for marker appear animation
const style = document.createElement('style');
style.textContent = `
    @keyframes markerAppear {
        from {
            transform: translateX(-50%) scale(0);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) scale(1);
            opacity: 1;
        }
    }
    
    @media (max-width: 768px) {
        @keyframes markerAppear {
            from {
                transform: translateX(0) scale(0);
                opacity: 0;
            }
            to {
                transform: translateX(0) scale(1);
                opacity: 1;
            }
        }
    }
`;
document.head.appendChild(style);

document.querySelectorAll('.timeline-item').forEach(item => {
    markerObserver.observe(item);
});
