// Global Accordion Handler (Accessible to inline onclick & event listeners)
window.toggleAccordion = function (headerElement) {
    if (!headerElement) return;
    const currentItem = headerElement.closest('.accordion-item');
    const allItems = document.querySelectorAll('#services-accordion .accordion-item');

    if (!currentItem) return;
    const isActive = currentItem.classList.contains('active');

    allItems.forEach(item => {
        item.classList.remove('active');
    });

    if (!isActive) {
        currentItem.classList.add('active');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis 1.1 Buttery Smooth Scroll Engine
    let lenis = null;
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

    // 5. ScrollSpy Active Link Observer
    const sections = document.querySelectorAll('main > section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3
    });

    sections.forEach(section => scrollSpyObserver.observe(section));

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

    // 7. Fast 0.35s Scroll Blur-In Reveal Observer
    const blurElements = document.querySelectorAll('.blur-in');
    const blurObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.01,
        rootMargin: '100px 0px 100px 0px'
    });

    blurElements.forEach(el => {
        blurObserver.observe(el);
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100) {
            el.classList.add('visible');
        }
    });

    // 8. Services Accordion Click Handler & Category Filter Pills Handler
    const accordionHeaders = document.querySelectorAll('#services-accordion .accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function () {
            window.toggleAccordion(this);
        });
    });

    const tabBtns = document.querySelectorAll('.service-tabs .tab-btn');
    const accordionItems = document.querySelectorAll('#services-accordion .accordion-item');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-category');

            let firstVisible = null;
            accordionItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.classList.remove('hidden');
                    if (!firstVisible) firstVisible = item;
                } else {
                    item.classList.add('hidden');
                    item.classList.remove('active');
                }
            });

            if (firstVisible && !document.querySelector('#services-accordion .accordion-item.active:not(.hidden)')) {
                accordionItems.forEach(i => i.classList.remove('active'));
                firstVisible.classList.add('active');
            }
        });
    });

    // 9. Trust Stats Counter Animation (Single Unified Block)
    const statsBar = document.getElementById('stats-counter-bar');
    let hasAnimatedStats = false;

    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            let current = 0;
            const increment = Math.ceil(target / 40);
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = current + suffix;
            }, 35);
        });
    }

    if (statsBar) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimatedStats) {
                    hasAnimatedStats = true;
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
