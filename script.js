const beds = [
  { name: 'Aurora Luxury Bed', sub: 'Plush · Luxury', thickness: '12"', feel: 'Plush', price: '$1,290',
    desc: 'Upholstered headboard with a 12-inch plush-top. Hotel-soft, sink-in comfort.',
    img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80' },
  { name: 'OrthoFirm Support', sub: 'Firm · Orthopedic', thickness: '10"', feel: 'Firm', price: '$1,090',
    desc: 'A firmer core engineered for spinal alignment and lasting back relief.',
    img: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?auto=format&fit=crop&w=1600&q=80' },
  { name: 'Grand King Platform', sub: 'Medium-firm · King', thickness: '14"', feel: 'Medium-firm', price: '$1,640',
    desc: 'Extra-wide king with a storage base and a balanced, supportive feel.',
    img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=80' },
  { name: 'Cloud Pillowtop', sub: 'Soft · Luxury', thickness: '13"', feel: 'Soft', price: '$1,420',
    desc: 'A deep pillowtop layer that wraps you in cloud-like softness.',
    img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=80' },
  { name: 'Linen Low Frame', sub: 'Medium · Modern', thickness: '11"', feel: 'Medium', price: '$980',
    desc: 'A low, linen-wrapped frame with a clean, modern silhouette.',
    img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80' },
  { name: 'Serene Storage Bed', sub: 'Medium-firm · King', thickness: '14"', feel: 'Medium-firm', price: '$1,540',
    desc: 'Generous under-bed storage with a quietly elegant headboard.',
    img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=80' },
  { name: 'Noir Canopy Bed', sub: 'Plush · Statement', thickness: '12"', feel: 'Plush', price: '$1,780',
    desc: 'A striking canopy frame that anchors the room in calm luxury.',
    img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80' },
];

let activeBed = 0;
let useLayerB = false;

function setActiveBed(idx) {
  activeBed = (idx + beds.length) % beds.length;
  renderBeds();
}

function renderBeds() {
  const list = document.getElementById('beds-list');
  list.innerHTML = '';

  beds.forEach((bed, idx) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'bed-row' + (idx === activeBed ? ' active' : '');
    row.innerHTML = `
      <div class="bed-bar"></div>
      <div>
        <div class="bed-name">${bed.name}</div>
        <div class="bed-sub">${bed.sub}</div>
      </div>
    `;
    row.addEventListener('click', () => setActiveBed(idx));
    list.appendChild(row);
  });

  const dots = document.getElementById('bed-dots');
  dots.innerHTML = '';
  beds.forEach((bed, idx) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot-btn' + (idx === activeBed ? ' active' : '');
    dot.setAttribute('aria-label', `Go to ${bed.name}`);
    dot.addEventListener('click', () => setActiveBed(idx));
    dots.appendChild(dot);
  });

  const active = beds[activeBed];
  const layerA = document.getElementById('bed-img-a');
  const layerB = document.getElementById('bed-img-b');
  const showLayer = useLayerB ? layerB : layerA;
  const hideLayer = useLayerB ? layerA : layerB;
  showLayer.style.backgroundImage = `url('${active.img}')`;
  showLayer.classList.add('active');
  hideLayer.classList.remove('active');
  useLayerB = !useLayerB;

  document.getElementById('bed-name').textContent = active.name;
  document.getElementById('bed-desc').textContent = active.desc;
  document.getElementById('bed-thickness').textContent = active.thickness;
  document.getElementById('bed-feel').textContent = active.feel;
  document.getElementById('bed-price').textContent = active.price;
}

document.getElementById('bed-prev').addEventListener('click', () => setActiveBed(activeBed - 1));
document.getElementById('bed-next').addEventListener('click', () => setActiveBed(activeBed + 1));

renderBeds();

const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== Scroll reveal ===== */

if (!reducedMotion) {
  const revealSelectors = [
    '.about-intro', '.center-title', '.row-head', '.beds-grid',
    '.delivery-card', '.contact-head', '.stores-card', '.footer-cta h2',
  ];
  document.querySelectorAll(revealSelectors.join(',')).forEach((el) => el.classList.add('reveal'));

  const staggerGroupSelectors = [
    '.about-pair', '.about-row2', '.grid-3', '.duvets-grid', '.contact-cards', '.stores-grid',
  ];
  staggerGroupSelectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        child.classList.add('reveal');
        child.style.transitionDelay = `${i * 90}ms`;
      });
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
}

/* ===== Hero parallax + nav solidify (shared scroll listener) ===== */

const heroEl = document.querySelector('.hero');
const navEl = document.querySelector('.nav');
let scrollTicking = false;

function onScroll() {
  const y = window.scrollY;

  if (!reducedMotion && heroEl) {
    const heroHeight = heroEl.offsetHeight;
    if (y < heroHeight) {
      heroEl.style.backgroundPositionY = `calc(38% + ${y * 0.3}px)`;
    }
  }

  navEl.classList.toggle('scrolled', y > 24);
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(onScroll);
    scrollTicking = true;
  }
});
onScroll();

/* ===== Scrollspy active nav link ===== */

const navSections = ['top', 'beds', 'range', 'pillows', 'duvets', 'contact']
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.querySelectorAll('a').forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });

navSections.forEach((section) => spyObserver.observe(section));
