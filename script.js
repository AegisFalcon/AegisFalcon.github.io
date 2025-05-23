// --------- VARIABLES UTILES ----------
const lightboxes = [...document.querySelectorAll('.lightbox')];
let currentIndex = 0;

// --------- OUVRIR LIGHTBOX ----------
function openLightboxByIndex(index, pushState = false) {
  if (index < 0 || index >= lightboxes.length) return;
  
  // Fermer toutes les lightboxes
  lightboxes.forEach(lb => lb.style.display = 'none');

  const target = lightboxes[index];
  if (!target) return;

  target.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  currentIndex = index;

  // Gérer le hash dans l'URL sans empiler l'historique (pushState = false)
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

  link.addEventListener('click', e => {
    e.preventDefault();
    openLightboxByIndex(index, true);
  });
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
      // Retirer le hash sans empiler l'historique
      history.replaceState(null, '', window.location.pathname + window.location.search);
    });
  }
});

// --------- NAVIGATION AU CLAVIER (flèches et Escape) ----------
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
      history.replaceState(null, '', window.location.pathname + window.location.search);

      // Supprimer la classe direct-lightbox et réafficher la galerie
      document.documentElement.classList.remove('direct-lightbox');
      const gallery = document.querySelector('.gallery');
      if (gallery) {
        gallery.style.display = 'flex'; // ou 'block' selon ton CSS
      }
      break;
  }
});

// --------- GESTION DU POPSTATE (boutons navigateur) ----------
window.addEventListener('popstate', () => {
  const hash = window.location.hash;
  if (!hash) {
    // plus de hash, on enlève la classe direct-lightbox
    document.documentElement.classList.remove('direct-lightbox');
    // on affiche la galerie
    document.querySelector('.gallery').style.display = 'flex'; // ou block selon ton CSS
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

// Fix share link speed (charger la galerie seulement après avoir quitté la lightbox)
document.querySelectorAll('.lightbox .close').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const lightbox = btn.closest('.lightbox');
    if (lightbox) lightbox.style.display = 'none';

    // Supprime le hash
    history.replaceState(null, '', window.location.pathname + window.location.search);

    // Réaffiche la galerie et enlève la classe
    document.documentElement.classList.remove('direct-lightbox');
    document.querySelector('.gallery').style.display = 'flex'; // ou block
    document.body.style.overflow = '';
  });
});

// Fermer ligthbox avec flèche gauche du navigateur
window.addEventListener('popstate', () => {
  const hash = window.location.hash;

  if (!hash) {
    // Pas de hash = fermer toutes les lightbox
    document.querySelectorAll('.lightbox').forEach(lb => {
      lb.style.display = 'none';
    });
    document.body.style.overflow = '';
  } else {
    // Si tu veux, tu peux rouvrir la lightbox correspondant au hash
    // const target = document.querySelector(hash);
    // if (target) {
    //   document.querySelectorAll('.lightbox').forEach(lb => lb.style.display = 'none');
    //   target.style.display = 'flex';
    //   document.body.style.overflow = 'hidden';
    // }
  }
});