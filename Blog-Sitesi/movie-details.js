const API_KEY = 'your_api_key_here'; // config.js'den alınacak
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// URL'den film ID'sini al
function getMovieIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Film detaylarını getir
async function fetchMovieDetails() {
    const movieId = getMovieIdFromUrl();
    if (!movieId) return;

    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=tr-TR`);
        const movie = await response.json();
        displayMovieDetails(movie);
    } catch (error) {
        console.error('Film detayları yüklenirken hata:', error);
    }
}

// Film detaylarını görüntüle
function displayMovieDetails(movie) {
    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-overview').textContent = movie.overview;
    document.getElementById('movie-rating').textContent = `${movie.vote_average.toFixed(1)}/10`;
    document.getElementById('movie-release-date').textContent = new Date(movie.release_date).toLocaleDateString('tr-TR');
    document.getElementById('movie-genres').textContent = movie.genres.map(genre => genre.name).join(', ');
    document.getElementById('movie-poster').src = `${IMG_BASE_URL}${movie.poster_path}`;
    
    // Beğeni durumunu kontrol et
    const isLiked = getLikeStatus('movie', movie.id);
    updateLikeButton(isLiked);
    
    // Yorumları göster
    displayComments(getComments('movie', movie.id));
}

// Beğeni ve yorum fonksiyonları
function getLikeStatus(type, id) {
    const likes = JSON.parse(localStorage.getItem('likes') || '{}');
    return likes[`${type}_${id}`] || false;
}

function updateLikeButton(isLiked) {
    const likeButton = document.getElementById('like-button');
    if (isLiked) {
        likeButton.innerHTML = '<i class="fas fa-heart"></i> Beğenildi';
        likeButton.style.backgroundColor = '#f4e243';
        likeButton.style.color = '#474c52';
    } else {
        likeButton.innerHTML = '<i class="far fa-heart"></i> Beğen';
        likeButton.style.backgroundColor = '#474c52';
        likeButton.style.color = '#f4e243';
    }
}

function getComments(type, id) {
    const comments = JSON.parse(localStorage.getItem('comments') || '{}');
    return comments[`${type}_${id}`] || [];
}

function displayComments(comments) {
    const container = document.getElementById('comments-section');
    container.innerHTML = comments.map(comment => `
        <div class="comment mb-2 text-white">
            <strong>${comment.nickname}</strong>: ${comment.text}
        </div>
    `).join('');
}

// Sayfa yüklendiğinde film detaylarını getir
document.addEventListener('DOMContentLoaded', fetchMovieDetails); 