document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour récupérer et afficher le flux RSS
    function fetchRSSFeed() {
        const rssContainer = document.getElementById('rss-feed');
        const pinnedContainer = document.getElementById('pinned-articles');
        const noPinnedMessage = document.querySelector('.no-pinned');
        
        // Utilisation d'un proxy CORS pour éviter les problèmes de sécurité
        const rssUrl = 'https://www.freecodecamp.org/news/rss/';
        const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(rssUrl);
        
        // Afficher un message de chargement
        rssContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                Chargement des articles...
            </div>
        `;
        
        // Récupérer les articles épinglés du localStorage
        const pinnedArticles = JSON.parse(localStorage.getItem('pinnedArticles') || '[]');
        
        // Afficher les articles épinglés
        if (pinnedArticles.length > 0) {
            noPinnedMessage.style.display = 'none';
            pinnedContainer.innerHTML = '<h3 class="pinned-title"><i class="fas fa-thumbtack"></i> Articles épinglés</h3>';
            pinnedArticles.forEach(article => {
                const articleElement = createArticleElement(article, true);
                pinnedContainer.appendChild(articleElement);
            });
        } else {
            noPinnedMessage.style.display = 'block';
            pinnedContainer.innerHTML = '<h3 class="pinned-title"><i class="fas fa-thumbtack"></i> Articles épinglés</h3>';
        }
        
        // Récupérer le flux RSS
        fetch(proxyUrl)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(data, 'text/xml');
                const items = xml.querySelectorAll('item');
                
                // Vider le conteneur
                rssContainer.innerHTML = '';
                
                // Filtrer les articles liés aux frameworks
                const frameworkKeywords = [
                    'framework', 'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt.js',
                    'django', 'flask', 'laravel', 'symfony', 'spring', 'express', 'node.js',
                    'bootstrap', 'tailwind', 'material-ui', 'jquery', 'webpack', 'babel',
                    'javascript', 'typescript', 'frontend', 'backend', 'web development'
                ];
                
                let articleCount = 0;
                let allArticles = [];
                
                // Collecter tous les articles pertinents
                items.forEach(item => {
                    const title = item.querySelector('title').textContent;
                    const description = item.querySelector('description').textContent;
                    
                    // Vérifier si l'article contient des mots-clés liés aux frameworks
                    const hasFrameworkKeyword = frameworkKeywords.some(keyword => 
                        title.toLowerCase().includes(keyword.toLowerCase()) || 
                        description.toLowerCase().includes(keyword.toLowerCase())
                    );
                    
                    if (hasFrameworkKeyword) {
                        const article = {
                            title: title,
                            link: item.querySelector('link').textContent,
                            description: description,
                            pubDate: new Date(item.querySelector('pubDate').textContent).toLocaleDateString()
                        };
                        
                        // Vérifier si l'article est épinglé
                        const isPinned = pinnedArticles.some(pinned => pinned.link === article.link);
                        if (!isPinned) {
                            allArticles.push(article);
                        }
                    }
                });
                
                // Si aucun article ne correspond aux critères, essayer un autre flux
                if (allArticles.length === 0) {
                    // Essayer un autre flux RSS
                    const alternativeRssUrl = 'https://www.smashingmagazine.com/feed/';
                    const alternativeProxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(alternativeRssUrl);
                    
                    fetch(alternativeProxyUrl)
                        .then(response => response.text())
                        .then(data => {
                            const parser = new DOMParser();
                            const xml = parser.parseFromString(data, 'text/xml');
                            const items = xml.querySelectorAll('item');
                            
                            // Vider le conteneur
                            rssContainer.innerHTML = '';
                            
                            // Afficher les articles
                            let articleCount = 0;
                            items.forEach(item => {
                                if (articleCount < 10) {
                                    const article = {
                                        title: item.querySelector('title').textContent,
                                        link: item.querySelector('link').textContent,
                                        description: item.querySelector('description').textContent,
                                        pubDate: new Date(item.querySelector('pubDate').textContent).toLocaleDateString()
                                    };
                                    
                                    // Vérifier si l'article est épinglé
                                    const isPinned = pinnedArticles.some(pinned => pinned.link === article.link);
                                    if (!isPinned) {
                                        const articleElement = createArticleElement(article, false);
                                        rssContainer.appendChild(articleElement);
                                        articleCount++;
                                    }
                                }
                            });
                            
                            if (articleCount === 0) {
                                rssContainer.innerHTML = `
                                    <div class="no-articles">
                                        <i class="fas fa-info-circle"></i>
                                        Aucun article sur les frameworks trouvé. Veuillez réessayer plus tard.
                                    </div>
                                `;
                            }
                        })
                        .catch(error => {
                            rssContainer.innerHTML = `
                                <div class="error">
                                    <i class="fas fa-exclamation-circle"></i>
                                    Erreur lors du chargement des articles. Veuillez réessayer.
                                </div>
                            `;
                            console.error('Erreur:', error);
                        });
                } else {
                    // Afficher les articles filtrés
                    allArticles.forEach(article => {
                        if (articleCount < 10) {
                            const articleElement = createArticleElement(article, false);
                            rssContainer.appendChild(articleElement);
                            articleCount++;
                        }
                    });
                    
                    if (articleCount === 0) {
                        rssContainer.innerHTML = `
                            <div class="no-articles">
                                <i class="fas fa-info-circle"></i>
                                Aucun article sur les frameworks trouvé. Veuillez réessayer plus tard.
                            </div>
                        `;
                    }
                }
            })
            .catch(error => {
                rssContainer.innerHTML = `
                    <div class="error">
                        <i class="fas fa-exclamation-circle"></i>
                        Erreur lors du chargement des articles. Veuillez réessayer.
                    </div>
                `;
                console.error('Erreur:', error);
            });
    }
    
    // Fonction pour créer un élément d'article
    function createArticleElement(article, isPinned) {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'rss-article';
        
        const pinButton = document.createElement('button');
        pinButton.className = `pin-button ${isPinned ? 'pinned' : ''}`;
        pinButton.innerHTML = `<i class="fas fa-thumbtack"></i>`;
        pinButton.onclick = () => togglePinArticle(article, articleDiv, pinButton);
        
        const title = document.createElement('h4');
        title.className = 'article-title';
        title.innerHTML = `<a href="${article.link}" target="_blank">${article.title}</a>`;
        
        const description = document.createElement('p');
        description.className = 'article-description';
        description.textContent = article.description;
        
        const date = document.createElement('div');
        date.className = 'article-date';
        date.textContent = article.pubDate;
        
        articleDiv.appendChild(pinButton);
        articleDiv.appendChild(title);
        articleDiv.appendChild(description);
        articleDiv.appendChild(date);
        
        return articleDiv;
    }
    
    // Fonction pour épingler/désépingler un article
    function togglePinArticle(article, articleElement, pinButton) {
        const pinnedArticles = JSON.parse(localStorage.getItem('pinnedArticles') || '[]');
        const isPinned = pinButton.classList.contains('pinned');
        
        if (isPinned) {
            // Désépingler l'article
            pinButton.classList.remove('pinned');
            const index = pinnedArticles.findIndex(a => a.link === article.link);
            if (index !== -1) {
                pinnedArticles.splice(index, 1);
                articleElement.remove();
            }
        } else {
            // Épingler l'article
            pinButton.classList.add('pinned');
            pinnedArticles.push(article);
            
            // Déplacer l'article vers la section épinglée
            const pinnedContainer = document.getElementById('pinned-articles');
            const noPinnedMessage = document.querySelector('.no-pinned');
            noPinnedMessage.style.display = 'none';
            
            const pinnedArticle = createArticleElement(article, true);
            pinnedContainer.appendChild(pinnedArticle);
            articleElement.remove();
        }
        
        // Mettre à jour le localStorage
        localStorage.setItem('pinnedArticles', JSON.stringify(pinnedArticles));
    }
    
    // Charger le flux RSS au chargement de la page
    fetchRSSFeed();
    
    // Rafraîchir le flux toutes les 5 minutes
    setInterval(fetchRSSFeed, 5 * 60 * 1000);
}); 