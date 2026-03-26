const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/admin', express.static('admin'));

// Ensure directories exist
['uploads', 'data'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpg, png, gif, webp)'));
    }
  }
});

// === Data helpers ===
function readData(filename) {
  const filepath = path.join(__dirname, 'data', filename);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, '[]');
    return [];
  }
  return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

function writeData(filename, data) {
  fs.writeFileSync(path.join(__dirname, 'data', filename), JSON.stringify(data, null, 2));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Initialize default data if empty
function initDefaultData() {
  // Forum posts
  if (readData('posts.json').length === 0) {
    writeData('posts.json', [
      {
        id: generateId(),
        author: 'Samuel Benzaquen',
        avatar: '',
        category: 'Gastronomía',
        title: 'El secreto del Boreka perfecto: Memorias de Rodas en mi cocina.',
        content: 'Mi abuela siempre decía que la masa debe ser tan fina como un suspiro. Hoy comparto el proceso que mi familia ha...',
        comments: 42,
        likes: 138,
        image: '',
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        author: 'Luna Levy',
        avatar: '',
        category: 'Genealogía',
        title: '¿Alguien más está trazando su linaje hasta Salónica?',
        content: 'He encontrado algunos registros en el archivo digital que podrían interesarles...',
        comments: 0,
        likes: 0,
        image: '',
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        author: 'Isaac Cohen',
        avatar: '',
        category: 'Cultura',
        title: 'Preservando el Ladino: Mis frases favoritas de la infancia.',
        content: '"Ken komiyo, muchos anios bivió". ¿Qué proverbios escuchaban en sus casas?',
        comments: 0,
        likes: 0,
        image: '',
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        author: 'Sarah M.',
        avatar: '',
        category: '',
        title: 'Buscando recomendaciones de música sefardí contemporánea.',
        content: 'Estoy armando un playlist para una cena cultural y me gustaría incluir sonidos modernos...',
        comments: 0,
        likes: 0,
        image: '',
        createdAt: new Date().toISOString()
      }
    ]);
  }

  // Cohorts / Study groups
  if (readData('cohorts.json').length === 0) {
    writeData('cohorts.json', [
      {
        id: generateId(),
        title: 'Introduction to Ladino',
        category: 'LINGÜÍSTICA',
        categoryColor: '#C44536',
        dates: '01 Sep — 14 Nov',
        joined: 4,
        total: 10,
        image: ''
      },
      {
        id: generateId(),
        title: 'Cocina Sefardí: Raíces Mediterráneas',
        category: 'GASTRONOMÍA',
        categoryColor: '#2E7D32',
        dates: '00 Oct — 12 Dic',
        joined: 8,
        total: 10,
        image: ''
      },
      {
        id: generateId(),
        title: 'Tracing Lineage in Archives',
        category: 'GENEALOGÍA',
        categoryColor: '#1565C0',
        dates: '01 Nov — 12 Jan',
        joined: 10,
        total: 20,
        image: ''
      }
    ]);
  }

  // Chronicles / Heritage articles
  if (readData('chronicles.json').length === 0) {
    writeData('chronicles.json', [
      {
        id: generateId(),
        title: 'The Golden Age of Sepharad',
        subtitle: 'Exploring the cultural synthesis and intellectual flourishing of medieval Spain through the eyes of its chroniclers.',
        category: 'FEATURED STORY',
        readTime: '10 min read • Historical Essay',
        image: '',
        featured: true,
        date: 'MARCH 2024'
      },
      {
        id: generateId(),
        title: 'Whispers of the Ladino Poets',
        subtitle: 'A deep dive into the poetic preservation of a language that...',
        category: 'ESTUDIOS',
        readTime: '',
        image: '',
        featured: false,
        date: 'MARCH 14, 2024'
      },
      {
        id: generateId(),
        title: 'The Architecture of Belonging',
        subtitle: 'How the built environment of the old quarters reflects a complex history...',
        category: 'HISTORY',
        readTime: '',
        image: '',
        featured: false,
        date: 'FEB 28, 2024'
      },
      {
        id: generateId(),
        title: 'Silver Threads of Toledo',
        subtitle: 'Uncovering the lost techniques of the medieval silversmiths who...',
        category: 'CRAFTSMANSHIP',
        readTime: '',
        image: '',
        featured: false,
        date: 'JAN 15, 2024'
      }
    ]);
  }

  // User studies
  if (readData('studies.json').length === 0) {
    writeData('studies.json', [
      {
        id: generateId(),
        title: 'Filosofía de Maimónides',
        progress: 75,
        nextSession: 'Próxima sesión: Mañana, 18:00'
      },
      {
        id: generateId(),
        title: 'Historia de la Diáspora',
        progress: 30,
        nextSession: 'Próxima sesión: Jueves, 10:30'
      }
    ]);
  }

  // User profile
  if (readData('profile.json').length === 0) {
    writeData('profile.json', JSON.stringify({
      name: 'Mateo Benveniste',
      location: 'SEPHARDIC • BUENOS AIRES',
      avatar: '',
      discussions: 42,
      cohorts: 12,
      historias: 156
    }));
    // Re-write properly
    const profile = {
      name: 'Mateo Benveniste',
      location: 'SEPHARDIC • BUENOS AIRES',
      avatar: '',
      discussions: 42,
      cohorts: 12,
      historias: 156
    };
    fs.writeFileSync(path.join(__dirname, 'data', 'profile.json'), JSON.stringify(profile, null, 2));
  }
}

initDefaultData();

// === API Routes ===

// -- Forum Posts --
app.get('/api/posts', (req, res) => {
  const posts = readData('posts.json');
  res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
  const posts = readData('posts.json');
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post no encontrado' });
  res.json(post);
});

app.post('/api/posts', upload.single('image'), (req, res) => {
  const posts = readData('posts.json');
  const post = {
    id: generateId(),
    author: req.body.author || 'Anónimo',
    avatar: '',
    category: req.body.category || '',
    title: req.body.title,
    content: req.body.content,
    comments: 0,
    likes: 0,
    image: req.file ? '/uploads/' + req.file.filename : '',
    createdAt: new Date().toISOString()
  };
  posts.unshift(post);
  writeData('posts.json', posts);
  res.status(201).json(post);
});

app.put('/api/posts/:id', upload.single('image'), (req, res) => {
  const posts = readData('posts.json');
  const idx = posts.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Post no encontrado' });

  posts[idx] = {
    ...posts[idx],
    author: req.body.author || posts[idx].author,
    category: req.body.category !== undefined ? req.body.category : posts[idx].category,
    title: req.body.title || posts[idx].title,
    content: req.body.content || posts[idx].content,
    image: req.file ? '/uploads/' + req.file.filename : posts[idx].image
  };
  writeData('posts.json', posts);
  res.json(posts[idx]);
});

app.delete('/api/posts/:id', (req, res) => {
  let posts = readData('posts.json');
  posts = posts.filter(p => p.id !== req.params.id);
  writeData('posts.json', posts);
  res.json({ success: true });
});

// -- Cohorts --
app.get('/api/cohorts', (req, res) => res.json(readData('cohorts.json')));

app.post('/api/cohorts', upload.single('image'), (req, res) => {
  const cohorts = readData('cohorts.json');
  const cohort = {
    id: generateId(),
    title: req.body.title,
    category: req.body.category || '',
    categoryColor: req.body.categoryColor || '#C44536',
    dates: req.body.dates || '',
    joined: parseInt(req.body.joined) || 0,
    total: parseInt(req.body.total) || 10,
    image: req.file ? '/uploads/' + req.file.filename : ''
  };
  cohorts.push(cohort);
  writeData('cohorts.json', cohorts);
  res.status(201).json(cohort);
});

app.put('/api/cohorts/:id', upload.single('image'), (req, res) => {
  const cohorts = readData('cohorts.json');
  const idx = cohorts.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Cohorte no encontrada' });

  cohorts[idx] = {
    ...cohorts[idx],
    title: req.body.title || cohorts[idx].title,
    category: req.body.category !== undefined ? req.body.category : cohorts[idx].category,
    categoryColor: req.body.categoryColor || cohorts[idx].categoryColor,
    dates: req.body.dates !== undefined ? req.body.dates : cohorts[idx].dates,
    joined: req.body.joined !== undefined ? parseInt(req.body.joined) : cohorts[idx].joined,
    total: req.body.total !== undefined ? parseInt(req.body.total) : cohorts[idx].total,
    image: req.file ? '/uploads/' + req.file.filename : cohorts[idx].image
  };
  writeData('cohorts.json', cohorts);
  res.json(cohorts[idx]);
});

app.delete('/api/cohorts/:id', (req, res) => {
  let cohorts = readData('cohorts.json');
  cohorts = cohorts.filter(c => c.id !== req.params.id);
  writeData('cohorts.json', cohorts);
  res.json({ success: true });
});

// -- Chronicles --
app.get('/api/chronicles', (req, res) => res.json(readData('chronicles.json')));

app.post('/api/chronicles', upload.single('image'), (req, res) => {
  const chronicles = readData('chronicles.json');
  const chronicle = {
    id: generateId(),
    title: req.body.title,
    subtitle: req.body.subtitle || '',
    category: req.body.category || '',
    readTime: req.body.readTime || '',
    image: req.file ? '/uploads/' + req.file.filename : '',
    featured: req.body.featured === 'true',
    date: req.body.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
  };
  chronicles.unshift(chronicle);
  writeData('chronicles.json', chronicles);
  res.status(201).json(chronicle);
});

app.put('/api/chronicles/:id', upload.single('image'), (req, res) => {
  const chronicles = readData('chronicles.json');
  const idx = chronicles.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Crónica no encontrada' });

  chronicles[idx] = {
    ...chronicles[idx],
    title: req.body.title || chronicles[idx].title,
    subtitle: req.body.subtitle !== undefined ? req.body.subtitle : chronicles[idx].subtitle,
    category: req.body.category !== undefined ? req.body.category : chronicles[idx].category,
    readTime: req.body.readTime !== undefined ? req.body.readTime : chronicles[idx].readTime,
    featured: req.body.featured !== undefined ? req.body.featured === 'true' : chronicles[idx].featured,
    date: req.body.date || chronicles[idx].date,
    image: req.file ? '/uploads/' + req.file.filename : chronicles[idx].image
  };
  writeData('chronicles.json', chronicles);
  res.json(chronicles[idx]);
});

app.delete('/api/chronicles/:id', (req, res) => {
  let chronicles = readData('chronicles.json');
  chronicles = chronicles.filter(c => c.id !== req.params.id);
  writeData('chronicles.json', chronicles);
  res.json({ success: true });
});

// -- Studies --
app.get('/api/studies', (req, res) => res.json(readData('studies.json')));

app.post('/api/studies', (req, res) => {
  const studies = readData('studies.json');
  const study = {
    id: generateId(),
    title: req.body.title,
    progress: parseInt(req.body.progress) || 0,
    nextSession: req.body.nextSession || ''
  };
  studies.push(study);
  writeData('studies.json', studies);
  res.status(201).json(study);
});

app.put('/api/studies/:id', (req, res) => {
  const studies = readData('studies.json');
  const idx = studies.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Estudio no encontrado' });

  studies[idx] = { ...studies[idx], ...req.body, id: studies[idx].id };
  writeData('studies.json', studies);
  res.json(studies[idx]);
});

app.delete('/api/studies/:id', (req, res) => {
  let studies = readData('studies.json');
  studies = studies.filter(s => s.id !== req.params.id);
  writeData('studies.json', studies);
  res.json({ success: true });
});

// -- Profile --
app.get('/api/profile', (req, res) => {
  const filepath = path.join(__dirname, 'data', 'profile.json');
  if (!fs.existsSync(filepath)) return res.json({});
  res.json(JSON.parse(fs.readFileSync(filepath, 'utf-8')));
});

app.put('/api/profile', (req, res) => {
  const filepath = path.join(__dirname, 'data', 'profile.json');
  const current = fs.existsSync(filepath) ? JSON.parse(fs.readFileSync(filepath, 'utf-8')) : {};
  const updated = { ...current, ...req.body };
  fs.writeFileSync(filepath, JSON.stringify(updated, null, 2));
  res.json(updated);
});

// -- Image upload --
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se subió ninguna imagen' });
  res.json({ url: '/uploads/' + req.file.filename });
});

// Serve main app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Raíces y Herencia server running on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin/`);
});
