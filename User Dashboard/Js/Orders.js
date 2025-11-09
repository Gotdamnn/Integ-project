// ===================================
// BUD BUDOTS ORDERS PAGE JAVASCRIPT
// Order Management & Tracking
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initializeOrdersPage();
});

// === INITIALIZATION ===
function initializeOrdersPage() {
    setupSidebar();
    setupUserProfile();
    setupNotifications();
    setupCart();
    setupOrderFilters();
    setupOrderActions();
    setupSearchFilter();
    animateOrderCards();
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
            if (!sidebar.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
    
    // Highlight active menu item (Orders page)
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        if (link.getAttribute('href').includes(currentPage)) {
            link.parentElement.classList.add('active');
        }
    });
    
    // Promo claim button
    const btnClaim = document.querySelector('.btn-claim');
    if (btnClaim) {
        btnClaim.addEventListener('click', () => {
            showToast('Promo claimed! Check your rewards 🎉', 'success');
        });
    }
}

// === USER PROFILE DROPDOWN ===
function setupUserProfile() {
    const userProfile = document.querySelector('.user-profile');
    
    if (userProfile) {
        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            showToast('Profile menu coming soon! 👤', 'info');
        });
    }
}

// === NOTIFICATIONS ===
function setupNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showToast('Your order is being prepared! 🔥', 'info');
        });
    }
}

// === CART ===
function setupCart() {
    const cartBtn = document.getElementById('cartBtn');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showToast('Cart: 2 items - ₱350.00 🛒', 'info');
        });
    }
}

// === ORDER FILTERS ===
function setupOrderFilters() {
    const filterPills = document.querySelectorAll('.filter-pills .pill');
    const orderCards = document.querySelectorAll('.order-card');
    
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Remove active class from all pills
            filterPills.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked pill
            pill.classList.add('active');
            
            // Get filter status
            const filterStatus = pill.getAttribute('data-status');
            
            // Filter orders
            filterOrders(filterStatus, orderCards);
            
            // Show feedback
            const statusName = pill.textContent.trim();
            showToast(`Showing ${statusName} 📋`, 'info');
        });
    });
    
    // Filter and sort buttons
    const btnFilter = document.querySelector('.btn-filter');
    const btnSort = document.querySelector('.btn-sort');
    
    if (btnFilter) {
        btnFilter.addEventListener('click', () => {
            showToast('Advanced filters coming soon! 🔍', 'info');
        });
    }
    
    if (btnSort) {
        btnSort.addEventListener('click', () => {
            showToast('Sort options coming soon! ⬆️⬇️', 'info');
        });
    }
}

function filterOrders(status, orderCards) {
    orderCards.forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        
        if (status === 'all' || cardStatus === status) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// === ORDER ACTIONS ===
function setupOrderActions() {
    // Track Order Buttons
    const trackButtons = document.querySelectorAll('.btn-track');
    trackButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const orderCard = btn.closest('.order-card');
            const orderNumber = orderCard.querySelector('.order-number').textContent;
            showTrackingModal(orderNumber);
        });
    });
    
    // Details Buttons
    const detailsButtons = document.querySelectorAll('.btn-details');
    detailsButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const orderCard = btn.closest('.order-card');
            const orderNumber = orderCard.querySelector('.order-number').textContent;
            showOrderDetails(orderNumber);
        });
    });
    
    // Reorder Buttons
    const reorderButtons = document.querySelectorAll('.btn-reorder');
    reorderButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const orderCard = btn.closest('.order-card');
            const orderNumber = orderCard.querySelector('.order-number').textContent;
            handleReorder(orderNumber);
        });
    });
    
    // Review Buttons
    const reviewButtons = document.querySelectorAll('.btn-review');
    reviewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const orderCard = btn.closest('.order-card');
            const orderNumber = orderCard.querySelector('.order-number').textContent;
            showReviewModal(orderNumber);
        });
    });
}

function showTrackingModal(orderNumber) {
    showToast(`Tracking ${orderNumber} 📍`, 'info');
    // In a real app, this would open a modal with a map showing delivery location
}

function showOrderDetails(orderNumber) {
    showToast(`Viewing details for ${orderNumber} 📄`, 'info');
    // In a real app, this would open a modal with full order details
}

function handleReorder(orderNumber) {
    showToast(`Items from ${orderNumber} added to cart! 🛒`, 'success');
    // Update cart badge
    const cartBadge = document.querySelector('#cartBtn .notification-badge');
    if (cartBadge) {
        const currentCount = parseInt(cartBadge.textContent);
        cartBadge.textContent = currentCount + 1;
    }
}

function showReviewModal(orderNumber) {
    showToast(`Review form for ${orderNumber} coming soon! ⭐`, 'info');
    // In a real app, this would open a modal to write a review
}

// === SEARCH FILTER ===
function setupSearchFilter() {
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            searchOrders(searchTerm);
        });
    }
}

function searchOrders(searchTerm) {
    const orderCards = document.querySelectorAll('.order-card');
    
    orderCards.forEach(card => {
        const orderNumber = card.querySelector('.order-number').textContent.toLowerCase();
        const orderItems = Array.from(card.querySelectorAll('.item-details h4'))
            .map(item => item.textContent.toLowerCase())
            .join(' ');
        
        if (orderNumber.includes(searchTerm) || orderItems.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// === ANIMATIONS ===
function animateOrderCards() {
    const orderCards = document.querySelectorAll('.order-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    orderCards.forEach(card => {
        observer.observe(card);
    });
}

// === TOAST NOTIFICATIONS ===
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
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-exclamation-circle"></i>',
        info: '<i class="fas fa-info-circle"></i>',
        warning: '<i class="fas fa-exclamation-triangle"></i>'
    };
    
    toast.innerHTML = `
        ${icons[type] || icons.info}
        <span>${message}</span>
        <button class="toast-close">&times;</button>
    `;
    
    document.getElementById('toastContainer').appendChild(toast);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        removeToast(toast);
    });
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        removeToast(toast);
    }, 4000);
}

function removeToast(toast) {
    toast.style.animation = 'slideOut 0.3s ease-out forwards';
    setTimeout(() => {
        toast.remove();
    }, 300);
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .toast {
        display: flex;
        align-items: center;
        gap: 1rem;
        position: relative;
    }
    
    .toast i {
        font-size: 1.25rem;
    }
    
    .toast.success i {
        color: var(--success);
    }
    
    .toast.error i {
        color: var(--error);
    }
    
    .toast.info i {
        color: var(--info);
    }
    
    .toast.warning i {
        color: var(--warning);
    }
    
    .toast-close {
        margin-left: auto;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--gray-500);
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .toast-close:hover {
        color: var(--gray-900);
    }
`;
document.head.appendChild(style);

// === AUTO-UPDATE ORDER PROGRESS ===
function updateOrderProgress() {
    const activeOrders = document.querySelectorAll('.order-card[data-status="preparing"], .order-card[data-status="delivery"]');
    
    activeOrders.forEach(order => {
        const progressFill = order.querySelector('.progress-fill');
        if (progressFill) {
            const currentWidth = parseInt(progressFill.style.width);
            if (currentWidth < 100) {
                // Simulate progress update (in real app, this would come from server)
                const newWidth = Math.min(currentWidth + 5, 100);
                progressFill.style.width = newWidth + '%';
            }
        }
    });
}

// Update progress every 30 seconds (demo purposes)
setInterval(updateOrderProgress, 30000);

// === UTILITY FUNCTIONS ===
function formatCurrency(amount) {
    return '₱' + amount.toFixed(2);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-PH', options);
}

// === RESPONSIVE HANDLING ===
function handleResize() {
    const sidebar = document.getElementById('sidebar');
    
    if (window.innerWidth > 1024) {
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (!isCollapsed) {
            sidebar.classList.remove('collapsed');
        }
    }
}

window.addEventListener('resize', handleResize);

// === KEYBOARD SHORTCUTS ===
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + F for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        document.querySelector('.search-bar input').focus();
    }
    
    // ESC to close modals/panels
    if (e.key === 'Escape') {
        const panels = document.querySelectorAll('.notification-panel, .modal');
        panels.forEach(panel => panel.remove());
    }
});

console.log('🍳 Bud Budots Orders Page Initialized!');
