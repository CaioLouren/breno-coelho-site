// ============================================================
// CONFIGURAÇÃO — tudo que o Breno precisa trocar fica aqui
// ============================================================
const CONFIG = {
  // 55 + DDD + número, só dígitos
  whatsapp: '558189085099',
  // Gmail do Breno para receber os pedidos (deixe '' para desligar o envio por e-mail)
  // Na 1ª vez, o FormSubmit manda um e-mail de ativação: é só clicar em "Activate".
  email: '',
  // Link da plataforma de galerias (Alboom, Pixieset, Google Drive...)
  galeriaClientes: '#',

  sinal: 0.3,              // 30% para reservar a data
  antecedenciaDias: 2,     // agenda a partir de daqui a 2 dias
  mesesAFrente: 3,         // até quantos meses à frente dá pra agendar
  diasFechados: [],        // 0=domingo ... 6=sábado. Ex.: [1] fecha as segundas

  // Datas totalmente indisponíveis (AAAA-MM-DD) — valores de TESTE
  datasBloqueadas: ['2026-11-21', '2026-11-29', '2026-12-06', '2026-12-24', '2026-12-25', '2026-12-31'],
  // Horários já reservados por data — valores de TESTE
  ocupados: {
    '2026-11-20': ['16:30'],
    '2026-11-22': ['06:00', '15:00'],
    '2026-11-28': ['16:00', '19:00'],
  },

  // Preços FICTÍCIOS para teste
  servicos: [
    { id: 'individual', nome: 'Ensaio individual', preco: 250, info: '1h · 20 fotos editadas · 1 local', horarios: ['06:00', '07:30', '15:30', '16:30'] },
    { id: 'casal', nome: 'Casal ou família', preco: 350, info: '2h · 40 fotos editadas · até 2 locais', horarios: ['06:00', '15:00', '16:00'] },
    { id: 'esportivos', nome: 'Eventos esportivos', preco: 400, info: 'Até 2h · jogos, corridas, campeonatos', horarios: ['07:00', '09:00', '15:00', '16:00', '19:00', '21:00'] },
    { id: 'eventos', nome: 'Eventos', preco: 600, info: 'Até 3h · aniversários, 15 anos, formaturas', horarios: ['10:00', '14:00', '16:00', '19:00', '20:00'] },
  ],
  extras: [
    { id: 'local', nome: 'Local extra', preco: 80 },
    { id: 'fotos', nome: '+10 fotos editadas', preco: 100 },
    { id: 'expressa', nome: 'Entrega expressa (48h)', preco: 70 },
    { id: 'hora', nome: 'Hora adicional', preco: 150 },
  ],
};

// ============================================================
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const waBase = `https://wa.me/${CONFIG.whatsapp}`;
const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const pad = (n) => String(n).padStart(2, '0');
const isoOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const params = new URLSearchParams(location.search);

// ---------- Básico (todas as páginas) ----------
$$('.js-year').forEach((el) => { el.textContent = new Date().getFullYear(); });
$$('.js-wa').forEach((a) => {
  a.href = `${waBase}?text=${encodeURIComponent(a.dataset.msg || 'Oi, Breno! Vim pelo seu site e queria saber mais.')}`;
  a.target = '_blank';
  a.rel = 'noopener';
});
$$('.js-gallery').forEach((a) => {
  a.href = CONFIG.galeriaClientes;
  if (CONFIG.galeriaClientes !== '#') { a.target = '_blank'; a.rel = 'noopener'; }
});
$$('.js-mail').forEach((a) => {
  if (!CONFIG.email) return;
  a.hidden = false;
  a.href = `mailto:${CONFIG.email}`;
  const t = $('.js-mail-text', a); if (t) t.textContent = CONFIG.email;
});
$$('[data-sinal]').forEach((el) => { el.textContent = `${Math.round(CONFIG.sinal * 100)}%`; });

// Menu mobile
const menuBtn = $('#menuBtn');
const mobileMenu = $('#mobileMenu');
if (menuBtn && mobileMenu) {
  const setMenu = (open) => {
    mobileMenu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  menuBtn.addEventListener('click', () => setMenu(mobileMenu.hidden));
  $$('a', mobileMenu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
}

// ---------- Portfólio: filtro + lightbox ----------
const shots = $$('.shot');
if (shots.length) {
  const applyFilter = (f) => {
    $$('.chip').forEach((c) => {
      const on = c.dataset.filter === f;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', String(on));
    });
    shots.forEach((s) => { s.hidden = !(f === 'todos' || s.dataset.cat === f); });
  };
  $$('.chip').forEach((chip) => chip.addEventListener('click', () => applyFilter(chip.dataset.filter)));
  if (params.get('cat')) applyFilter(params.get('cat'));

  const lb = $('#lightbox');
  const lbImg = $('#lbImg');
  const lbCaption = $('#lbCaption');
  let current = 0;
  let lastFocus = null;
  const visible = () => shots.filter((s) => !s.hidden);
  const show = (i) => {
    const list = visible();
    current = (i + list.length) % list.length;
    const s = list[current];
    const img = $('img', s);
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = '';
    lbCaption.append(s.dataset.title);
    const meta = document.createElement('span');
    meta.className = 'muted';
    meta.textContent = ` · ${s.dataset.place} · ${current + 1} de ${list.length}`;
    lbCaption.append(meta);
  };
  const open = (s) => {
    lastFocus = document.activeElement;
    show(visible().indexOf(s));
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#lbClose').focus();
  };
  const close = () => {
    lb.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };
  shots.forEach((s) => $('.thumb', s).addEventListener('click', () => open(s)));
  $('#lbClose').addEventListener('click', close);
  $('#lbPrev').addEventListener('click', () => show(current - 1));
  $('#lbNext').addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  let tx = null;
  lb.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    tx = null;
  });
}

// ---------- Agendamento ----------
const booking = $('#agendar');
if (booking) {
  const state = { servico: null, extras: new Set(), data: null, hora: null, step: 1 };
  const viewMonth = new Date(); viewMonth.setDate(1);

  // Etapa 1 — serviços e extras
  const svcBox = $('#bkServices');
  CONFIG.servicos.forEach((s) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'svc';
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', 'false');
    b.dataset.id = s.id;
    b.innerHTML = '<span class="svc-top"><strong></strong><span class="svc-price"></span></span><small></small>';
    $('strong', b).textContent = s.nome;
    $('.svc-price', b).textContent = brl(s.preco);
    $('small', b).textContent = s.info;
    b.addEventListener('click', () => pickService(s.id));
    svcBox.append(b);
  });
  const exBox = $('#bkExtras');
  CONFIG.extras.forEach((x) => {
    const l = document.createElement('label');
    l.className = 'extra';
    l.innerHTML = '<input type="checkbox"><span class="extra-name"></span><span class="extra-price"></span>';
    const cb = $('input', l);
    cb.value = x.id;
    $('.extra-name', l).textContent = x.nome;
    $('.extra-price', l).textContent = `+ ${brl(x.preco)}`;
    cb.addEventListener('change', () => {
      if (cb.checked) state.extras.add(x.id); else state.extras.delete(x.id);
      updateTotals();
    });
    exBox.append(l);
  });

  const svc = () => CONFIG.servicos.find((s) => s.id === state.servico);
  const extrasSel = () => CONFIG.extras.filter((x) => state.extras.has(x.id));
  const total = () => (svc() ? svc().preco : 0) + extrasSel().reduce((a, x) => a + x.preco, 0);
  function updateTotals() {
    $$('.js-total', booking).forEach((el) => { el.textContent = brl(total()); });
    $('#bkSinal').textContent = brl(total() * CONFIG.sinal);
  }
  function pickService(id) {
    state.servico = id;
    $$('.svc', svcBox).forEach((b) => b.setAttribute('aria-checked', String(b.dataset.id === id)));
    // horário escolhido pode não existir no novo serviço
    if (state.hora && !svc().horarios.includes(state.hora)) state.hora = null;
    updateTotals();
    renderSlots();
  }

  // Etapa 2 — calendário e horários
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const minDate = new Date(today); minDate.setDate(minDate.getDate() + CONFIG.antecedenciaDias);
  const maxDate = new Date(today); maxDate.setMonth(maxDate.getMonth() + CONFIG.mesesAFrente);
  const dayFree = (d) => {
    const iso = isoOf(d);
    if (d < minDate || d > maxDate) return false;
    if (CONFIG.diasFechados.includes(d.getDay())) return false;
    if (CONFIG.datasBloqueadas.includes(iso)) return false;
    const all = svc() ? svc().horarios : CONFIG.servicos[0].horarios;
    const busy = CONFIG.ocupados[iso] || [];
    return all.some((h) => !busy.includes(h));
  };
  function renderCalendar() {
    const grid = $('#calGrid');
    grid.textContent = '';
    const y = viewMonth.getFullYear();
    const m = viewMonth.getMonth();
    const label = viewMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    $('#calMonth').textContent = label.charAt(0).toUpperCase() + label.slice(1);
    const firstDow = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    for (let i = 0; i < firstDow; i++) grid.append(document.createElement('span'));
    for (let d = 1; d <= days; d++) {
      const date = new Date(y, m, d);
      const iso = isoOf(date);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'day';
      b.textContent = d;
      const free = dayFree(date);
      b.disabled = !free;
      b.setAttribute('aria-label', date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) + (free ? '' : ' — indisponível'));
      if (iso === isoOf(today)) b.classList.add('is-today');
      if (state.data === iso) { b.classList.add('is-on'); b.setAttribute('aria-pressed', 'true'); }
      b.addEventListener('click', () => { state.data = iso; state.hora = null; renderCalendar(); renderSlots(); });
      grid.append(b);
    }
    const prevLimit = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextLimit = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
    $('#calPrev').disabled = viewMonth <= prevLimit;
    $('#calNext').disabled = viewMonth >= nextLimit;
  }
  $('#calPrev').addEventListener('click', () => { viewMonth.setMonth(viewMonth.getMonth() - 1); renderCalendar(); });
  $('#calNext').addEventListener('click', () => { viewMonth.setMonth(viewMonth.getMonth() + 1); renderCalendar(); });

  const golden = (h) => { const [hh, mm] = h.split(':').map(Number); const t = hh * 60 + mm; return t <= 7 * 60 + 30 || (t >= 15 * 60 + 30 && t <= 17 * 60); };
  function renderSlots() {
    const box = $('#slots');
    box.textContent = '';
    if (!state.data) {
      $('#slotsLabel').textContent = 'Escolha um dia no calendário';
      $('#slotHint').textContent = '';
    } else {
      const d = new Date(`${state.data}T12:00:00`);
      $('#slotsLabel').textContent = `Horários para ${d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}`;
      const busy = CONFIG.ocupados[state.data] || [];
      (svc() ? svc().horarios : CONFIG.servicos[0].horarios).forEach((h) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'slot';
        b.setAttribute('role', 'radio');
        b.setAttribute('aria-checked', String(state.hora === h));
        b.disabled = busy.includes(h);
        b.innerHTML = '<strong></strong><small></small>';
        $('strong', b).textContent = h;
        $('small', b).textContent = busy.includes(h) ? 'Reservado' : (golden(h) ? 'Luz dourada' : 'Disponível');
        b.addEventListener('click', () => { state.hora = h; renderSlots(); });
        box.append(b);
      });
      $('#slotHint').textContent = 'Dica: horários de luz dourada (começo da manhã e fim da tarde) rendem as fotos mais bonitas.';
    }
    $('#toStep3').disabled = !(state.data && state.hora);
  }

  // Etapa 3 — dados
  $('#f-whats').addEventListener('input', (e) => {
    const d = e.target.value.replace(/\D/g, '').slice(0, 11);
    let out = d;
    if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    e.target.value = out;
  });
  const val = (id) => $(id).value.trim();
  function validateData() {
    const errs = [];
    const nome = $('#f-nome'); const whats = $('#f-whats'); const email = $('#f-email');
    const okNome = val('#f-nome').length > 1;
    const okWhats = val('#f-whats').replace(/\D/g, '').length >= 10;
    const okEmail = !val('#f-email') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('#f-email'));
    nome.classList.toggle('invalid', !okNome); nome.setAttribute('aria-invalid', String(!okNome));
    whats.classList.toggle('invalid', !okWhats); whats.setAttribute('aria-invalid', String(!okWhats));
    email.classList.toggle('invalid', !okEmail); email.setAttribute('aria-invalid', String(!okEmail));
    if (!okNome) errs.push('seu nome');
    if (!okWhats) errs.push('um WhatsApp válido');
    if (!okEmail) errs.push('um e-mail válido (ou deixe em branco)');
    const box = $('#formError');
    if (errs.length) {
      box.textContent = `Falta preencher ${errs.join(', ')}.`;
      box.hidden = false;
      (!okNome ? nome : !okWhats ? whats : email).focus();
      return false;
    }
    box.hidden = true;
    return true;
  }

  // Etapa 4 — resumo, WhatsApp e e-mail
  const dataLonga = () => new Date(`${state.data}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
  function pedido() {
    return {
      servico: `${svc().nome} (${brl(svc().preco)})`,
      extras: extrasSel().length ? extrasSel().map((x) => `${x.nome} (+${brl(x.preco)})`).join(', ') : 'Nenhum',
      data: dataLonga(),
      hora: state.hora,
      local: val('#f-local') || 'A combinar',
      nome: val('#f-nome'),
      whats: val('#f-whats'),
      email: val('#f-email'),
      ideia: val('#f-msg'),
      total: brl(total()),
      sinal: brl(total() * CONFIG.sinal),
    };
  }
  function renderSummary() {
    const p = pedido();
    const rows = [
      ['Serviço', p.servico], ['Extras', p.extras], ['Data', p.data], ['Horário', p.hora],
      ['Local', p.local], ['Nome', p.nome], ['WhatsApp', p.whats],
    ];
    if (p.email) rows.push(['E-mail', p.email]);
    if (p.ideia) rows.push(['Ideia', p.ideia]);
    const dl = $('#bkSummary');
    dl.textContent = '';
    rows.forEach(([k, v]) => {
      const div = document.createElement('div');
      const dt = document.createElement('dt'); dt.textContent = k;
      const dd = document.createElement('dd'); dd.textContent = v;
      div.append(dt, dd); dl.append(div);
    });
    const linhas = [
      'Olá, Breno! Quero agendar pelo site.',
      '',
      `*Serviço:* ${p.servico}`,
      `*Extras:* ${p.extras}`,
      `*Data:* ${p.data}`,
      `*Horário:* ${p.hora}`,
      `*Local:* ${p.local}`,
      `*Total estimado:* ${p.total}`,
      `*Sinal (${Math.round(CONFIG.sinal * 100)}%):* ${p.sinal}`,
      '',
      `*Nome:* ${p.nome}`,
      `*WhatsApp:* ${p.whats}`,
    ];
    if (p.email) linhas.push(`*E-mail:* ${p.email}`);
    if (p.ideia) linhas.push(`*Ideia:* ${p.ideia}`);
    linhas.push('', 'Pode confirmar a disponibilidade?');
    $('#bkWa').href = `${waBase}?text=${encodeURIComponent(linhas.join('\n'))}`;
    $('#bkEmail').hidden = !CONFIG.email;
    $('#bkStatus').textContent = '';
  }

  let emailSent = false;
  async function sendEmail(silent) {
    if (!CONFIG.email || emailSent) return;
    const p = pedido();
    const status = $('#bkStatus');
    if (!silent) status.textContent = 'Enviando…';
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${CONFIG.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          _subject: `Novo agendamento: ${svc().nome} — ${p.data} às ${p.hora}`,
          _template: 'table',
          _captcha: 'false',
          ...(p.email ? { _replyto: p.email } : {}),
          Nome: p.nome, WhatsApp: p.whats, 'E-mail': p.email || '—',
          Serviço: p.servico, Extras: p.extras, Data: p.data, Horário: p.hora, Local: p.local,
          'Total estimado': p.total, Sinal: p.sinal, Ideia: p.ideia || '—',
        }),
      });
      if (!r.ok) throw new Error(r.status);
      emailSent = true;
      status.textContent = 'Pedido enviado para o e-mail do Breno. Ele confirma em até 24h.';
    } catch (err) {
      if (!silent) status.textContent = 'Não deu pra enviar o e-mail agora. Use o botão do WhatsApp.';
    }
  }
  $('#bkWa').addEventListener('click', () => {
    sendEmail(true);
    $('#bkStatus').textContent = 'Abrimos o WhatsApp com seu pedido pronto — é só tocar em enviar.';
  });
  $('#bkEmail').addEventListener('click', () => sendEmail(false));

  // Navegação entre etapas
  function go(n) {
    state.step = n;
    $$('.bk-panel', booking).forEach((p) => { p.hidden = Number(p.dataset.step) !== n; });
    $$('.bk-progress li', booking).forEach((li) => {
      const k = Number(li.dataset.p);
      li.classList.toggle('is-on', k === n);
      li.classList.toggle('is-done', k < n);
      if (k === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    if (n === 2) { renderCalendar(); renderSlots(); }
    if (n === 4) renderSummary();
    const title = $(`.bk-panel[data-step="${n}"] .bk-title`, booking);
    booking.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (title) { title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true }); }
  }
  $$('[data-next]', booking).forEach((b) => b.addEventListener('click', () => {
    if (state.step === 1 && !state.servico) {
      svcBox.classList.add('shake');
      setTimeout(() => svcBox.classList.remove('shake'), 500);
      return;
    }
    if (state.step === 3 && !validateData()) return;
    go(state.step + 1);
  }));
  $$('[data-back]', booking).forEach((b) => b.addEventListener('click', () => go(state.step - 1)));
  $('#bkRestart').addEventListener('click', () => {
    state.servico = null; state.extras.clear(); state.data = null; state.hora = null; emailSent = false;
    $$('.svc', svcBox).forEach((b) => b.setAttribute('aria-checked', 'false'));
    $$('input', exBox).forEach((c) => { c.checked = false; });
    $('#bkForm').reset();
    updateTotals();
    go(1);
  });

  // Serviço vindo do link (ex.: agendar.html?servico=esportivos)
  const pre = params.get('servico');
  if (pre && CONFIG.servicos.some((s) => s.id === pre)) pickService(pre);
  updateTotals();
}
