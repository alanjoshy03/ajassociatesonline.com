// Global Accordion Handler (Accessible to inline onclick & event listeners)
let lastToggleTime = 0;
let lastToggledHeader = null;

window.toggleAccordion = function (headerElement) {
    if (!headerElement) return;
    const now = Date.now();
    // Guard against rapid duplicate invocation (e.g. if invoked by multiple listeners within 100ms)
    if (lastToggledHeader === headerElement && (now - lastToggleTime) < 100) {
        return;
    }
    lastToggleTime = now;
    lastToggledHeader = headerElement;

    const currentItem = headerElement.closest('.accordion-item');
    if (!currentItem) return;

    const accordionContainer = currentItem.closest('.accordion-container') || currentItem.parentElement;
    const allItems = accordionContainer.querySelectorAll('.accordion-item');

    const isActive = currentItem.classList.contains('active');

    allItems.forEach(item => {
        item.classList.remove('active');
        const header = item.querySelector('.accordion-header');
        if (header) {
            header.setAttribute('aria-expanded', 'false');
        }
    });

    if (!isActive) {
        currentItem.classList.add('active');
        headerElement.setAttribute('aria-expanded', 'true');
    }
};

// Global Hero Interactive Card Tab Switcher
window.switchHeroTab = function (tabName) {
    const allBtns = document.querySelectorAll('.hero-tab-btn');
    const allPanes = document.querySelectorAll('.hero-tab-pane');

    allBtns.forEach(btn => btn.classList.remove('active'));
    allPanes.forEach(pane => pane.classList.remove('active'));

    const targetPane = document.getElementById(`hero-pane-${tabName}`);
    if (targetPane) {
        targetPane.classList.add('active');
    }

    allBtns.forEach(btn => {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabName)) {
            btn.classList.add('active');
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    // Shared Lenis Smooth Scroll Engine Reference
    let lenis = null;

    // Kinetic Falling Letters Entrance Animation for Main Hero Title
    const initHeroFallingLetters = () => {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle || heroTitle.dataset.lettersProcessed) return;

        heroTitle.dataset.lettersProcessed = "true";

        const line1Text = "Financial Precision.";
        const line2Text = "Strategic Growth.";

        heroTitle.innerHTML = '';

        let charIdx = 0;

        // Line 1
        const line1 = document.createElement('div');
        line1.className = 'hero-title-line';
        Array.from(line1Text).forEach((char) => {
            const span = document.createElement('span');
            span.className = 'falling-char' + (char === ' ' ? ' char-space' : '');
            span.style.setProperty('--char-idx', charIdx);
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            line1.appendChild(span);
            charIdx++;
        });

        // Line 2
        const line2 = document.createElement('div');
        line2.className = 'hero-title-line text-navy';
        Array.from(line2Text).forEach((char) => {
            const span = document.createElement('span');
            span.className = 'falling-char' + (char === ' ' ? ' char-space' : '');
            span.style.setProperty('--char-idx', charIdx);
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            line2.appendChild(span);
            charIdx++;
        });

        heroTitle.appendChild(line1);
        heroTitle.appendChild(line2);
    };

    initHeroFallingLetters();

    // Hero Slider with Kinetic Letter-by-Letter Incoming Animation
    const initHeroSlider = () => {
        const sliderCard = document.getElementById('hero-slider-card');
        if (!sliderCard) return;

        const slides = sliderCard.querySelectorAll('.hero-slide');
        const dots = sliderCard.querySelectorAll('.slider-dot');
        let currentIndex = 0;
        let slideTimer = null;

        // Process titles into kinetic letter incoming character spans
        slides.forEach(slide => {
            const titleEl = slide.querySelector('.slide-title');
            if (titleEl && !titleEl.dataset.processed) {
                const originalText = titleEl.textContent;
                titleEl.dataset.processed = "true";
                titleEl.innerHTML = '';

                Array.from(originalText).forEach((char, idx) => {
                    const span = document.createElement('span');
                    span.className = 'letter-char';
                    span.style.setProperty('--c-idx', idx);
                    span.textContent = char;
                    titleEl.appendChild(span);
                });
            }
        });

        const gotoSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentIndex = index;

            // Re-trigger letter incoming animation for active slide title
            const activeSlide = slides[index];
            if (activeSlide) {
                const chars = activeSlide.querySelectorAll('.letter-char');
                chars.forEach(char => {
                    char.style.animation = 'none';
                    // Force reflow
                    void char.offsetWidth;
                    char.style.animation = '';
                });
            }
        };

        const nextSlide = () => {
            const nextIdx = (currentIndex + 1) % slides.length;
            gotoSlide(nextIdx);
        };

        const startAutoplay = () => {
            if (slideTimer) clearInterval(slideTimer);
            slideTimer = setInterval(nextSlide, 6500);
        };

        const stopAutoplay = () => {
            if (slideTimer) clearInterval(slideTimer);
        };

        // Attach dot click events
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const targetIdx = parseInt(e.currentTarget.getAttribute('data-target'), 10);
                gotoSlide(targetIdx);
                startAutoplay();
            });
        });

        // Pause on hover
        sliderCard.addEventListener('mouseenter', stopAutoplay);
        sliderCard.addEventListener('mouseleave', startAutoplay);

        // Start initial auto-cycle
        startAutoplay();
    };

    initHeroSlider();

    // Floating Bottom-Right WhatsApp Widget Scroll Trigger & One-Time 10s Tooltip Prompt
    const initFloatingWhatsApp = () => {
        const waWidget = document.getElementById('floating-whatsapp-widget');
        const tooltip = waWidget ? waWidget.querySelector('.wa-tooltip-pill') : null;
        if (!waWidget || !tooltip) return;

        let hasRunOnce = false;
        let isDismissed = false;
        let showTimeout = null;
        let hideTimeout = null;

        const triggerOneTimePrompt = () => {
            if (hasRunOnce || isDismissed) return;
            hasRunOnce = true;

            // Slide in 0.5s after WhatsApp button pops up
            showTimeout = setTimeout(() => {
                if (isDismissed) return;
                tooltip.classList.add('active');

                // Wait for 10 seconds, then slide back out behind button and vanish
                hideTimeout = setTimeout(() => {
                    tooltip.classList.remove('active');
                }, 10000);
            }, 500);
        };

        const handleScroll = () => {
            const currentScroll = window.scrollY || window.pageYOffset || 0;
            if (currentScroll > 150) {
                if (!waWidget.classList.contains('visible')) {
                    waWidget.classList.add('visible');
                }
                triggerOneTimePrompt();
            } else {
                if (waWidget.classList.contains('visible')) {
                    waWidget.classList.remove('visible');
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        if (lenis) {
            lenis.on('scroll', handleScroll);
        }

        window.closeWaTooltip = function (e) {
            if (e) e.stopPropagation();
            isDismissed = true;
            if (showTimeout) clearTimeout(showTimeout);
            if (hideTimeout) clearTimeout(hideTimeout);
            tooltip.classList.remove('active');
            tooltip.classList.add('dismissed');
        };
    };

    // 1. Initialize Lenis 1.1 Buttery Smooth Scroll Engine
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.1,
            touchMultiplier: 1.5,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    initFloatingWhatsApp();

    // 2. Set Current Year in Footer
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // 3. Mobile Navigation Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('mobile-active');
            mobileMenuBtn.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link, .nav-cta-btn').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('mobile-active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // 4. Header Scroll Shadow Effect
    const siteHeader = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    }, { passive: true });

    // 5. Bulletproof ScrollSpy Active Link Engine (Precision 35% Viewport Focal Line)
    const spySections = Array.from(document.querySelectorAll('main > section[id]'));
    const spyNavLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));

    const updateScrollSpy = () => {
        const scrollPosition = window.scrollY || window.pageYOffset || 0;
        const viewportHeight = window.innerHeight;
        const targetFocalOffset = scrollPosition + (viewportHeight * 0.35); // 35% down screen

        let currentActiveId = 'home';

        // Boundary checks
        if (scrollPosition < 80) {
            currentActiveId = 'home';
        } else if ((window.innerHeight + scrollPosition) >= (document.documentElement.scrollHeight - 60)) {
            currentActiveId = 'contact';
        } else {
            spySections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                if (targetFocalOffset >= sectionTop && targetFocalOffset < (sectionTop + sectionHeight)) {
                    currentActiveId = section.getAttribute('id');
                }
            });
        }

        spyNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentActiveId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', updateScrollSpy, { passive: true });
    if (lenis) {
        lenis.on('scroll', updateScrollSpy);
    }
    updateScrollSpy();

    // 6. Smooth Scroll Navigation Handler via Lenis 1.1
    function smoothScrollToElement(targetElement) {
        if (lenis) {
            lenis.scrollTo(targetElement, { offset: -90, duration: 1.4 });
        } else {
            const headerOffset = 90;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === 'javascript:void(0)') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                if (targetId === '#home') {
                    if (lenis) {
                        lenis.scrollTo(0, { duration: 1.4 });
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                } else {
                    smoothScrollToElement(targetElement);
                }

                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    // Handle initial hash on page load
    if (window.location.hash) {
        if (window.location.hash === '#home') {
            window.scrollTo(0, 0);
        } else {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                setTimeout(() => {
                    smoothScrollToElement(targetElement);
                }, 300);
            }
        }
    }

    // 7. Scroll Blur-In Reveal Observer (Triggers 60px INSIDE visible viewport)
    const blurElements = document.querySelectorAll('.blur-in');
    const checkBlurVisibility = () => {
        blurElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 60 && rect.bottom > 0) {
                el.classList.add('visible');
            }
        });
    };

    const blurObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    blurElements.forEach(el => {
        blurObserver.observe(el);
    });

    checkBlurVisibility();
    window.addEventListener('scroll', checkBlurVisibility, { passive: true });
    if (typeof lenis !== 'undefined' && lenis) {
        lenis.on('scroll', checkBlurVisibility);
    }

    // 8. Interactive Partnership Stage Swap (Bi-Directional Sweep Animation)
    const initPartnershipCard = () => {
        const toggleBtn = document.getElementById('btn-toggle-alliance-stage');
        const backBtn = document.getElementById('btn-back-alliance-stage');
        const editorialView = document.getElementById('alliance-editorial-view');
        const formView = document.getElementById('alliance-form-view');
        const chevronWrapper = document.getElementById('chevron-direction-wrapper');

        if (!toggleBtn || !editorialView || !formView) return;

        let isFormActive = false;

        const toggleStage = () => {
            isFormActive = !isFormActive;

            if (isFormActive) {
                editorialView.classList.add('swiped-out');
                formView.classList.add('active-in-left');
                if (toggleBtn) toggleBtn.classList.add('hide-right-arrow');
            } else {
                editorialView.classList.remove('swiped-out');
                formView.classList.remove('active-in-left');
                if (toggleBtn) toggleBtn.classList.remove('hide-right-arrow');
            }
        };

        toggleBtn.addEventListener('click', toggleStage);
        if (backBtn) backBtn.addEventListener('click', toggleStage);

        // Automatically return to default stage when user leaves section
        if ('IntersectionObserver' in window) {
            const partnershipObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting && isFormActive) {
                        toggleStage();
                    }
                });
            }, { threshold: 0.05 });

            const partnershipSection = document.getElementById('partnership-section');
            if (partnershipSection) {
                partnershipObserver.observe(partnershipSection);
            }
        }
    };

    initPartnershipCard();

    // 8.8 Continuous Infinite Google Reviews Marquee Engine
    const initGoogleReviewsContinuous = () => {
        const track = document.getElementById('g-reviews-track');
        if (!track || track.dataset.duplicated) return;

        track.dataset.duplicated = "true";
        // Clone all inner review cards once to create seamless -50% marquee loop
        track.innerHTML += track.innerHTML;
    };

    initGoogleReviewsContinuous();

    // 8.9 Native Light Mode 3-Column Editorial Service Stage Engine
    const initEditorialServices = () => {
        const menuBtns = document.querySelectorAll('#service-menu-list .native-menu-btn');
        const detailPanes = document.querySelectorAll('#service-detail-panes .native-pane');

        if (!menuBtns.length || !detailPanes.length) return;

        const showPane = (index) => {
            menuBtns.forEach((btn, idx) => {
                if (idx === index) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            detailPanes.forEach((pane, idx) => {
                if (idx === index) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        };

        menuBtns.forEach((btn, idx) => {
            btn.addEventListener('click', () => {
                showPane(idx);
            });
            btn.addEventListener('mouseenter', () => {
                showPane(idx);
            });
        });
    };

    initEditorialServices();

    // 9. Trust Stats Counter Animation (Single Unified Block)
    const statsBar = document.getElementById('stats-counter-bar');
    let hasAnimatedStats = false;

    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            const prefix = el.getAttribute('data-prefix') || '';
            const suffix = el.getAttribute('data-suffix') || '';
            let current = 0;
            const increment = Math.ceil(target / 40);
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = prefix + current + suffix;
            }, 35);
        });
    }

    if (statsBar) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimatedStats) {
                    hasAnimatedStats = true;
                    statsBar.classList.add('is-visible');
                    animateStats();
                }
            });
        }, { threshold: 0.2 });
        statsObserver.observe(statsBar);
    }

    // 10. Interactive Tax & Compliance Calculator
    let selectedEntity = 'proprietorship';
    let selectedTurnover = 'under_20l';

    const entityBtns = document.querySelectorAll('.entity-options .calc-btn');
    const turnoverBtns = document.querySelectorAll('.turnover-options .calc-btn');

    entityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            entityBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedEntity = btn.getAttribute('data-entity');
            updateCalculatorResults();
        });
    });

    turnoverBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            turnoverBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedTurnover = btn.getAttribute('data-turnover');
            updateCalculatorResults();
        });
    });

    function updateCalculatorResults() {
        const packageNameEl = document.getElementById('result-package-name');
        const tierEl = document.getElementById('result-tier');
        const featuresListEl = document.getElementById('result-features-list');
        const whatsappBtn = document.getElementById('calc-whatsapp-btn');

        let packageName = 'Essential Compliance Package';
        let tier = 'Standard Scope';
        let features = [];

        if (selectedEntity === 'individual') {
            packageName = 'Individual & NRI Tax Filing';
            tier = 'Personal Tax Scope';
            features = [
                'Income Tax Return (ITR-1 / ITR-2 / ITR-3) Filing',
                'Capital Gains & Investment Tax Exemption Guidance',
                'Foreign Income & NRI Remittance Advisory'
            ];
        } else if (selectedEntity === 'proprietorship') {
            if (selectedTurnover === 'under_20l') {
                packageName = 'Small Business Proprietorship Package';
                tier = 'Starter Scope';
                features = [
                    'Annual Income Tax Return (ITR-3/4) Filing',
                    'Financial Statement Preparation (P&L & Balance Sheet)',
                    'MSME / Udyam Registration Assistance'
                ];
            } else {
                packageName = 'Complete Proprietorship & GST Compliance';
                tier = 'Growth Scope';
                features = [
                    'Monthly GST Return Filings (GSTR-1, GSTR-3B)',
                    'Income Tax & Statutory Tax Audit Compliance',
                    'Quarterly TDS Computation & E-Filing',
                    'Bookkeeping & Financial Ledger Supervision'
                ];
            }
        } else if (selectedEntity === 'partnership') {
            packageName = 'Partnership / LLP Governance Package';
            tier = 'Corporate Scope';
            features = [
                'LLP Form 11 & Form 8 Annual Filing with MCA',
                'Partner Tax Planning & Distribution Accounting',
                'Monthly GST & Quarterly TDS Returns',
                'Statutory Audit & Tax Notice Representation'
            ];
        } else if (selectedEntity === 'pvt_ltd') {
            packageName = 'Pvt Ltd Corporate Compliance Retainer';
            tier = 'Executive Scope';
            features = [
                'MCA Annual Returns (AOC-4 & MGT-7)',
                'Statutory Audit Supervision & Board Resolutions',
                'Monthly GST & Quarterly TDS Returns',
                'Director KYC & Corporate Secretarial Advisory'
            ];
        }

        if (selectedTurnover === '1cr_5cr' || selectedTurnover === 'above_5cr') {
            tier = 'Enterprise Scope';
            features.push('Bank CMA Data & Loan Syndication Support');
            features.push('Dedicated Senior Chartered Accounting Advisory');
        }

        if (packageNameEl) packageNameEl.textContent = packageName;
        if (tierEl) tierEl.textContent = tier;

        if (featuresListEl) {
            featuresListEl.innerHTML = features.map(f => `<li><i class="fas fa-check-circle"></i> ${f}</li>`).join('');
        }

        if (whatsappBtn) {
            const entityText = selectedEntity.toUpperCase().replace('_', ' ');
            const turnoverText = selectedTurnover.toUpperCase().replace('_', ' ');
            const message = encodeURIComponent(`Greetings AJ Associates! I used your Tax Package Estimator for my ${entityText} with Turnover (${turnoverText}). I would like to receive a detailed quote for the ${packageName}.`);
            whatsappBtn.href = `https://wa.me/916282406091?text=${message}`;
        }
    }

    updateCalculatorResults();

    // 11. Careers Modal Handlers
    window.openCareersModal = function () {
        const modal = document.getElementById('careers-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeCareersModal = function () {
        const modal = document.getElementById('careers-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCareersModal();
    });

    const modalOverlay = document.getElementById('careers-modal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeCareersModal();
        });
    }
});

// Custom Dropdown Functions
function toggleCustomSelect(wrapper) {
    wrapper.classList.toggle('open');
}

function selectCustomOption(optionElement, event) {
    event.stopPropagation();
    const wrapper = optionElement.closest('.custom-select-wrapper');
    const valueDisplay = wrapper.querySelector('.custom-select-value');
    const hiddenInput = wrapper.parentElement.querySelector('input[type="hidden"]');

    valueDisplay.textContent = optionElement.textContent;
    valueDisplay.style.color = '#0F172A';
    hiddenInput.value = optionElement.getAttribute('data-value');

    wrapper.classList.remove('open');
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select-wrapper')) {
        document.querySelectorAll('.custom-select-wrapper.open').forEach(el => el.classList.remove('open'));
    }
});

// Contact Form Handler
function validateAndSubmitContactForm(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const service = document.getElementById('service').value.trim();

    if (!service) {
        alert("Please select a required service category from the dropdown.");
        return false;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
        alert("Please enter a valid 10-digit mobile number.");
        return false;
    }

    alert(`Thank you ${name}! Your inquiry has been submitted successfully. A senior consultant from AJ Associates will contact you at ${mobile} within 24 hours.`);
    event.target.reset();
    document.getElementById('service').value = '';
    const customValueDisplay = document.querySelector('.custom-select-value');
    if (customValueDisplay) {
        customValueDisplay.textContent = 'Choose a category...';
        customValueDisplay.style.color = '#64748B';
    }
    return true;
}

// Partnership Form Handler
function handlePartnershipSubmit(event) {
    event.preventDefault();
    alert("Thank you for your proposal! Our strategic alliance team will review your submission and contact you shortly.");
    event.target.reset();
}

// Interactive Practice Identity & About Us Stage Logic
let currentAchievementIndex = 0;
function goToAchievementSlide(index) {
    const track = document.getElementById('achievements-carousel-track');
    const dots = document.querySelectorAll('#achievements-carousel-dots .dot');
    const tabPills = document.querySelectorAll('.about-tab-pills .tab-pill');
    if (!track) return;

    const cards = track.querySelectorAll('.achievement-card-item');
    if (!cards.length) return;

    currentAchievementIndex = (index + cards.length) % cards.length;
    const cardWidth = cards[0].offsetWidth + 28; // card width + gap
    track.style.transform = `translateX(-${currentAchievementIndex * cardWidth}px)`;

    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentAchievementIndex);
    });

    tabPills.forEach((pill, idx) => {
        pill.classList.toggle('active', idx === currentAchievementIndex);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('achievements-prev-btn');
    const nextBtn = document.getElementById('achievements-next-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToAchievementSlide(currentAchievementIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToAchievementSlide(currentAchievementIndex + 1);
        });
    }

    // Auto rotate every 6 seconds
    setInterval(() => {
        const track = document.getElementById('achievements-carousel-track');
        if (track && track.querySelectorAll('.achievement-card-item').length) {
            goToAchievementSlide(currentAchievementIndex + 1);
        }
    }, 6000);
});

// Service Sub-Section Accordion Toggle Function
window.toggleServiceAccordion = function (headerElement) {
    if (!headerElement) return;
    const parentItem = headerElement.closest('.service-accordion-item');
    if (!parentItem) return;

    const cardBody = parentItem.closest('.deck-card-body');
    if (cardBody) {
        const allItems = cardBody.querySelectorAll('.service-accordion-item');
        allItems.forEach(item => {
            if (item !== parentItem) {
                item.classList.remove('active');
            }
        });
    }

    parentItem.classList.toggle('active');
};

// Strategic Alliance Interactive Stage View Switcher Logic
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('btn-toggle-alliance-stage');
    const backBtn = document.getElementById('btn-back-to-overview');
    const overviewView = document.getElementById('alliance-view-overview');
    const formView = document.getElementById('alliance-view-form');
    const triggerText = document.getElementById('alliance-trigger-text');
    const sectionContainer = document.getElementById('partnership-section');

    function showFormView() {
        if (!overviewView || !formView) return;
        overviewView.classList.remove('active-panel');
        overviewView.classList.add('hidden-panel');

        formView.classList.remove('hidden-panel');
        formView.classList.add('active-panel');

        if (triggerText) triggerText.textContent = 'Return to Overview';
        if (sectionContainer) sectionContainer.classList.add('form-mode-active');
    }

    function showOverviewView() {
        if (!overviewView || !formView) return;
        formView.classList.remove('active-panel');
        formView.classList.add('hidden-panel');

        overviewView.classList.remove('hidden-panel');
        overviewView.classList.add('active-panel');

        if (triggerText) triggerText.textContent = 'Submit Partnership Inquiry';
        if (sectionContainer) sectionContainer.classList.remove('form-mode-active');
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (formView && formView.classList.contains('active-panel')) {
                showOverviewView();
            } else {
                showFormView();
            }
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', showOverviewView);
    }
});

// Interactive UNO Card Deck Google Reviews Handler
document.addEventListener('DOMContentLoaded', () => {
    const deck = document.getElementById('uno-review-deck');
    if (!deck) return;

    const cards = Array.from(deck.querySelectorAll('.google-maps-card'));
    if (cards.length === 0) return;

    let currentIndex = 0;
    let isAnimating = false;

    function updateDeckPositions() {
        cards.forEach((card, i) => {
            const relIndex = (i - currentIndex + cards.length) % cards.length;
            card.classList.remove('card-front', 'card-behind-1', 'card-behind-2', 'card-hidden', 'card-falling', 'card-exiting');

            if (relIndex === 0) {
                card.classList.add('card-front');
            } else if (relIndex === 1) {
                card.classList.add('card-behind-1');
            } else if (relIndex === 2) {
                card.classList.add('card-behind-2');
            } else {
                card.classList.add('card-hidden');
            }
        });
    }

    function cycleNextCard() {
        if (isAnimating) return;
        isAnimating = true;

        const exitingCard = cards[currentIndex];

        currentIndex = (currentIndex + 1) % cards.length;
        updateDeckPositions();

        // Add exiting class to old top card so it drops down simultaneously in parallel
        exitingCard.classList.remove('card-hidden');
        exitingCard.classList.add('card-exiting');

        setTimeout(() => {
            exitingCard.classList.remove('card-exiting');
            isAnimating = false;
        }, 550);
    }

    deck.addEventListener('click', cycleNextCard);

    // Auto cycle every 4.5 seconds
    let deckInterval = setInterval(cycleNextCard, 4500);

    deck.addEventListener('mouseenter', () => clearInterval(deckInterval));
    deck.addEventListener('mouseleave', () => {
        deckInterval = setInterval(cycleNextCard, 4500);
    });

    updateDeckPositions();
});
