// ===== Default Data (used when no backend is available) =====
const DEFAULT_POSTS = [
    {
        id: '1', author: 'Samuel Benzaquen', avatar: '', category: 'Gastronomía',
        title: 'El secreto del Boreka perfecto: Memorias de Rodas en mi cocina.',
        content: 'Mi abuela siempre decía que la masa debe ser tan fina como un suspiro. Hoy comparto el proceso que mi familia ha...',
        comments: 42, likes: 138, image: '', createdAt: new Date().toISOString()
    },
    {
        id: '2', author: 'Luna Levy', avatar: '', category: 'Genealogía',
        title: '¿Alguien más está trazando su linaje hasta Salónica?',
        content: 'He encontrado algunos registros en el archivo digital que podrían interesarles...',
        comments: 0, likes: 0, image: '', createdAt: new Date().toISOString()
    },
    {
        id: '3', author: 'Isaac Cohen', avatar: '', category: 'Cultura',
        title: 'Preservando el Ladino: Mis frases favoritas de la infancia.',
        content: '"Ken komiyo, muchos anios bivió". ¿Qué proverbios escuchaban en sus casas?',
        comments: 0, likes: 0, image: '', createdAt: new Date().toISOString()
    },
    {
        id: '4', author: 'Sarah M.', avatar: '', category: '',
        title: 'Buscando recomendaciones de música sefardí contemporánea.',
        content: 'Estoy armando un playlist para una cena cultural y me gustaría incluir sonidos modernos...',
        comments: 0, likes: 0, image: '', createdAt: new Date().toISOString()
    }
];

const DEFAULT_COHORTS = [
    { id: '1', title: 'Introduction to Ladino', category: 'LINGÜÍSTICA', categoryColor: '#C44536', dates: '01 Sep — 14 Nov', joined: 4, total: 10 },
    { id: '2', title: 'Cocina Sefardí: Raíces Mediterráneas', category: 'GASTRONOMÍA', categoryColor: '#2E7D32', dates: '00 Oct — 12 Dic', joined: 8, total: 10 },
    { id: '3', title: 'Tracing Lineage in Archives', category: 'GENEALOGÍA', categoryColor: '#1565C0', dates: '01 Nov — 12 Jan', joined: 10, total: 20 }
];

const DEFAULT_CHRONICLES = [
    { id: '1', title: 'The Golden Age of Sepharad', subtitle: 'Exploring the cultural synthesis and intellectual flourishing of medieval Spain through the eyes of its chroniclers.', category: 'FEATURED STORY', readTime: '10 min read • Historical Essay', image: '', featured: true, date: 'MARCH 2024' },
    { id: '2', title: 'Whispers of the Ladino Poets', subtitle: 'A deep dive into the poetic preservation of a language that...', category: 'ESTUDIOS', readTime: '', image: '', featured: false, date: 'MARCH 14, 2024' },
    { id: '3', title: 'The Architecture of Belonging', subtitle: 'How the built environment of the old quarters reflects a complex history...', category: 'HISTORY', readTime: '', image: '', featured: false, date: 'FEB 28, 2024' },
    { id: '4', title: 'Silver Threads of Toledo', subtitle: 'Uncovering the lost techniques of the medieval silversmiths who...', category: 'CRAFTSMANSHIP', readTime: '', image: '', featured: false, date: 'JAN 15, 2024' }
];

const DEFAULT_STUDIES = [
    { id: '1', title: 'Filosofía de Maimónides', progress: 75, nextSession: 'Próxima sesión: Mañana, 18:00' },
    { id: '2', title: 'Historia de la Diáspora', progress: 30, nextSession: 'Próxima sesión: Jueves, 10:30' }
];

const DEFAULT_PROFILE = { name: 'Mateo Benveniste', location: 'SEPHARDIC • BUENOS AIRES', discussions: 42, cohorts: 12, historias: 156 };

// ===== Detect if backend is available =====
let backendAvailable = false;

async function checkBackend() {
    try {
        const res = await fetch('/api/posts', { method: 'GET', signal: AbortSignal.timeout(2000) });
        if (res.ok) { backendAvailable = true; }
    } catch (e) {
        backendAvailable = false;
    }
}

async function apiGet(endpoint, fallback) {
    if (backendAvailable) {
        try {
            const res = await fetch(endpoint);
            if (res.ok) return res.json();
        } catch (e) { /* fallback */ }
    }
    return fallback;
}

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

// ===== Load Data =====
async function loadPosts(filter = '') {
    const posts = await apiGet('/api/posts', DEFAULT_POSTS);
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
    const cohorts = await apiGet('/api/cohorts', DEFAULT_COHORTS);
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
    const studies = await apiGet('/api/studies', DEFAULT_STUDIES);
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
    const chronicles = await apiGet('/api/chronicles', DEFAULT_CHRONICLES);
    const featured = chronicles.find(c => c.featured);
    const rest = chronicles.filter(c => !c.featured);

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
    const profile = await apiGet('/api/profile', DEFAULT_PROFILE);
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
    if (backendAvailable) {
        const formData = new FormData();
        formData.append('title', document.getElementById('new-post-title').value);
        formData.append('content', document.getElementById('new-post-content').value);
        formData.append('category', document.getElementById('new-post-category').value);
        formData.append('author', 'Aviva');
        const imageFile = document.getElementById('new-post-image').files[0];
        if (imageFile) formData.append('image', imageFile);
        await fetch('/api/posts', { method: 'POST', body: formData });
    }
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
    if (mins < 1) return 'ahora';
    if (mins < 60) return `hace ${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `hace ${hours}h`;
    const days = Math.floor(hours / 24);
    return `hace ${days}d`;
}

// ===== Zmanim (Halachic Times) =====
let zmanimExpanded = false;

const ZMANIM_LABELS = {
    alotHaShachar: 'Alot HaShajar',
    misheyakir: 'Misheyakir',
    sunrise: 'Netz HaJamá',
    sofZmanShma: 'Sof Zmán Shemá',
    sofZmanTfilla: 'Sof Zmán Tefilá',
    chatzot: 'Jatzot',
    minchaGedola: 'Minjá Guedolá',
    minchaKetana: 'Minjá Ketaná',
    plagHaMincha: 'Plag HaMinjá',
    sunset: 'Shkiá',
    tzeit7083deg: 'Tzeit HaKojabim',
    tzeit85deg: 'Tzeit (RT)',
};

const ZMANIM_MAIN = ['sunrise', 'sofZmanShma', 'sofZmanTfilla', 'chatzot', 'sunset', 'tzeit7083deg'];
const ZMANIM_EXTRA = ['alotHaShachar', 'misheyakir', 'minchaGedola', 'minchaKetana', 'plagHaMincha', 'tzeit85deg'];
const ZMANIM_HIGHLIGHT = ['sunrise', 'sunset'];

function formatZmanTime(isoStr) {
    if (!isoStr) return '--:--';
    const d = new Date(isoStr);
    return d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', hour12: false });
}

async function loadZmanim() {
    const dateEl = document.getElementById('zmanim-date');
    const now = new Date();
    const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Shabbat'];
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    dateEl.textContent = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`;

    // Default: Buenos Aires
    let lat = -34.6037;
    let lng = -58.3816;
    let cityName = 'Buenos Aires, Argentina';

    // Try geolocation
    try {
        const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        // Reverse geocode
        try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`);
            const geoData = await geoRes.json();
            cityName = geoData.address?.city || geoData.address?.town || geoData.address?.state || 'Tu ubicación';
        } catch(e) {
            cityName = 'Tu ubicación';
        }
    } catch(e) {
        // Use default Buenos Aires
    }

    document.getElementById('zmanim-city').textContent = cityName;

    // Fetch zmanim from Hebcal
    const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    try {
        const res = await fetch(`https://www.hebcal.com/zmanim?cfg=json&latitude=${lat}&longitude=${lng}&date=${dateStr}`);
        const data = await res.json();
        const times = data.times || {};

        renderZmanim(times);
    } catch(e) {
        document.getElementById('zmanim-grid').innerHTML = '<div class="zmanim-loading">No se pudieron cargar los horarios</div>';
    }
}

function renderZmanim(times) {
    const grid = document.getElementById('zmanim-grid');
    let html = '';

    ZMANIM_MAIN.forEach(key => {
        const isHL = ZMANIM_HIGHLIGHT.includes(key);
        html += `<div class="zmanim-item${isHL ? ' highlight' : ''}">
            <span class="zmanim-label">${ZMANIM_LABELS[key] || key}</span>
            <span class="zmanim-time">${formatZmanTime(times[key])}</span>
        </div>`;
    });

    html += '<div class="zmanim-extra" id="zmanim-extra">';
    ZMANIM_EXTRA.forEach(key => {
        html += `<div class="zmanim-item">
            <span class="zmanim-label">${ZMANIM_LABELS[key] || key}</span>
            <span class="zmanim-time">${formatZmanTime(times[key])}</span>
        </div>`;
    });
    html += '</div>';

    grid.innerHTML = html;
}

function toggleZmanim() {
    zmanimExpanded = !zmanimExpanded;
    const extra = document.getElementById('zmanim-extra');
    const btn = document.getElementById('zmanim-toggle');
    if (extra) {
        extra.classList.toggle('show', zmanimExpanded);
    }
    btn.textContent = zmanimExpanded ? 'Ver menos' : 'Ver todos los horarios';
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', async () => {
    await checkBackend();
    loadPosts();
    loadCohorts();
    loadStudies();
    loadChronicles();
    loadProfile();
    loadZmanim();
});
