// ===================================
// BUD BUDOTS PROFILE PAGE JAVASCRIPT
// User Profile Management
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initializeProfilePage();
});

// === INITIALIZATION ===
function initializeProfilePage() {
    setupSidebar();
    setupUserProfile();
    setupNotifications();
    setupProfileForm();
    setupAvatarUpload();
    setupCoverPhoto();
    setupEditButtons();
    animateOnScroll();
}

// === SIDEBAR FUNCTIONALITY ===
function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    // Mobile menu toggle
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            if (sidebarOverlay) {
                sidebarOverlay.classList.toggle('active');
            }
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close sidebar when clicking overlay
    if (sidebarOverlay && sidebar) {
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Highlight active menu item
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        if (link.getAttribute('href').includes(currentPage)) {
            link.parentElement.classList.add('active');
        }
    });
}

// === USER PROFILE DROPDOWN ===
function setupUserProfile() {
    const userProfile = document.querySelector('.user-profile');
    
    if (userProfile) {
        userProfile.addEventListener('click', () => {
            showToast('Profile settings! 👤', 'info');
        });
    }
}

// === NOTIFICATIONS ===
function setupNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            showToast('No new notifications 🔔', 'info');
        });
    }
}

// === PROFILE FORM ===
function setupProfileForm() {
    const form = document.getElementById('profileForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            console.log('Profile updated:', data);
            showToast('Profile updated successfully! ✨', 'success');
            
            // Update user name in nav
            const userName = document.querySelector('.user-name');
            if (userName) {
                userName.textContent = data.fullName;
            }
        });
    }
    
    // Make fields editable on click
    const infoValues = document.querySelectorAll('.info-value');
    infoValues.forEach(value => {
        value.addEventListener('click', function() {
            if (!this.querySelector('input')) {
                const currentText = this.textContent;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentText;
                input.className = 'edit-input';
                input.style.cssText = `
                    border: 2px solid var(--gold);
                    padding: 0.5rem;
                    border-radius: 8px;
                    width: 100%;
                    font-size: 0.95rem;
                `;
                
                this.textContent = '';
                this.appendChild(input);
                input.focus();
                
                input.addEventListener('blur', function() {
                    const newValue = this.value || currentText;
                    value.textContent = newValue;
                    showToast('Click "Save Changes" to update', 'info');
                });
                
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        this.blur();
                    }
                });
            }
        });
    });
}

// === AVATAR UPLOAD ===
function setupAvatarUpload() {
    const avatarInput = document.getElementById('avatarUpload');
    const changeAvatarBtn = document.querySelector('.btn-change-avatar');
    const profileAvatar = document.querySelector('.profile-avatar img');
    
    if (changeAvatarBtn && avatarInput) {
        changeAvatarBtn.addEventListener('click', () => {
            avatarInput.click();
        });
        
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5000000) {
                    showToast('File size should be less than 5MB', 'error');
                    return;
                }
                
                if (!file.type.startsWith('image/')) {
                    showToast('Please select an image file', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (profileAvatar) {
                        profileAvatar.src = e.target.result;
                        showToast('Avatar updated! Click "Save Changes" to apply', 'success');
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// === COVER PHOTO ===
function setupCoverPhoto() {
    const coverInput = document.getElementById('coverUpload');
    const changeCoverBtn = document.querySelector('.btn-change-cover');
    const coverPhoto = document.querySelector('.cover-photo');
    
    if (changeCoverBtn && coverInput) {
        changeCoverBtn.addEventListener('click', () => {
            coverInput.click();
        });
        
        coverInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 10000000) {
                    showToast('File size should be less than 10MB', 'error');
                    return;
                }
                
                if (!file.type.startsWith('image/')) {
                    showToast('Please select an image file', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (coverPhoto) {
                        coverPhoto.style.backgroundImage = `url(${e.target.result})`;
                        showToast('Cover photo updated! Click "Save Changes" to apply', 'success');
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// === EDIT BUTTONS ===
function setupEditButtons() {
    // Save Changes Button
    const saveBtn = document.querySelector('.btn-save-all');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            showToast('All changes saved successfully! ✅', 'success');
        });
    }
    
    // Edit Profile Button
    const editProfileBtn = document.querySelector('.btn-edit-profile');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            const infoSection = document.querySelector('.info-section');
            if (infoSection) {
                infoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                showToast('Click on any field to edit', 'info');
            }
        });
    }
    
    // Edit Section Buttons
    document.querySelectorAll('.btn-edit-section').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.closest('.info-section');
            const fields = section.querySelectorAll('.info-value');
            fields.forEach(field => {
                field.style.borderBottom = '2px dashed var(--gold)';
                field.style.cursor = 'pointer';
            });
            showToast('Click on fields to edit them', 'info');
        });
    });
}

// === UTILITY FUNCTIONS ===
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    const colors = {
        success: '#22C55E',
        error: '#EF4444',
        info: '#3B82F6',
        warning: '#F97316'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type]}" style="color: ${colors[type]}; font-size: 1.5rem;"></i>
        <div>
            <strong style="display: block; margin-bottom: 0.25rem;">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
            <span>${message}</span>
        </div>
        <button class="toast-close">&times;</button>
    `;
    
    document.getElementById('toastContainer').appendChild(toast);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }
    }, 3000);
}

function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.info-section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        observer.observe(el);
    });
}

// === SEARCH FUNCTIONALITY ===
const searchBar = document.querySelector('.search-bar input');
if (searchBar) {
    searchBar.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length > 2) {
            showToast(`Searching for "${query}"... 🔍`, 'info');
        }
    });
}

// === CART BUTTON ===
const cartBtn = document.getElementById('cartBtn');
if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        showToast('Opening cart... 🛒', 'info');
    });
}

console.log('🍱 Bud Budots Profile Page loaded successfully!');
