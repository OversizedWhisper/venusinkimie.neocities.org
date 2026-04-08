const nav = document.getElementById('main-nav');
let isSidebar = false;

// posição inicial centrada
gsap.set(nav, {
  top: '50%',
  left: '50%',
  xPercent: -50,
  yPercent: -50,
  fontSize: '3em'
});

// esconde todas as secções no início
gsap.set('.content-section', { opacity: 0, x: 60 });

function openSection(id) {
  const clickedLink = event.target;

  // remove link ativo anterior
  document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove('active-link'));
  clickedLink.classList.add('active-link');

  // esconde secção atual com GSAP
  gsap.to('.content-section.visible', {
    opacity: 0,
    x: 60,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      document.querySelectorAll('.content-section').forEach(s => {
        s.classList.remove('visible');
      });

      // mostra nova secção
      const section = document.getElementById(id);
      section.classList.add('visible');
      gsap.fromTo(section,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  });

  // anima nav para sidebar (só na primeira vez)
  if (!isSidebar) {
    isSidebar = true;
    nav.classList.remove('centered');
    nav.classList.add('sidebar');

    gsap.to(nav, {
      top: '20%',
      left: '7.5%',
      xPercent: 0,
      yPercent: 0,
      fontSize: '2.5em',
      duration: 0.8,
      ease: 'power4.inOut'
    });

    gsap.to('.titleimg', {
      width: 120,
      duration: 0.8,
      ease: 'power4.inOut'
    });
  }
}

// clicar no logo volta ao centro
document.querySelector('.titleimg').addEventListener('click', () => {
  if (!isSidebar) return;
  isSidebar = false;

  // esconde secção visível
  gsap.to('.content-section.visible', {
    opacity: 0,
    x: 60,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      document.querySelectorAll('.content-section').forEach(s => s.classList.remove('visible'));
    }
  });

  // remove links ativos
  document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove('active-link'));

  // volta ao centro
  nav.classList.remove('sidebar');
  nav.classList.add('centered');

  gsap.to(nav, {
    top: '50%',
    left: '50%',
    xPercent: -50,
    yPercent: -50,
    fontSize: '3em',
    duration: 0.8,
    ease: 'power4.inOut'
  });

  gsap.to('.titleimg', {
    width: 180,
    duration: 0.8,
    ease: 'power4.inOut'
  });
});

function setLang(lang) {
  document.querySelectorAll('[data-pt]').forEach(el => {
    el.textContent = el.dataset[lang];
  });
  document.getElementById('btn-pt').classList.toggle('active', lang === 'pt');
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
}