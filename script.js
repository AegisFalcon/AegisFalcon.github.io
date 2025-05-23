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
    history.replaceState(null, '', '#' + target.id);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash;
  if (hash) {
    const targetLightbox = document.querySelector(hash);
    if (targetLightbox) {
      const index = lightboxes.indexOf(targetLightbox);
      if (index !== -1) {
        showLightbox(index);
      }
    }
  }
});

let currentIndex = 0;

// Attache les flèches dynamiquement
lightboxes.forEach((lightbox, i) => {
  const prevBtn = lightbox.querySelector('.prev');
  const nextBtn = lightbox.querySelector('.next');
  const closeBtn = lightbox.querySelector('.close');

  if (prevBtn) {
    prevBtn.addEventListener('click', e => {
      e.preventDefault();
      const newIndex = (i - 1 + lightboxes.length) % lightboxes.length;
      showLightbox(newIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', e => {
      e.preventDefault();
      const newIndex = (i + 1) % lightboxes.length;
      showLightbox(newIndex);
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
      history.replaceState(null, '', '#' + next.id);
    }
  }

  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    const prevIndex = currentIndex === 0 ? maxIndex : currentIndex - 1;
    const prev = lightboxes.find(lb => parseInt(lb.dataset.index, 10) === prevIndex);
    if (prev) {
      activeLightbox.style.display = 'none';
      prev.style.display = 'flex';
      history.replaceState(null, '', '#' + prev.id);
    }
  }

  if (e.key === 'Escape') {
    e.preventDefault();
    activeLightbox.style.display = 'none';
    document.body.style.overflow = '';
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
});


// Ouvrir un lien pour chaque ligthbox
document.addEventListener("DOMContentLoaded", () => {
  const allThumbnails = document.querySelectorAll("a > img.lazy");
  const allLightboxes = document.querySelectorAll(".lightbox");

  if (allThumbnails.length !== allLightboxes.length) {
    console.warn("Nombre de miniatures et de lightboxes différent. Vérifie leur ordre !");
  }

  allThumbnails.forEach((img, index) => {
    const link = img.closest("a");
    if (!link) return;

    link.addEventListener("click", e => {
      e.preventDefault();

      // Ferme toutes les lightboxes
      allLightboxes.forEach(lb => lb.style.display = "none");

      // Ouvre la bonne lightbox
      const target = allLightboxes[index];
      if (target) {
        target.style.display = "flex";
        document.body.style.overflow = "hidden";
        const id = target.id;
        if (id) {
          history.pushState(null, "", `#${id}`); // ✅ Affiche le hash dans l’URL
        }
      }
    });
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
