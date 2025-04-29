window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const home = document.querySelector('.home');
    
    // Обработка navbar
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    home.style.backgroundPosition = `center ${window.pageYOffset * 0.5}px`;
    
    if (isMenuOpen) {
        navLinks.classList.remove('active');
        socialIcons.classList.remove('active');
        menuButton.innerHTML = '☰';
        isMenuOpen = false;
    }
});

const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
const socialIcons = document.querySelector('.social-icons');
let isMenuOpen = false;

menuButton.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    navLinks.classList.toggle('active');
    socialIcons.classList.toggle('active');
    menuButton.innerHTML = isMenuOpen ? '×' : '☰';
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value.toLowerCase();
    const versionFilter = document.getElementById('versionFilter').value;
    const productsGrid = document.querySelector('.products-grid');
    
    const cards = Array.from(document.querySelectorAll('.sudo'));
    
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const category = card.querySelector('.category').textContent.toLowerCase();
        const version = card.querySelector('.version').textContent;
        
        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesType = !typeFilter || category.includes(typeFilter);
        const matchesVersion = !versionFilter || version.includes(versionFilter);
        
        if (matchesSearch && matchesType && matchesVersion) {
            card.style.display = '';
            card.style.order = '0';
        } else {
            card.style.display = 'none';
            card.style.order = '1'; 
        }
    });
    
    const visibleCards = cards.filter(card => card.style.display !== 'none');
    visibleCards.forEach((card, index) => {
        productsGrid.appendChild(card);
    });
}

document.getElementById('searchInput').addEventListener('input', filterProducts);
document.getElementById('typeFilter').addEventListener('change', filterProducts);
document.getElementById('versionFilter').addEventListener('change', filterProducts);

document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.sudo');
    let currentModal = null;
    let currentImageIndex = 0;
    let modalImages = [];

    productCards.forEach((card, index) => {
        const productCard = card.querySelector('.product-card');
        const modal = card.querySelector('.modal');
        
        const modalId = `product-modal-${index}`;
        modal.id = modalId;
        productCard.setAttribute('data-modal', modalId);
    });

    function initializeModal(modal) {
        currentModal = modal;
        modalImages = Array.from(modal.querySelectorAll('.modal-image'));
        currentImageIndex = 0;
        
        document.addEventListener('keydown', handleKeyPress);
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        modal.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        modal.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchEndX - touchStartX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    showImage(currentImageIndex - 1);
                } else {
                    showImage(currentImageIndex + 1);
                }
            }
        }
    }

    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        initializeModal(modal);
        showImage(0);
        preloadImages();
    }

    function closeModal() {
        if (currentModal) {
            currentModal.classList.remove('active');
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeyPress);
            currentModal = null;
        }
    }

    function showImage(index) {
        if (!modalImages.length) return;
        
        currentImageIndex = ((index % modalImages.length) + modalImages.length) % modalImages.length;
        
        modalImages.forEach(img => {
            img.style.opacity = '0';
            img.style.display = 'none';
        });
        
        const targetImage = modalImages[currentImageIndex];
        targetImage.style.display = 'block';
        
        setTimeout(() => {
            targetImage.style.opacity = '1';
        }, 50);
    }

    function preloadImages() {
        const nextIndex = (currentImageIndex + 1) % modalImages.length;
        const prevIndex = (currentImageIndex - 1 + modalImages.length) % modalImages.length;
        
        if (modalImages[nextIndex]) {
            const nextImg = new Image();
            nextImg.src = modalImages[nextIndex].src;
        }
        
        if (modalImages[prevIndex]) {
            const prevImg = new Image();
            prevImg.src = modalImages[prevIndex].src;
        }
    }

    function handleKeyPress(e) {
        if (!currentModal) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                showImage(currentImageIndex - 1);
                break;
            case 'ArrowRight':
                showImage(currentImageIndex + 1);
                break;
            case 'Escape':
                closeModal();
                break;
        }
    }

    productCards.forEach(card => {
        const productCard = card.querySelector('.product-card');
        productCard.addEventListener('click', function() {
            const modalId = this.dataset.modal;
            const modal = document.getElementById(modalId);
            openModal(modal);
        });
    });

    document.addEventListener('click', function(e) {
        if (!currentModal) return;

        if (e.target.classList.contains('modal-overlay') || 
            e.target.classList.contains('modal-close')) {
            closeModal();
        }

        if (e.target.closest('.modal-prev')) {
            showImage(currentImageIndex - 1);
        }

        if (e.target.closest('.modal-next')) {
            showImage(currentImageIndex + 1);
        }
    });
});