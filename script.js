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