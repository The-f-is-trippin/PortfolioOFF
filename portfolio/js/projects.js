document.addEventListener('DOMContentLoaded', function() {
    // Animation des cartes de projet au survol
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('project-card-hover');
            const icon = this.querySelector('.project-icon');
            if (icon) {
                icon.classList.add('icon-spin');
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('project-card-hover');
            const icon = this.querySelector('.project-icon');
            if (icon) {
                icon.classList.remove('icon-spin');
            }
        });
    });
    
    // Gestion des modales de projet
    const projectLinks = document.querySelectorAll('.project-link');
    
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const projectId = this.getAttribute('data-project-id');
            const modal = document.getElementById(projectId);
            
            if (modal) {
                const bsModal = new bootstrap.Modal(modal);
                bsModal.show();
            }
        });
    });
    
    // Redirection des icônes de projet vers des sites web
    const projectIcons = document.querySelectorAll('.project-icon');
    
    // Définition des URLs pour chaque projet
    const projectUrls = {
        'jo2028': 'https://github.com/The-f-is-trippin/JO2028',
        'disney': 'https://the-f-is-trippin.github.io/Disney-plus-Francois-Fofana-Souare/',
        'cartegrise': 'https://github.com/The-f-is-trippin/JAVA-CARTE-GRISE',
        'nextcloud': 'https://nextcloud.com/'
    };
    
    projectIcons.forEach(icon => {
        // Rendre l'icône cliquable
        icon.style.cursor = 'pointer';
        
        // Ajouter un titre pour indiquer que c'est cliquable
        icon.title = 'Cliquez pour visiter le site';
        
        // Ajouter l'événement de clic
        icon.addEventListener('click', function(e) {
            e.stopPropagation(); // Empêcher la propagation de l'événement
            
            // Trouver le projet parent
            const projectCard = this.closest('.project-card');
            if (projectCard) {
                // Extraire l'ID du projet à partir du titre
                const projectTitle = projectCard.querySelector('.project-title').textContent.toLowerCase();
                let projectId = '';
                
                // Déterminer l'ID du projet en fonction du titre
                if (projectTitle.includes('jo')) {
                    projectId = 'jo2028';
                } else if (projectTitle.includes('disney')) {
                    projectId = 'disney';
                } else if (projectTitle.includes('carte grise')) {
                    projectId = 'cartegrise';
                } else if (projectTitle.includes('nextcloud')) {
                    projectId = 'nextcloud';
                }
                
                // Rediriger vers l'URL correspondante
                if (projectId && projectUrls[projectId]) {
                    window.open(projectUrls[projectId], '_blank');
                }
            }
        });
    });
    
    // Animation des compétences
    const skillBars = document.querySelectorAll('.skill-bar');
    
    // Observer pour déclencher l'animation quand les éléments sont visibles
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('skill-bar-animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}); 