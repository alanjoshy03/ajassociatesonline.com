document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lenis Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const appRoot = document.getElementById('app-root');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.site-header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');

    // Initialize intersection observer for continuous scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Re-arm the animation when it leaves the viewport
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    // Routing Logic
    async function handleRoute() {
        try {
            const fullHash = decodeURIComponent(window.location.hash.substring(1)) || 'home';
            const [pageKey, sectionId] = fullHash.split('/');

            if (!pages[pageKey]) {
                console.warn(`Page not found: ${pageKey}. Redirecting to home.`);
                window.location.hash = 'home';
                return;
            }

            // Smooth page transition out
            appRoot.style.opacity = '0';

            await new Promise(r => setTimeout(r, 400));

            // Clean up old observers to prevent memory leaks
            observer.disconnect();

            // Inject new HTML
            appRoot.innerHTML = pages[pageKey];

            // Setup observers for new elements
            const elements = appRoot.querySelectorAll('.fade-in');
            elements.forEach(el => {
                observer.observe(el);
            });

            // Handle scrolling
            if (sectionId) {
                const target = document.getElementById(sectionId);
                if (target) {
                    // Wait a tiny bit for browser to calculate layout after injection
                    setTimeout(() => {
                        lenis.scrollTo(target, { offset: -100, duration: 1.5 });
                    }, 100);
                } else {
                    lenis.scrollTo(0, { immediate: true });
                }
            } else {
                lenis.scrollTo(0, { immediate: true });
            }

            // Smooth page transition in
            void appRoot.offsetWidth;
            appRoot.style.opacity = '1';

            // Update Active Nav Link
            updateNavLinks(pageKey);

            // Handle specific header styling based on route
            if (pageKey === 'home') {
                header.style.backgroundColor = window.scrollY > 50 ? 'var(--color-charcoal)' : 'transparent';
            } else {
                header.style.backgroundColor = 'var(--color-charcoal)';
            }

            // Close mobile menu if open
            if (window.innerWidth < 768) {
                mainNav.style.display = 'none';
            }
        } catch (error) {
            console.error("Routing error:", error);
            // Fallback to home page on critical error to maintain reliability
            if (window.location.hash !== '#home') {
                window.location.hash = 'home';
            }
        }
    }

    function updateNavLinks(activePageKey) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activePageKey}`) {
                link.classList.add('active');
            }
        });
    }

    // Optimized Scroll Logic for Header
    let isHeaderScrolled = false;
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            let hash = window.location.hash.substring(1) || 'home';
            let shouldBeScrolled = window.scrollY > 50 || hash !== 'home';

            // Only update DOM if state actually changes
            if (shouldBeScrolled !== isHeaderScrolled) {
                isHeaderScrolled = shouldBeScrolled;
                if (isHeaderScrolled) {
                    header.classList.add('scrolled');
                    header.style.backgroundColor = 'var(--color-charcoal)';
                } else {
                    header.classList.remove('scrolled');
                    header.style.backgroundColor = 'transparent';
                }
            }
        });
    }, { passive: true });

    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent immediate closing
        if (mainNav.style.display === 'flex') {
            mainNav.style.display = 'none';
        } else {
            mainNav.style.display = 'flex';
            mainNav.style.flexDirection = 'column';
            mainNav.style.position = 'absolute';
            mainNav.style.top = '100%';
            mainNav.style.left = '0';
            mainNav.style.width = '100%';
            mainNav.style.backgroundColor = 'var(--color-charcoal)';
            mainNav.style.padding = 'var(--spacing-sm)';
            mainNav.style.gap = 'var(--spacing-sm)';
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 768 && mainNav.style.display === 'flex') {
            if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mainNav.style.display = 'none';
            }
        }
    });

    // Listeners
    window.addEventListener('hashchange', handleRoute);

    // Initial Load
    handleRoute();

    // Modal Global Handlers
    window.openCareersModal = function () {
        const modal = document.getElementById('careers-modal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };

    window.closeCareersModal = function () {
        const modal = document.getElementById('careers-modal');
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    };

    // Close modal on escape key or clicking outside
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCareersModal();
    });

    document.getElementById('careers-modal').addEventListener('click', (e) => {
        if (e.target.id === 'careers-modal') closeCareersModal();
    });
});
