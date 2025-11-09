// ===================================
// BUD BUDOTS SETTINGS PAGE JAVASCRIPT
// User Settings Management
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initializeSettingsPage();
});

// === INITIALIZATION ===
function initializeSettingsPage() {
    setupSidebar();
    setupUserProfile();
    setupNotifications();
    setupToggleSwitches();
    setupPasswordChange();
    setupLanguageSelector();
    setupThemeSelector();
    setupNotificationSettings();
    setupPrivacySettings();
    setupDataManagement();
    setupAccountActions();
    animateOnScroll();
}

// === SIDEBAR FUNCTIONALITY ===
function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            if (sidebarOverlay) {
                sidebarOverlay.classList.toggle('active');
            }
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        });
    }
    
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

// === USER PROFILE ===
function setupUserProfile() {
    const userProfile = document.querySelector('.user-profile');
    
    if (userProfile) {
        userProfile.addEventListener('click', () => {
            showToast('Profile menu! 👤', 'info');
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

// === TOGGLE SWITCHES ===
function setupToggleSwitches() {
    const toggles = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
    
    toggles.forEach(toggle => {
        // Restore saved state
        const settingName = toggle.id;
        const savedState = localStorage.getItem(settingName);
        if (savedState !== null) {
            toggle.checked = savedState === 'true';
        }
        
        toggle.addEventListener('change', function() {
            const settingName = this.id;
            const label = this.closest('.setting-item').querySelector('.setting-label')?.textContent || 'Setting';
            const isEnabled = this.checked;
            
            // Save state
            localStorage.setItem(settingName, isEnabled);
            
            // Show notification
            showToast(`${label} ${isEnabled ? 'enabled' : 'disabled'}`, isEnabled ? 'success' : 'info');
            
            // Handle specific settings
            handleSettingChange(settingName, isEnabled);
        });
    });
}

function handleSettingChange(settingName, isEnabled) {
    switch(settingName) {
        case 'emailNotifications':
            console.log('Email notifications:', isEnabled);
            break;
        case 'pushNotifications':
            if (isEnabled && 'Notification' in window) {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        showToast('Push notifications enabled!', 'success');
                    } else {
                        showToast('Permission denied for push notifications', 'warning');
                    }
                });
            }
            break;
        case 'darkMode':
            toggleDarkMode(isEnabled);
            break;
        case 'twoFactorAuth':
            if (isEnabled) {
                showToast('Two-factor authentication setup required', 'info');
            }
            break;
    }
}

// === PASSWORD CHANGE ===
function setupPasswordChange() {
    const changePasswordBtn = document.querySelector('.btn-change-password');
    
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
            showPasswordChangeModal();
        });
    }
}

function showPasswordChangeModal() {
    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Change Password</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Current Password</label>
                    <input type="password" id="currentPassword" class="form-input" placeholder="Enter current password">
                </div>
                <div class="form-group">
                    <label>New Password</label>
                    <input type="password" id="newPassword" class="form-input" placeholder="Enter new password">
                </div>
                <div class="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" id="confirmPassword" class="form-input" placeholder="Confirm new password">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary modal-cancel">Cancel</button>
                <button class="btn-primary modal-save">Change Password</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close handlers
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-cancel').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    // Save handler
    modal.querySelector('.modal-save').addEventListener('click', () => {
        const current = modal.querySelector('#currentPassword').value;
        const newPass = modal.querySelector('#newPassword').value;
        const confirm = modal.querySelector('#confirmPassword').value;
        
        if (!current || !newPass || !confirm) {
            showToast('Please fill all fields', 'error');
            return;
        }
        
        if (newPass !== confirm) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        if (newPass.length < 8) {
            showToast('Password must be at least 8 characters', 'error');
            return;
        }
        
        showToast('Password changed successfully! 🔒', 'success');
        modal.remove();
    });
}

// === LANGUAGE SELECTOR ===
function setupLanguageSelector() {
    const languageSelect = document.querySelector('.setting-select');
    
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const language = this.value;
            localStorage.setItem('language', language);
            showToast(`Language changed to ${language === 'en' ? 'English' : 'Filipino'}`, 'success');
        });
    }
}

// === THEME SELECTOR ===
function setupThemeSelector() {
    const themeButtons = document.querySelectorAll('.theme-option');
    
    themeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            themeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const theme = this.dataset.theme;
            localStorage.setItem('theme', theme);
            applyTheme(theme);
            showToast(`${theme} theme activated!`, 'success');
        });
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Theme CSS would handle the actual styling
}

function toggleDarkMode(enabled) {
    if (enabled) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// === NOTIFICATION SETTINGS ===
function setupNotificationSettings() {
    const notificationTypes = document.querySelectorAll('.notification-type-toggle');
    
    notificationTypes.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const type = this.dataset.type;
            const enabled = this.checked;
            localStorage.setItem(`notification_${type}`, enabled);
        });
    });
}

// === PRIVACY SETTINGS ===
function setupPrivacySettings() {
    const privacyToggles = document.querySelectorAll('.privacy-toggle');
    
    privacyToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const setting = this.dataset.privacy;
            const enabled = this.checked;
            localStorage.setItem(`privacy_${setting}`, enabled);
            showToast(`Privacy setting updated`, 'success');
        });
    });
}

// === DATA MANAGEMENT ===
function setupDataManagement() {
    // Export Data
    const exportBtn = document.querySelector('.btn-export-data');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            showToast('Preparing your data for export... 📦', 'info');
            setTimeout(() => {
                showToast('Data export ready! Download started.', 'success');
                // Trigger download
                downloadUserData();
            }, 2000);
        });
    }
    
    // Clear Cache
    const clearCacheBtn = document.querySelector('.btn-clear-cache');
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear cache? This cannot be undone.')) {
                localStorage.clear();
                sessionStorage.clear();
                showToast('Cache cleared successfully! 🧹', 'success');
            }
        });
    }
}

function downloadUserData() {
    const data = {
        userName: document.querySelector('.user-name')?.textContent || 'User',
        exportDate: new Date().toISOString(),
        settings: {
            notifications: localStorage.getItem('emailNotifications'),
            language: localStorage.getItem('language'),
            theme: localStorage.getItem('theme')
        }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'budbudots-user-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// === ACCOUNT ACTIONS ===
function setupAccountActions() {
    // Deactivate Account
    const deactivateBtn = document.querySelector('.btn-deactivate');
    if (deactivateBtn) {
        deactivateBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to deactivate your account? You can reactivate it later.')) {
                showToast('Account deactivation process started...', 'warning');
            }
        });
    }
    
    // Delete Account
    const deleteBtn = document.querySelector('.btn-delete-account');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            const confirmation = prompt('Type "DELETE" to permanently delete your account:');
            if (confirmation === 'DELETE') {
                showToast('Account deletion process started... We\'re sad to see you go! 😢', 'error');
            } else if (confirmation !== null) {
                showToast('Account deletion cancelled', 'info');
            }
        });
    }
}

// === UTILITY FUNCTIONS ===
function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
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
    
    toastContainer.appendChild(toast);
    
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    });
    
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
    
    document.querySelectorAll('.settings-section').forEach(el => {
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
            showToast(`Searching settings for "${query}"... 🔍`, 'info');
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

// Add modal styles
const style = document.createElement('style');
style.textContent = `
    .settings-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .modal-content {
        background: white;
        border-radius: 20px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
    }
    
    @keyframes slideUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        border-bottom: 2px solid #F5F5F5;
    }
    
    .modal-header h3 {
        font-size: 1.5rem;
        color: #171717;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 2rem;
        color: #737373;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .modal-close:hover {
        color: #171717;
        transform: rotate(90deg);
    }
    
    .modal-body {
        padding: 2rem;
    }
    
    .form-group {
        margin-bottom: 1.5rem;
    }
    
    .form-group label {
        display: block;
        font-weight: 600;
        color: #404040;
        margin-bottom: 0.5rem;
    }
    
    .form-input {
        width: 100%;
        padding: 0.85rem 1.25rem;
        border: 2px solid #E5E5E5;
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.3s ease;
    }
    
    .form-input:focus {
        outline: none;
        border-color: #FCC61D;
        box-shadow: 0 0 0 4px rgba(252, 198, 29, 0.1);
    }
    
    .modal-footer {
        display: flex;
        gap: 1rem;
        padding: 1.5rem 2rem;
        border-top: 2px solid #F5F5F5;
    }
    
    .btn-secondary {
        flex: 1;
        padding: 0.85rem 1.75rem;
        background: #F5F5F5;
        color: #404040;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-secondary:hover {
        background: #E5E5E5;
    }
    
    .btn-primary {
        flex: 1;
        padding: 0.85rem 1.75rem;
        background: linear-gradient(135deg, #FCC61D, #C59560);
        color: white;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(252, 198, 29, 0.3);
    }
    
    .toast-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #737373;
        cursor: pointer;
        margin-left: auto;
    }
    
    .toast-close:hover {
        color: #171717;
    }
`;
document.head.appendChild(style);

console.log('🍱 Bud Budots Settings Page loaded successfully!');
