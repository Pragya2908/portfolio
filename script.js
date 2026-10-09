const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const toast = document.querySelector('.toast');
const hero = document.querySelector('.hero');
const heroArt = document.querySelector('.hero-art');
const illustrationModal = document.querySelector('#illustration-modal');
const illustrationModalTitle = document.querySelector('#illustration-modal-title');
const illustrationModalType = document.querySelector('#illustration-modal-type');
const illustrationModalImage = document.querySelector('#illustration-modal-image');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    mobileNav.classList.toggle('open', !isOpen);
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      mobileNav.classList.remove('open');
    });
  });
}

if (hero && heroArt && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  hero.addEventListener('pointermove', (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 16;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;
    heroArt.style.setProperty('--mx', `${x.toFixed(2)}px`);
    heroArt.style.setProperty('--my', `${y.toFixed(2)}px`);
  });

  hero.addEventListener('pointerleave', () => {
    heroArt.style.setProperty('--mx', '0px');
    heroArt.style.setProperty('--my', '0px');
  });
}

const flipbook = document.querySelector('.flipbook-card');
const flipPage = flipbook?.querySelector('.portrait-project-page');
const flipProjects = [
  { className: 'project-one', kicker: 'PROJECT PREVIEW / 01', title: 'HOMERO', meta: 'Branding + digital + social media', image: 'assests/images/homero tile image.png', alt: "Homero's warm wooden dining table", href: '#detail-project-1' },
  { className: 'project-two', kicker: 'PROJECT PREVIEW / 02', title: 'MEVO', meta: 'Branding + packaging design', image: 'assests/images/mevo 2.png', alt: 'Mevo natural cashew packaging', href: '#detail-project-3' },
  { className: 'project-three', kicker: 'PROJECT PREVIEW / 03', title: 'GOVINDAM', meta: 'Brand identity + packaging', image: 'assests/images/govindam tile image.png', alt: 'Govindam sweets and snacks packaging', href: '#detail-project-5' },
];
// Index zero represents the original portrait; each click advances once.
let flipIndex = 0;

function flipToProject() {
  if (!flipbook || !flipPage) return;
  flipIndex = (flipIndex + 1) % (flipProjects.length + 1);
  flipPage.classList.remove('is-flipping');
  void flipPage.offsetWidth;

  // State zero is the original portrait card. Keep it in the loop after the
  // three project pages so the primary hero artwork is never lost.
  if (flipIndex === 0) {
    flipbook.classList.remove('project-one', 'project-two', 'project-three', 'has-project');
    flipPage.classList.remove('is-active');
    flipPage.setAttribute('aria-hidden', 'true');
    flipbook.setAttribute('aria-label', 'Cat illustration. Click to flip through three project previews.');
    return;
  }

  const project = flipProjects[flipIndex - 1];
  flipbook.classList.remove('project-one', 'project-two', 'project-three');
  flipbook.classList.add(project.className, 'has-project');
  flipPage.innerHTML = `<img class="page-image" src="${project.image}" alt="${project.alt}"><span class="page-meta">${project.meta}</span><a class="page-arrow" href="${project.href}" aria-label="Open ${project.title} project details">↗</a>`;
  flipPage.classList.add('is-active', 'is-flipping');
  flipPage.setAttribute('aria-hidden', 'false');
  flipbook.setAttribute('aria-label', `${project.kicker}: ${project.meta}. Click to see the next project.`);
}

if (flipbook) {
  flipbook.addEventListener('click', (event) => {
    if (!event.target.closest('.page-arrow')) flipToProject();
  });
  flipbook.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      flipToProject();
    }
  });
}

const motionNav = document.querySelector('.project-motion-nav');
const vinylRecord = document.querySelector('.project-showcase-ring');
const selectedWorkAudio = document.querySelector('#selected-work-audio');
const vinylAudioToggle = document.querySelector('#vinyl-audio-toggle');
const hoverPreview = document.querySelector('.project-hover-preview');
const hoverPreviewImage = hoverPreview?.querySelector('img');
const hoverPreviewTitle = hoverPreview?.querySelector('b');
const hoverPreviewMeta = hoverPreview?.querySelector('em');
let activePreviewLink = null;

if (vinylRecord && selectedWorkAudio && vinylAudioToggle) {
  let audioPinnedByButton = false;
  const audioToggleIcon = vinylAudioToggle.querySelector('.audio-toggle-icon');
  const audioToggleLabel = vinylAudioToggle.querySelector('.audio-toggle-label');

  function updateVinylAudioButton() {
    const isPlaying = !selectedWorkAudio.paused;
    vinylAudioToggle.setAttribute('aria-pressed', String(isPlaying));
    vinylAudioToggle.setAttribute('aria-label', isPlaying ? 'Pause selected work soundtrack' : 'Play selected work soundtrack');
    if (audioToggleIcon) audioToggleIcon.textContent = isPlaying ? 'Ⅱ' : '▶';
    if (audioToggleLabel) audioToggleLabel.textContent = isPlaying ? 'Pause sound' : 'Play sound';
  }

  vinylRecord.addEventListener('pointerenter', () => {
    if (selectedWorkAudio.paused) {
      selectedWorkAudio.play().catch(() => updateVinylAudioButton());
    }
  });
  vinylRecord.addEventListener('pointerleave', () => {
    if (!audioPinnedByButton) selectedWorkAudio.pause();
  });

  vinylAudioToggle.addEventListener('click', () => {
    if (selectedWorkAudio.paused) {
      audioPinnedByButton = true;
      selectedWorkAudio.play().catch(() => {
        audioPinnedByButton = false;
        updateVinylAudioButton();
      });
    } else {
      audioPinnedByButton = false;
      selectedWorkAudio.pause();
    }
  });

  selectedWorkAudio.addEventListener('play', updateVinylAudioButton);
  selectedWorkAudio.addEventListener('pause', updateVinylAudioButton);
  selectedWorkAudio.addEventListener('ended', updateVinylAudioButton);
  updateVinylAudioButton();
}

function positionProjectPreview(link) {
  if (!motionNav || !hoverPreview) return;
  const showcase = motionNav.closest('.project-showcase');
  if (!showcase) return;
  const linkRect = link.getBoundingClientRect();
  const showcaseRect = showcase.getBoundingClientRect();
  const linkX = linkRect.left - showcaseRect.left + linkRect.width / 2;
  const linkY = linkRect.top - showcaseRect.top + linkRect.height / 2;
  const centerX = showcaseRect.width / 2;
  const centerY = showcaseRect.height / 2;
  const dx = linkX - centerX;
  const dy = linkY - centerY;
  const length = Math.hypot(dx, dy) || 1;
  const outward = window.innerWidth <= 800 ? 92 : window.innerWidth <= 1000 ? 108 : 122;
  const cardHalfWidth = Math.min((hoverPreview.offsetWidth || 240) / 2 + 10, showcaseRect.width / 2 - 8);
  const cardHalfHeight = Math.min((hoverPreview.offsetHeight || 156) / 2 + 10, showcaseRect.height / 2 - 8);
  const x = Math.min(Math.max(linkX + (dx / length) * outward, cardHalfWidth), showcaseRect.width - cardHalfWidth);
  const y = Math.min(Math.max(linkY + (dy / length) * outward, cardHalfHeight), showcaseRect.height - cardHalfHeight);
  const tilt = `${Math.max(-4, Math.min(4, (dx / length) * 3)).toFixed(2)}deg`;
  hoverPreview.style.setProperty('--preview-x', `${x}px`);
  hoverPreview.style.setProperty('--preview-y', `${y}px`);
  hoverPreview.style.setProperty('--preview-tilt', tilt);
}

function showProjectPreview(link) {
  if (!hoverPreview || !hoverPreviewImage || !hoverPreviewTitle || !hoverPreviewMeta) return;
  activePreviewLink = link;
  positionProjectPreview(link);
  hoverPreviewImage.src = link.dataset.previewImage;
  hoverPreviewTitle.textContent = link.dataset.previewTitle;
  hoverPreviewMeta.textContent = link.dataset.previewMeta;
  hoverPreview.setAttribute('aria-hidden', 'false');
  hoverPreview.classList.add('is-visible');
}

function hideProjectPreview() {
  activePreviewLink = null;
  hoverPreview?.classList.remove('is-visible');
  hoverPreview?.setAttribute('aria-hidden', 'true');
}

if (motionNav && hoverPreview) {
  motionNav.querySelectorAll('.preview-link').forEach((link) => {
    link.addEventListener('pointerenter', () => showProjectPreview(link));
    link.addEventListener('focus', () => showProjectPreview(link));
    link.addEventListener('pointerleave', hideProjectPreview);
    link.addEventListener('blur', hideProjectPreview);
  });
  motionNav.addEventListener('pointerleave', hideProjectPreview);
  window.addEventListener('resize', () => {
    if (activePreviewLink) positionProjectPreview(activePreviewLink);
  });
}

if (illustrationModal) {
  document.querySelectorAll('.illustration-tile').forEach((tile) => {
    tile.addEventListener('click', () => {
      illustrationModalTitle.textContent = tile.dataset.illustrationTitle;
      illustrationModalType.textContent = tile.dataset.illustrationType;
      if (illustrationModalImage) {
        illustrationModalImage.src = tile.dataset.illustrationImage;
        illustrationModalImage.alt = tile.dataset.illustrationTitle;
      }
      illustrationModal.className = `illustration-modal ${tile.classList[1]}`;
      illustrationModal.showModal();
    });
  });

  illustrationModal.querySelector('.modal-close').addEventListener('click', () => illustrationModal.close());
  illustrationModal.addEventListener('click', (event) => {
    if (event.target === illustrationModal) illustrationModal.close();
  });
}

const caseStudyModal = document.querySelector('#case-study-modal');
const caseStudyTitle = document.querySelector('#case-study-title');
const caseStudyNumber = document.querySelector('#case-study-number');
const caseStudyCategory = document.querySelector('#case-study-category');
const caseStudyTagline = document.querySelector('#case-study-tagline');
const caseStudySections = document.querySelector('#case-study-sections');
const caseStudies = {
  homero: {
    number: '01 / HOMERO', title: 'HOMERO', category: 'Branding / Digital / Social Media', tagline: 'A brand world built to move.',
    sections: [
  [
    'The brief',
    'Build a connected brand presence that can move confidently across identity, digital touchpoints, and social media.',
    'assests/images/homero brand guidelines.png',
    'Homero project brief'
  ],
  [
    'The idea',
    'A flexible visual system with enough character to be memorable and enough range to stay useful across everyday communication.',
    'assests/images/homero wireframes.png',
    'Homero visual identity concept'
  ],
  [
    'The direction',
    'Bold type, graphic rhythm, and modular compositions create a lively identity that feels clear at a glance.',
    'assests/images/homero website mockup.png',
    'Homero design direction'
  ],
  [
    'The outcome',
    'A scalable brand world ready for launch assets, digital moments, social templates, and future campaign chapters.',
    'assests/images/homero campaigns.png',
    'Homero brand outcome'
  ]
]
  },
  supply6: {
    number: '02 / SUPPLY SIX', title: 'SUPPLY SIX', category: 'Brand Identity / Digital / Packaging', tagline: 'Everyday nutrition, made easier to choose.',
    sections: [
      ['The brief', 'Create a clear, energetic digital presence for Supply6, a daily nutrition brand designed to help people fill common gaps in their diets.', 'assests/images/supply6.1.png', 'Supply6 project overview'],
      ['The idea', 'Make everyday wellness feel approachable through a confident visual system, straightforward product stories, and a bright, modern tone.', 'assests/images/supply 6 .2.png', 'Supply6 visual concept'],
      ['The direction', 'Translate the brand into a focused online shop that helps people explore products by their everyday health goals.', 'assests/images/supply6.3.png', 'Supply6 website design'],
      ['The outcome', 'A cohesive digital experience bringing product discovery, wellness education, and the Supply6 brand together.', 'assests/images/supply 6.4.png', 'Supply6 final design']
    ]
  },
  haven: {
    number: '04 / HAVEN', title: 'HAVEN', category: 'UI/UX / Product Design', tagline: 'Designing a calmer product experience.',
    sections: [
      ['The challenge', 'Turn a complex product journey into an interface that feels approachable, focused, and easy to navigate.', 'assests/images/haven 1.png', 'Haven product challenge'],
      ['The idea', 'Give every interaction room to breathe: clear hierarchy, quiet confidence, and helpful moments that guide rather than interrupt.', 'assests/images/haven 2.png', 'Haven interface concept'],
      ['The direction', 'A product system built around purposeful layouts, intuitive flows, and a visual language that balances utility with warmth.', 'assests/images/haven 3.png', 'Haven product design direction'],
      ['The outcome', 'A considered UI/UX foundation for key screens, responsive states, product touchpoints, and future feature growth.', 'assests/images/haven 4.png', 'Haven product design outcome']
    ]
  },
  govindam: {
    number: '05 / GOVINDAM', title: 'GOVINDAM', category: 'Brand Identity / Packaging', tagline: 'A healthier kind of indulgence.',
    sections: [
      ['The brief', 'Create a premium sweets and snacks identity that celebrates pure desi ghee, Indian heritage, and a generous sense of hospitality.', 'assests/images/govindam 1.png', 'Govindam identity and colour palette'],
      ['The idea', 'Bring Govindam’s story to life through a peacock feather mark, botanical details, and a rich forest green and antique gold palette.', 'assests/images/govindam 2.png', 'Govindam brand world by the river'],
      ['The direction', 'Pair refined typography and ornamental patterns with tactile packaging that feels rooted, warm, and celebratory.', 'assests/images/govindam 3.png', 'Govindam sweets packaging'],
      ['The outcome', 'A cohesive visual system for the logo, packaging, product imagery, and future brand touchpoints.', 'assests/images/govindam 4.png', 'Govindam brand outcome']
    ]
  },
  mevo: {
    number: '03 / MEVO', title: 'MEVO', category: 'Branding / Packaging Design', tagline: 'A fresh identity for everyday nourishment.',
    sections: [
      ['The brief', 'Create a premium dry-fruit and healthy-snacking brand built around quality, freshness, and natural nutrition.', 'assests/images/mevo 1.png', 'Mevo brand brief'],
      ['The idea', 'Bring the journey from source to pack into a warm, earthy visual world that feels premium and approachable.', 'assests/images/mevo 2.png', 'Mevo brand concept'],
      ['The direction', 'A flexible colour system and illustrated landscape language carry across multiple product variants while keeping the family cohesive.', 'assests/images/mevo 3.png', 'Mevo packaging design'],
      ['The outcome', 'A packaging identity that makes everyday nourishment feel considered, natural, and easy to choose.', 'assests/images/mevo 4.png', 'Mevo product packaging']
    ]
  },
  social: {
    number: '06 / SOCIAL MEDIA', title: 'SOCIAL MEDIA', category: 'Content / Campaign Design', tagline: 'Content with a campaign pulse.',
    sections: [
      ['The challenge', 'Make campaign ideas feel immediate and recognizable across a fast-moving social feed.', 'assests/images/social media 1.jpeg', 'Social media campaign artwork one'],
      ['The idea', 'Build a repeatable content language that gives every post a strong first impression without making the system feel repetitive.', 'assests/images/social media 2.jpeg', 'Social media campaign artwork two'],
      ['The direction', 'Kinetic type, graphic hooks, and modular layouts create a social-first toolkit for launches, stories, and always-on content.', 'assests/images/social media 3.jpg', 'Social media campaign artwork three'],
      ['The outcome', 'A campaign-ready system that helps ideas travel consistently across formats, moments, and audience touchpoints.', 'assests/images/social media 4.jpg', 'Social media campaign artwork four']
    ]
  }
};

function renderCaseStudy(key) {
  const project = caseStudies[key];
  if (!project || !caseStudyModal) return;
  caseStudyNumber.textContent = project.number;
  caseStudyTitle.textContent = project.title;
  caseStudyCategory.textContent = project.category;
  caseStudyTagline.textContent = project.tagline;
  caseStudyModal.className = `case-study-modal case-${key}`;
  caseStudySections.innerHTML = project.sections.map(([heading, copy, imageSrc, imageAlt], index) => `<section class="case-study-block"><div class="case-study-label">0${index + 1} / ${heading}</div><div class="case-study-copy"><p>${copy}</p>${imageSrc ? `<img class="case-study-image" src="${imageSrc}" alt="${imageAlt || heading}" loading="lazy">` : `<div class="case-image-slot" aria-label="Image placeholder for ${heading}"><span>IMAGE SLOT</span><small>Add project image later</small></div>`}</div></section>`).join('');
  caseStudyModal.showModal();
}

if (caseStudyModal) {
  document.querySelectorAll('.case-study-trigger').forEach((trigger) => trigger.addEventListener('click', () => renderCaseStudy(trigger.dataset.project)));
  caseStudyModal.querySelector('.case-study-close').addEventListener('click', () => caseStudyModal.close());
  caseStudyModal.addEventListener('click', (event) => {
    if (event.target === caseStudyModal) caseStudyModal.close();
  });
}

const publicationModal = document.querySelector('#publication-modal');
const publicationTrigger = document.querySelector('#publication-trigger');
if (publicationModal && publicationTrigger) {
  publicationTrigger.addEventListener('click', () => publicationModal.showModal());
  publicationModal.querySelector('.modal-close').addEventListener('click', () => publicationModal.close());
  publicationModal.addEventListener('click', (event) => {
    if (event.target === publicationModal) publicationModal.close();
  });
}

const testimonialButtons = document.querySelectorAll('.testimonial-controls button');
testimonialButtons.forEach((button) => {
  button.addEventListener('click', () => {
    toast.textContent = 'More kind words are coming soon.';
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2600);
  });
});

const projectCards = document.querySelectorAll('.project-card');
if ('IntersectionObserver' in window && projectCards.length) {
  const projectObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  projectCards.forEach((card) => projectObserver.observe(card));
} else {
  projectCards.forEach((card) => card.classList.add('is-visible'));
}
