// ===================================
// SIGN UP PAGE - BUD BUDOTS
// Interactive Registration Form
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // ELEMENTS
    // ===================================
    const signupForm = document.getElementById('signupForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('termsAccept');
    const btnSignup = document.querySelector('.btn-signup');
    const notification = document.getElementById('notification');
    const successModal = document.getElementById('successModal');
    const strengthBar = document.querySelector('.strength-bar');

    // ===================================
    // PASSWORD TOGGLE VISIBILITY
    // ===================================
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            const type = targetInput.getAttribute('type') === 'password' ? 'text' : 'password';
            targetInput.setAttribute('type', type);
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // ===================================
    // PASSWORD STRENGTH CHECKER
    // ===================================
    if (passwordInput && strengthBar) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = checkPasswordStrength(password);
            
            // Remove all classes
            strengthBar.className = 'strength-bar';
            
            // Add appropriate class
            if (password.length === 0) {
                // No strength bar
            } else if (strength < 3) {
                strengthBar.classList.add('weak');
            } else if (strength < 5) {
                strengthBar.classList.add('medium');
            } else {
                strengthBar.classList.add('strong');
            }
        });
    }

    function checkPasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Character variety
        if (/[a-z]/.test(password)) strength++; // lowercase
        if (/[A-Z]/.test(password)) strength++; // uppercase
        if (/[0-9]/.test(password)) strength++; // numbers
        if (/[^a-zA-Z0-9]/.test(password)) strength++; // special chars
        
        return strength;
    }

    // ===================================
    // PHONE NUMBER FORMATTING
    // ===================================
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Auto-add +63 for Philippine numbers
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
            } else {
                e.target.value = '';
            }
        });
    }

    // ===================================
    // INPUT FIELD ANIMATIONS
    // ===================================
    const inputs = document.querySelectorAll('.input-group input');
    
    inputs.forEach(input => {
        // Add glow effect on focus
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });

        // Visual feedback on input
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.style.letterSpacing = '0.3px';
            } else {
                this.style.letterSpacing = 'normal';
            }
        });
    });

    // ===================================
    // EMAIL VALIDATION (REAL-TIME)
    // ===================================
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#f44336';
                showNotification('Please enter a valid email address!', 'error');
            } else if (this.value) {
                this.style.borderColor = '#4CAF50';
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }
        });

        emailInput.addEventListener('focus', function() {
            this.style.borderColor = 'var(--gold)';
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // ===================================
    // PASSWORD MATCH VALIDATION
    // ===================================
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value && this.value !== passwordInput.value) {
                this.style.borderColor = '#f44336';
            } else if (this.value && this.value === passwordInput.value) {
                this.style.borderColor = '#4CAF50';
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }
        });
    }

    // ===================================
    // FORM VALIDATION & SUBMISSION
    // ===================================
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const firstName = firstNameInput.value.trim();
            const lastName = lastNameInput.value.trim();
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            const termsAccepted = termsCheckbox.checked;

            // Validation checks
            if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
                showNotification('Please fill in all required fields!', 'error');
                return;
            }

            if (firstName.length < 2) {
                showNotification('First name must be at least 2 characters!', 'error');
                shakeInput(firstNameInput);
                return;
            }

            if (lastName.length < 2) {
                showNotification('Last name must be at least 2 characters!', 'error');
                shakeInput(lastNameInput);
                return;
            }

            if (!validateEmail(email)) {
                showNotification('Please enter a valid email address!', 'error');
                shakeInput(emailInput);
                return;
            }

            if (phone.replace(/\D/g, '').length < 10) {
                showNotification('Please enter a valid phone number!', 'error');
                shakeInput(phoneInput);
                return;
            }

            if (password.length < 6) {
                showNotification('Password must be at least 6 characters!', 'error');
                shakeInput(passwordInput);
                return;
            }

            if (password !== confirmPassword) {
                showNotification('Passwords do not match!', 'error');
                shakeInput(confirmPasswordInput);
                return;
            }

            if (!termsAccepted) {
                showNotification('Please accept the Terms & Conditions!', 'error');
                return;
            }

            // Show loading state
            btnSignup.classList.add('loading');
            btnSignup.querySelector('.btn-text').textContent = 'Creating Account';

            // Simulate API call
            setTimeout(() => {
                // Success!
                btnSignup.classList.remove('loading');
                btnSignup.querySelector('.btn-text').textContent = 'Create Account';
                
                // Show success modal
                showSuccessModal();

                // Reset form
                signupForm.reset();
                strengthBar.className = 'strength-bar';
            }, 2500);
        });
    }

    // ===================================
    // NOTIFICATION SYSTEM
    // ===================================
    function showNotification(message, type = 'success') {
        const notificationIcon = notification.querySelector('.notification-icon');
        const notificationTitle = notification.querySelector('.notification-title');
        const notificationMessage = notification.querySelector('.notification-message');

        // Set content
        notificationMessage.textContent = message;

        // Set style based on type
        if (type === 'error') {
            notificationIcon.classList.add('error');
            notificationIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
            notificationTitle.textContent = 'Error!';
        } else {
            notificationIcon.classList.remove('error');
            notificationIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
            notificationTitle.textContent = 'Success!';
        }

        // Show notification
        notification.classList.add('show');

        // Auto hide after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }

    // ===================================
    // SUCCESS MODAL
    // ===================================
    function showSuccessModal() {
        successModal.classList.add('show');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    // Redirect function (global)
    window.redirectToHome = function() {
        window.location.href = '../Guest Page/Html/Index.html';
    };

    // ===================================
    // GOOGLE SIGN UP BUTTON
    // ===================================
    const btnGoogle = document.querySelector('.btn-google');
    if (btnGoogle) {
        btnGoogle.addEventListener('click', function() {
            showNotification('Google sign up coming soon!', 'success');
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    }

    // ===================================
    // TERMS LINK
    // ===================================
    const termsLink = document.querySelector('.terms-link');
    if (termsLink) {
        termsLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Terms & Conditions will open in a new tab!', 'success');
        });
    }

    // ===================================
    // KEYBOARD SHORTCUTS
    // ===================================
    document.addEventListener('keydown', function(e) {
        // Enter key submits form when focused on inputs
        if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
            signupForm.dispatchEvent(new Event('submit'));
        }

        // Escape key clears form
        if (e.key === 'Escape' && !successModal.classList.contains('show')) {
            signupForm.reset();
            firstNameInput.focus();
        }
    });

    // ===================================
    // PARTICLE EFFECT ON SIGNUP BUTTON
    // ===================================
    btnSignup.addEventListener('mouseenter', function() {
        createParticles(this);
    });

    function createParticles(element) {
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${i % 2 === 0 ? '#FCC61D' : '#fff'};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + rect.height / 2}px;
                animation: particleFloat ${1 + Math.random() * 2}s ease-out forwards;
                opacity: 0.8;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 3000);
        }
    }

    // Add particle animation
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particleFloat {
            0% {
                transform: translateY(0) scale(1);
                opacity: 0.8;
            }
            100% {
                transform: translateY(-100px) scale(0);
                opacity: 0;
            }
        }

        @keyframes ripple {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particleStyle);

    // ===================================
    // SHAKE ANIMATION FOR ERRORS
    // ===================================
    function shakeInput(input) {
        input.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    }

    // Add shake animation
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(shakeStyle);

    // ===================================
    // DYNAMIC STEAM ON INPUT FOCUS
    // ===================================
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            const steam = document.createElement('div');
            steam.className = 'input-steam';
            steam.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 50%;
                width: 30px;
                height: 30px;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent);
                border-radius: 50%;
                filter: blur(10px);
                animation: inputSteamRise 2s ease-out infinite;
                pointer-events: none;
            `;
            
            this.parentElement.appendChild(steam);
            
            this.addEventListener('blur', function blurHandler() {
                steam.remove();
                this.removeEventListener('blur', blurHandler);
            }, { once: true });
        });
    });

    // Add input steam animation
    const inputSteamStyle = document.createElement('style');
    inputSteamStyle.textContent = `
        @keyframes inputSteamRise {
            0% {
                transform: translate(-50%, 0) scale(0.8);
                opacity: 0;
            }
            50% {
                opacity: 0.6;
            }
            100% {
                transform: translate(-50%, -60px) scale(1.2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(inputSteamStyle);

    // ===================================
    // AUTO-FOCUS ON FIRST NAME
    // ===================================
    if (firstNameInput) {
        setTimeout(() => {
            firstNameInput.focus();
        }, 500);
    }

    // ===================================
    // PREVENT DOUBLE SUBMISSION
    // ===================================
    let isSubmitting = false;
    signupForm.addEventListener('submit', function(e) {
        if (isSubmitting) {
            e.preventDefault();
            return;
        }
        isSubmitting = true;
        
        setTimeout(() => {
            isSubmitting = false;
        }, 3000);
    });

    // ===================================
    // NAME CAPITALIZATION
    // ===================================
    [firstNameInput, lastNameInput].forEach(input => {
        if (input) {
            input.addEventListener('blur', function() {
                this.value = this.value
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');
            });
        }
    });

    // ===================================
    // STEAM ANIMATION TIMING
    // ===================================
    const smokeElements = document.querySelectorAll('.smoke');
    smokeElements.forEach((smoke, index) => {
        smoke.style.animationDelay = `${index * 3}s`;
    });

    // ===================================
    // CONSOLE EASTER EGG
    // ===================================
    console.log('%c🍳 Bud Budots Sign Up Page', 'color: #3338A0; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
    console.log('%c✨ Join Our Silog Family!', 'color: #FCC61D; font-size: 16px; font-weight: bold;');
    console.log('%cWelcome! Create your account and start ordering delicious Filipino breakfast! 🥓🍚', 'color: #666; font-size: 14px;');

    // ===================================
    // PERFORMANCE: REDUCE ANIMATIONS ON LOW-END DEVICES
    // ===================================
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.smoke, .beam, .food-icon, .card-steam').forEach(el => {
            el.style.animation = 'none';
        });
    }

    // ===================================
    // SMOOTH PAGE LOAD ANIMATION
    // ===================================
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);

    // ===================================
    // PASSWORD STRENGTH TOOLTIP
    // ===================================
    if (passwordInput) {
        const tooltip = document.createElement('div');
        tooltip.className = 'password-tooltip';
        tooltip.innerHTML = `
            <div style="font-size: 0.85rem; color: rgba(255,255,255,0.9); padding: 10px; background: rgba(51,56,160,0.9); border-radius: 10px; position: absolute; top: -80px; left: 0; width: 100%; display: none; z-index: 10;">
                <strong>Password must contain:</strong><br>
                • At least 6 characters<br>
                • Mix of letters & numbers
            </div>
        `;
        passwordInput.parentElement.appendChild(tooltip);

        passwordInput.addEventListener('focus', function() {
            tooltip.querySelector('div').style.display = 'block';
        });

        passwordInput.addEventListener('blur', function() {
            tooltip.querySelector('div').style.display = 'none';
        });
    }
});
