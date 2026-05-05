document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Pixy-Style Preloader ---
  const loader = document.getElementById('preloader');
  const curtains = document.getElementById('curtains');
  const words = document.querySelectorAll('.pixy-word');
  
  if (loader && words.length > 0) {
    document.body.style.overflow = 'hidden';

    // Animation Timeline
    const runPreloader = async () => {
      // Step 1: Sequential Words
      for (let i = 0; i < words.length; i++) {
        await new Promise(r => setTimeout(r, 200));
        words[i].classList.add('active');
        await new Promise(r => setTimeout(r, 800));
        words[i].classList.remove('active');
        words[i].classList.add('exit');
      }

      // Step 2: Brand Reveal
      await new Promise(r => setTimeout(r, 400));
      loader.classList.add('step-2');
      
      // Step 3: Finish and Reveal Site
      await new Promise(r => setTimeout(r, 1800));
      loader.style.opacity = '0';
      
      setTimeout(() => {
        if (curtains) curtains.classList.add('curtains-open');
        document.body.classList.add('ready');
        document.body.style.overflow = '';
      }, 400);

      setTimeout(() => {
        loader.remove();
        if (curtains) curtains.remove();
      }, 1500);
    };

    runPreloader();
  } else {
    document.body.classList.add('ready');
  }

  // --- 2. Carousel Logic for Ongoing Projects ---
  const track = document.getElementById('ongoing-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');
  const dots = Array.from(document.querySelectorAll('.dot'));
  
  if (track && slides.length > 0) {
    let currentIndex = 0;

    const slideCount = slides.length;

    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      slides[currentIndex].classList.add('active');
      dots[currentIndex].classList.add('active');
      
      // Update progress bar dynamically for the active slide
      const currentProgress = slides[currentIndex].getAttribute('data-progress');
      const fillBar = slides[currentIndex].querySelector('.slide-progress-bar .fill');
      if(fillBar) {
        fillBar.style.width = '0%'; // Reset first
        setTimeout(() => {
          fillBar.style.width = currentProgress + '%';
        }, 100);
      }
    };

    // Initialize first slide progress
    const firstProgress = slides[0].getAttribute('data-progress');
    const firstFill = slides[0].querySelector('.slide-progress-bar .fill');
    if(firstFill) firstFill.style.width = firstProgress + '%';

    let autoSlideInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % slideCount;
      updateCarousel();
    }, 6000); // Auto slide every 6 seconds

    const resetAutoSlide = () => {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slideCount;
        updateCarousel();
      }, 6000);
    };

    // Swipe/Drag Detection for Carousel
    let touchStartX = 0;
    let touchEndX = 0;

    const track = document.getElementById('ongoing-track');
    if (track) {
      track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      });

      track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleGesture();
      });

      track.addEventListener('mousedown', e => {
        touchStartX = e.screenX;
      });

      track.addEventListener('mouseup', e => {
        touchEndX = e.screenX;
        handleGesture();
      });
    }

    const handleGesture = () => {
      const threshold = 50;
      if (touchEndX < touchStartX - threshold) {
        // Swipe Left -> Next
        currentIndex = (currentIndex + 1) % slideCount;
        updateCarousel();
        resetAutoSlide();
      }
      if (touchEndX > touchStartX + threshold) {
        // Swipe Right -> Prev
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateCarousel();
        resetAutoSlide();
      }
    };

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slideCount;
      updateCarousel();
      resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slideCount) % slideCount;
      updateCarousel();
      resetAutoSlide();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
        resetAutoSlide();
      });
    });
  }

  // --- 4. Process/FAQ Accordion ---
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const head = item.querySelector('.accordion-head');
    head.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      accordionItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  /* ------------------------------------- */
  /* Scroll Animations (Intersection Observer)
  /* ------------------------------------- */
  const revealElements = document.querySelectorAll('.img-reveal, .mask-reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  revealElements.forEach(el => revealObserver.observe(el));
  
  /* Navbar Scroll Effect & Parallax Effects */
  const navbar = document.querySelector('.navbar');
  const parallaxFloats = document.querySelectorAll('.parallax-float');
  const parallaxYElements = document.querySelectorAll('[data-parallax-y]');
  const scrollRotate = document.querySelector('.rotating-text');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar Glassmorphism
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    
    // Parallax Float Effect for About Us images
    parallaxFloats.forEach(el => {
      const speed = 0.1;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });

    // Vertical Parallax for elements with data-parallax-y
    parallaxYElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax-y')) * 0.001;
      el.style.transform = `translate(-50%, ${scrollY * speed}px)`;
    });

    // Scroll-based rotation (scrub)
    if (scrollRotate) {
      scrollRotate.style.transform = `rotate(${scrollY * 0.2}deg)`;
    }
  });
  
  /* Custom Cursor Logic */
  const cursorDot = document.querySelector('.custom-cursor-dot');
  const cursorRing = document.querySelector('.custom-cursor-ring');
  
  if (cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    const render = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    const hoverables = document.querySelectorAll('a, button, .arrow-btn, .dot, .accordion-head, .slide-image, .comp-card, .letter-anim');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* Pixy Individual Letter Split Animation */
  const heroTitles = document.querySelectorAll('.hero-title-pixy');
  heroTitles.forEach(title => {
    const text = title.textContent.trim();
    title.innerHTML = ''; // Clear original text
    text.split('').forEach(char => {
      const span = document.createElement('span');
      if (char === ' ') {
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = char;
        span.classList.add('letter-anim');
      }
      title.appendChild(span);
    });
  });

  /* Mobile Menu Toggle */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

});
