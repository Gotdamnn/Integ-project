// Admin login JS: toggle password, remember username, notification, and redirect on success
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('adminLoginForm');
  const usernameEl = document.getElementById('adminUsername');
  const passwordEl = document.getElementById('adminPassword');
  const rememberEl = document.getElementById('adminRememberMe');
  const toggleBtn = document.querySelector('.toggle-password');
  const notification = document.getElementById('notification');
  const notifIcon = document.getElementById('notificationIcon');
  const notifTitle = document.getElementById('notificationTitle');
  const notifMessage = document.getElementById('notificationMessage');

  // Pre-fill username if remembered
  try {
    const saved = localStorage.getItem('adminUsername');
    if (saved) usernameEl.value = saved; rememberEl.checked = true;
  } catch(e){/* ignore */}

  // toggle password visibility
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const type = passwordEl.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordEl.setAttribute('type', type);
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = (type === 'text') ? 'fas fa-eye-slash' : 'fas fa-eye';
    });
  }

  function showNotification({title = 'Success', message = '', success = true, timeout = 2500} = {}){
    if (!notification) return;
    // set content
    notifTitle.textContent = title;
    notifMessage.textContent = message;
    if (success) {
      notifIcon.className = 'notification-icon';
      notifIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
    } else {
      notifIcon.className = 'notification-icon error';
      notifIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    }
    notification.classList.add('show');
    // hide after timeout
    setTimeout(()=>notification.classList.remove('show'), timeout);
  }

  // simple client-side auth (replace with server-side check in production)
  function authenticate(username, password){
    // default demo credential: admin / admin123
    // you can change or wire this to an API
    if (!username || !password) return false;
    if (username.toLowerCase() === 'admin' && password === 'admin123') return true;
    // optionally accept any user who has 'admin' in username
    if (username.toLowerCase().includes('admin')) return true;
    return false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameEl.value.trim();
    const password = passwordEl.value;
    const remember = rememberEl.checked;

    if (authenticate(username, password)){
      // save username if requested
      try { if (remember) localStorage.setItem('adminUsername', username); else localStorage.removeItem('adminUsername'); } catch(e){}
      showNotification({title:'Welcome', message:'Redirecting to admin dashboard…', success:true, timeout:1400});
      setTimeout(()=>{
        // redirect to dashboard (assumes dashboard.html is in the same folder)
        window.location.href = 'dashboard.html';
      }, 900);
    } else {
      showNotification({title:'Sign in failed', message:'Invalid credentials. Try admin / admin123', success:false, timeout:3000});
      // small shake animation
      const card = document.querySelector('.login-card');
      if (card){
        card.animate([
          { transform: 'translateX(0)' },
          { transform: 'translateX(-8px)' },
          { transform: 'translateX(8px)' },
          { transform: 'translateX(0)' }
        ], { duration: 300, easing: 'ease' });
      }
    }
  });
});