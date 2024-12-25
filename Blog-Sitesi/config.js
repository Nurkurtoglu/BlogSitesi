// API Yapılandırması
const API_KEY = 'c9d5f0f01b098c021e6964b9fae786dd';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Beğeni sistemi fonksiyonları
function toggleLike(type, contentId) {
    // Local storage'dan beğenileri al
    let likes = JSON.parse(localStorage.getItem('likes')) || {};
    const likeButton = document.getElementById(`${type}-like-button`);
    
    // İçerik için beğeni durumunu güncelle
    if (!likes[contentId]) {
        likes[contentId] = {
            count: 1,
            timestamp: new Date().toISOString()
        };
        likeButton.innerHTML = '<i class="fas fa-heart"></i> Beğenildi';
        likeButton.classList.add('liked');
    } else {
        delete likes[contentId];
        likeButton.innerHTML = '<i class="far fa-heart"></i> Beğen';
        likeButton.classList.remove('liked');
    }
    
    // Local storage'a kaydet
    localStorage.setItem('likes', JSON.stringify(likes));
    
    // Beğeni sayısını güncelle
    updateLikeCount(type, contentId);
}

// Beğeni sayısını güncelle
function updateLikeCount(type, contentId) {
    const likes = JSON.parse(localStorage.getItem('likes')) || {};
    const likeCount = document.getElementById(`${type}-like-count`);
    const count = likes[contentId] ? 1 : 0;
    likeCount.textContent = `${count} beğeni`;
}

// Beğeni durumunu kontrol et
function checkLikeStatus(type, contentId) {
    const likes = JSON.parse(localStorage.getItem('likes')) || {};
    const likeButton = document.getElementById(`${type}-like-button`);
    
    if (likes[contentId]) {
        likeButton.innerHTML = '<i class="fas fa-heart"></i> Beğenildi';
        likeButton.classList.add('liked');
    } else {
        likeButton.innerHTML = '<i class="far fa-heart"></i> Beğen';
        likeButton.classList.remove('liked');
    }
    
    updateLikeCount(type, contentId);
}

// Modal içeriğini güncelle
function updateModalContent(type, content) {
    const modalTitle = document.getElementById(`${type}-title`);
    const modalOverview = document.getElementById(`${type}-overview`);
    const modalPoster = document.getElementById(`${type}-poster`);
    const modalRating = document.getElementById(`${type}-rating`);
    
    modalTitle.textContent = content.title;
    modalOverview.textContent = content.overview;
    modalPoster.src = content.poster_path ? `${IMG_BASE_URL}${content.poster_path}` : 'placeholder.jpg';
    modalRating.textContent = content.vote_average;
    
    // Beğeni durumunu güncelle
    checkLikeStatus(type, content.title);
} 
function updateLikeButton(button, isLiked) {
    if (isLiked) {
        button.innerHTML = '<i class="fas fa-heart"></i> Beğenildi';
        button.classList.remove('btn-outline-warning');
        button.classList.add('btn-warning');
    } else {
        button.innerHTML = '<i class="far fa-heart"></i> Beğen';
        button.classList.remove('btn-warning');
        button.classList.add('btn-outline-warning');
    }
}