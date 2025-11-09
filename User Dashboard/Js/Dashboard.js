// ===================================
// BUD BUDOTS DASHBOARD JAVASCRIPT
// Modern Filipino Silog Dashboard
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

// === INITIALIZATION ===
function initializeDashboard() {
    setupSidebar();
    setupUserProfile();
    setupNotifications();
    setupQuickActions();
    setupOrderActions();
    setupFavoriteActions();
    setupPromoActions();
    animateOnScroll();
    updateGreeting();
}

// === SIDEBAR FUNCTIONALITY ===
function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const menuToggle = document.getElementById('menuToggle');
    
    // Desktop collapse toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });
    }
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Restore sidebar state
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed && window.innerWidth > 1024) {
        sidebar.classList.add('collapsed');
    }
    
    // Close mobile sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
    
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
            showToast('Profile menu coming soon! 👤', 'info');
        });
    }
}

// === NOTIFICATIONS ===
function setupNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            showNotificationsPanel();
        });
    }
}

function showNotificationsPanel() {
    const notifications = [
        { icon: '🎉', title: 'Order Delivered!', message: 'Your Tapsilog Special has been delivered', time: '5 mins ago' },
        { icon: '🔥', title: 'New Promo Available', message: 'Get 20% off on your next order', time: '1 hour ago' },
        { icon: '⭐', title: 'Reward Points Earned', message: 'You earned 50 points from your last order', time: '2 hours ago' }
    ];
    
    const panel = createNotificationPanel(notifications);
    document.body.appendChild(panel);
}

function createNotificationPanel(notifications) {
    const panel = document.createElement('div');
    panel.className = 'notification-panel';
    panel.innerHTML = `
        <div class="notification-panel-content">
            <div class="notification-header">
                <h3><i class="fas fa-bell"></i> Notifications</h3>
                <button class="close-panel">&times;</button>
            </div>
            <div class="notification-list">
                ${notifications.map(notif => `
                    <div class="notification-item">
                        <span class="notif-icon">${notif.icon}</span>
                        <div class="notif-content">
                            <h4>${notif.title}</h4>
                            <p>${notif.message}</p>
                            <span class="notif-time">${notif.time}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-mark-read">Mark All as Read</button>
        </div>
    `;
    
    // Styling
    panel.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: 420px;
        background: white;
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Close panel
    panel.querySelector('.close-panel').addEventListener('click', () => panel.remove());
    panel.querySelector('.btn-mark-read').addEventListener('click', () => {
        showToast('All notifications marked as read ✓', 'success');
        panel.remove();
    });
    
    return panel;
}

// === QUICK ACTIONS ===
function setupQuickActions() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const actions = [
                { action: 'new-order', message: 'Opening menu... 🍽️' },
                { action: 'reorder', message: 'Reordering your last meal... 🔄' },
                { action: 'rewards', message: 'Loading your rewards... 🎁' },
                { action: 'support', message: 'Connecting to support... 💬' }
            ];
            
            const action = actions[index];
            showToast(action.message, 'info');
            
            // Add ripple effect
            addRipple(btn);
            
            // Simulate action
            setTimeout(() => {
                if (action.action === 'new-order') {
                    window.location.href = '../../../User Page/Html/Index.html';
                }
            }, 1000);
        });
    });
}

// === ORDER ACTIONS ===
function setupOrderActions() {
    // Reorder buttons
    document.querySelectorAll('.btn-reorder').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const orderItem = btn.closest('.order-item');
            const mealName = orderItem.querySelector('h4').textContent;
            
            addRipple(btn);
            showToast(`Reordering ${mealName}... 🛒`, 'success');
            
            // Animate button
            btn.style.transform = 'rotate(360deg) scale(1.2)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 500);
        });
    });
    
    // Track buttons
    document.querySelectorAll('.btn-track').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const orderItem = btn.closest('.order-item');
            const mealName = orderItem.querySelector('h4').textContent;
            
            showToast(`Tracking ${mealName}... 📍`, 'info');
        });
    });
}

// === FAVORITE ACTIONS ===
function setupFavoriteActions() {
    document.querySelectorAll('.btn-add-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const favoriteCard = btn.closest('.favorite-card');
            const mealName = favoriteCard.querySelector('h4').textContent;
            
            addRipple(btn);
            showToast(`${mealName} added to cart! 🛒`, 'success');
            
            // Update cart badge
            updateCartBadge();
        });
    });
}

// === PROMO ACTIONS ===
function setupPromoActions() {
    // Claim promo button
    const claimBtn = document.querySelector('.btn-claim');
    if (claimBtn) {
        claimBtn.addEventListener('click', () => {
            showToast('Promo claimed successfully! 🎉', 'success');
            claimBtn.textContent = 'Claimed!';
            claimBtn.disabled = true;
            claimBtn.style.opacity = '0.6';
        });
    }
    
    // Promo banner buttons
    document.querySelectorAll('.btn-promo').forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('Redirecting to menu... 🍽️', 'info');
            setTimeout(() => {
                window.location.href = '../../../User Page/Html/Index.html';
            }, 800);
        });
    });
}

// === UTILITY FUNCTIONS ===
function updateCartBadge() {
    const cartBadge = document.querySelector('#cartBtn .notification-badge');
    const leftBadge = document.querySelector('#leftCartBtn .nav-left-badge');
    if (cartBadge) {
        const currentCount = parseInt(cartBadge.textContent) || 0;
        cartBadge.textContent = currentCount + 1;
        // Animate badge
        cartBadge.style.animation = 'none';
        setTimeout(() => {
            cartBadge.style.animation = 'pulse 2s ease-in-out infinite';
        }, 10);
    }
    if (leftBadge) {
        const current = parseInt(leftBadge.textContent) || 0;
        leftBadge.textContent = current + 1;
        leftBadge.style.animation = 'none';
        setTimeout(() => {
            leftBadge.style.animation = 'pulse 2s ease-in-out infinite';
        }, 10);
    }
}

function updateGreeting() {
    const hour = new Date().getHours();
    const welcomeText = document.querySelector('.welcome-text h1');
    
    if (welcomeText) {
        let greeting = 'Kumusta';
        let emoji = '👋';
        
        if (hour < 12) {
            greeting = 'Magandang Umaga';
            emoji = '🌅';
        } else if (hour < 18) {
            greeting = 'Magandang Hapon';
            emoji = '☀️';
        } else {
            greeting = 'Magandang Gabi';
            emoji = '🌙';
        }
        
        const userName = document.querySelector('.user-name')?.textContent.split(' ')[0] || 'Juan';
        welcomeText.innerHTML = `${greeting}, ${userName}! ${emoji}`;
    }
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
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

function addRipple(element) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// === SCROLL ANIMATIONS ===
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.stat-card, .order-item, .favorite-card, .promo-banner').forEach(el => {
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

// Left-side cart button (top-left)
const leftCartBtn = document.getElementById('leftCartBtn');
if (leftCartBtn) {
    leftCartBtn.addEventListener('click', () => {
        showToast('Opening cart... 🛒', 'info');
        setTimeout(() => {
            window.location.href = '../../User Page/Html/cart.html';
        }, 400);
    });
}

// === CSS ANIMATIONS ===
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification-panel-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: white;
    }
    
    .notification-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 2px solid #F5F5F5;
    }
    
    .notification-header h3 {
        font-size: 1.25rem;
        color: #171717;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .close-panel {
        background: none;
        border: none;
        font-size: 2rem;
        color: #737373;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .close-panel:hover {
        color: #171717;
        transform: rotate(90deg);
    }
    
    .notification-list {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
    }
    
    .notification-item {
        display: flex;
        gap: 1rem;
        padding: 1.25rem;
        margin-bottom: 0.75rem;
        background: #FAFAFA;
        border-radius: 12px;
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .notification-item:hover {
        background: #FCC61D20;
        transform: translateX(5px);
    }
    
    .notif-icon {
        font-size: 2rem;
    }
    
    .notif-content h4 {
        font-size: 1rem;
        color: #171717;
        margin-bottom: 0.25rem;
    }
    
    .notif-content p {
        font-size: 0.9rem;
        color: #404040;
        margin-bottom: 0.5rem;
    }
    
    .notif-time {
        font-size: 0.8rem;
        color: #737373;
    }
    
    .btn-mark-read {
        margin: 1.5rem;
        padding: 0.85rem;
        background: linear-gradient(135deg, #3338A0, #3B82F6);
        color: white;
        border: none;
        border-radius: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-mark-read:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(51, 56, 160, 0.3);
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

console.log('🍱 Bud Budots Dashboard loaded successfully!');
