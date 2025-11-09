// cart.js - handles item selection, quantity, subtotal and checkout flow
document.addEventListener('DOMContentLoaded', function () {
	const selectAll = document.getElementById('select-all');
	const itemChecks = () => Array.from(document.querySelectorAll('.item-check'));
	const qtyInputs = () => Array.from(document.querySelectorAll('.qty-input'));
	const checkoutBtn = document.getElementById('checkout-btn');
	const summarySubtotal = document.getElementById('summary-subtotal');
	const summaryCount = document.getElementById('summary-count');
	const summaryTotal = document.getElementById('summary-total');
	const checkoutCount = document.getElementById('checkout-count');
	const deleteSelected = document.getElementById('delete-selected');

	function parsePrice(el) {
		return Number(el.getAttribute('data-price') || el.textContent.replace(/,/g, '')) || 0;
	}

	function formatCurrency(n) {
		return Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	}

	function recalc() {
		const rows = Array.from(document.querySelectorAll('.cart-row'));
		let subtotal = 0;
		let count = 0;
		rows.forEach(row => {
			const checked = row.querySelector('.item-check').checked;
			const price = parseFloat(row.querySelector('.price').getAttribute('data-price')) || 0;
			const qty = Math.max(1, Number(row.querySelector('.qty-input').value) || 1);
			if (checked) {
				subtotal += price * qty;
				count += qty;
			}
		});

		summarySubtotal.textContent = formatCurrency(subtotal);
		summaryCount.textContent = count;
		summaryTotal.textContent = formatCurrency(subtotal);
		checkoutCount.textContent = count;
	}

	// Select all logic
	selectAll.addEventListener('change', function () {
		const checked = this.checked;
		itemChecks().forEach(i => i.checked = checked);
		recalc();
	});

	// item check change -> update selectAll if needed
	itemChecks().forEach(ic => {
		ic.addEventListener('change', function () {
			const all = itemChecks();
			selectAll.checked = all.length && all.every(i => i.checked);
			recalc();
		});
	});

	// quantity buttons
	document.querySelectorAll('.qty-inc').forEach(btn => {
		btn.addEventListener('click', function () {
			const input = this.parentElement.querySelector('.qty-input');
			input.value = Math.max(1, Number(input.value || 0) + 1);
			recalc();
		});
	});

	document.querySelectorAll('.qty-dec').forEach(btn => {
		btn.addEventListener('click', function () {
			const input = this.parentElement.querySelector('.qty-input');
			input.value = Math.max(1, Number(input.value || 0) - 1);
			recalc();
		});
	});

	qtyInputs().forEach(input => {
		input.addEventListener('change', function () {
			if (this.value === '' || Number(this.value) < 1) this.value = 1;
			recalc();
		});
	});

	// dialog modal elements & helpers (replace native alert/confirm)
	const dialogModal = document.getElementById('dialog-modal');
	const dialogMessage = document.getElementById('dialog-message');
	const dialogOk = document.getElementById('dialog-ok');
	const dialogCancel = document.getElementById('dialog-cancel');

	function openDialog(text, showCancel = false) {
		dialogMessage.textContent = text;
		dialogCancel.style.display = showCancel ? 'inline-flex' : 'none';
		dialogModal.setAttribute('aria-hidden', 'false');
		dialogModal.style.display = 'flex';
	}

	function closeDialog() {
		dialogModal.setAttribute('aria-hidden', 'true');
		dialogModal.style.display = 'none';
	}

	function showAlert(message) {
		return new Promise(resolve => {
			openDialog(message, false);
			function okHandler() {
				dialogOk.removeEventListener('click', okHandler);
				closeDialog();
				resolve();
			}
			dialogOk.addEventListener('click', okHandler);
		});
	}

	function showConfirm(message) {
		return new Promise(resolve => {
			openDialog(message, true);
			function okHandler() {
				cleanup();
				resolve(true);
			}
			function cancelHandler() {
				cleanup();
				resolve(false);
			}
			function cleanup() {
				dialogOk.removeEventListener('click', okHandler);
				dialogCancel.removeEventListener('click', cancelHandler);
				closeDialog();
			}
			dialogOk.addEventListener('click', okHandler);
			dialogCancel.addEventListener('click', cancelHandler);
		});
	}

	// delete selected
	deleteSelected.addEventListener('click', async function () {
		const rows = Array.from(document.querySelectorAll('.cart-row'));
		let removed = 0;
		rows.forEach(r => {
			if (r.querySelector('.item-check').checked) {
				r.remove();
				removed++;
			}
		});
		if (removed) {
			recalc();
			await showAlert(removed + ' item(s) removed from cart.');
		} else {
			await showAlert('No items selected to delete.');
		}
	});

	// Checkout flow
	checkoutBtn.addEventListener('click', async function () {
		const rows = Array.from(document.querySelectorAll('.cart-row'));
		const selected = rows.filter(r => r.querySelector('.item-check').checked);
		if (selected.length === 0) {
			await showAlert('Please select at least one item to proceed to checkout.');
			return;
		}

		const payment = document.querySelector('input[name="payment"]:checked').value;
		let total = 0;
		let itemLines = [];
		// prepare item details array so we can both show confirm and build receipt later
		const selectedDetails = selected.map(r => {
			const title = r.querySelector('.title').textContent.trim();
			const price = Number(r.querySelector('.price').getAttribute('data-price')) || 0;
			const qty = Number(r.querySelector('.qty-input').value) || 1;
			const lineTotal = price * qty;
			total += lineTotal;
			itemLines.push(`${title} x${qty} (₱${formatCurrency(lineTotal)})`);
			return { title, price, qty, lineTotal };
		});

		const confirmMsg = `Proceed to checkout with ${selected.length} item(s)\n\n${itemLines.join('\n')}\n\nTotal: ₱${formatCurrency(total)}\nPayment: ${payment === 'cash' ? 'Cash (counter)' : 'GCash (QR only)'}\n\nConfirm?`;
		const ok = await showConfirm(confirmMsg);
		if (!ok) return;

		// store last checkout so the payment handlers can access the items for receipt
		lastCheckout = {
			payment,
			total,
			items: selectedDetails
		};

		if (payment === 'gcash') {
			// show modal with QR
			const modal = document.getElementById('gcash-modal');
			modal.setAttribute('aria-hidden', 'false');
			modal.style.display = 'flex';
		} else {
			// cash counter flow: notify and show receipt
			await showAlert('Please pay at the store counter when picking up your order.\nThank you!');
			showReceipt(lastCheckout);
		}
	});

	// Modal handling
	document.getElementById('close-modal').addEventListener('click', function () {
		const modal = document.getElementById('gcash-modal');
		modal.setAttribute('aria-hidden', 'true');
		modal.style.display = 'none';
	});
	document.getElementById('gcash-confirm').addEventListener('click', async function () {
		// In a real app you'd verify the payment server-side. Here we simply close modal and show success.
		const modal = document.getElementById('gcash-modal');
		modal.setAttribute('aria-hidden', 'true');
		modal.style.display = 'none';
		await showAlert('Thank you! Your GCash payment was received (simulated). Your order is confirmed.');
		// show receipt for the last checkout
		if (lastCheckout) {
			showReceipt(Object.assign({}, lastCheckout, { payment: 'gcash' }));
		}
	});

	// keep last checkout data accessible to handlers
	let lastCheckout = null;

	// Receipt modal helpers
	function generateOrderNumber() {
		const d = new Date();
		return 'ORD' + d.getFullYear().toString().slice(-2) + ('0'+(d.getMonth()+1)).slice(-2) + ('0'+d.getDate()).slice(-2) + '-' + Math.random().toString(36).substr(2,6).toUpperCase();
	}

	function generateReference() {
		return 'REF' + Math.floor(100000 + Math.random() * 900000);
	}

	function showReceipt(checkout) {
		// checkout: { payment, total, items: [{title,price,qty,lineTotal}] }
		const orderNum = generateOrderNumber();
		const ref = generateReference();
		const dt = new Date().toLocaleString();
		const cashier = (document.querySelector('.guest-name') && document.querySelector('.guest-name').textContent.trim()) || 'Cashier';

		document.getElementById('receipt-order-number').textContent = orderNum;
		document.getElementById('receipt-payment').textContent = checkout.payment === 'gcash' ? 'GCash (QR)' : 'Cash (counter)';
		document.getElementById('receipt-datetime').textContent = dt;
		document.getElementById('receipt-cashier').textContent = cashier;
		document.getElementById('receipt-ref').textContent = ref;
		document.getElementById('receipt-total').textContent = formatCurrency(checkout.total);

		const tbody = document.getElementById('receipt-items-body');
		tbody.innerHTML = '';
		checkout.items.forEach(it => {
			const tr = document.createElement('tr');
			const tdName = document.createElement('td'); tdName.textContent = it.title;
			const tdQty = document.createElement('td'); tdQty.textContent = it.qty;
			const tdPrice = document.createElement('td'); tdPrice.className = 'align-right'; tdPrice.textContent = '₱' + formatCurrency(it.lineTotal);
			tr.appendChild(tdName); tr.appendChild(tdQty); tr.appendChild(tdPrice);
			tbody.appendChild(tr);
		});

		openReceiptModal();
	}

	function openReceiptModal() {
		document.getElementById('receipt-modal').setAttribute('aria-hidden', 'false');
		document.getElementById('receipt-modal').style.display = 'flex';
	}

	function closeReceiptModal() {
		document.getElementById('receipt-modal').setAttribute('aria-hidden', 'true');
		document.getElementById('receipt-modal').style.display = 'none';
	}

	document.getElementById('receipt-close').addEventListener('click', closeReceiptModal);
	document.getElementById('receipt-done').addEventListener('click', closeReceiptModal);
	document.getElementById('receipt-print').addEventListener('click', function () {
		// open a print-friendly window with only the receipt body
		const body = document.getElementById('receipt-body').innerHTML;
		const w = window.open('', '_blank');
		w.document.write('<html><head><title>Receipt</title>');
		w.document.write('<style>body{font-family:system-ui,Segoe UI,Roboto,Arial;margin:20px;} table{width:100%;border-collapse:collapse;} td,th{padding:6px 8px;} .align-right{text-align:right;} .receipt-actions{display:flex;gap:0.5rem;justify-content:center;margin-top:1rem;} .btn{display:inline-block;padding:6px 12px;border-radius:8px;text-decoration:none;font-weight:700;} .btn-primary{background:#3338A0;color:#fff;border:none;} .btn-secondary{background:#FCC61D;color:#fff;border:none;} @media print{ .receipt-actions{display:none;} }</style>');
		w.document.write('</head><body>');
		w.document.write(body);
		w.document.write('</body></html>');
		w.document.close();
		w.focus();
		setTimeout(() => {
			w.print();
			// close the receipt modal in the main window after initiating print
			try { closeReceiptModal(); } catch (e) { /* ignore if not available */ }
		}, 250);
	});

	// initial calc
	recalc();

	// Mobile hamburger / sidebar menu toggling
	(function setupMobileMenu() {
		const hamburger = document.querySelector('.hamburger');
		const navMenu = document.querySelector('.nav-menu');
		if (!hamburger || !navMenu) return;

		hamburger.addEventListener('click', function (e) {
			e.stopPropagation();
			navMenu.classList.toggle('active');
		});

		// Close sidebar when a link inside it is clicked (useful for navigation)
		navMenu.querySelectorAll('a').forEach(a => {
			a.addEventListener('click', () => navMenu.classList.remove('active'));
		});

		// Click outside closes the menu
		document.addEventListener('click', function (e) {
			if (!navMenu.classList.contains('active')) return;
			if (!e.target.closest('.nav-menu') && !e.target.closest('.hamburger')) {
				navMenu.classList.remove('active');
			}
		});

		// ESC to close
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && navMenu.classList.contains('active')) {
				navMenu.classList.remove('active');
			}
		});
	})();
});

