const nav = document.getElementById('main-nav');
let isSidebar = false;
let isAnimating = false;
let currentSection = null;

// ── deteta língua do browser ──
const browserLang = navigator.language.startsWith('pt') ? 'pt' : 'en';
document.body.lang = browserLang;
document.getElementById('btn-pt').classList.toggle('active', browserLang === 'pt');
document.getElementById('btn-en').classList.toggle('active', browserLang === 'en');

function setLang(lang) {
  document.body.lang = lang;
  document.getElementById('btn-pt').classList.toggle('active', lang === 'pt');
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
}

// ── configuração inicial ──
gsap.set(nav, {
  top: '50%',
  left: '50%',
  xPercent: -50,
  yPercent: -50,
  fontSize: '3em'
});

gsap.set('.titleimg', { width: 350 });
gsap.set('.content-section', { opacity: 0, x: 80, visibility: 'hidden' });

// animação de entrada da página
const introTl = gsap.timeline();
introTl
  .from('.titleimg', {
    opacity: 0,
    y: -20,
    duration: 0.8,
    ease: 'power3.out'
  })
  .from('.lang-switch', {
    opacity: 0,
    y: -10,
    duration: 0.2,
    ease: 'power2.out'
  }, '-=0.4')
  .from('nav ul li', {
    opacity: 0,
    y: 15,
    stagger: 0.08,
    duration: 0.2,
    ease: 'power2.out'
  }, '-=0.3');


function openSection(id) {
  if (isAnimating) return;
  const clickedLink = event.target.closest('a');

  if (currentSection === id && isSidebar) return;

  isAnimating = true;

  document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove('active-link'));
  clickedLink.classList.add('active-link');

  const tl = gsap.timeline({
    onComplete: () => { isAnimating = false; }
  });

  // ── primeira vez: nav vai para sidebar ──
  if (!isSidebar) {
    isSidebar = true;
    nav.classList.remove('centered');
    nav.classList.add('sidebar');

    tl
      .to(nav, {
        top: '20%',
        left: '7.5%',
        xPercent: 0,
        yPercent: 0,
        fontSize: '2.5em',
        duration: 0.5,
        ease: 'expo.inOut'
      })
      .to('.titleimg', {
        width: 120,
        duration: 0.5,
        ease: 'expo.inOut'
      }, '<')
      .from('nav ul li', {
        x: -10,
        opacity: 0.3,
        stagger: 0.06,
        duration: 0.4,
        ease: 'power2.out'
      }, '-=0.3')
      .call(() => {
        const section = document.getElementById(id);
        section.classList.add('visible');
        gsap.set(section, { visibility: 'visible' });
      })
      .fromTo(`#${id}`,
        { opacity: 0, x: 80 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out' },
        '-=0.2'
      )
      .from(`#${id} h1`, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power3.out'
      }, '-=0.4')
      .from(`#${id} p`, {
        opacity: 0,
        y: 15,
        duration: 0.4,
        ease: 'power2.out'
      }, '-=0.3');

  } else {
    // ── já está em sidebar: troca de secção ──
    const oldSection = document.querySelector('.content-section.visible');

    if (oldSection && oldSection.id !== id) {
      tl
        .to(oldSection, {
          opacity: 0,
          x: -50,
          duration: 0.35,
          ease: 'power2.in',
          onComplete: () => {
            oldSection.classList.remove('visible');
            gsap.set(oldSection, { visibility: 'hidden', x: 80 });
          }
        })
        .call(() => {
          const section = document.getElementById(id);
          section.classList.add('visible');
          gsap.set(section, { visibility: 'visible' });
        })
        .fromTo(`#${id}`,
          { opacity: 0, x: 80 },
          { opacity: 1, x: 0, duration: 0.3, ease: 'expo.out' },
          '+=0.05'
        )
        .from(`#${id} h1`, {
          opacity: 0,
          y: 20,
          duration: 0.45,
          ease: 'power3.out'
        }, '-=0.4')
        .from(`#${id} p`, {
          opacity: 0,
          y: 12,
          duration: 0.35,
          ease: 'power2.out'
        }, '-=0.3');

    } else if (!oldSection) {
      tl
        .call(() => {
          const section = document.getElementById(id);
          section.classList.add('visible');
          gsap.set(section, { visibility: 'visible' });
        })
        .fromTo(`#${id}`,
          { opacity: 0, x: 80 },
          { opacity: 1, x: 0, duration: 0.6, ease: 'expo.out' }
        );
    }
  }

  currentSection = id;
}


// ── clicar no logo volta ao centro ──
document.querySelector('.titleimg').addEventListener('click', () => {
  if (!isSidebar || isAnimating) return;
  isAnimating = true;
  currentSection = null;

  document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove('active-link'));

  const tl = gsap.timeline({
    onComplete: () => { isAnimating = false; }
  });

  const visibleSection = document.querySelector('.content-section.visible');

  if (visibleSection) {
    tl.to(visibleSection, {
      opacity: 0,
      x: 80,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        visibleSection.classList.remove('visible');
        gsap.set(visibleSection, { visibility: 'hidden' });
      }
    });
  }

  tl
    .call(() => {
      nav.classList.remove('sidebar');
      nav.classList.add('centered');
      isSidebar = false;
    })
    .to(nav, {
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      fontSize: '3em',
      duration: 0.9,
      ease: 'expo.inOut'
    }, visibleSection ? '-=0.1' : '0')
    .to('.titleimg', {
      width: 180,
      duration: 0.5,
      ease: 'expo.inOut'
    }, '<')
    .from('nav ul li', {
      opacity: 0.3,
      x: 10,
      stagger: 0.06,
      duration: 0.2,
      ease: 'power2.out'
    }, '-=0.3');
});
