// Section Navigation
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
}

// Sales Filter - drives the sales chart and quick summary numbers
// Determine active filter (custom range, month picker, or preset) and build series
function computeSalesSeriesFromControls() {
  try {
    const start = document.getElementById('customStart')?.value;
    const end = document.getElementById('customEnd')?.value;
    const month = document.getElementById('monthPicker')?.value; // format YYYY-MM
    // If both start and end provided -> custom range (per-day)
    if (start && end) {
      return generateSalesDataForRange(start, end);
    }
    // If month provided -> generate per-day for that month
    if (month) {
      return generateSalesDataForMonth(month);
    }
    // otherwise fallback to preset select
    const preset = document.getElementById('salesFilter')?.value || 'week';
    return generateSalesData(preset);
  } catch (e) {
    console.warn('[computeSalesSeriesFromControls] error', e);
    return generateSalesData('week');
  }
}

function filterSales() {
  const series = computeSalesSeriesFromControls();
  const labels = series.labels;
  const data = series.data;
  const total = data.reduce((s, v) => s + v, 0);
  const earningsEl = document.getElementById('totalEarnings');
  const ordersEl = document.getElementById('orderCount');
  if (earningsEl) earningsEl.textContent = '₱' + Number(total).toLocaleString();
  const ordersData = generateOrdersFromSales(data);
  const totalOrders = ordersData.reduce((s, v) => s + v, 0);
  if (ordersEl) ordersEl.textContent = totalOrders;
  updateSalesChart(labels, data, series.mode || document.getElementById('salesFilter')?.value);
  updateOrdersChart(labels, ordersData);
}

// generate per-day sales between start and end (inclusive). start/end in YYYY-MM-DD
function generateSalesDataForRange(startISO, endISO) {
  const start = new Date(startISO + 'T00:00:00');
  const end = new Date(endISO + 'T00:00:00');
  if (isNaN(start) || isNaN(end) || end < start) {
    return generateSalesData('week');
  }
  const labels = [];
  const data = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const copy = new Date(d);
    labels.push(copy.toISOString().slice(0,10));
    // synthetic but proportional to day-of-week
    const base = 400 + (copy.getDay() === 0 || copy.getDay() === 6 ? -80 : 120);
    data.push(Math.floor(base + Math.random() * 900));
  }
  return { labels, data, mode: 'range' };
}

// generate per-day sales for a month string "YYYY-MM"
function generateSalesDataForMonth(monthStr) {
  const [y, m] = monthStr.split('-').map(Number);
  if (!y || !m) return generateSalesData('year');
  const labels = [];
  const data = [];
  const days = new Date(y, m, 0).getDate();
  for (let day = 1; day <= days; day++) {
    const dd = new Date(y, m - 1, day);
    labels.push(String(day).padStart(2,'0') + ' ' + dd.toLocaleString(undefined, { month: 'short' }));
    data.push(Math.floor(300 + Math.random() * 1200));
  }
  return { labels, data, mode: 'month' };
}

// Chart helpers
let salesChart = null;
let ordersChart = null;
function initSalesChart() {
  const ctx = document.getElementById('salesChart');
  if (!ctx || typeof Chart === 'undefined') return;
  salesChart = new Chart(ctx.getContext('2d'), {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Sales',
        data: [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.12)',
        fill: true,
        tension: 0.3,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { display: true },
        y: { display: true }
      }
    }
  });
}

function updateSalesChart(labels, data, range) {
  if (!salesChart) return;
  salesChart.data.labels = labels;
  salesChart.data.datasets[0].data = data;
  salesChart.update();
}

function initOrdersChart() {
  const ctx = document.getElementById('ordersChart');
  if (!ctx || typeof Chart === 'undefined') return;
  ordersChart = new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Orders',
        data: [],
        backgroundColor: 'rgba(59,130,246,0.7)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { display: true },
        y: { display: true }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function updateOrdersChart(labels, data) {
  if (!ordersChart) return;
  ordersChart.data.labels = labels;
  ordersChart.data.datasets[0].data = data;
  ordersChart.update();
}

function generateSalesData(range) {
  const labels = [];
  const data = [];
  if (range === 'day') {
    for (let h = 0; h < 24; h++) { labels.push(h + ':00'); data.push(Math.floor(50 + Math.random() * 400)); }
  } else if (range === 'week') {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      labels.push(days[d.getDay()]);
      data.push(Math.floor(300 + Math.random() * 1200));
    }
  } else { // year
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    for (let m = 0; m < 12; m++) { labels.push(months[m]); data.push(Math.floor(2000 + Math.random() * 8000)); }
  }
  return { labels, data };
}

function generateOrdersFromSales(salesData) {
  // derive orders roughly from sales amounts
  return salesData.map(v => Math.max(0, Math.round(v / 200)));
}

// Product Management
// Product Management (modal-based)
const productList = document.getElementById('productList');
// edit modal/form may not exist on every page — guard their usage
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');

let editingCard = null; // will hold the card DOM being edited

// Add product
function addProduct(event) {
  event.preventDefault();
  const name = document.getElementById('productName').value.trim();
  const price = document.getElementById('productPrice').value.trim();
  const desc = document.getElementById('productDesc').value.trim();
  const imageFile = document.getElementById('productImage').files[0];

  if (!name || !price || !desc) {
    alert('Please fill required fields.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imgSrc = e.target.result;
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.image = imgSrc;
    card.innerHTML = `
      <img src="${imgSrc}" alt="${escapeHtml(name)}">
      <h3>${escapeHtml(name)}</h3>
      <p class="prod-desc">${escapeHtml(desc)}</p>
      <p><strong class="prod-price">₱${Number(price).toLocaleString()}</strong></p>
      <p><strong>Stocks:</strong> <span class="stock-count">0</span></p>
      <div style="margin-top:10px;display:flex;gap:8px;">
        <button class="btn btn-gold" onclick="openEditModal(this)">Edit</button>
        <button class="btn btn-secondary" onclick="deleteProduct(this)">Delete</button>
      </div>
    `;
    productList.appendChild(card);
  };

  if (imageFile) reader.readAsDataURL(imageFile);
  else {
    // fallback image (if you want)
    const card = document.createElement('div');
    card.className = 'product-card';
    const placeholder = 'https://via.placeholder.com/300x180?text=No+Image';
    card.dataset.image = placeholder;
    card.innerHTML = `
      <img src="${placeholder}" alt="${escapeHtml(name)}">
      <h3>${escapeHtml(name)}</h3>
      <p class="prod-desc">${escapeHtml(desc)}</p>
      <p><strong class="prod-price">₱${Number(price).toLocaleString()}</strong></p>
      <p><strong>Stocks:</strong> <span class="stock-count">0</span></p>
      <div style="margin-top:10px;display:flex;gap:8px;">
        <button class="btn btn-gold" onclick="openEditModal(this)">Edit</button>
        <button class="btn btn-secondary" onclick="deleteProduct(this)">Delete</button>
      </div>
    `;
    productList.appendChild(card);
  }

  event.target.reset();
}

// Open modal and fill fields
function openEditModal(button) {
  // If the edit modal isn't present, avoid throwing and show a simple message.
  if (!editModal || !editForm) {
    const card = button.closest('.product-card');
    const name = card?.querySelector('h3')?.textContent || 'Item';
    alert('Edit UI not available. Item: ' + name);
    return;
  }

  const card = button.closest('.product-card');
  editingCard = card;

  // Fill modal inputs with current values
  const name = card.querySelector('h3').textContent;
  const desc = card.querySelector('.prod-desc').textContent;
  const priceText = card.querySelector('.prod-price').textContent.replace('₱', '').replace(/,/g, '');
  const stock = card.querySelector('.stock-count').textContent || '0';
  const imageSrc = card.dataset.image || card.querySelector('img')?.src || '';

  const editName = document.getElementById('editName');
  const editDesc = document.getElementById('editDesc');
  const editPrice = document.getElementById('editPrice');
  const editStock = document.getElementById('editStock');
  const editImage = document.getElementById('editImage');

  if (editName) editName.value = name;
  if (editDesc) editDesc.value = desc;
  if (editPrice) editPrice.value = priceText;
  if (editStock) editStock.value = stock;
  // clear file input
  if (editImage) editImage.value = '';

  // show modal
  editModal.classList.add('active');
  editModal.setAttribute('aria-hidden', 'false');
  // focus first input for accessibility
  setTimeout(()=> editName && editName.focus(), 120);
}

// Close modal
function closeModal() {
  editModal.classList.remove('active');
  editModal.setAttribute('aria-hidden', 'true');
  editingCard = null;
}

// Save changes from modal (only attach listener if form exists)
if (editForm) {
  editForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!editingCard) {
      closeModal();
      return;
    }

    const newName = document.getElementById('editName').value.trim();
    const newDesc = document.getElementById('editDesc').value.trim();
    const newPrice = document.getElementById('editPrice').value.trim();
    const newStock = document.getElementById('editStock').value.trim();
    const newImageFile = document.getElementById('editImage').files[0];

    if (!newName || !newPrice || newStock === '') {
      alert('Please complete required fields.');
      return;
    }

    if (newImageFile) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        updateProductCard(editingCard, newName, newDesc, newPrice, newStock, ev.target.result);
        closeModal();
      };
      reader.readAsDataURL(newImageFile);
    } else {
      const currentImage = editingCard.dataset.image || editingCard.querySelector('img')?.src || '';
      updateProductCard(editingCard, newName, newDesc, newPrice, newStock, currentImage);
      closeModal();
    }
  });
}

// Update card DOM
function updateProductCard(card, name, desc, price, stock, imageSrc) {
  card.dataset.image = imageSrc;
  card.innerHTML = `
    <img src="${imageSrc}" alt="${escapeHtml(name)}">
    <h3>${escapeHtml(name)}</h3>
    <p class="prod-desc">${escapeHtml(desc)}</p>
    <p><strong class="prod-price">₱${Number(price).toLocaleString()}</strong></p>
    <p><strong>Stocks:</strong> <span class="stock-count">${Number(stock)}</span></p>
    <div style="margin-top:10px;display:flex;gap:8px;">
      <button class="btn btn-gold" onclick="openEditModal(this)">Edit</button>
      <button class="btn btn-secondary" onclick="deleteProduct(this)">Delete</button>
    </div>
  `;
}

// Delete product
function deleteProduct(button) {
  const card = button.closest('.product-card');
  if (!card) return;
  // show modal confirmation instead of native confirm()
  showConfirm('Delete this product?', () => card.remove());
}

// small helper to avoid XSS from inserted strings
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


function openUserModal(username) {
  const modal = document.getElementById("userModal");
  const modalTitle = document.getElementById("modalTitle");
  modalTitle.textContent = `Ban ${username}`;
  modal.style.display = "block";

  const form = document.getElementById("userForm");
  form.onsubmit = (e) => {
    e.preventDefault();
    const reason = document.getElementById("userReason").value;
    document.getElementById("summaryReason").textContent = reason;
    // set the banned username in the summary
    const bannedField = document.getElementById("summaryBanned");
    if (bannedField) bannedField.textContent = username;
    document.getElementById("summaryStart").textContent = new Date().toLocaleDateString();
    document.getElementById("summaryEnd").textContent = "—";
    document.getElementById("summaryStatus").textContent = "Banned";
    // update the user's row in the users table to show status = Banned
    const rows = document.querySelectorAll('#userList table tbody tr');
    rows.forEach(row => {
      const nameCell = row.cells[0];
      if (nameCell && nameCell.textContent.trim() === username) {
        // set status cell
        if (row.cells[1]) row.cells[1].textContent = 'Banned';
        // add a class for possible styling
        row.classList.add('banned');
        // update actions to show Lift button
        const actionCell = row.cells[2];
        if (actionCell) {
          actionCell.innerHTML = `
            <div class="action-buttons">
              <button onclick="liftUser('${escapeHtml(username)}')">Lift</button>
              <button>Edit</button>
            </div>
          `;
        }
      }
    });
    closeUserModal();
  };
}

// Lift a user's ban
function liftUser(username) {
  // Use the modal-based lift flow for a consistent UX
  showLiftModal(username);
}

function closeUserModal() {
  const modal = document.getElementById("userModal");
  modal.style.display = "none";
  document.getElementById("userForm").reset();
}

window.onclick = function (event) {
  const modal = document.getElementById("userModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// --- Enhanced ban handling: maintain bans list, modal-based lift, and edit modal ---
let bans = {};
const BANS_KEY = 'adminBans';
let liftTarget = null;

function loadBans() {
  try { const raw = localStorage.getItem(BANS_KEY); if (raw) bans = JSON.parse(raw); } catch (e) { bans = {}; }
}

function saveBans() { try { localStorage.setItem(BANS_KEY, JSON.stringify(bans)); } catch (e) {} }

function renderBannedList() {
  const list = document.getElementById('bannedList');
  if (!list) return;
  console.log('[renderBannedList] rendering', Object.keys(bans).length, 'bans');
  list.innerHTML = '';
  Object.keys(bans).forEach(username => {
    const info = bans[username];
    const li = document.createElement('li');
    li.className = 'banned-item';
    li.innerHTML = `<span class="banned-name">${escapeHtml(username)}</span> — <span class="banned-reason">${escapeHtml(info.reason||'No reason')}</span>` +
      ` <span class="banned-dates">(${escapeHtml(info.start||'')}${info.end ? ' → '+escapeHtml(info.end) : ''})</span>` +
      ` <span style="float:right"><button onclick="showLiftModal('${escapeHtml(username)}')">Lift</button> <button onclick="openEditUserModal('${escapeHtml(username)}')">Edit</button></span>`;
    list.appendChild(li);
  });
}

function syncTableWithBans() {
  const rows = document.querySelectorAll('#userList table tbody tr');
  rows.forEach(row => {
    const nameCell = row.cells[0];
    if (!nameCell) return;
    const username = nameCell.textContent.trim();
    const actionCell = row.cells[2];
    if (bans[username]) {
      if (row.cells[1]) row.cells[1].textContent = 'Banned';
      row.classList.add('banned');
      if (actionCell) actionCell.innerHTML = `<div class="action-buttons"><button onclick="showLiftModal('${escapeHtml(username)}')">Lift</button><button onclick="openEditUserModal('${escapeHtml(username)}')">Edit</button></div>`;
    } else {
      if (row.cells[1]) row.cells[1].textContent = 'Active';
      row.classList.remove('banned');
      if (actionCell) actionCell.innerHTML = `<div class="action-buttons"><button onclick="openUserModal('${escapeHtml(username)}')">Ban</button><button onclick="openEditUserModal('${escapeHtml(username)}')">Edit</button></div>`;
    }
  });
}

// initialize
loadBans();
renderBannedList();
syncTableWithBans();

// initialize sales + orders charts when DOM available and wire controls
setTimeout(()=>{
  try {
    initSalesChart();
    initOrdersChart();
    // wire filter controls
    const applyBtn = document.getElementById('applyFilterBtn');
    if (applyBtn) applyBtn.addEventListener('click', (e) => { e.preventDefault(); filterSales(); });
    const preset = document.getElementById('salesFilter');
    if (preset) preset.addEventListener('change', () => filterSales());
    // wire confirm modal OK button (if present)
    const confirmOkBtn = document.getElementById('confirmOkBtn');
    if (confirmOkBtn) confirmOkBtn.addEventListener('click', () => confirmModalOk());
    // initial render
    filterSales();
  } catch (e) { console.warn('Chart init failed', e); }
}, 80);

// Replace previous openUserModal, liftUser and closeUserModal behaviors with enhanced ones
function openUserModal(username, mode='ban') {
  const modal = document.getElementById('userModal');
  const title = document.getElementById('modalTitle');
  const modalUsername = document.getElementById('modalUsername');
  const reason = document.getElementById('userReason');
  const banStart = document.getElementById('banStart');
  const banEnd = document.getElementById('banEnd');

  modalUsername.textContent = username;
  title.textContent = (mode === 'edit') ? `Edit Ban: ${username}` : `Ban ${username}`;

  if (bans[username]) {
    reason.value = bans[username].reason || '';
    banStart.value = bans[username].start || '';
    banEnd.value = bans[username].end || '';
  } else {
    reason.value = '';
    banStart.value = new Date().toISOString().slice(0,10);
    banEnd.value = '';
  }

  modal.dataset.username = username;
  modal.dataset.mode = mode;
  modal.style.display = 'block';

  const form = document.getElementById('userForm');
  form.onsubmit = (e) => {
    e.preventDefault();
    const r = reason.value.trim();
    const s = banStart.value || new Date().toISOString().slice(0,10);
    const en = banEnd.value || '';
    bans[username] = { reason: r, start: s, end: en, status: 'Banned' };
    saveBans();
    renderBannedList();
    syncTableWithBans();
    // update summary quick-fields
    document.getElementById('summaryReason').textContent = r || '—';
    document.getElementById('summaryStart').textContent = s || '—';
    document.getElementById('summaryEnd').textContent = en || '—';
    document.getElementById('summaryStatus').textContent = 'Banned';
    closeUserModal();
  };
}

function openEditUserModal(username) { openUserModal(username, 'edit'); }

function closeUserModal() {
  const modal = document.getElementById('userModal');
  modal.style.display = 'none';
  modal.dataset.username = '';
  modal.dataset.mode = '';
  document.getElementById('userForm').reset();
}

function showLiftModal(username) {
  liftTarget = username;
  const liftModal = document.getElementById('liftModal');
  const msg = document.getElementById('liftMessage');
  msg.textContent = `Lift ban for ${username}?`;
  liftModal.style.display = 'block';
}

function closeLiftModal() {
  const liftModal = document.getElementById('liftModal');
  liftModal.style.display = 'none';
  liftTarget = null;
}

function confirmLift() {
  if (!liftTarget) return closeLiftModal();
  const username = liftTarget;
  // remove from bans
  if (bans[username]) delete bans[username];
  saveBans();
  renderBannedList();
  syncTableWithBans();
  // if summary showed this user, clear end/status
  const summaryStatus = document.getElementById('summaryStatus');
  console.log('[confirmLift] lifted', username);
  if (summaryStatus && summaryStatus.textContent === 'Banned') {
    document.getElementById('summaryEnd').textContent = new Date().toLocaleDateString();
    document.getElementById('summaryStatus').textContent = 'Active';
  }
  closeLiftModal();
}

// Generic confirm modal helpers
let _confirmCallback = null;
function showConfirm(message, onConfirm, title) {
  const modal = document.getElementById('confirmModal');
  const msgEl = document.getElementById('confirmMessage');
  const titleEl = document.getElementById('confirmTitle');
  if (!modal || !msgEl) {
    // fallback to native confirm if modal missing
    if (window.confirm(message)) onConfirm && onConfirm();
    return;
  }
  titleEl.textContent = title || 'Confirm';
  msgEl.textContent = message || 'Are you sure?';
  _confirmCallback = onConfirm || null;
  modal.style.display = 'block';
}

function closeConfirmModal() {
  const modal = document.getElementById('confirmModal');
  if (!modal) return;
  modal.style.display = 'none';
  _confirmCallback = null;
}

function confirmModalOk() {
  try { if (_confirmCallback) _confirmCallback(); } catch(e){ console.warn('confirm callback error', e); }
  closeConfirmModal();
}

// wire lift confirm button reliably
(() => {
  const btn = document.getElementById('liftConfirmBtn');
  if (!btn) return; // nothing to wire
  // use addEventListener to avoid overwriting other handlers
  btn.addEventListener('click', confirmLift);
})();



// Logout
function logout() {
  // Redirect directly to the admin login page
  window.location.href = 'admin_login.html';
}
