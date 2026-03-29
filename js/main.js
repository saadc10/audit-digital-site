/* ============================================
   Audit Digital | Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initMobileMenu();
    initScrollReveal();
    initPortfolioKeyboard();
    initHeroParallax();
    initContactForm();
    initActiveNav();
});


/* --- Navbar scroll effect --- */
function initNav() {
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
    }, { passive: true });
}


/* --- Mobile menu toggle --- */
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');
    const links = menu.querySelectorAll('a');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        var isOpen = menu.classList.contains('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
        toggle.setAttribute('aria-expanded', isOpen);
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}


/* --- Scroll reveal animations --- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.section-label, .section-title, .problem__card, .problem__why-item, .services__item, .portfolio__item, .process__step, .about__stat'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}


/* --- Portfolio keyboard accessibility --- */
function initPortfolioKeyboard() {
    document.querySelectorAll('.portfolio__item--live[role="button"]').forEach(function(card) {
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
}


/* --- Active nav state --- */
function initActiveNav() {
    var sectionIds = ['problem', 'services', 'portfolio', 'about', 'contact'];
    var navLinks = {};

    // Exclude the nav CTA — it's a button, not a section indicator
    document.querySelectorAll('.nav__links a[href^="#"]:not(.nav__cta)').forEach(function(link) {
        var id = link.getAttribute('href').replace('#', '');
        navLinks[id] = link;
    });

    var sections = sectionIds.map(function(id) {
        return document.getElementById(id);
    }).filter(Boolean);

    function update() {
        // Find the last section whose top edge is above 40% of the viewport height
        var threshold = window.scrollY + window.innerHeight * 0.4;
        var active = null;

        for (var i = 0; i < sections.length; i++) {
            if (sections[i].offsetTop <= threshold) {
                active = sections[i].id;
            }
        }

        sectionIds.forEach(function(id) {
            if (navLinks[id]) navLinks[id].classList.remove('active');
        });
        if (active && navLinks[active]) {
            navLinks[active].classList.add('active');
        }
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
}


/* --- Contact form --- */
function initContactForm() {
    var form = document.getElementById('contactForm');
    var submit = document.getElementById('contactSubmit');
    var success = document.getElementById('formSuccess');
    var error = document.getElementById('formError');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        submit.disabled = true;
        submit.textContent = 'Sending…';
        success.style.display = 'none';
        error.style.display = 'none';

        var data = new FormData(form);

        fetch('https://formspree.io/f/mzdjnjjg', {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        })
        .then(function(res) {
            if (res.ok) {
                success.style.display = 'block';
                form.reset();
            } else {
                error.style.display = 'block';
            }
        })
        .catch(function() {
            error.style.display = 'block';
        })
        .finally(function() {
            submit.disabled = false;
            submit.textContent = 'Send Enquiry';
        });
    });
}


/* --- Hero parallax on scroll --- */
function initHeroParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;

    var pattern = document.querySelector('.hero__bg-pattern');
    var content = document.querySelector('.hero__container');
    var hero    = document.querySelector('.hero');
    if (!pattern || !content || !hero) return;

    content.style.willChange = 'transform, opacity';

    var ticking = false;
    var heroH = hero.offsetHeight;

    function update() {
        var scrollY = window.scrollY;

        if (scrollY > heroH) {
            pattern.style.transform = '';
            content.style.transform = '';
            content.style.opacity   = '';
            ticking = false;
            return;
        }

        var progress = scrollY / heroH;

        // Background drifts at 30% scroll speed — slower than content, creates depth
        pattern.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';

        // Content lifts gently and fades slightly as the hero exits
        content.style.transform = 'translateY(' + (scrollY * 0.12) + 'px)';
        content.style.opacity   = 1 - progress * 0.35;

        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener('resize', function() {
        heroH = hero.offsetHeight;
    }, { passive: true });
}



/* --- Comparison slider --- */

/* ADD NEW FIRMS HERE — copy the uppal block, change the key and values
   Images go in assets/comparisons/[slug]-old.png and [slug]-new.png */

var compareData = {
    uppal: {
        title: 'Uppal & Co Accountants',
        subtitle: 'Homepage comparison',
        oldImg: 'assets/comparisons/uppal-old.png',
        newImg: 'assets/comparisons/uppal-new.png',
        liveUrl: 'https://uppal.auditdigital.co.uk/'
    }
};

var sliderDragging = false;
var sliderAnimating = false;

function openComparison(key) {
    var data = compareData[key];
    if (!data) return;

    if (window.innerWidth <= 768) {
        window.open(data.liveUrl, '_blank');
        return;
    }

    var modal = document.getElementById('compareModal');
    document.getElementById('compareTitle').textContent = data.title;
    document.getElementById('compareSubtitle').textContent = data.subtitle;
    document.getElementById('compareOld').src = data.oldImg;
    document.getElementById('compareNew').src = data.newImg;
    document.getElementById('compareLiveLink').href = data.liveUrl;

    sliderAnimating = false;
    setSliderPosition(50);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    setTimeout(function() { autoSweep(); }, 800);
}

function closeComparison() {
    var modal = document.getElementById('compareModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    sliderAnimating = false;
}

function autoSweep() {
    sliderAnimating = true;
    var keyframes = [
        { from: 50, to: 8, duration: 1200 },
        { from: 8, to: 92, duration: 2000 },
        { from: 92, to: 50, duration: 1000 }
    ];
    var step = 0;

    function runStep() {
        if (step >= keyframes.length || !sliderAnimating) {
            sliderAnimating = false;
            return;
        }
        var kf = keyframes[step];
        var startTime = null;

        function animate(ts) {
            if (!sliderAnimating) return;
            if (!startTime) startTime = ts;
            var progress = Math.min((ts - startTime) / kf.duration, 1);
            var eased = 0.5 - 0.5 * Math.cos(progress * Math.PI);
            setSliderPosition(kf.from + (kf.to - kf.from) * eased);
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                step++;
                runStep();
            }
        }
        requestAnimationFrame(animate);
    }
    runStep();
}

function setSliderPosition(pct) {
    pct = Math.max(2, Math.min(98, pct));
    var newImg = document.getElementById('compareNew');
    var divider = document.getElementById('compareDivider');
    newImg.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    divider.style.left = pct + '%';
}

(function() {
    var slider = document.getElementById('compareSlider');
    if (!slider) return;

    var pendingPosition = null;
    var rafId = null;

    function getPosition(e) {
        var rect = slider.getBoundingClientRect();
        var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        return (x / rect.width) * 100;
    }

    function applyPosition() {
        if (pendingPosition !== null) {
            setSliderPosition(pendingPosition);
            pendingPosition = null;
        }
        rafId = null;
    }

    function queuePosition(pct) {
        pendingPosition = pct;
        if (!rafId) rafId = requestAnimationFrame(applyPosition);
    }

    slider.addEventListener('mousedown', function(e) {
        sliderDragging = true;
        sliderAnimating = false;
        setSliderPosition(getPosition(e));
        e.preventDefault();
    });

    slider.addEventListener('touchstart', function(e) {
        sliderDragging = true;
        sliderAnimating = false;
        setSliderPosition(getPosition(e));
    }, { passive: true });

    document.addEventListener('mousemove', function(e) {
        if (sliderDragging) queuePosition(getPosition(e));
    });

    document.addEventListener('touchmove', function(e) {
        if (sliderDragging) queuePosition(getPosition(e));
    }, { passive: true });

    document.addEventListener('mouseup', function() { sliderDragging = false; });
    document.addEventListener('touchend', function() { sliderDragging = false; });
})();

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeComparison();
});
