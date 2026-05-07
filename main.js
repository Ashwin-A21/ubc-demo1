document.addEventListener('DOMContentLoaded', () => {
  // --- 1. SURGICAL CUSTOM CURSOR ---
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const cursorEl = document.querySelector('.am-cursor');
  let mX = 0, mY = 0, dX = 0, dY = 0, rX = 0, rY = 0;
  let cursorInitialized = false;

  // Active globally and immediately
  window.addEventListener('mousemove', (e) => {
    mX = e.clientX;
    mY = e.clientY;
    
    if (!cursorInitialized) {
      dX = mX; dY = mY; rX = mX; rY = mY; // Snap to first position
      cursorInitialized = true;
      if (cursorEl) cursorEl.classList.add('is-active');
      document.body.classList.add('custom-cursor-active');
    }
  });

  const updateCursor = () => {
    dX += (mX - dX) * 0.25;
    dY += (mY - dY) * 0.25;
    rX += (mX - rX) * 0.12;
    rY += (mY - rY) * 0.12;
    
    if (dot) {
      dot.style.transform = `translate3d(${dX}px, ${dY}px, 0) translate(-50%, -50%)`;
    }
    if (ring) {
      ring.style.transform = `translate3d(${rX}px, ${rY}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(updateCursor);
  };
  updateCursor();

  // --- 2. SMOOTH SCROLL (LENIS) ---
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.stop(); // Lock until Enter

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // --- 3. SPLASH & ENTRANCE SEQUENCE ---
  const splash = document.getElementById('splash');
  const enterBtn = document.getElementById('enter-btn');
  
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      gsap.to(splash, {
        yPercent: -100,
        duration: 1.5,
        ease: "expo.inOut",
        onComplete: () => {
          splash.style.display = 'none';
          document.body.classList.remove('loading');
          
          lenis.start(); // ACTIVATE SCROLL
          
          initAnimations();
          ScrollTrigger.refresh();
        }
      });
    });
  }

  // --- 4. HERO STRIPS LOGIC ---
  const strips = document.querySelectorAll('.strip');
  const heroStrips = document.getElementById('hero-strips');

  strips.forEach(strip => {
    const bg = strip.querySelector('.strip-bg');
    const content = strip.querySelector('.strip-content');
    
    strip.addEventListener('mouseenter', () => {
      // Remove active from others
      strips.forEach(s => s.classList.remove('active'));
      strip.classList.add('active');
      
      // GSAP enhancement for smoother flex/scale
      gsap.to(strips, { flex: 1, duration: 1, ease: "expo.out", overwrite: true });
      gsap.to(strip, { flex: 3, duration: 1.2, ease: "expo.out", overwrite: true });
      
      if (bg) gsap.to(bg, { scale: 1.1, duration: 2, ease: "power2.out" });
    });
    
    strip.addEventListener('mouseleave', () => {
      if (bg) gsap.to(bg, { scale: 1, duration: 1.5, ease: "power2.out" });
    });
  });

  if (heroStrips) {
    heroStrips.addEventListener('mouseleave', () => {
      strips.forEach(s => s.classList.remove('active'));
      if (strips[1]) {
        strips[1].classList.add('active');
        gsap.to(strips, { flex: 1, duration: 1, ease: "expo.out" });
        gsap.to(strips[1], { flex: 3, duration: 1.2, ease: "expo.out" });
      }
    });
  }

  // --- 5. CORE ANIMATIONS ---
  const initAnimations = () => {
    // Studio Horizontal (Desktop)
    const track = document.querySelector('.about-track');
    if (track && window.innerWidth > 768) {
      gsap.to(track, {
        xPercent: -66.66,
        ease: "none",
        scrollTrigger: {
          trigger: ".am-about-horizontal",
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => "+=" + track.offsetWidth,
        }
      });
    }

    // Reveal Titles
    gsap.utils.toArray('.am-title').forEach(title => {
      gsap.from(title, {
        y: 100, opacity: 0, duration: 1.5, ease: "expo.out",
        scrollTrigger: { trigger: title, start: "top 90%" }
      });
    });

    // Nav Hide & Cursor Light (Footer Reveal)
    ScrollTrigger.create({
      trigger: ".am-footer-elite",
      start: "top 80%",
      onToggle: self => {
        const nav = document.querySelector('.am-nav');
        const cursor = document.getElementById('custom-cursor');
        if (self.isActive) {
          if (nav) nav.classList.add('is-hidden');
          if (cursor) cursor.classList.add('am-cursor-light');
        } else {
          if (nav) nav.classList.remove('is-hidden');
          if (cursor) cursor.classList.remove('am-cursor-light');
        }
      }
    });

    // Completed Works Stagger & Image Reveal
    const completedItems = gsap.utils.toArray('.am-completed-item');
    completedItems.forEach((item, i) => {
      const img = item.querySelector('img');
      const box = item.querySelector('.am-img-box');
      
      // Reveal Item
      gsap.from(item, {
        y: 80,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
        }
      });

      // Image Parallax/Reveal
      if (img && box) {
        gsap.from(img, {
          scale: 1.3,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: box,
            start: "top bottom",
            scrub: true
          }
        });
      }
    });

    // Footer Content Animation
    gsap.from('.f-brand-section, .f-nav-group', {
      y: 60,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".am-footer-elite",
        start: "top 85%",
      }
    });
  };

  // --- 6. ONGOING PROJECTS SYSTEM ---
  const projectItems = document.querySelectorAll('.am-project-item');
  const bgContainer = document.getElementById('project-bg');
  
  const updateProjectBG = (img) => {
    if (bgContainer) {
      bgContainer.style.backgroundImage = `url('${img}')`;
      bgContainer.classList.add('active');
    }
  };

  projectItems.forEach(item => {
    const fill = item.querySelector('.p-fill');
    const targetWidth = item.getAttribute('data-progress');

    // Desktop Hover
    item.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) {
        updateProjectBG(item.getAttribute('data-img'));
        gsap.to(fill, { width: targetWidth, duration: 1.2, ease: "power2.out" });
      }
    });
    
    item.addEventListener('mouseleave', () => {
      if (window.innerWidth > 768 && bgContainer) {
        bgContainer.classList.remove('active');
        gsap.to(fill, { width: 0, duration: 0.8 });
      }
    });

    // Mobile Center Detection
    ScrollTrigger.create({
      trigger: item,
      start: "top center",
      end: "bottom center",
      onEnter: () => activateMobileProject(item),
      onEnterBack: () => activateMobileProject(item),
    });
  });

  const activateMobileProject = (item) => {
    if (window.innerWidth <= 768) {
      const fill = item.querySelector('.p-fill');
      const targetWidth = item.getAttribute('data-progress');
      projectItems.forEach(i => i.classList.remove('is-active-mobile'));
      item.classList.add('is-active-mobile');
      updateProjectBG(item.getAttribute('data-img'));
      gsap.to(fill, { width: targetWidth, duration: 1.2, ease: "power2.out" });
    }
  };

  // Global Cursor Interactions
  document.querySelectorAll('a, button, .am-project-item, .strip').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (ring) gsap.to(ring, { width: 60, height: 60, backgroundColor: "rgba(184, 134, 11, 0.12)", duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
      if (ring) gsap.to(ring, { width: 22, height: 22, backgroundColor: "transparent", duration: 0.3 });
    });
  });

  // --- 8. BACK TO TOP ---
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      lenis.scrollTo(0, { duration: 2, ease: (t) => 1 - Math.pow(1 - t, 4) });
    });
  }
});
