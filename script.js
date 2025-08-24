// --------- VARIABLES UTILES ----------
const lightboxes = [...document.querySelectorAll('.lightbox')];
let currentIndex = 0;

// --------- AFFICHAGE / MASQUAGE DES BOUTONS SCROLL et Filtrage  ----------
function openLightbox() {
  document.querySelector('.lightbox')?.classList.add('show');

  // Masquer les boutons de scroll
  const scrollBtns = document.querySelector('.scroll-buttons');
  if (scrollBtns) scrollBtns.style.display = 'none';

  // Masquer les boutons de filtre
  const filterBtns = document.querySelector('.filter-buttons');
  if (filterBtns) filterBtns.style.display = 'none';
}

function closeLightbox() {
  document.querySelector('.lightbox')?.classList.remove('show');

  // Réafficher les boutons de scroll
  const scrollBtns = document.querySelector('.scroll-buttons');
  if (scrollBtns) scrollBtns.style.display = 'flex';

  // Réafficher les boutons de filtre
  const filterBtns = document.querySelector('.filter-buttons');
  if (filterBtns) filterBtns.style.display = 'flex';
}

// --------- OUVRIR LIGHTBOX ----------
function openLightboxByIndex(index, pushState = false) {
  if (index < 0 || index >= lightboxes.length) return;
  
  lightboxes.forEach(lb => lb.style.display = 'none');

  const target = lightboxes[index];
  if (!target) return;

  target.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  currentIndex = index;

  openLightbox();

  if (pushState) {
    history.pushState(null, '', '#' + target.id);
  } else {
    history.replaceState(null, '', '#' + target.id);
  }
}

// --------- OUVRIR LIGHTBOX PAR HASH AU CHARGEMENT ----------
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash;
  if (hash) {
    const targetLightbox = document.querySelector(hash);
    const index = lightboxes.indexOf(targetLightbox);
    if (index !== -1) {
      openLightboxByIndex(index, false);
    }
  }
});

// --------- CLIC SUR MINIATURES POUR OUVRIR LIGHTBOX ----------
document.querySelectorAll('a > img.lazy').forEach((img, index) => {
  const link = img.closest('a');
  if (!link) return;

  const target = link.getAttribute('href');
  if (target && target.startsWith('#')) {
    link.addEventListener('click', e => {
      e.preventDefault();
      openLightboxByIndex(index, true);
    });
  }
});

// --------- BOUTONS PREV / NEXT / CLOSE DANS LIGHTBOX ----------
lightboxes.forEach((lb, i) => {
  const prevBtn = lb.querySelector('.prev');
  const nextBtn = lb.querySelector('.next');
  const closeBtn = lb.querySelector('.close');

  if (prevBtn) {
    prevBtn.addEventListener('click', e => {
      e.preventDefault();
      openLightboxByIndex((i - 1 + lightboxes.length) % lightboxes.length, false);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', e => {
      e.preventDefault();
      openLightboxByIndex((i + 1) % lightboxes.length, false);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', e => {
      e.preventDefault();
      lb.style.display = 'none';
      document.body.style.overflow = '';
      closeLightbox();
      history.replaceState(null, '', window.location.pathname + window.location.search);
    });
  }
});

// --------- NAVIGATION AU CLAVIER ----------
document.addEventListener('keydown', e => {
  const activeLb = lightboxes.find(lb => lb.style.display === 'flex');
  if (!activeLb) return;

  const index = lightboxes.indexOf(activeLb);
  if (index === -1) return;

  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault();
      openLightboxByIndex((index + 1) % lightboxes.length, false);
      break;

    case 'ArrowLeft':
      e.preventDefault();
      openLightboxByIndex((index - 1 + lightboxes.length) % lightboxes.length, false);
      break;

    case 'Escape':
      e.preventDefault();
      activeLb.style.display = 'none';
      document.body.style.overflow = '';
      closeLightbox();
      history.replaceState(null, '', window.location.pathname + window.location.search);

      document.documentElement.classList.remove('direct-lightbox');
      const gallery = document.querySelector('.gallery');
      if (gallery) {
        gallery.style.display = 'flex';
      }
      break;
  }
});

// --------- GESTION DU POPSTATE (boutons navigateur) ----------
window.addEventListener('popstate', () => {
  const hash = window.location.hash;

  if (!hash) {
    document.querySelectorAll('.lightbox').forEach(lb => {
      lb.style.display = 'none';
    });
    document.body.style.overflow = '';
    closeLightbox();

    document.documentElement.classList.remove('direct-lightbox');
    const gallery = document.querySelector('.gallery');
    if (gallery) {
      gallery.style.display = 'flex';
    }
  }
});

// --------- EFFET FADE-IN POUR IMAGES LAZY ----------
function addLazyLoadFadeEffect() {
  const imgs = document.querySelectorAll('img.lazy');
  imgs.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
    }
  });
}

window.addEventListener('load', addLazyLoadFadeEffect);

// --------- FIX POUR LARGEUR SCROLLBAR DYNAMIQUE ---------
function setScrollbarWidthVar() {
  const scrollDiv = document.createElement('div');
  scrollDiv.style.visibility = 'hidden';
  scrollDiv.style.overflow = 'scroll';
  scrollDiv.style.position = 'absolute';
  scrollDiv.style.top = '-9999px';
  scrollDiv.style.width = '100px';
  scrollDiv.style.height = '100px';
  document.body.appendChild(scrollDiv);

  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);

  document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
}

window.addEventListener('load', setScrollbarWidthVar);
window.addEventListener('resize', setScrollbarWidthVar);

// --------- FIX 100vh SUR MOBILE iOS ---------
function setRealVhUnit() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setRealVhUnit);
window.addEventListener('load', setRealVhUnit);

// --------- FIX SHARE LINK SPEED (close et galerie) ---------
document.querySelectorAll('.lightbox .close').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const lightbox = btn.closest('.lightbox');
    if (lightbox) lightbox.style.display = 'none';

    history.replaceState(null, '', window.location.pathname + window.location.search);

    document.documentElement.classList.remove('direct-lightbox');

    // Gérer la galerie ou la section screenshot selon la page
    const gallery = document.querySelector('.gallery');
    const screenshot = document.querySelector('.screenshot');

    if (gallery) gallery.style.display = 'flex';
    if (screenshot) screenshot.style.display = 'flex';

    document.body.style.overflow = '';
    closeLightbox();
  });
});

// Récupère l'année actuelle
  document.addEventListener("DOMContentLoaded", function() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
  }
});

// --------- BOUTONS SCROLL HAUT/BAS ----------
const scrollStep = 500; // nombre de pixels à scroller par clic

document.getElementById("scroll-up").addEventListener("click", function () {
  const currentScroll = window.scrollY || window.pageYOffset;
  const newScroll = Math.max(0, currentScroll - scrollStep);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById("scroll-down").addEventListener("click", function () {
  const currentScroll = window.scrollY || window.pageYOffset;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const newScroll = Math.min(maxScroll, currentScroll + scrollStep);
  window.scrollTo({ top: newScroll, behavior: "smooth" });
});
