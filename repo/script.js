// ===========================================================
// ESTUDIO POI — interactions
// ===========================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.classList.toggle('nav-open', open);
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', false);
      document.body.classList.remove('nav-open');
    });
  });

  /* ---------- Scroll cue ---------- */
  document.getElementById('scrollCue').addEventListener('click', () => {
    document.getElementById('nosotros').scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Hero seal stamp-in (plays once) ---------- */
  const seal = document.getElementById('hero-seal');
  requestAnimationFrame(() => {
    setTimeout(() => seal.classList.add('is-stamping'), 250);
  });

  /* ---------- Service tabs ---------- */
  const tabBtns = document.querySelectorAll('.tabs__btn');
  const tabPanels = document.querySelectorAll('.tabs__panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.tab;
      tabBtns.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected','false'); });
      tabPanels.forEach(p => p.classList.remove('is-active'));
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected','true');
      document.querySelector(`.tabs__panel[data-panel="${idx}"]`).classList.add('is-active');
    });
  });

  /* ---------- Accordion ---------- */
  document.querySelectorAll('.accordion__item').forEach(item => {
    const trigger = item.querySelector('.accordion__trigger');
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.accordion__item').forEach(i => i.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });

  /* ---------- Process stepper (scroll driven) ---------- */
  const stepperSteps = document.querySelectorAll('.stepper__step');
  const stepperFill = document.getElementById('stepperFill');
  const finalStep = document.getElementById('finalStep');
  const stepperSection = document.getElementById('stepper');
  let stepperTriggered = false;

  const stepperObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !stepperTriggered) {
        stepperTriggered = true;
        stepperSteps.forEach((step, i) => {
          setTimeout(() => {
            step.classList.add('is-active');
            stepperFill.style.width = `${(i / (stepperSteps.length - 1)) * 100}%`;
            if (step === finalStep) {
              setTimeout(() => finalStep.classList.add('is-stamped'), 200);
            }
          }, i * 380);
        });
      }
    });
  }, { threshold: 0.5 });
  stepperObserver.observe(stepperSection);

  /* ---------- Nav active link highlight ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav__links a');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.nav__links a[href="#${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.style.color = '');
        link.style.color = 'var(--copper)';
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => navObserver.observe(s));

  /* ---------- Contact form -> WhatsApp ----------
     El número sale del atributo data-whatsapp del <body> de cada página,
     así cada versión (Argentina / United States) redirige al chat que corresponde. */
  const WHATSAPP_NUMBER = document.body.dataset.whatsapp || '5491130169196';

  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const mensaje = form.mensaje.value.trim();

    const texto =
      `Hola Estudio POI! Quiero hacer una consulta.\n\n` +
      `Nombre: ${nombre}\n` +
      `Email: ${email}\n` +
      `Mensaje: ${mensaje}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

    note.textContent = 'Te estamos redirigiendo a WhatsApp…';
    window.open(url, '_blank', 'noopener');
    form.reset();
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- WeChat: modal con el QR real ----------
     WeChat no tiene un link web que abra un chat como wa.me o t.me, así que
     al tocar el botón mostramos el QR real de la persona (WeChat lo pide
     escaneado) más su ID como alternativa para buscarla a mano. */
  const wechatModal = document.getElementById('wechatModal');
  if (wechatModal) {
    const modalImg = document.getElementById('wechatModalImg');
    const modalName = document.getElementById('wechatModalName');
    const modalIdText = document.getElementById('wechatModalId');
    const modalCopyBtn = document.getElementById('wechatModalCopy');
    let lastFocused = null;

    function openWechatModal(btn) {
      modalImg.src = btn.dataset.wechatQr;
      modalName.textContent = btn.dataset.wechatName || 'WeChat';
      modalIdText.textContent = btn.dataset.wechatId || '';
      lastFocused = document.activeElement;
      wechatModal.hidden = false;
      document.body.classList.add('nav-open'); // reutiliza el overflow:hidden que ya existe
      wechatModal.querySelector('.wechat-modal__close').focus();
    }
    function closeWechatModal() {
      wechatModal.hidden = true;
      document.body.classList.remove('nav-open');
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll('[data-wechat-qr]').forEach((btn) => {
      btn.addEventListener('click', () => openWechatModal(btn));
    });
    wechatModal.querySelectorAll('[data-wechat-close]').forEach((el) => {
      el.addEventListener('click', closeWechatModal);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !wechatModal.hidden) closeWechatModal();
    });

    if (modalCopyBtn) {
      const copyLabel = modalCopyBtn.querySelector('#wechatModalId');
      modalCopyBtn.addEventListener('click', async () => {
        const id = modalIdText.textContent;
        try {
          await navigator.clipboard.writeText(id);
        } catch (err) {
          const tmp = document.createElement('textarea');
          tmp.value = id;
          tmp.style.position = 'fixed';
          tmp.style.opacity = '0';
          document.body.appendChild(tmp);
          tmp.select();
          document.execCommand('copy');
          document.body.removeChild(tmp);
        }
        const copiedText = document.documentElement.lang === 'en' ? 'Copied!' : '¡Copiado!';
        const original = id;
        copyLabel.textContent = copiedText;
        setTimeout(() => { copyLabel.textContent = original; }, 1500);
      });
    }
  }

  /* ---------- Carrusel genérico (opiniones / empresas que confían) ----------
     Se auto-inicializa en cualquier bloque con [data-carousel]. Avanza solo
     cada data-autoplay ms (default 4000), y se puede navegar con flechas o puntos. */
  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const track = root.querySelector('[data-carousel-track]');
    if (!track) return;
    const prevBtn = root.querySelector('[data-carousel-prev]');
    const nextBtn = root.querySelector('[data-carousel-next]');
    const dotsWrap = root.querySelector('[data-carousel-dots]');
    const autoplayMs = parseInt(root.dataset.autoplay || '4000', 10);
    let timer = null;

    const pageCount = () => Math.max(1, Math.round(track.scrollWidth / track.clientWidth));
    const currentPage = () => Math.round(track.scrollLeft / track.clientWidth);

    function goTo(page) {
      const pages = pageCount();
      const target = ((page % pages) + pages) % pages;
      track.scrollTo({ left: target * track.clientWidth, behavior: 'smooth' });
    }

    function updateDots() {
      if (!dotsWrap) return;
      const page = currentPage();
      dotsWrap.querySelectorAll('button').forEach((d, i) => {
        d.classList.toggle('is-active', i === page);
      });
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      const pages = pageCount();
      for (let i = 0; i < pages; i++) {
        const b = document.createElement('button');
        b.setAttribute('aria-label', `Ir a la página ${i + 1}`);
        b.addEventListener('click', () => { goTo(i); resetAutoplay(); });
        dotsWrap.appendChild(b);
      }
      updateDots();
    }

    function resetAutoplay() {
      if (autoplayMs <= 0) return;
      clearInterval(timer);
      timer = setInterval(() => goTo(currentPage() + 1), autoplayMs);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(currentPage() - 1); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(currentPage() + 1); resetAutoplay(); });
    track.addEventListener('scroll', () => window.requestAnimationFrame(updateDots));
    root.addEventListener('mouseenter', () => clearInterval(timer));
    root.addEventListener('mouseleave', resetAutoplay);
    window.addEventListener('resize', buildDots);

    buildDots();
    resetAutoplay();
  });
});
