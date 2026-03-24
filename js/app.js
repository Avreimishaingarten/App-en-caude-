// ===== State =====
let trips = [];
let currentTripId = null;

const CATEGORY_ICONS = {
    sightseeing: '🏛️',
    food: '🍽️',
    transport: '✈️',
    hotel: '🏨',
    adventure: '🏔️',
    shopping: '🛍️',
    other: '📌'
};

const EXPENSE_ICONS = {
    accommodation: '🏨',
    transport: '✈️',
    food: '🍽️',
    activities: '🎟️',
    shopping: '🛍️',
    other: '💰'
};

const EXPENSE_LABELS = {
    accommodation: 'Hospedaje',
    transport: 'Transporte',
    food: 'Comida',
    activities: 'Actividades',
    shopping: 'Compras',
    other: 'Otro'
};

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderTripList();
    setupTabs();
    setupNotesAutoSave();

    document.getElementById('btn-new-trip').addEventListener('click', openNewTripModal);
});

// ===== Data persistence =====
function loadData() {
    const data = localStorage.getItem('viajaplan_trips');
    if (data) {
        trips = JSON.parse(data);
    }
}

function saveData() {
    localStorage.setItem('viajaplan_trips', JSON.stringify(trips));
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ===== Trip List =====
function renderTripList() {
    const list = document.getElementById('trip-list');
    list.innerHTML = '';

    if (trips.length === 0) {
        showScreen('welcome-screen');
        return;
    }

    trips.forEach(trip => {
        const item = document.createElement('div');
        item.className = `trip-list-item${trip.id === currentTripId ? ' active' : ''}`;
        item.onclick = () => selectTrip(trip.id);
        item.innerHTML = `
            <span class="trip-list-item-icon">&#9992;</span>
            <div class="trip-list-item-info">
                <div class="trip-list-item-name">${escapeHtml(trip.name)}</div>
                <div class="trip-list-item-dest">${escapeHtml(trip.destination)}</div>
            </div>
        `;
        list.appendChild(item);
    });
}

function selectTrip(id) {
    currentTripId = id;
    renderTripList();
    renderTripDetail();
    showScreen('trip-detail-screen');
}

// ===== Screens =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// ===== Tabs =====
function setupTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
        });
    });
}

// ===== Trip CRUD =====
function openNewTripModal() {
    document.getElementById('modal-trip-title').textContent = 'Nuevo Viaje';
    document.getElementById('form-trip').reset();
    document.getElementById('trip-edit-id').value = '';
    openModal('modal-trip');
}

function editCurrentTrip() {
    const trip = getCurrentTrip();
    if (!trip) return;
    document.getElementById('modal-trip-title').textContent = 'Editar Viaje';
    document.getElementById('trip-name').value = trip.name;
    document.getElementById('trip-destination').value = trip.destination;
    document.getElementById('trip-start').value = trip.startDate;
    document.getElementById('trip-end').value = trip.endDate;
    document.getElementById('trip-budget').value = trip.budget || '';
    document.getElementById('trip-edit-id').value = trip.id;
    openModal('modal-trip');
}

function saveTrip(e) {
    e.preventDefault();
    const editId = document.getElementById('trip-edit-id').value;
    const tripData = {
        name: document.getElementById('trip-name').value.trim(),
        destination: document.getElementById('trip-destination').value.trim(),
        startDate: document.getElementById('trip-start').value,
        endDate: document.getElementById('trip-end').value,
        budget: parseFloat(document.getElementById('trip-budget').value) || 0
    };

    if (editId) {
        const trip = trips.find(t => t.id === editId);
        if (trip) Object.assign(trip, tripData);
    } else {
        const newTrip = {
            id: generateId(),
            ...tripData,
            activities: [],
            expenses: [],
            packingList: [],
            notes: ''
        };
        trips.push(newTrip);
        currentTripId = newTrip.id;
    }

    saveData();
    renderTripList();
    if (currentTripId) {
        renderTripDetail();
        showScreen('trip-detail-screen');
    }
    closeModal('modal-trip');
}

function deleteCurrentTrip() {
    if (!confirm('¿Estás seguro de que quieres eliminar este viaje?')) return;
    trips = trips.filter(t => t.id !== currentTripId);
    currentTripId = null;
    saveData();
    renderTripList();
    showScreen('welcome-screen');
}

function getCurrentTrip() {
    return trips.find(t => t.id === currentTripId);
}

// ===== Trip Detail =====
function renderTripDetail() {
    const trip = getCurrentTrip();
    if (!trip) return;

    document.getElementById('trip-title').textContent = `${trip.name} — ${trip.destination}`;
    document.getElementById('trip-dates').textContent = formatDateRange(trip.startDate, trip.endDate);

    renderItinerary(trip);
    renderBudget(trip);
    renderPackingList(trip);
    document.getElementById('trip-notes').value = trip.notes || '';
}

// ===== Itinerary =====
function renderItinerary(trip) {
    const timeline = document.getElementById('itinerary-timeline');
    const emptyState = document.getElementById('itinerary-empty');

    if (!trip.activities || trip.activities.length === 0) {
        timeline.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    timeline.style.display = 'block';
    emptyState.style.display = 'none';

    // Group by date
    const grouped = {};
    const sorted = [...trip.activities].sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return (a.time || '').localeCompare(b.time || '');
    });

    sorted.forEach(act => {
        const key = act.date;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(act);
    });

    timeline.innerHTML = '';
    Object.entries(grouped).forEach(([date, activities]) => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'timeline-day';
        dayDiv.innerHTML = `<div class="timeline-day-header">${formatDateLong(date)}</div>`;

        activities.forEach(act => {
            const card = document.createElement('div');
            card.className = 'activity-card';
            card.innerHTML = `
                <span class="activity-time">${act.time || '--:--'}</span>
                <span class="activity-icon">${CATEGORY_ICONS[act.category] || '📌'}</span>
                <div class="activity-info">
                    <div class="activity-title">${escapeHtml(act.title)}</div>
                    ${act.location ? `<div class="activity-location">📍 ${escapeHtml(act.location)}</div>` : ''}
                    ${act.notes ? `<div class="activity-notes-text">${escapeHtml(act.notes)}</div>` : ''}
                </div>
                <div class="activity-actions">
                    <button onclick="editActivity('${act.id}')" title="Editar">&#9998;</button>
                    <button class="delete-btn" onclick="deleteActivity('${act.id}')" title="Eliminar">&#10005;</button>
                </div>
            `;
            dayDiv.appendChild(card);
        });

        timeline.appendChild(dayDiv);
    });
}

function openActivityModal(editId) {
    document.getElementById('form-activity').reset();
    document.getElementById('activity-edit-id').value = '';

    const trip = getCurrentTrip();
    if (trip && trip.startDate) {
        document.getElementById('activity-date').value = trip.startDate;
    }

    openModal('modal-activity');
}

function editActivity(id) {
    const trip = getCurrentTrip();
    const act = trip.activities.find(a => a.id === id);
    if (!act) return;

    document.getElementById('activity-title').value = act.title;
    document.getElementById('activity-date').value = act.date;
    document.getElementById('activity-time').value = act.time || '';
    document.getElementById('activity-category').value = act.category || 'other';
    document.getElementById('activity-location').value = act.location || '';
    document.getElementById('activity-notes').value = act.notes || '';
    document.getElementById('activity-edit-id').value = act.id;

    openModal('modal-activity');
}

function saveActivity(e) {
    e.preventDefault();
    const trip = getCurrentTrip();
    if (!trip) return;

    const editId = document.getElementById('activity-edit-id').value;
    const data = {
        title: document.getElementById('activity-title').value.trim(),
        date: document.getElementById('activity-date').value,
        time: document.getElementById('activity-time').value,
        category: document.getElementById('activity-category').value,
        location: document.getElementById('activity-location').value.trim(),
        notes: document.getElementById('activity-notes').value.trim()
    };

    if (editId) {
        const act = trip.activities.find(a => a.id === editId);
        if (act) Object.assign(act, data);
    } else {
        if (!trip.activities) trip.activities = [];
        trip.activities.push({ id: generateId(), ...data });
    }

    saveData();
    renderTripDetail();
    closeModal('modal-activity');
}

function deleteActivity(id) {
    const trip = getCurrentTrip();
    if (!trip) return;
    trip.activities = trip.activities.filter(a => a.id !== id);
    saveData();
    renderTripDetail();
}

// ===== Budget & Expenses =====
function renderBudget(trip) {
    const budget = trip.budget || 0;
    const spent = (trip.expenses || []).reduce((sum, e) => sum + e.amount, 0);
    const remaining = budget - spent;

    document.getElementById('budget-total').textContent = formatCurrency(budget);
    document.getElementById('budget-spent').textContent = formatCurrency(spent);
    document.getElementById('budget-remaining').textContent = formatCurrency(remaining);

    const bar = document.getElementById('budget-bar');
    const percent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
    bar.style.width = percent + '%';
    bar.className = 'budget-bar';
    if (percent > 90) bar.classList.add('danger');
    else if (percent > 70) bar.classList.add('warning');

    const list = document.getElementById('expenses-list');
    const emptyState = document.getElementById('expenses-empty');

    if (!trip.expenses || trip.expenses.length === 0) {
        list.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    list.style.display = 'flex';
    emptyState.style.display = 'none';
    list.innerHTML = '';

    const sorted = [...trip.expenses].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    sorted.forEach(exp => {
        const card = document.createElement('div');
        card.className = 'expense-card';
        card.innerHTML = `
            <span class="expense-icon">${EXPENSE_ICONS[exp.category] || '💰'}</span>
            <div class="expense-info">
                <div class="expense-description">${escapeHtml(exp.description)}</div>
                <div class="expense-meta">${EXPENSE_LABELS[exp.category] || 'Otro'}${exp.date ? ' · ' + formatDateShort(exp.date) : ''}</div>
            </div>
            <span class="expense-amount">-${formatCurrency(exp.amount)}</span>
            <div class="expense-actions">
                <button onclick="editExpense('${exp.id}')" title="Editar">&#9998;</button>
                <button class="delete-btn" onclick="deleteExpense('${exp.id}')" title="Eliminar">&#10005;</button>
            </div>
        `;
        list.appendChild(card);
    });
}

function openExpenseModal() {
    document.getElementById('form-expense').reset();
    document.getElementById('expense-edit-id').value = '';
    openModal('modal-expense');
}

function editExpense(id) {
    const trip = getCurrentTrip();
    const exp = trip.expenses.find(e => e.id === id);
    if (!exp) return;

    document.getElementById('expense-description').value = exp.description;
    document.getElementById('expense-amount').value = exp.amount;
    document.getElementById('expense-category').value = exp.category;
    document.getElementById('expense-date').value = exp.date || '';
    document.getElementById('expense-edit-id').value = exp.id;

    openModal('modal-expense');
}

function saveExpense(e) {
    e.preventDefault();
    const trip = getCurrentTrip();
    if (!trip) return;

    const editId = document.getElementById('expense-edit-id').value;
    const data = {
        description: document.getElementById('expense-description').value.trim(),
        amount: parseFloat(document.getElementById('expense-amount').value) || 0,
        category: document.getElementById('expense-category').value,
        date: document.getElementById('expense-date').value
    };

    if (editId) {
        const exp = trip.expenses.find(e => e.id === editId);
        if (exp) Object.assign(exp, data);
    } else {
        if (!trip.expenses) trip.expenses = [];
        trip.expenses.push({ id: generateId(), ...data });
    }

    saveData();
    renderTripDetail();
    closeModal('modal-expense');
}

function deleteExpense(id) {
    const trip = getCurrentTrip();
    if (!trip) return;
    trip.expenses = trip.expenses.filter(e => e.id !== id);
    saveData();
    renderTripDetail();
}

// ===== Packing List =====
function renderPackingList(trip) {
    const list = document.getElementById('packing-list');
    const emptyState = document.getElementById('packing-empty');

    if (!trip.packingList || trip.packingList.length === 0) {
        list.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    list.style.display = 'flex';
    emptyState.style.display = 'none';
    list.innerHTML = '';

    trip.packingList.forEach(item => {
        const div = document.createElement('div');
        div.className = 'packing-item';
        div.innerHTML = `
            <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="togglePackingItem('${item.id}')">
            <span class="packing-item-text ${item.checked ? 'checked' : ''}">${escapeHtml(item.text)}</span>
            <button onclick="deletePackingItem('${item.id}')" title="Eliminar">&times;</button>
        `;
        list.appendChild(div);
    });
}

function addPackingItem() {
    const input = document.getElementById('packing-item-input');
    const text = input.value.trim();
    if (!text) return;

    const trip = getCurrentTrip();
    if (!trip) return;

    if (!trip.packingList) trip.packingList = [];
    trip.packingList.push({ id: generateId(), text, checked: false });

    input.value = '';
    saveData();
    renderPackingList(trip);
}

function togglePackingItem(id) {
    const trip = getCurrentTrip();
    if (!trip) return;
    const item = trip.packingList.find(i => i.id === id);
    if (item) item.checked = !item.checked;
    saveData();
    renderPackingList(trip);
}

function deletePackingItem(id) {
    const trip = getCurrentTrip();
    if (!trip) return;
    trip.packingList = trip.packingList.filter(i => i.id !== id);
    saveData();
    renderPackingList(trip);
}

// ===== Notes Auto-save =====
function setupNotesAutoSave() {
    let timeout;
    document.getElementById('trip-notes').addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const trip = getCurrentTrip();
            if (trip) {
                trip.notes = e.target.value;
                saveData();
            }
        }, 500);
    });
}

// ===== Modal Helpers =====
function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// ===== Formatting Helpers =====
function formatDateRange(start, end) {
    if (!start || !end) return '';
    const opts = { day: 'numeric', month: 'long', year: 'numeric' };
    const s = new Date(start + 'T00:00:00').toLocaleDateString('es-ES', opts);
    const e = new Date(end + 'T00:00:00').toLocaleDateString('es-ES', opts);
    return `${s} — ${e}`;
}

function formatDateLong(dateStr) {
    if (!dateStr) return '';
    const opts = { weekday: 'long', day: 'numeric', month: 'long' };
    const d = new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', opts);
    return d.charAt(0).toUpperCase() + d.slice(1);
}

function formatDateShort(dateStr) {
    if (!dateStr) return '';
    const opts = { day: 'numeric', month: 'short' };
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', opts);
}

function formatCurrency(amount) {
    return '$' + amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
