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
var sliderAnimating = false;

function openComparison(key) {
    var data = compareData[key];
    if (!data) return;

    var modal = document.getElementById('compareModal');
    document.getElementById('compareTitle').textContent = data.title;
    document.getElementById('compareSubtitle').textContent = data.subtitle;
    document.getElementById('compareOld').src = data.oldImg;
    document.getElementById('compareNew').src = data.newImg;
    document.getElementById('compareLiveLink').href = data.liveUrl;

    setSliderPosition(50);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    setTimeout(function() { autoSweep(); }, 600);
}

function closeComparison() {
    var modal = document.getElementById('compareModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    sliderAnimating = false;
}

function setSliderPosition(pct) {
    pct = Math.max(2, Math.min(98, pct));
    var clip = document.getElementById('compareClip');
    var divider = document.getElementById('compareDivider');
    clip.style.width = pct + '%';
    divider.style.left = pct + '%';
}

function autoSweep() {
    sliderAnimating = true;
    var start = 50;
    var keyframes = [
        { target: 75, duration: 500 },
        { target: 25, duration: 800 },
        { target: 50, duration: 500 }
    ];
    var step = 0;

    function runStep() {
        if (step >= keyframes.length || !sliderAnimating) {
            sliderAnimating = false;
            return;
        }
        var kf = keyframes[step];
        var from = step === 0 ? start : keyframes[step - 1].target;
        var to = kf.target;
        var dur = kf.duration;
        var startTime = null;

        function animate(ts) {
            if (!sliderAnimating) return;
            if (!startTime) startTime = ts;
            var elapsed = ts - startTime;
            var progress = Math.min(elapsed / dur, 1);
            var eased = 0.5 - 0.5 * Math.cos(progress * Math.PI);
            setSliderPosition(from + (to - from) * eased);
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

(function() {
    var slider = document.getElementById('compareSlider');
    if (!slider) return;

    function getPosition(e) {
        var rect = slider.getBoundingClientRect();
        var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        return (x / rect.width) * 100;
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
        if (sliderDragging) setSliderPosition(getPosition(e));
    });

    document.addEventListener('touchmove', function(e) {
        if (sliderDragging) setSliderPosition(getPosition(e));
    }, { passive: true });

    document.addEventListener('mouseup', function() { sliderDragging = false; });
    document.addEventListener('touchend', function() { sliderDragging = false; });
})();

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeComparison();
});
