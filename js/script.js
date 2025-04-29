const imageContainer = document.getElementById('imageContainer');
const uploadInput = document.getElementById('imageUpload');
const titleInput = document.getElementById('imageTitle');
const addImageBtn = document.getElementById('addImageBtn');

const folderInput = document.getElementById('newFolderName');
const createFolderBtn = document.getElementById('createFolderBtn');
const folderSelect = document.getElementById('folderSelect');

const STORAGE_KEY = 'galeria_com_pastas';
let folders = {};
let currentFolder = 'Pasta Padrão';

function saveFolders() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
}

function loadFolders() {
  const saved = localStorage.getItem(STORAGE_KEY);
  folders = saved ? JSON.parse(saved) : { 'Pasta Padrão': [] };
}

function renderFolderOptions() {
  folderSelect.innerHTML = '';
  Object.keys(folders).forEach(folder => {
    const opt = document.createElement('option');
    opt.value = folder;
    opt.textContent = folder;
    folderSelect.appendChild(opt);
  });
  folderSelect.value = currentFolder;
}

function renderImages() {
  imageContainer.innerHTML = '';
  const images = folders[currentFolder] || [];
  images.forEach(({ src, title }) => renderImageCard(src, title));
}

function renderImageCard(src, title) {
  const card = document.createElement('div');
  card.classList.add('image-card');

  const img = document.createElement('img');
  img.src = src;

  const caption = document.createElement('div');
  caption.classList.add('title');
  caption.textContent = title;

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '<i data-lucide="trash-2"></i>';
  deleteBtn.classList.add('delete-btn');

  deleteBtn.addEventListener('click', () => {
    folders[currentFolder] = folders[currentFolder].filter(img => img.src !== src);
    saveFolders();
    renderImages();
  });

  card.appendChild(img);
  card.appendChild(caption);
  card.appendChild(deleteBtn);
  imageContainer.appendChild(card);
}

addImageBtn.addEventListener('click', () => {
  const files = Array.from(uploadInput.files);
  const baseTitle = titleInput.value.trim() || 'Sem título';

  if (files.length === 0) return alert('Selecione ao menos uma imagem.');

  files.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = e => {
      const src = e.target.result;
      const title = files.length > 1 ? `${baseTitle} ${index + 1}` : baseTitle;
      folders[currentFolder].push({ src, title });
      saveFolders();
      renderImages();
    };
    reader.readAsDataURL(file);
  });

  uploadInput.value = '';
  titleInput.value = '';
});

createFolderBtn.addEventListener('click', () => {
  const name = folderInput.value.trim();
  if (!name) return alert('Nome inválido.');
  if (folders[name]) return alert('Essa pasta já existe.');
  folders[name] = [];
  currentFolder = name;
  saveFolders();
  renderFolderOptions();
  renderImages();
  folderInput.value = '';
});

folderSelect.addEventListener('change', e => {
  currentFolder = e.target.value;
  renderImages();
});

// Inicialização
loadFolders();
renderFolderOptions();
renderImages();

// Fullscreen
imageContainer.addEventListener('click', e => {
  if (e.target.tagName === 'IMG') {
    document.getElementById('fullscreen-img').src = e.target.src;
    document.getElementById('fullscreen').classList.add('open');
  }
});

document.getElementById('fullscreen').addEventListener('click', () => {
  document.getElementById('fullscreen').classList.remove('open');
});

// Inicializando os ícones Lucide
lucide.createIcons();
