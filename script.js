/**
 * Best MEP Pvt Ltd - Luxury Animation & Interaction Engine
 * Pure Vanilla JavaScript (No Python, No heavy libraries)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroBannerSlider();
  initScrollEffects();
  initCounterAnimations();
  initScrollReveal();
  initServiceFilters();
  initLightbox();
  initContactForm();
  initBackToTop();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav a');

  // Sticky header blur & shadow on scroll
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Close mobile nav when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navToggle && navToggle.checked) {
        navToggle.checked = false;
      }
    });
  });

  // Active link tracking on scroll
  const sections = document.querySelectorAll('main > section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else if (link.getAttribute('href')?.startsWith('#') && !link.classList.contains('btn')) {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => navObserver.observe(sec));
}

/* ==========================================================================
   2. STATS NUMBER COUNTER ANIMATION
   ========================================================================== */
function initCounterAnimations() {
  const statsElements = document.querySelectorAll('.stat-count');
  if (!statsElements.length) return;

  let hasAnimated = false;

  const animateCounters = () => {
    statsElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 1800; // ms
      const frameRate = 1000 / 60;
      const totalFrames = Math.round(duration / frameRate);
      let frame = 0;

      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

      const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuart(frame / totalFrames);
        const currentCount = Math.round(target * progress);

        el.textContent = currentCount;

        if (frame >= totalFrames) {
          el.textContent = target + (el.getAttribute('data-suffix') || '');
          clearInterval(counter);
        }
      }, frameRate);
    });
  };

  const statsSection = document.querySelector('.stats');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

/* ==========================================================================
   3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Apply staggered delay if specified
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, parseInt(delay, 10));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   4. SERVICE FILTER TABS
   ========================================================================== */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.service-filter-btn');
  const serviceCards = document.querySelectorAll('.cards .card');

  if (!filterBtns.length || !serviceCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category?.includes(filterValue)) {
          card.classList.remove('card-hidden');
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.96)';
          setTimeout(() => {
            card.classList.add('card-hidden');
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   5. LIGHTBOX MODAL FOR GALLERY IMAGES
   ========================================================================== */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery img, .gallery-sheets img, .about-media img');
  if (!galleryItems.length) return;

  // Create modal container if not exists
  let modal = document.getElementById('lightbox-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'lightbox-modal';
    modal.className = 'lightbox-modal';
    modal.innerHTML = `
      <div class="lightbox-overlay"></div>
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close image preview">&times;</button>
        <img class="lightbox-img" src="" alt="Enlarged site image">
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const modalImg = modal.querySelector('.lightbox-img');
  const modalCaption = modal.querySelector('.lightbox-caption');
  const closeBtn = modal.querySelector('.lightbox-close');
  const overlay = modal.querySelector('.lightbox-overlay');

  const openLightbox = (src, alt) => {
    modalImg.src = src;
    modalCaption.textContent = alt || 'Best MEP On-Site Engineering Photo';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  galleryItems.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(img.src, img.alt);
    });
  });

  const galleryItemWrappers = document.querySelectorAll('.gallery-item');
  galleryItemWrappers.forEach(item => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   6. CONTACT FORM INTERACTION & TOAST NOTIFICATION
   ========================================================================== */
function initContactForm() {
  const form = document.querySelector('.form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    // Show premium visual feedback
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = `
      <span class="spinner"></span> Sending Enquiry...
    `;
    submitBtn.disabled = true;

    // Simulate luxury instant feedback then let mailto or action proceed smoothly
    setTimeout(() => {
      submitBtn.innerHTML = `✓ Enquiry Sent Successfully!`;
      submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      showToast('Thank you! Your enquiry has been received. Our engineering director will connect with you shortly.');

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        form.reset();
      }, 3500);
    }, 1000);
  });
}

function showToast(message) {
  let toast = document.getElementById('luxury-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'luxury-toast';
    toast.className = 'luxury-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="toast-inner">
      <span class="toast-icon">✨</span>
      <span class="toast-text">${message}</span>
    </div>
  `;
  toast.classList.add('visible');

  setTimeout(() => {
    toast.classList.remove('visible');
  }, 4500);
}

/* ==========================================================================
   7. BACK TO TOP BUTTON WITH CIRCULAR SCROLL PROGRESS
   ========================================================================== */
function initBackToTop() {
  let backBtn = document.getElementById('back-to-top');
  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.id = 'back-to-top';
    backBtn.className = 'back-to-top';
    backBtn.setAttribute('aria-label', 'Back to top');
    backBtn.innerHTML = `
      <svg class="progress-ring" width="46" height="46" viewBox="0 0 46 46">
        <circle class="progress-ring-bg" stroke="rgba(212, 175, 55, 0.2)" stroke-width="3" fill="transparent" r="20" cx="23" cy="23"/>
        <circle class="progress-ring-circle" stroke="#d4af37" stroke-width="3" fill="transparent" r="20" cx="23" cy="23"/>
      </svg>
      <span class="arrow-up">↑</span>
    `;
    document.body.appendChild(backBtn);
  }

  const circle = backBtn.querySelector('.progress-ring-circle');
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference;

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
    const offset = circumference - scrollPercent * circumference;
    circle.style.strokeDashoffset = offset;

    if (scrollTop > 300) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   8. SCROLL PARALLAX ACCENTS & PARTICLES
   ========================================================================== */
function initScrollEffects() {
  // Smooth anchor link scrolling with header offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   9. HERO BANNER BACKGROUND SLIDER (Visible, Smooth Crossfade)
   ========================================================================== */
function initHeroBannerSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const buttons = document.querySelectorAll('.hero-slider-btn[data-index]');
  const bannerTitle = document.getElementById('bannerCurrentTitle');
  const clarityToggleBtn = document.getElementById('clarityToggleBtn');
  const heroSection = document.querySelector('.hero');
  if (!slides.length) return;

  let currentIndex = 0;
  let autoSlideTimer = null;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      if (i === index && bannerTitle) {
        bannerTitle.textContent = slide.getAttribute('data-label') || 'Engineering Project';
      }
    });
    buttons.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
    currentIndex = index;
  };

  const nextSlide = () => {
    const next = (currentIndex + 1) % slides.length;
    showSlide(next);
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideTimer = setInterval(nextSlide, 6500);
  };

  const stopAutoSlide = () => {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
  };

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      showSlide(index);
      startAutoSlide();
    });
  });

  // Ultra-Clear View Toggle
  if (clarityToggleBtn && heroSection) {
    clarityToggleBtn.addEventListener('click', () => {
      const isUltra = heroSection.classList.toggle('ultra-clear');
      clarityToggleBtn.classList.toggle('active', isUltra);
      clarityToggleBtn.innerHTML = isUltra ? '✓ Ultra-Clear (ON)' : '👁️ Ultra-Clear';
    });
  }

  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoSlide);
    heroSection.addEventListener('mouseleave', startAutoSlide);
  }

  showSlide(0);
  startAutoSlide();
}
