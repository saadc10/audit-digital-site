/* ============================================
   Audit Digital | Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initMobileMenu();
    initScrollReveal();
});


/* --- Navbar scroll effect --- */
function initNav() {
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }

        lastScroll = currentScroll;
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
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}


/* --- Scroll reveal animations --- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.problem__card, .services__item, .portfolio__item, .process__step, .about__stat'
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


/* --- Smooth scroll for anchor links (fallback) --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});


/* --- Comparison slider --- */
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

    setSliderPosition(50);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeComparison() {
    var modal = document.getElementById('compareModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
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
        setSliderPosition(getPosition(e));
        e.preventDefault();
    });

    slider.addEventListener('touchstart', function(e) {
        sliderDragging = true;
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
