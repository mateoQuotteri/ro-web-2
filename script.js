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
     Reemplazá este número por el de WhatsApp real de Estudio POI
     (mismo formato que el botón de WhatsApp del bloque de contacto). */
  const WHATSAPP_NUMBER = '5491173620775';

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
});
