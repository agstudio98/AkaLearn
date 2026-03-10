/**
 * AkaLearn - JavaScript Functions
 * Three.js 3D Background, Carousels, Scroll Effects
 */

// ==========================================
// THREE.JS 3D FLOATING OBJECTS BACKGROUND
// ==========================================

function initThreeJS() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;
  
  // Scene setup
  const scene = new THREE.Scene();
  
  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  
  // Renderer
  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    alpha: true,
    antialias: true 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Materials - monochromatic with low opacity
  const materials = [
    new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.03 
    }),
    new THREE.MeshBasicMaterial({ 
      color: 0xcccccc, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.02 
    }),
    new THREE.MeshBasicMaterial({ 
      color: 0x888888, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.025 
    })
  ];
  
  // Geometries
  const geometries = [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.TetrahedronGeometry(1, 0),
    new THREE.TorusGeometry(0.8, 0.3, 8, 12),
    new THREE.TorusKnotGeometry(0.6, 0.2, 32, 8),
    new THREE.BoxGeometry(1, 1, 1)
  ];
  
  // Create floating objects
  const objects = [];
  const objectCount = 15;
  
  for (let i = 0; i < objectCount; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    const mesh = new THREE.Mesh(geometry, material);
    
    // Random positions
    mesh.position.x = (Math.random() - 0.5) * 15;
    mesh.position.y = (Math.random() - 0.5) * 15;
    mesh.position.z = (Math.random() - 0.5) * 10 - 2;
    
    // Random rotations
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    // Store original positions for animation
    mesh.userData = {
      originalX: mesh.position.x,
      originalY: mesh.position.y,
      originalZ: mesh.position.z,
      rotationSpeedX: (Math.random() - 0.5) * 0.002,
      rotationSpeedY: (Math.random() - 0.5) * 0.002,
      floatSpeed: Math.random() * 0.001 + 0.0005,
      floatOffset: Math.random() * Math.PI * 2,
      floatAmplitude: Math.random() * 0.5 + 0.2
    };
    
    scene.add(mesh);
    objects.push(mesh);
  }
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Animation loop
  let time = 0;
  
  function animate() {
    requestAnimationFrame(animate);
    time += 0.001;
    
    objects.forEach(obj => {
      // Rotation
      obj.rotation.x += obj.userData.rotationSpeedX;
      obj.rotation.y += obj.userData.rotationSpeedY;
      
      // Floating motion
      obj.position.y = obj.userData.originalY + 
        Math.sin(time * obj.userData.floatSpeed * 100 + obj.userData.floatOffset) * 
        obj.userData.floatAmplitude;
      
      obj.position.x = obj.userData.originalX + 
        Math.cos(time * obj.userData.floatSpeed * 50 + obj.userData.floatOffset) * 
        0.2;
    });
    
    // Subtle camera movement
    camera.position.x = Math.sin(time * 0.1) * 0.3;
    camera.position.y = Math.cos(time * 0.15) * 0.2;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
  }
  
  animate();
}

// ==========================================
// HEADER SCROLL EFFECT (Transparent → Black)
// ==========================================

function initHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;
  
  let lastScroll = 0;
  const scrollThreshold = 50;
  
  function handleScroll() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }
  
  // Use requestAnimationFrame for smoother scroll handling
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Initial check
  handleScroll();
}

// ==========================================
// BANNER CAROUSEL
// ==========================================

function initBannerCarousel() {
  const slides = document.querySelectorAll('.banner .slide');
  if (!slides || slides.length === 0) return;
  
  let idx = 0;
  const total = slides.length;
  const intervalMs = 5000; // 5 seconds
  let timer = null;
  
  function show(i) {
    slides.forEach(s => s.classList.remove('active'));
    slides[i].classList.add('active');
  }
  
  function next() {
    idx = (idx + 1) % total;
    show(idx);
  }
  
  function prev() {
    idx = (idx - 1 + total) % total;
    show(idx);
  }
  
  // Start auto-rotation
  timer = setInterval(next, intervalMs);
  
  // Pause on hover
  const banner = document.querySelector('.banner');
  if (banner) {
    banner.addEventListener('mouseenter', () => clearInterval(timer));
    banner.addEventListener('mouseleave', () => { timer = setInterval(next, intervalMs); });
    
    // Keyboard navigation
    banner.setAttribute('tabindex', '0');
    banner.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
  }
}

// ==========================================
// FINAL CAROUSEL (Slogans)
// ==========================================

function initFinalCarousel() {
  const slides = document.querySelectorAll('.final-slide');
  if (!slides || slides.length === 0) return;
  
  let idx = 0;
  const total = slides.length;
  const intervalMs = 4000;
  let timer = null;
  
  function show(i) {
    slides.forEach(s => s.classList.remove('active'));
    slides[i].classList.add('active');
  }
  
  function next() {
    idx = (idx + 1) % total;
    show(idx);
  }
  
  // Start
  timer = setInterval(next, intervalMs);
  
  // Pause on hover
  const carousel = document.querySelector('.final-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', () => { timer = setInterval(next, intervalMs); });
  }
}

// ==========================================
// CONTACT FORM HANDLER
// ==========================================

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Simple validation
    if (!email || !message) {
      alert('Por favor completa los campos requeridos.');
      return;
    }
    
    // Show success message (in production, send to server)
    alert('¡Gracias! Tu mensaje ha sido enviado. Te contactaremos pronto.');
    
    // Reset form
    form.reset();
  });
}

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ==========================================
// NAVIGATION ACTIVE STATE
// ==========================================

function initNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ==========================================
// INITIALIZE EVERYTHING
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  initHeaderScroll();
  initBannerCarousel();
  initFinalCarousel();
  initContactForm();
  initSmoothScroll();
  initNavigation();
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function esc(str) {
  return encodeURIComponent((str || '').trim());
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initThreeJS,
    initHeaderScroll,
    initBannerCarousel,
    initFinalCarousel,
    initContactForm
  };
}

