// ============================================================
// CONFIGURAÇÃO — troque aqui
// ============================================================
const CONFIG = {
  // 55 + DDD + número, só dígitos. Ex.: '5581999999999'
  whatsapp: '558189085099',
  // Link da plataforma de galerias (Alboom, Pixieset, Google Drive...)
  galeriaClientes: '#',
};

// ============================================================
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const waBase = `https://wa.me/${CONFIG.whatsapp}`;

// Ano no rodapé
$('#year').textContent = new Date().getFullYear();

// Links de WhatsApp e galeria
$$('.js-wa').forEach((a) => {
  a.href = `${waBase}?text=${encodeURIComponent('Oi, Breno! Vim pelo seu site e queria saber mais sobre os ensaios.')}`;
  a.target = '_blank';
  a.rel = 'noopener';
});
const galleryLink = $('#galleryLink');
galleryLink.href = CONFIG.galeriaClientes;
if (CONFIG.galeriaClientes !== '#') { galleryLink.target = '_blank'; galleryLink.rel = 'noopener'; }

// ---------- Menu mobile ----------
const menuBtn = $('#menuBtn');
const mobileMenu = $('#mobileMenu');
const setMenu = (open) => {
  mobileMenu.hidden = !open;
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
};
menuBtn.addEventListener('click', () => setMenu(mobileMenu.hidden));
$$('a', mobileMenu).forEach((a) => a.addEventListener('click', () => setMenu(false)));

// ---------- Filtro do portfólio ----------
const shots = $$('.shot');
$$('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    $$('.chip').forEach((c) => {
      const on = c === chip;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', String(on));
    });
    shots.forEach((s) => { s.hidden = !(f === 'todos' || s.dataset.cat === f); });
  });
});

// ---------- Lightbox ----------
const lb = $('#lightbox');
const lbImg = $('#lbImg');
const lbCaption = $('#lbCaption');
let current = 0;
let lastFocus = null;
const visibleShots = () => shots.filter((s) => !s.hidden);

function showShot(i) {
  const list = visibleShots();
  current = (i + list.length) % list.length;
  const s = list[current];
  const img = $('img', s);
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbCaption.innerHTML = '';
  lbCaption.append(s.dataset.title);
  const meta = document.createElement('span');
  meta.className = 'muted';
  meta.textContent = ` · ${s.dataset.place} · ${current + 1} de ${list.length}`;
  lbCaption.append(meta);
}
function openLb(shot) {
  lastFocus = document.activeElement;
  showShot(visibleShots().indexOf(shot));
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
  $('#lbClose').focus();
}
function closeLb() {
  lb.hidden = true;
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}
shots.forEach((s) => $('.thumb', s).addEventListener('click', () => openLb(s)));
$('#lbClose').addEventListener('click', closeLb);
$('#lbPrev').addEventListener('click', () => showShot(current - 1));
$('#lbNext').addEventListener('click', () => showShot(current + 1));
lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', (e) => {
  if (lb.hidden) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') showShot(current - 1);
  if (e.key === 'ArrowRight') showShot(current + 1);
});
// Swipe no celular
let touchX = null;
lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) showShot(current + (dx < 0 ? 1 : -1));
  touchX = null;
});

// ---------- Pacotes → formulário ----------
const tipo = $('#f-tipo');
$$('[data-service]').forEach((btn) => {
  btn.addEventListener('click', () => { tipo.value = btn.dataset.service; });
});

// ---------- Formulário → WhatsApp ----------
const form = $('#quoteForm');
const sentBox = $('#sentBox');
const formError = $('#formError');

// Máscara simples de telefone
$('#f-whats').addEventListener('input', (e) => {
  const d = e.target.value.replace(/\D/g, '').slice(0, 11);
  let out = d;
  if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  e.target.value = out;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = $('#f-nome');
  const whats = $('#f-whats');
  const okNome = nome.value.trim().length > 1;
  const okWhats = whats.value.replace(/\D/g, '').length >= 10;
  nome.classList.toggle('invalid', !okNome);
  whats.classList.toggle('invalid', !okWhats);
  if (!okNome || !okWhats) {
    formError.hidden = false;
    (okNome ? whats : nome).focus();
    return;
  }
  formError.hidden = true;

  const data = $('#f-data').value;
  const dataBr = data ? data.split('-').reverse().join('/') : 'a combinar';
  const msg = $('#f-msg').value.trim();
  const texto = [
    'Oi, Breno! Vim pelo seu site e quero um orçamento.',
    `Nome: ${nome.value.trim()}`,
    `WhatsApp: ${whats.value}`,
    `Serviço: ${tipo.value}`,
    `Data desejada: ${dataBr}`,
    msg ? `Ideia: ${msg}` : '',
  ].filter(Boolean).join('\n');

  $('#sentService').textContent = tipo.value;
  $('#sentWa').href = `${waBase}?text=${encodeURIComponent(texto)}`;
  form.hidden = true;
  sentBox.hidden = false;
});

$('#resetForm').addEventListener('click', () => {
  form.reset();
  sentBox.hidden = true;
  form.hidden = false;
  $('#f-nome').focus();
});
