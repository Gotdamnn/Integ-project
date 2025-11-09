// ===================================
// LOGIN PAGE - BUD BUDOTS
// Interactive Login Form with Animations
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // ELEMENTS
    // ===================================
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const btnLogin = document.querySelector('.btn-login');
    const notification = document.getElementById('notification');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // ===================================
    // PASSWORD TOGGLE VISIBILITY
    // ===================================
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
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

        // Floating label effect (visual feedback)
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.style.letterSpacing = '0.5px';
            } else {
                this.style.letterSpacing = 'normal';
            }
        });
    });

    // ===================================
    // FORM VALIDATION & SUBMISSION
    // ===================================
    
    // Valid credentials for User Page access
    const VALID_CREDENTIALS = {
        username: 'admin',
        password: 'budbudots2025'
    };
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // Basic validation
            if (!username || !password) {
                showNotification('Please fill in all fields!', 'error');
                return;
            }

            if (username.length < 3) {
                showNotification('Username must be at least 3 characters!', 'error');
                return;
            }

            if (password.length < 6) {
                showNotification('Password must be at least 6 characters!', 'error');
                return;
            }

            // Show loading state
            btnLogin.classList.add('loading');
            btnLogin.querySelector('.btn-text').textContent = 'Logging in';

            // Simulate API call
            setTimeout(() => {
                btnLogin.classList.remove('loading');
                btnLogin.querySelector('.btn-text').textContent = 'Log In';
                
                // Check credentials
                if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
                    // Valid credentials - redirect to User Page
                    showNotification('Welcome back, Admin!', 'success');

                    // Save remember me preference
                    if (rememberMeCheckbox.checked) {
                        localStorage.setItem('rememberMe', 'true');
                        localStorage.setItem('username', username);
                    }

                    // Save authentication status
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('userType', 'admin');

                    // Redirect to User Page
                    setTimeout(() => {
                        window.location.href = '../User Page/Html/Index.html';
                    }, 1500);
                } else {
                    // Invalid credentials
                    showNotification('Invalid username or password!', 'error');
                    
                    // Shake the inputs
                    usernameInput.parentElement.style.animation = 'shake 0.5s ease-in-out';
                    passwordInput.parentElement.style.animation = 'shake 0.5s ease-in-out';
                    
                    setTimeout(() => {
                        usernameInput.parentElement.style.animation = '';
                        passwordInput.parentElement.style.animation = '';
                    }, 500);
                }
            }, 2000);
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
    // GOOGLE LOGIN BUTTON
    // ===================================
    const btnGoogle = document.querySelector('.btn-google');
    if (btnGoogle) {
        btnGoogle.addEventListener('click', function() {
            showNotification('Google login coming soon!', 'success');
            
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
    // FORGOT PASSWORD LINK
    // ===================================
    const forgotLink = document.querySelector('.forgot-link');
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Password reset link sent to your email!', 'success');
        });
    }

    // ===================================
    // REMEMBER ME - CHECK LOCAL STORAGE
    // ===================================
    if (localStorage.getItem('rememberMe') === 'true') {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            usernameInput.value = savedUsername;
            rememberMeCheckbox.checked = true;
        }
    }

    // ===================================
    // KEYBOARD SHORTCUTS
    // ===================================
    document.addEventListener('keydown', function(e) {
        // Enter key submits form when focused on inputs
        if (e.key === 'Enter' && (document.activeElement === usernameInput || document.activeElement === passwordInput)) {
            loginForm.dispatchEvent(new Event('submit'));
        }

        // Escape key clears form
        if (e.key === 'Escape') {
            loginForm.reset();
            usernameInput.focus();
        }
    });

    // ===================================
    // PARTICLE EFFECT ON LOGIN BUTTON
    // ===================================
    btnLogin.addEventListener('mouseenter', function() {
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
    // STEAM ANIMATION TIMING
    // ===================================
    const smokeElements = document.querySelectorAll('.smoke');
    smokeElements.forEach((smoke, index) => {
        smoke.style.animationDelay = `${index * 3}s`;
    });

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
    // AUTO-FOCUS ON USERNAME
    // ===================================
    if (usernameInput && !usernameInput.value) {
        setTimeout(() => {
            usernameInput.focus();
        }, 500);
    }

    // ===================================
    // PREVENT DOUBLE SUBMISSION
    // ===================================
    let isSubmitting = false;
    loginForm.addEventListener('submit', function(e) {
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
    // CONSOLE EASTER EGG
    // ===================================
    console.log('%c🍳 Bud Budots Login Page', 'color: #3338A0; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
    console.log('%c✨ Morning Silog Energy Activated!', 'color: #FCC61D; font-size: 16px; font-weight: bold;');
    console.log('%cWelcome back! Ready to order some delicious Filipino breakfast? 🥓🍚', 'color: #666; font-size: 14px;');

    // ===================================
    // PERFORMANCE: REDUCE ANIMATIONS ON LOW-END DEVICES
    // ===================================
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.smoke, .beam, .food-icon, .card-steam').forEach(el => {
            el.style.animation = 'none';
        });
    }

    // ===================================
    // FORM FIELD ERROR SHAKE ANIMATION
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

    // Apply shake on validation error
    loginForm.addEventListener('submit', function(e) {
        if (!usernameInput.value.trim()) {
            shakeInput(usernameInput);
        }
        if (!passwordInput.value.trim()) {
            shakeInput(passwordInput);
        }
    });

    // ===================================
    // SMOOTH PAGE LOAD ANIMATION
    // ===================================
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});
