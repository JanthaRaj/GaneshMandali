// Mobile-First JavaScript for Janatha Raj Website
// Functional Fixes for Navigation and Links

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initMobileNavigation();
    initScrollAnimations();
    initCounterAnimations();
    initGallery();
    initSmoothScrolling();
    initParticleAnimation();
    initTouchGestures();
    initLazyLoading();
    initFormValidation();
    initExternalLinks(); // ADDED: For Get Directions button
    initYearFilters();
    initLoadMoreIdols();
    console.log('🎉 Janatha Raj Website Loaded - Functional Fixes Applied');
});

// Mobile Navigation System
function initMobileNavigation() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const menuClose = document.querySelector('.menu-close');
    const menuLinks = document.querySelectorAll('.menu-link');
    if (!menuToggle || !menuOverlay) return;

    menuToggle.addEventListener('click', function () {
        menuToggle.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = menuOverlay.classList.contains('active') ? 'hidden' : '';
        if (navigator.vibrate) navigator.vibrate(50);
    });

    function closeMenu() {
        menuToggle.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (menuClose) menuClose.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', (e) => { if (e.target === menuOverlay) closeMenu(); });

    // UPDATED: Logic for menu link clicks
    menuLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor behavior
            closeMenu();
            const targetId = this.getAttribute('href');

            // Special handling for the #home link
            if (targetId === '#home') {
                setTimeout(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 300); // Timeout to allow menu to close smoothly
            }
            // Handling for all other links
            else if (targetId.startsWith('#')) {
                setTimeout(() => {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const offset = 70; // Nav height
                        const targetPosition = targetElement.offsetTop - offset;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 300);
            }
        });
    });

    let lastScrollTop = 0;
    const navbar = document.querySelector('.mobile-nav');
    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (window.innerWidth <= 768) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // navbar.style.transform = 'translateY(-100%)'; // This was commented out in your version, keeping it that way
            } else {
                // navbar.style.transform = 'translateY(0)';
            }
        }
        lastScrollTop = scrollTop;
    });
}

// NEW: Function to handle the "Get Directions" button
function initExternalLinks() {
    const locationButton = document.querySelector('.location-btn');
    if (locationButton) {
        locationButton.addEventListener('click', function () {
            window.open('https://maps.app.goo.gl/ZxsL1z1TMQc8n7nH6', '_blank');
        });
    }
}
function initLoadMoreIdols() {
    const loadBtn = document.querySelector('.load-more-btn');
    const olderIdols = document.querySelectorAll('.idol-card[data-old="true"]');

    olderIdols.forEach(card => {
        card.style.display = 'none';
        card.classList.remove('show');
    });

    if (loadBtn) {
        loadBtn.addEventListener('click', () => {
            olderIdols.forEach((card, index) => {
                setTimeout(() => {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('show'), 10);
                }, index * 100); // stagger
            });

            // 👇 Just hide the button after showing
            loadBtn.style.display = 'none';
        });
    }
}



// Year Filters for Previous Idols
function initYearFilters() {
    const yearButtons = document.querySelectorAll('.year-btn');
    const idolCards = document.querySelectorAll('.idol-card');

    yearButtons.forEach(button => {
        button.addEventListener('click', function () {
            const year = this.getAttribute('data-year');

            yearButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            idolCards.forEach(card => {
                const cardYear = card.getAttribute('data-year');

                if (year === 'all' || cardYear === year) {
                    card.classList.remove('hide');
                    card.classList.add('show');
                    card.style.display = 'block';
                } else {
                    card.classList.remove('show');
                    card.classList.add('hide');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400); // match the CSS transition duration
                }
            });
        });
    });
}


// --- All other functions remain unchanged ---

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
            transition: opacity 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .animate-on-scroll.in-view {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    `;
    document.head.appendChild(style);
    const animatedElements = document.querySelectorAll('.section-header, .about-content, .stats-grid, .timeline-item, .gallery-grid-new, .contact-content');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                let current = 0;
                const increment = target / (duration / 16);
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(counter => observer.observe(counter));
}

function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
            const img = this.querySelector('img');
            if (img) openLightbox(img.src, img.alt);
        });
    });
}

function initSmoothScrolling() {
    const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            this.style.transform = 'scale(0.95)';
            setTimeout(() => { this.style.transform = ''; }, 150);
            let targetSection = '';
            const buttonText = this.textContent.toLowerCase();
            if (buttonText.includes('join') || buttonText.includes('celebration')) targetSection = '#celebrations';
            else if (buttonText.includes('donate now')) targetSection = '#contact';
            if (targetSection) {
                const targetElement = document.querySelector(targetSection);
                if (targetElement) {
                    const offset = 70;
                    const targetPosition = targetElement.offsetTop - offset;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            }
        });
    });
}

function initParticleAnimation() {
    const heroParticles = document.querySelector('.hero-particles');
    if (!heroParticles) return;
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        const size = Math.random() * 5 + 2;
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 153, 51, ${Math.random() * 0.8 + 0.2});
            border-radius: 50%;
            box-shadow: 0 0 ${size * 2}px var(--primary-saffron);
            left: ${Math.random() * 100}%;
            bottom: -20px;
            animation: floatParticle ${Math.random() * 20 + 15}s linear infinite;
            animation-delay: ${Math.random() * 15}s;
        `;
        heroParticles.appendChild(particle);
    }
}

function initTouchGestures() {
    let startX, startY, distX, distY; const threshold = 100; document.addEventListener('touchstart', function (e) { const touch = e.touches[0]; startX = touch.clientX; startY = touch.clientY; }); document.addEventListener('touchend', function (e) {
        if (!startX || !startY) return; const touch = e.changedTouches[0]; distX = touch.clientX - startX; distY = touch.clientY - startY; if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > threshold) { if (distX > 0) { const menuOverlay = document.querySelector('.mobile-menu-overlay'); if (menuOverlay && !menuOverlay.classList.contains('active')) { document.querySelector('.mobile-menu-toggle').click(); } } else { const menuOverlay = document.querySelector('.mobile-menu-overlay'); if (menuOverlay && menuOverlay.classList.contains('active')) { document.querySelector('.menu-close').click(); } } }
        startX = startY = distX = distY = null;
    });
}

function initLazyLoading() { const images = document.querySelectorAll('img[data-src]'); const imageObserver = new IntersectionObserver(function (entries) { entries.forEach(entry => { if (entry.isIntersecting) { const img = entry.target; img.src = img.dataset.src; img.classList.remove('lazy'); imageObserver.unobserve(img); } }); }); images.forEach(img => { imageObserver.observe(img); }); }

function initFormValidation() { const forms = document.querySelectorAll('form'); forms.forEach(form => { form.addEventListener('submit', function (e) { e.preventDefault(); const inputs = form.querySelectorAll('input, textarea'); let isValid = true; inputs.forEach(input => { if (input.hasAttribute('required') && !input.value.trim()) { isValid = false; input.style.borderColor = '#DC2626'; input.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)'; } else { input.style.borderColor = ''; input.style.boxShadow = ''; } }); if (isValid) { showNotification('Thank you! Your message has been sent.', 'success'); form.reset(); } else { showNotification('Please fill in all required fields.', 'error'); if (navigator.vibrate) { navigator.vibrate([100, 50, 100]); } } }); }); }

function openLightbox(src, alt) {
    const lightbox = document.createElement('div'); lightbox.className = 'lightbox'; lightbox.innerHTML = `<div class="lightbox-content"><img src="${src}" alt="${alt}"><button class="lightbox-close">&times;</button></div>`; lightbox.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:10000;opacity:0;transition:opacity 0.3s ease;`; const content = lightbox.querySelector('.lightbox-content'); content.style.cssText = `position:relative;max-width:90%;max-height:90%;`; const img = lightbox.querySelector('img'); img.style.cssText = `width:100%;height:100%;object-fit:contain;border-radius:8px;`; const closeBtn = lightbox.querySelector('.lightbox-close'); closeBtn.style.cssText = `position:absolute;top:-40px;right:0;background:none;border:none;color:white;font-size:30px;cursor:pointer;width:40px;height:40px;display:flex;align-items:center;justify-content:center;`; document.body.appendChild(lightbox); document.body.style.overflow = 'hidden'; setTimeout(() => { lightbox.style.opacity = '1'; }, 10); function closeLightbox() { lightbox.style.opacity = '0'; setTimeout(() => { if (document.body.contains(lightbox)) { document.body.removeChild(lightbox); document.body.style.overflow = ''; } }, 300); }
    closeBtn.addEventListener('click', closeLightbox); lightbox.addEventListener('click', function (e) { if (e.target === lightbox) { closeLightbox(); } }); document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeLightbox(); } });
};

function showNotification(message, type = 'info') { const notification = document.createElement('div'); notification.className = `notification notification-${type}`; notification.textContent = message; notification.style.cssText = `position:fixed;top:20px;right:20px;padding:16px 24px;border-radius:8px;color:white;font-weight:500;z-index:10000;transform:translateX(100%);transition:transform 0.3s ease;max-width:calc(100% - 40px);box-shadow:0 4px 12px rgba(0,0,0,0.15);`; const colors = { success: '#10B981', error: '#EF4444', info: '#3B82F6', warning: '#F59E0B' }; notification.style.background = colors[type] || colors.info; document.body.appendChild(notification); setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 10); setTimeout(() => { notification.style.transform = 'translateX(100%)'; setTimeout(() => { if (document.body.contains(notification)) { document.body.removeChild(notification); } }, 300); }, 4000); }

function optimizePerformance() {
    let scrollTimeout; const originalScrollHandler = window.onscroll; window.onscroll = function () {
        if (scrollTimeout) { clearTimeout(scrollTimeout); }
        scrollTimeout = setTimeout(() => { if (originalScrollHandler) { originalScrollHandler(); } }, 16);
    }; const criticalImages = ['assets/images/shivaji_maharaj_portrait.jpg', 'assets/images/lord_ganesha_idol.jpg']; criticalImages.forEach(src => { const img = new Image(); img.src = src; });
}
optimizePerformance();

if ('serviceWorker' in navigator) { window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').then(function (registration) { console.log('SW registered: ', registration); }).catch(function (registrationError) { console.log('SW registration failed: ', registrationError); }); }); }
let deferredPrompt; window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferredPrompt = e; setTimeout(() => { if (deferredPrompt) { const installBanner = document.createElement('div'); installBanner.innerHTML = `<div style="position:fixed;bottom:20px;left:20px;right:20px;background:linear-gradient(135deg, #FF9933, #FFD700);color:white;padding:16px;border-radius:12px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:1000;font-size:14px;"><span>📱 Install Janatha Raj app for better experience!</span><button id="install-btn" style="background:white;color:#FF9933;border:none;padding:8px 16px;border-radius:6px;font-weight:600;cursor:pointer;">Install</button><button id="dismiss-btn" style="background:none;border:none;color:white;cursor:pointer;margin-left:8px;">✕</button></div>`; document.body.appendChild(installBanner); document.getElementById('install-btn').addEventListener('click', function () { deferredPrompt.prompt(); deferredPrompt.userChoice.then(function (choiceResult) { deferredPrompt = null; document.body.removeChild(installBanner); }); }); document.getElementById('dismiss-btn').addEventListener('click', function () { document.body.removeChild(installBanner); }); } }, 5000); });

function trackUserEngagement() { let maxScroll = 0; window.addEventListener('scroll', function () { const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100); if (scrollPercent > maxScroll) { maxScroll = scrollPercent; } }); const startTime = Date.now(); window.addEventListener('beforeunload', function () { const timeSpent = Math.round((Date.now() - startTime) / 1000); console.log(`User engagement: ${timeSpent}s on page, ${maxScroll}% scroll depth`); }); }
trackUserEngagement();

function enhanceAccessibility() {
    const skipLink = document.createElement('a'); skipLink.href = '#main-content'; skipLink.textContent = 'Skip to main content'; skipLink.style.cssText = `position:absolute;top:-40px;left:6px;background:#FF9933;color:white;padding:8px;text-decoration:none;border-radius:4px;z-index:10000;transition:top 0.3s;`; skipLink.addEventListener('focus', function () { this.style.top = '6px'; }); skipLink.addEventListener('blur', function () { this.style.top = '-40px'; }); document.body.insertBefore(skipLink, document.body.firstChild); const heroSection = document.querySelector('.hero'); if (heroSection) { heroSection.setAttribute('id', 'main-content'); heroSection.setAttribute('role', 'main'); }
    const style = document.createElement('style'); style.textContent = `*:focus{outline:2px solid #FF9933 !important;outline-offset:2px !important;}.menu-link:focus,.cta-primary:focus,.cta-secondary:focus,.filter-btn:focus,.year-btn:focus{box-shadow:0 0 0 3px rgba(255,153,51,0.3) !important;}`; document.head.appendChild(style);
}
enhanceAccessibility();
