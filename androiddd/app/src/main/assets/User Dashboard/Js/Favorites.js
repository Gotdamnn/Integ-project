// ===================================
// FAVORITES PAGE - BUD BUDOTS
// User Dashboard JavaScript
// ===================================

// === SIDEBAR TOGGLE ===
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });
    }
    
    // Restore sidebar state
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        sidebar.classList.add('collapsed');
    }
});

// === FILTER PILLS ===
const filterPills = document.querySelectorAll('.pill');
const favoriteItems = document.querySelectorAll('.favorite-item');

filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
        // Remove active from all pills
        filterPills.forEach(p => p.classList.remove('active'));
        // Add active to clicked pill
        pill.classList.add('active');
        
        const filterCategory = pill.textContent.trim();
        
        // Filter favorites
        favoriteItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filterCategory === 'All' || category === filterCategory) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Show toast
        showToast(`Showing ${filterCategory === 'All' ? 'all favorites' : filterCategory + ' favorites'}`);
    });
});

// === FAVORITE HEART TOGGLE ===
const heartButtons = document.querySelectorAll('.btn-favorite');

heartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const mealName = btn.closest('.favorite-item').querySelector('h3').textContent;
        
        if (btn.classList.contains('active')) {
            // Remove from favorites
            btn.classList.remove('active');
            btn.innerHTML = '<i class="ri-heart-line"></i>';
            showToast(`${mealName} removed from favorites`, 'error');
            
            // Optionally remove the item with animation
            setTimeout(() => {
                const item = btn.closest('.favorite-item');
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.remove();
                    checkEmptyState();
                }, 300);
            }, 1000);
        } else {
            // Add to favorites (shouldn't happen on this page, but handle it)
            btn.classList.add('active');
            btn.innerHTML = '<i class="ri-heart-fill"></i>';
            showToast(`${mealName} added to favorites`, 'success');
        }
    });
});

// === ADD TO CART ===
const addToCartButtons = document.querySelectorAll('.btn-add-cart');

addToCartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const mealName = btn.closest('.favorite-item').querySelector('h3').textContent;
        const price = btn.closest('.favorite-item').querySelector('.price').textContent;
        
        // Add ripple effect
        addRipple(e, btn);
        
        // Update cart count (if exists in nav)
        updateCartCount();
        
        // Show success toast
        showToast(`${mealName} added to cart (${price})`, 'success');
        
        // Button animation
        btn.innerHTML = '<i class="ri-check-line"></i> Added!';
        btn.style.background = 'linear-gradient(135deg, #22C55E, #4ADE80)';
        
        setTimeout(() => {
            btn.innerHTML = '<i class="ri-shopping-cart-line"></i> Add to Cart';
            btn.style.background = 'linear-gradient(135deg, var(--gold), var(--accent-brown))';
        }, 2000);
    });
});

// === SEARCH FUNCTIONALITY ===
const searchInput = document.querySelector('.search-bar input');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        favoriteItems.forEach(item => {
            const mealName = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('.meal-description').textContent.toLowerCase();
            const tags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
            
            if (mealName.includes(searchTerm) || description.includes(searchTerm) || tags.includes(searchTerm)) {
                item.style.display = 'block';
                item.style.opacity = '1';
            } else {
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 200);
            }
        });
        
        checkEmptyState();
    });
}

// === MEAL CARD CLICK (VIEW DETAILS) ===
favoriteItems.forEach(item => {
    item.addEventListener('click', (e) => {
        // Don't trigger if clicking buttons
        if (e.target.closest('.btn-favorite') || e.target.closest('.btn-add-cart')) return;
        
        const mealName = item.querySelector('h3').textContent;
        showToast(`Opening ${mealName} details...`);
        
        // Here you could open a modal or navigate to details page
        setTimeout(() => {
            // window.location.href = `meal-details.html?meal=${encodeURIComponent(mealName)}`;
        }, 300);
    });
});

// === CART COUNT UPDATE ===
function updateCartCount() {
    const cartBadge = document.querySelector('.nav-icon:has(.ri-shopping-cart-line) .notification-badge');
    if (cartBadge) {
        let currentCount = parseInt(cartBadge.textContent) || 0;
        currentCount++;
        cartBadge.textContent = currentCount;
        
        // Bounce animation
        cartBadge.style.animation = 'none';
        setTimeout(() => {
            cartBadge.style.animation = 'bounce 0.5s ease';
        }, 10);
    }
}

// === EMPTY STATE CHECK ===
function checkEmptyState() {
    const visibleItems = Array.from(favoriteItems).filter(item => item.style.display !== 'none');
    const favoritesGrid = document.querySelector('.favorites-grid');
    
    if (visibleItems.length === 0 && !document.querySelector('.empty-state')) {
        // Create empty state
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <div class="empty-content">
                <i class="ri-heart-line"></i>
                <h2>No favorites found</h2>
                <p>Try adjusting your search or browse our delicious menu to find your next favorite silog!</p>
                <a href="Menu.html" class="btn-browse">
                    <i class="ri-restaurant-line"></i>
                    Browse Menu
                </a>
            </div>
        `;
        favoritesGrid.parentElement.appendChild(emptyState);
        favoritesGrid.style.display = 'none';
    } else if (visibleItems.length > 0) {
        const emptyState = document.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
            favoritesGrid.style.display = 'grid';
        }
    }
}

// === RIPPLE EFFECT ===
function addRipple(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// === TOAST NOTIFICATIONS ===
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: 'ri-check-line',
        error: 'ri-close-line',
        info: 'ri-information-line'
    };
    
    toast.innerHTML = `
        <i class="${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// === NOTIFICATION CLICK ===
const notificationBtn = document.querySelector('.nav-icon:has(.ri-notification-line)');
if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
        showToast('You have 3 new notifications!');
    });
}

// === USER PROFILE CLICK ===
const userProfile = document.querySelector('.user-profile');
if (userProfile) {
    userProfile.addEventListener('click', () => {
        showToast('Opening profile menu...');
    });
}

// === SCROLL ANIMATIONS ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all favorite items
favoriteItems.forEach(item => {
    observer.observe(item);
});

// Add CSS for toast and ripple
const style = document.createElement('style');
style.textContent = `
    .toast {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    }
    
    .toast.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .toast-success {
        border-left: 4px solid #22C55E;
    }
    
    .toast-error {
        border-left: 4px solid #EF4444;
    }
    
    .toast-info {
        border-left: 4px solid #3B82F6;
    }
    
    .toast i {
        font-size: 1.5rem;
    }
    
    .toast-success i { color: #22C55E; }
    .toast-error i { color: #EF4444; }
    .toast-info i { color: #3B82F6; }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(style);

console.log('🍱 Favorites page loaded - Bud Budots!');
