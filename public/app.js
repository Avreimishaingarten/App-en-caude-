// ===== Navigation =====
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('screen-' + btn.dataset.screen).classList.add('active');
    });
});

// Estudio sub-tabs
document.querySelectorAll('.estudio-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.estudio-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.subtab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('subtab-' + tab.dataset.subtab).classList.add('active');
    });
});

// Raíz sub-tabs
document.querySelectorAll('.raiz-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.raiz-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.raztab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('raztab-' + tab.dataset.raztab).classList.add('active');
    });
});

// Filter tags
document.querySelectorAll('.filter-tags .tag').forEach(tag => {
    tag.addEventListener('click', () => {
        document.querySelectorAll('.filter-tags .tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        loadPosts(tag.textContent === 'Todos' ? '' : tag.textContent);
    });
});

// ===== API Helpers =====
const API = '';

async function api(endpoint, options = {}) {
    const res = await fetch(API + endpoint, options);
    return res.json();
}

// ===== Load Data =====
async function loadPosts(filter = '') {
    const posts = await api('/api/posts');
    const container = document.getElementById('forum-posts');
    const filtered = filter ? posts.filter(p => p.category === filter) : posts;

    container.innerHTML = filtered.map(post => `
        <div class="post-card">
            <div class="post-author-row">
                <div class="post-avatar">${getInitials(post.author)}</div>
                <div class="post-author-info">
                    <div class="post-author-name">${escapeHtml(post.author)}</div>
                    <div class="post-author-handle">${timeAgo(post.createdAt)}</div>
                </div>
            </div>
            ${post.category ? `<span class="post-category-badge">${escapeHtml(post.category)}</span>` : ''}
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <p class="post-excerpt">${escapeHtml(post.content)}</p>
            ${post.image ? `<img src="${post.image}" class="post-image" alt="">` : ''}
            <div class="post-footer">
                <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    ${post.comments} comentarios
                </span>
                <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    ${post.likes}
                </span>
            </div>
        </div>
    `).join('');
}

async function loadCohorts() {
    const cohorts = await api('/api/cohorts');
    const container = document.getElementById('cohorts-list');

    container.innerHTML = cohorts.map(c => `
        <div class="cohort-card">
            <span class="cohort-category" style="background:${c.categoryColor || '#C44536'}">${escapeHtml(c.category)}</span>
            <h3 class="cohort-title">${escapeHtml(c.title)}</h3>
            <div class="cohort-dates">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                ${escapeHtml(c.dates)}
            </div>
            <div class="cohort-footer">
                <span class="cohort-joined">${c.joined}/${c.total} joined</span>
                <button class="join-btn">JOIN</button>
            </div>
        </div>
    `).join('');
}

async function loadStudies() {
    const studies = await api('/api/studies');
    const container = document.getElementById('my-studies');

    container.innerHTML = studies.map(s => `
        <div class="study-card">
            <div class="study-progress-circle" style="--progress: ${s.progress * 3.6}deg">
                <div class="study-progress-inner">${s.progress}%</div>
            </div>
            <div class="study-info">
                <div class="study-title">${escapeHtml(s.title)}</div>
                <div class="study-next">${escapeHtml(s.nextSession)}</div>
                <button class="continue-btn">CONTINUE STUDY</button>
            </div>
        </div>
    `).join('');
}

async function loadChronicles() {
    const chronicles = await api('/api/chronicles');
    const featured = chronicles.find(c => c.featured);
    const rest = chronicles.filter(c => !c.featured);

    // Featured
    const featuredContainer = document.getElementById('featured-chronicle');
    if (featured) {
        featuredContainer.innerHTML = `
            ${featured.image ? `<img src="${featured.image}" class="featured-bg" alt="">` : '<div class="featured-bg" style="background:var(--navy-dark);"></div>'}
            <div class="featured-overlay">
                <span class="featured-tag">${escapeHtml(featured.category)}</span>
                <h2 class="featured-title">${escapeHtml(featured.title)}</h2>
                <p class="featured-subtitle">${escapeHtml(featured.subtitle)}</p>
                <div class="featured-actions">
                    <button class="read-btn">Read Narrative</button>
                    <span class="featured-meta">${escapeHtml(featured.readTime)}</span>
                </div>
            </div>
        `;
    }

    // List
    const listContainer = document.getElementById('chronicles-list');
    listContainer.innerHTML = rest.map(c => `
        <div class="chronicle-card">
            <div class="chronicle-img">
                ${c.image ? `<img src="${c.image}" alt="">` : ''}
            </div>
            <div class="chronicle-info">
                <h4 class="chronicle-title">${escapeHtml(c.title)}</h4>
                <p class="chronicle-excerpt">${escapeHtml(c.subtitle)}</p>
                <div class="chronicle-meta">
                    <span>${c.date}</span>
                    <span class="chronicle-category-tag">${escapeHtml(c.category)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

async function loadProfile() {
    const profile = await api('/api/profile');
    if (profile.name) {
        document.getElementById('profile-name').textContent = profile.name;
        document.getElementById('profile-location').textContent = profile.location || '';
        document.getElementById('profile-avatar').textContent = getInitials(profile.name);
        document.getElementById('stat-discussions').textContent = profile.discussions || 0;
        document.getElementById('stat-cohorts').textContent = profile.cohorts || 0;
        document.getElementById('stat-historias').textContent = profile.historias || 0;
    }
}

// ===== New Post =====
function showNewPostModal() {
    document.getElementById('modal-new-post').classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

async function submitNewPost(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', document.getElementById('new-post-title').value);
    formData.append('content', document.getElementById('new-post-content').value);
    formData.append('category', document.getElementById('new-post-category').value);
    formData.append('author', 'Aviva');

    const imageFile = document.getElementById('new-post-image').files[0];
    if (imageFile) formData.append('image', imageFile);

    await fetch('/api/posts', { method: 'POST', body: formData });
    document.getElementById('form-new-post').reset();
    closeModal('modal-new-post');
    loadPosts();
}

// ===== Helpers =====
function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `hace ${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `hace ${hours}h`;
    const days = Math.floor(hours / 24);
    return `hace ${days}d`;
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    loadCohorts();
    loadStudies();
    loadChronicles();
    loadProfile();
});
