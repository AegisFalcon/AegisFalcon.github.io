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

document.querySelectorAll('a[href^="#img"]').forEach(link => {
  const targetId = link.getAttribute('href');

  link.addEventListener('click', e => {
    e.preventDefault();
    openLightbox(targetId);
  });
});

// Fermer la lightbox
document.querySelectorAll('.lightbox .close').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const lightbox = btn.closest('.lightbox');
    lightbox.style.display = 'none';
    history.replaceState(null, null, ' ');
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


