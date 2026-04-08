function openSection(id) {
  // desliza nav para sidebar
  const nav = document.getElementById('main-nav');
  nav.classList.remove('centered');
  nav.classList.add('sidebar');

  // esconde todas as secções
  document.querySelectorAll('.content-section').forEach(s => {
    s.classList.remove('visible');
  });

  // remove link ativo anterior
  document.querySelectorAll('nav ul li a').forEach(a => {
    a.classList.remove('active-link');
  });

  // mostra a secção certa com pequeno delay para a animação da nav
  setTimeout(() => {
    document.getElementById(id).classList.add('visible');
  }, 300);

  // marca link como ativo
  event.target.classList.add('active-link');
}

// clicar no logo volta ao centro
document.querySelector('.titleimg').addEventListener('click', () => {
  const nav = document.getElementById('main-nav');
  nav.classList.remove('sidebar');
  nav.classList.add('centered');

  document.querySelectorAll('.content-section').forEach(s => {
    s.classList.remove('visible');
  });

  document.querySelectorAll('nav ul li a').forEach(a => {
    a.classList.remove('active-link');
  });
});

function setLang(lang) {
  document.querySelectorAll('[data-pt]').forEach(el => {
    el.textContent = el.dataset[lang];
  });
  document.getElementById('btn-pt').classList.toggle('active', lang === 'pt');
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
}