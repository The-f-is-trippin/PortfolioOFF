// Animation au défilement
document.addEventListener('DOMContentLoaded', function() {
    // Animation des sections au scroll
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('section-hidden');
        observer.observe(section);
    });

    // Animation des cartes au hover
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Smooth scroll pour les liens de navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animation du texte de la navbar
    const navbarBrand = document.querySelector('.navbar-brand');
    navbarBrand.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    navbarBrand.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}); 