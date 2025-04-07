document.addEventListener('DOMContentLoaded', function() {
    // Animation des cartes de certification
    const certificationCards = document.querySelectorAll('.certification-card');
    
    certificationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('certification-card-hover');
            const icon = this.querySelector('.certification-icon');
            if (icon) {
                icon.classList.add('icon-pulse');
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('certification-card-hover');
            const icon = this.querySelector('.certification-icon');
            if (icon) {
                icon.classList.remove('icon-pulse');
            }
        });
    });
    
    // Gestion des modales de certification
    const certificationLinks = document.querySelectorAll('.certification-link');
    
    certificationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const certificationId = this.getAttribute('data-certification-id');
            const modal = document.getElementById(certificationId);
            
            if (modal) {
                const bsModal = new bootstrap.Modal(modal);
                bsModal.show();
            }
        });
    });
    
    // Animation des badges de certification
    const certificationBadges = document.querySelectorAll('.certification-badge');
    
    // Observer pour déclencher l'animation quand les éléments sont visibles
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('badge-animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    certificationBadges.forEach(badge => {
        observer.observe(badge);
    });
    
    // Gestion de la galerie d'images
    const galleries = document.querySelectorAll('.certification-gallery');
    
    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('img');
        const dotsContainer = gallery.parentElement.querySelector('.gallery-dots');
        const prevButton = gallery.parentElement.querySelector('.gallery-prev');
        const nextButton = gallery.parentElement.querySelector('.gallery-next');
        
        let currentIndex = 0;
        
        // Créer les points de navigation
        images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('gallery-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => showImage(index));
            dotsContainer.appendChild(dot);
        });
        
        // Fonction pour afficher une image
        function showImage(index) {
            images.forEach(img => img.classList.remove('active'));
            const dots = dotsContainer.querySelectorAll('.gallery-dot');
            dots.forEach(dot => dot.classList.remove('active'));
            
            images[index].classList.add('active');
            dots[index].classList.add('active');
            currentIndex = index;
        }
        
        // Gestion des boutons précédent/suivant
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                const newIndex = (currentIndex - 1 + images.length) % images.length;
                showImage(newIndex);
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const newIndex = (currentIndex + 1) % images.length;
                showImage(newIndex);
            });
        }
        
        // Défilement automatique toutes les 5 secondes
        let interval = setInterval(() => {
            const newIndex = (currentIndex + 1) % images.length;
            showImage(newIndex);
        }, 5000);
        
        // Arrêter le défilement automatique au survol
        gallery.addEventListener('mouseenter', () => clearInterval(interval));
        gallery.addEventListener('mouseleave', () => {
            interval = setInterval(() => {
                const newIndex = (currentIndex + 1) % images.length;
                showImage(newIndex);
            }, 5000);
        });
    });
    
    // Animation des images de certification
    const certificationImages = document.querySelectorAll('.certification-image');
    
    certificationImages.forEach(image => {
        image.addEventListener('click', function() {
            // Créer un modal pour afficher l'image en grand
            const modal = document.createElement('div');
            modal.className = 'certification-image-modal';
            
            const modalContent = document.createElement('div');
            modalContent.className = 'certification-image-modal-content';
            
            const closeBtn = document.createElement('span');
            closeBtn.className = 'certification-image-modal-close';
            closeBtn.innerHTML = '&times;';
            
            const img = document.createElement('img');
            img.src = this.src;
            img.alt = this.alt;
            
            modalContent.appendChild(closeBtn);
            modalContent.appendChild(img);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            // Afficher le modal avec animation
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            // Fermer le modal au clic sur le bouton de fermeture ou en dehors de l'image
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            function closeModal() {
                modal.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            }
        });
    });
}); 