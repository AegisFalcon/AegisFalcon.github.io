// Garde le scroll au même endroit après fermeture lightbox

function openLightbox(targetId) {
  document.querySelectorAll('.lightbox').forEach(lb => lb.style.display = 'none');
  const target = document.querySelector(targetId);
  if (target) {
    target.style.display = 'flex';
    window.location.hash = targetId;
    document.body.style.overflow = 'hidden';
  }
}

// Ouvre la lightbox sans empiler l'historique
document.querySelectorAll('a[href^="#img"]').forEach(link => {
  const targetId = link.getAttribute('href');

  link.addEventListener('click', e => {
    e.preventDefault();

    // Ferme toutes les lightbox d’abord
    document.querySelectorAll('.lightbox').forEach(lb => lb.style.display = 'none');

    // Ouvre la cible
    const target = document.querySelector(targetId);
    if (target) {
      target.style.display = 'flex';
      // Remplace l'URL sans ajouter d'entrée dans l'historique
      history.replaceState(null, '', targetId);
      document.body.style.overflow = 'hidden';
    }
  });
});

// Ferme la lightbox avec la croix
document.querySelectorAll('.lightbox .close').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();

    const lightbox = btn.closest('.lightbox');
    if (lightbox) lightbox.style.display = 'none';

    // Supprime le hash sans créer d’entrée
    history.replaceState(null, '', window.location.pathname + window.location.search);
    document.body.style.overflow = '';
  });
});

// Gérer les flèches prev/next pour ne pas changer le hash
document.querySelectorAll('.lightbox .nav').forEach(nav => {
  nav.addEventListener('click', e => {
    e.preventDefault();
    const targetId = nav.getAttribute('href');
    openLightbox(targetId);
  });
});

               // Effet fade in images

document.querySelectorAll('img.lazy').forEach(img => {
  img.classList.add('lazy'); // au cas où

  img.addEventListener('load', () => {
    img.classList.add('loaded');
  });
});

window.addEventListener("load", () => {
    document.querySelectorAll('img.lazy').forEach(img => {
      if (img.complete) {
        img.classList.add("loaded");
      } else {
        img.addEventListener("load", () => {
          img.classList.add("loaded");
        });
      }
    });
  });


            //fix flèche droite 
function setScrollbarWidthVar() {
    const scrollDiv = document.createElement("div");
    scrollDiv.style.visibility = "hidden";
    scrollDiv.style.overflow = "scroll";
    scrollDiv.style.position = "absolute";
    scrollDiv.style.top = "-9999px";
    scrollDiv.style.width = "100px";
    scrollDiv.style.height = "100px";
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
  }

  window.addEventListener("load", setScrollbarWidthVar);
  window.addEventListener("resize", setScrollbarWidthVar);


             // Fix 100vh mobile iOS bug
function setRealVhUnit() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setRealVhUnit);
window.addEventListener('load', setRealVhUnit);


             // Next et Prev sans ID
const lightboxes = [...document.querySelectorAll('.lightbox')];

function showLightbox(index) {
  lightboxes.forEach(lb => lb.style.display = 'none');
  const target = lightboxes[index];
  if (target) {
    target.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    currentIndex = index;
  }
}

let currentIndex = 0;

// Attache les flèches dynamiquement
lightboxes.forEach((lightbox, i) => {
  const prevBtn = lightbox.querySelector('.prev');
  const nextBtn = lightbox.querySelector('.next');
  const closeBtn = lightbox.querySelector('.close');

  if (prevBtn) {
    prevBtn.addEventListener('click', e => {
      e.preventDefault();
      showLightbox((i - 1 + lightboxes.length) % lightboxes.length);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', e => {
      e.preventDefault();
      showLightbox((i + 1) % lightboxes.length);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', e => {
      e.preventDefault();
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    });
  }
});

// Ouverture au clic sur les miniatures
document.querySelectorAll('a[href^="#img"]').forEach((link, i) => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showLightbox(i);
  });
});


              // Navigation Flèche Clavier
// 1. Assigner automatiquement les index
document.querySelectorAll('.lightbox').forEach((lb, index) => {
  lb.dataset.index = index;
});

// 2. Navigation clavier
document.addEventListener('keydown', function (e) {
  const lightboxes = Array.from(document.querySelectorAll('.lightbox'));
  const activeLightbox = lightboxes.find(lb => lb.style.display === 'flex');
  if (!activeLightbox) return;

  const currentIndex = parseInt(activeLightbox.dataset.index, 10);
  const maxIndex = lightboxes.length - 1;

  if (e.key === 'ArrowRight') {
    e.preventDefault();
    const nextIndex = currentIndex === maxIndex ? 0 : currentIndex + 1;
    const next = lightboxes.find(lb => parseInt(lb.dataset.index, 10) === nextIndex);
    if (next) {
      activeLightbox.style.display = 'none';
      next.style.display = 'flex';
    }
  }

  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    const prevIndex = currentIndex === 0 ? maxIndex : currentIndex - 1;
    const prev = lightboxes.find(lb => parseInt(lb.dataset.index, 10) === prevIndex);
    if (prev) {
      activeLightbox.style.display = 'none';
      prev.style.display = 'flex';
    }
  }

  if (e.key === 'Escape') {
    e.preventDefault();
    activeLightbox.style.display = 'none';
    document.body.style.overflow = '';
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
});


// Associer chaque miniature à sa lightbox dans l'ordre
document.addEventListener("DOMContentLoaded", () => {
  const thumbnails = document.querySelectorAll(".screenshot a");
  const lightboxes = document.querySelectorAll(".lightbox");

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", (e) => {
      e.preventDefault();
      // Fermer toutes les lightbox
      lightboxes.forEach(lb => lb.style.display = 'none');
      // Ouvrir la lightbox correspondante
      const target = lightboxes[index];
      if (target) {
        target.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    });
  });
});