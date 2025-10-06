document.addEventListener('DOMContentLoaded', () => {
    // ========== DONNÉES LOCALES ==========
    // Tous les articles disponibles pour la recherche
    const localDatabase = [
        {
            id: 1,
            title: "Nouvel album de Vald",
            category: "musique",
            excerpt: "Le rappeur Vald a sorti son nouvel album ce vendredi.",
            url: "musique.html#album-v"
        },
        {
            id: 2,
            title: "Mise à jour Minecraft",
            category: "jeux-videos",
            excerpt: "La mise à jour 1.20 ajoute de nouveaux biomes.",
            url: "jeux-videos.html#minecraft-120"
        },
        {
            id: 3,
            title: "Résultat du weekend",
            category: "sport",
            excerpt: "Victoire du Real Madrid, nouvelle défaite de l'OM...",
            url: "sport.html#resultat"
        },
        {
            id: 4,
            title: "Topuria vs Makhachev",  // Corrigé : espace après "vs"
            category: "sport",
            excerpt: "Topuria vs Makhachev : vers le combat de l'année ?",
            url: "sport.html#annonce"
        },  // Virgule ajoutée ici (sauf pour le dernier élément)
        {
            id: 5,
            title: "Trump fait des ravages",
            category: "actu",
            excerpt: "Trump inquiète le monde entier",
            url: "monde.html#trump"
        },
        {
            id: 6,
            title: "Bouleversement Politique en France",
            category: "actu",
            excerpt: "Le RN détourne 4.1M d'euros sans scrupule.",
            url: "monde.html#politique"
        },
        {
            id: 7,
            title: "Switch 2 : enfin là ?",
            category: "jeux-videos",
            excerpt: "La Nintendo Switch 2 serait disponible en juin",
            url: "jeux-videos.html#switch"
        },
        {
            id: 8,
            title: "ChatGPT progresse vitesse grand V !",
            category: "actu",
            excerpt: "L'IA ChatGPT fait débat après les nouvelles fonctionnalités Ghibli",  // Guillemets retirés
            url: "monde.html#ChatGPT"
        },
		{
			id: 9,
            title: "Carlos Alcaraz : un début de saison moyen ? ",
            category: "sport",
            excerpt: "Le prodige du tennis réalise un début de saison 2025 assez mitigé",  
            url: "sport.html#alcaraz"
		},
		{
			id: 10,
            title: "Palestine : toujours pas de paix en Moyen-Orient",
            category: "actu",
            excerpt: "Le Moyen-Orient et notamment la Palestine ne peuvent toujours pas vivre en paix dû aux difficultées d'une trève",  
            url: "monde.html#paix"
		},
		{
			id: 11,
            title: "CR7 : toujours légendaire !",
            category: "sport",
            excerpt: "Le GOAT portugais continue d'empiler les buts à passé 40ans !",  
            url: "sport.html#ronaldo"
		},
		{
			id: 12,
            title: "Playboy Carti : tout ça pour ça ? ",
            category: "musique",
            excerpt: "Le rappeur américain a fait poireauter ses fans pendant plusieurs années pour un album très moyen parait-t-il",  
            url: "musique.html#carti"
		},	
        {
			id: 13,
            title: "Un nouveau Mario Galaxy ?",
            category: "jeux-vidéos",
            excerpt: "Les fans nintendo espèrent que la rumeur menant à un nouvel opus de la licence Mario Galaxy dit vrai",  
            url: "jeux-vidéos.html#mario"
		},
		{
			id: 14,
            title: "Un nouveau club pour Pogba ?",
            category: "sport",
            excerpt: "Beaucoup de rumeur sur le footballeur Paul Pogba : vers l'OM ?",  
            url: "sport.html#pogba"
		},
		{
			id: 15,
            title: "GTA VI : Encore du retard ?",
            category: "jeux-vidéos",
            excerpt: "Les fans redoutent que RockstarGmaes repousse à nouveau son jeu tant attendu",  
            url: "jeux-vidéos.html#rockstar"
		},
    ];

    // ========== RÉCUPÉRATION DES ÉLÉMENTS DU DOM ==========
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    // Debug : vérifie que les éléments existent
    if (!searchInput || !searchResults) {
        console.error("Erreur : Éléments introuvables. Vérifiez les IDs dans le HTML.");
        return;
    }

    // ========== FONCTION DE RECHERCHE ==========
    const performSearch = (query) => {
        // Ignore les recherches trop courtes
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        // Filtre les résultats (insensible à la casse)
        const results = localDatabase.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) || 
            item.excerpt.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );

        displayResults(results);
    };

    // ========== AFFICHAGE DES RÉSULTATS ==========
    const displayResults = (results) => {
        searchResults.innerHTML = '';  // Réinitialise les résultats

        if (results.length === 0) {
            // Affiche un message si aucun résultat
            searchResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>Aucun résultat trouvé</p>
                </div>
            `;
        } else {
            // Génère les éléments de résultat
            results.forEach(item => {
                const resultItem = document.createElement('a');
                resultItem.href = item.url;
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <div class="result-category ${item.category}">
                        ${getCategoryIcon(item.category)}
                    </div>
                    <div>
                        <h3>${highlightText(item.title, searchInput.value)}</h3>
                        <p>${highlightText(item.excerpt, searchInput.value)}</p>
                    </div>
                `;
                searchResults.appendChild(resultItem);
            });
        }

        // Affiche le conteneur
        searchResults.style.display = 'block';
    };

    // ========== FONCTIONS UTILITAIRES ==========
    /**
     * Met en surbrillance les correspondances dans le texte
     * @param {string} text - Texte original
     * @param {string} query - Terme recherché
     * @returns {string} Texte avec balises <mark>
     */
    const highlightText = (text, query) => {
        if (!query) return text;
        return text.replace(new RegExp(query, 'gi'), match => 
            `<mark>${match}</mark>`
        );
    };

    /**
     * Renvoie une icône Font Awesome selon la catégorie
     * @param {string} category - Catégorie de l'article
     * @returns {string} Balise HTML de l'icône
     */
    const getCategoryIcon = (category) => {
        const icons = {
            musique: '<i class="fas fa-music"></i>',
            sport: '<i class="fas fa-running"></i>',
            'jeux-videos': '<i class="fas fa-gamepad"></i>',
            actu: '<i class="fas fa-globe"></i>'
        };
        return icons[category] || '<i class="fas fa-newspaper"></i>';
    };

    // ========== GESTION DES ÉVÉNEMENTS ==========
    // Déclenche la recherche à chaque saisie
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });

    // Cache les résultats quand on clique ailleurs
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar')) {
            searchResults.style.display = 'none';
        }
    });

    // Debug : confirme le chargement
    console.log("Initialisation terminée. Articles chargés :", localDatabase.length);
});
