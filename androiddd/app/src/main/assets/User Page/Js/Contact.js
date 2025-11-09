// ===================================
// CONTACT PAGE - BUD BUDOTS
// Interactive Form & Sidebar Toggle
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // SIDEBAR & BOTTOM NAV TOGGLE
    // ===================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const bottomNav = document.querySelector('.bottom-nav');

    function toggleSidebar() {
        navMenu.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        if (bottomNav) {
            bottomNav.classList.toggle('hide');
        }
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    // Close sidebar when clicking nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleSidebar();
            }
        });
    });

    // ===================================
    // FORM VALIDATION & SUBMISSION
    // ===================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();

            // Validation
            if (!firstName || !lastName || !email || !subject || !message) {
                showNotification('Please fill in all required fields!', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showNotification('Please enter a valid email address!', 'error');
                return;
            }

            // If all validations pass
            showSuccessModal();
            contactForm.reset();
        });
    }

    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // ===================================
    // INPUT FIELD ANIMATIONS
    // ===================================
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    
    formInputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        // Remove focus effect
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });

        // Character counter for textarea
        if (input.tagName === 'TEXTAREA') {
            const maxLength = 500;
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.cssText = 'text-align: right; font-size: 0.85rem; color: #999; margin-top: 5px;';
            input.parentElement.appendChild(counter);

            input.addEventListener('input', function() {
                const remaining = maxLength - this.value.length;
                counter.textContent = `${this.value.length}/${maxLength} characters`;
                counter.style.color = remaining < 50 ? '#FCC61D' : '#999';
            });
        }
    });

    // ===================================
    // FAQ ACCORDION
    // ===================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // ===================================
    // SCROLL ANIMATIONS
    // ===================================
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.contact-card, .faq-item, .form-content, .form-image');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease-out';
            observer.observe(element);
        });
    };

    animateOnScroll();

    // ===================================
    // NOTIFICATION SYSTEM
    // ===================================
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : '#4CAF50'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            font-weight: 600;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ===================================
    // SUCCESS MODAL
    // ===================================
    function showSuccessModal() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'overlay show';
        
        // Create success modal
        const modal = document.createElement('div');
        modal.className = 'form-success';
        modal.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check"></i>
            </div>
            <h3>Message Sent!</h3>
            <p>Thank you for reaching out! We'll get back to you within 24 hours.</p>
            <button class="btn btn-primary" onclick="closeSuccessModal()">
                <i class="fas fa-thumbs-up"></i>
                Awesome!
            </button>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        // Trigger animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Auto close after 5 seconds
        setTimeout(() => {
            closeSuccessModal();
        }, 5000);
    }

    // Close success modal function (global)
    window.closeSuccessModal = function() {
        const modal = document.querySelector('.form-success');
        const overlay = document.querySelector('.overlay');
        
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 500);
        }
        
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
        }
    };

    // ===================================
    // FLOATING ANIMATION FOR HERO ICONS
    // ===================================
    const floatingIcons = document.querySelectorAll('.floating-icon');
    floatingIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 2}s`;
    });

    // ===================================
    // PARALLAX EFFECT ON SCROLL
    // ===================================
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const hero = document.querySelector('.contact-hero');
        
        if (hero) {
            const offset = scrollTop * 0.5;
            hero.style.transform = `translateY(${offset}px)`;
        }

        lastScrollTop = scrollTop;
    });

    // ===================================
    // SMOOTH SCROLL FOR CTA BUTTONS
    // ===================================
    const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const text = this.textContent.trim();
            
            if (text.includes('Order Now')) {
                e.preventDefault();
                showNotification('Redirecting to order page...', 'info');
                setTimeout(() => {
                    window.location.href = 'Menu.html';
                }, 1000);
            } else if (text.includes('View Menu')) {
                e.preventDefault();
                window.location.href = 'Menu.html';
            }
        });
    });

    // ===================================
    // PHONE NUMBER FORMATTING
    // ===================================
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Format: +63 912 345 6789
            if (value.startsWith('63')) {
                value = value.substring(2);
            } else if (value.startsWith('0')) {
                value = value.substring(1);
            }
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    e.target.value = `+63 ${value}`;
                } else if (value.length <= 6) {
                    e.target.value = `+63 ${value.slice(0, 3)} ${value.slice(3)}`;
                } else {
                    e.target.value = `+63 ${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6, 10)}`;
                }
            }
        });
    }

    // ===================================
    // FORM FIELD REAL-TIME VALIDATION
    // ===================================
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#f44336';
                showNotification('Please enter a valid email!', 'error');
            } else {
                this.style.borderColor = '#E0E0E0';
            }
        });
    }

    // ===================================
    // SUBMIT BUTTON LOADING STATE
    // ===================================
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn && contactForm) {
        contactForm.addEventListener('submit', function() {
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // ===================================
    // CONSOLE GREETING
    // ===================================
    console.log('%c🍳 Bud Budots Contact Page', 'color: #3338A0; font-size: 20px; font-weight: bold;');
    console.log('%c💬 We\'d love to hear from you!', 'color: #FCC61D; font-size: 14px;');
});

// ===================================
// ADD CSS ANIMATIONS
// ===================================
const style = document.createElement('style');
style.textContent = `
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

    .form-group.focused label {
        color: #FCC61D;
    }

    .char-counter {
        transition: color 0.3s ease;
    }
`;
document.head.appendChild(style);
