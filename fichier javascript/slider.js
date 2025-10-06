/**
 * INITIALISATION DU SLIDER
 * Se déclenche quand le DOM est chargé
 */
document.addEventListener('DOMContentLoaded', () => {
    // ========== VARIABLES ==========
    const slider = document.querySelector('.slider');
    const slides = document.querySelector('.slides');
    const images = document.querySelectorAll('.slides img');
    const dotsContainer = document.querySelector('.dots');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    let currentSlide = 0; // Index de la slide actuelle
    let slideInterval; // Intervalle pour le défilement auto
    let isHovering = false; // État de survol
    let isDragging = false; // État de glissement
    let startX = 0; // Position initiale du glissement
    let currentTranslate = 0; // Translation actuelle

    // ========== CRÉATION DES POINTS INDICATEURS ==========
    images.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.dataset.id = index;
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dots span');

    // ========== FONCTIONS ==========
    /**
     * Met à jour la position du slider
     */
    function updateSlider() {
        slides.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Met à jour les points indicateurs
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }

    /**
     * Démarre le défilement automatique
     */
    function startSlider() {
        slideInterval = setInterval(() => {
            if (!isHovering && !isDragging) {
                goToNextSlide();
            }
        }, 5000); // Change de slide toutes les 5 secondes
    }

    /**
     * Passe à la slide suivante
     */
    function goToNextSlide() {
        currentSlide = (currentSlide + 1) % images.length;
        updateSlider();
    }

    /**
     * Passe à la slide précédente
     */
    function goToPrevSlide() {
        currentSlide = (currentSlide - 1 + images.length) % images.length;
        updateSlider();
    }

    /**
     * Réinitialise l'intervalle
     */
    function resetInterval() {
        clearInterval(slideInterval);
        startSlider();
    }

    // ========== ÉVÉNEMENTS ==========
    // Survol du slider
    slider.addEventListener('mouseenter', () => {
        isHovering = true;
        clearInterval(slideInterval);
    });

    slider.addEventListener('mouseleave', () => {
        isHovering = false;
        resetInterval();
    });

    // Boutons de navigation
    nextBtn.addEventListener('click', () => {
        goToNextSlide();
        resetInterval();
    });

    prevBtn.addEventListener('click', () => {
        goToPrevSlide();
        resetInterval();
    });

    // Navigation par points
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            currentSlide = parseInt(dot.dataset.id);
            updateSlider();
            resetInterval();
        });
    });

    // ========== GESTION DU TOUCH/DRAG ==========
    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        currentTranslate = -currentSlide * 100;
        clearInterval(slideInterval);
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const x = e.clientX;
        const diff = x - startX;
        const newTranslate = currentTranslate + (diff / slider.offsetWidth) * 100;
        
        // Limite la translation
        slides.style.transform = `translateX(calc(${newTranslate}%))`;
    });

    slider.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const x = e.clientX;
        const diff = x - startX;
        
        // Détermine si on change de slide
        if (Math.abs(diff) > 50) { // Seuil de glissement
            if (diff > 0) {
                goToPrevSlide();
            } else {
                goToNextSlide();
            }
        } else {
            updateSlider(); // Revenir à la slide actuelle
        }
        
        resetInterval();
    });

    // ========== INITIALISATION ==========
    updateSlider(); // Affiche la première slide
    startSlider(); // Démarre le défilement auto
});
