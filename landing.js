// ===== Landing Page Interactions - ATS Upgraded =====

document.addEventListener('DOMContentLoaded', () => {

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    // ===== ANIMATED COUNTER =====
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target, parseInt(entry.target.dataset.count));
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(el, target) {
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }

    // ===== SCROLL REVEAL =====
    const revealElements = document.querySelectorAll(
        '.feature-card, .step-card, .template-card, .ats-item'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = 'opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1), transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)';
        revealObserver.observe(el);
    });

    // ===== TEMPLATE CARD SELECTION =====
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        card.addEventListener('click', () => {
            templateCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });

    // ===== SMOOTH SCROLL FOR NAV LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const navH = navbar ? navbar.offsetHeight : 68;
                window.scrollTo({ top: target.offsetTop - navH - 8, behavior: 'smooth' });
            }
        });
    });

    // ===== ATS CHECKLIST STAGGER ON SCROLL =====
    const atsItems = document.querySelectorAll('.ats-item');
    const atsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, i * 60);
                atsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    atsItems.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(-16px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        atsObserver.observe(el);
    });

    // ===== ATS SCORE COUNTER IN HERO STAT =====
    // The "93% Avg ATS Score" stat gets a special color pulse on reveal
    const atsStatNumber = document.querySelector('.stat-number[data-count="93"]');
    if (atsStatNumber) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        atsStatNumber.style.color = '#34d399';
                        atsStatNumber.style.transition = 'color 0.4s ease';
                    }, 800);
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statObserver.observe(atsStatNumber);
    }

});