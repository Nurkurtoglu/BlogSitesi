const API_KEY = 'c9d5f0f01b098c021e6964b9fae786dd';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let allMovies = [];
let allShows = [];

// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('yeni-filmler.html')) {
        fetchNewMovies();
    } else if (currentPage.includes('yeni-diziler.html')) {
        fetchNewTVShows();
    }
});

// Yeni çıkan filmler
async function fetchNewMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=tr-TR&page=1`);
        const data = await response.json();
        allMovies = data.results;
        displayMovies(data.results);
    } catch (error) {
        console.error('Filmler yüklenirken hata:', error);
    }
}

// Yeni çıkan diziler
async function fetchNewTVShows() {
    try {
        console.log('Yeni diziler yükleniyor...');
        const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&language=tr-TR&sort_by=first_air_date.desc&page=1&include_null_first_air_dates=false`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Yanıtı:', data);
        
        if (!data.results || data.results.length === 0) {
            throw new Error('Dizi verisi bulunamadı');
        }
        
        const validShows = data.results.filter(show => show.poster_path);
        console.log('Geçerli diziler:', validShows.length);
        
        allShows = validShows;
        displayTVShows(validShows);
        
    } catch (error) {
        console.error('Diziler yüklenirken hata:', error);
        const tvShowList = document.getElementById('tv-show-list');
        if (tvShowList) {
            tvShowList.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger" role="alert">
                        Diziler yüklenirken bir hata oluştu: ${error.message}
                    </div>
                </div>
            `;
        }
    }
}

// Filmleri görüntüle
function displayMovies(movies) {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = `
            <div class="col-md-3 mb-4">
                <div class="card text-white bg-dark">
                    <img src="${IMG_BASE_URL}${movie.poster_path}" class="card-img-top" alt="${movie.title}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <button class="btn w-100" 
                                style="background-color: #0d6efd; color: #f4e243; font-weight: bold;" 
                                onmouseover="this.style.backgroundColor='#0b5ed7'" 
                                onmouseout="this.style.backgroundColor='#0d6efd'"
                                onclick="showMovieDetails(${movie.id})">
                            Detayları Gör
                        </button>
                    </div>
                </div>
            </div>
        `;
        movieList.innerHTML += movieCard;
    });
}

// Dizileri görüntüle
function displayTVShows(shows) {
    console.log('displayTVShows çağrıldı, shows:', shows);
    
    const tvShowList = document.getElementById('tv-show-list');
    if (!tvShowList) {
        console.error('tv-show-list elementi bulunamadı');
        return;
    }

    if (!shows || shows.length === 0) {
        tvShowList.innerHTML = '<div class="col-12"><p class="text-white">Gösterilecek dizi bulunamadı.</p></div>';
        return;
    }

    tvShowList.innerHTML = '';
    shows.forEach(show => {
        if (!show.poster_path) return;

        const tvCard = `
            <div class="col-md-3 mb-4">
                <div class="card text-white bg-dark">
                    <img src="${IMG_BASE_URL}${show.poster_path}" 
                         class="card-img-top" 
                         alt="${show.name}"
                         onerror="this.src='https://via.placeholder.com/500x750.png?text=Resim+Bulunamadı'">
                    <div class="card-body">
                        <h5 class="card-title">${show.name}</h5>
                        <p class="card-text small">${show.first_air_date ? new Date(show.first_air_date).toLocaleDateString('tr-TR') : 'Tarih belirtilmemiş'}</p>
                        <button class="btn w-100" 
                                style="background-color: #0d6efd; color: #f4e243; font-weight: bold;"
                                onmouseover="this.style.backgroundColor='#0b5ed7'" 
                                onmouseout="this.style.backgroundColor='#0d6efd'"
                                onclick="showTVDetails(${show.id})">
                            Detayları Gör
                        </button>
                    </div>
                </div>
            </div>
        `;
        tvShowList.innerHTML += tvCard;
    });
}

// Film detaylarını göster
async function showMovieDetails(movieId) {
    document.getElementById('detailsModal').setAttribute('data-content-id', movieId);
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=tr-TR`);
        const movie = await response.json();
        
        const isLiked = getLikeStatus('movie', movieId);
        const comments = getComments('movie', movieId);
        
        document.getElementById('detailsModalLabel').textContent = movie.title;
        document.getElementById('details-poster').src = `${IMG_BASE_URL}${movie.poster_path}`;
        document.getElementById('details-title').textContent = movie.title;
        document.getElementById('details-overview').textContent = movie.overview;
        document.getElementById('details-rating').textContent = `${movie.vote_average.toFixed(1)}/10`;
        
        // Beğeni butonunu güncelle
        const likeButton = document.getElementById('details-like-button');
        updateLikeButton(likeButton, isLiked);
        
        // Yorumları göster
        displayComments('details-comments-section', comments);
        
        new bootstrap.Modal(document.getElementById('detailsModal')).show();
    } catch (error) {
        console.error('Film detayları yüklenirken hata:', error);
    }
}

// Beğeni ve yorum fonksiyonları
function getLikeStatus(type, id) {
    const key = `${type}_${id}_liked`;
    return localStorage.getItem(key) === 'true';
}

function toggleLike(type, id) {
    const key = `${type}_${id}_liked`;
    const currentStatus = getLikeStatus(type, id);
    const newStatus = !currentStatus;
    localStorage.setItem(key, newStatus.toString());
    return newStatus;
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

function getComments(type, id) {
    const key = `${type}_${id}_comments`;
    return JSON.parse(localStorage.getItem(key) || '[]');
}

function displayComments(containerId, comments) {
    const container = document.getElementById(containerId);
    if (comments.length === 0) {
        container.innerHTML = '<p class="text-muted">Henüz yorum yapılmamış.</p>';
        return;
    }
    
    container.innerHTML = comments.map(comment => `
        <div class="comment mb-3">
            <div class="d-flex justify-content-between">
                <strong class="text-primary">${comment.nickname}</strong>
                <small class="text-muted">${comment.date}</small>
            </div>
            <p class="mb-1">${comment.comment}</p>
            <hr>
        </div>
    `).join('');
}

// Tür filtreleme
function filterMovies() {
    const selectedGenre = document.getElementById('genre-select').value;
    if (selectedGenre === '') {
        displayMovies(allMovies);
    } else {
        const filteredMovies = allMovies.filter(movie => 
            movie.genre_ids.includes(parseInt(selectedGenre))
        );
        displayMovies(filteredMovies);
    }
}

function filterShows() {
    const selectedGenre = document.getElementById('genre-select').value;
    if (selectedGenre === '') {
        displayTVShows(allShows);
    } else {
        const filteredShows = allShows.filter(show => 
            show.genre_ids.includes(parseInt(selectedGenre))
        );
        displayTVShows(filteredShows);
    }
}

// Beğeni işlemi
function toggleDetailsLike() {
    const currentPage = window.location.pathname;
    const contentId = document.getElementById('detailsModal').getAttribute('data-content-id');
    const contentType = currentPage.includes('film') ? 'movie' : 'tv';

    const newStatus = toggleLike(contentType, contentId);
    const likeButton = document.getElementById('details-like-button');
    updateLikeButton(likeButton, newStatus);
}


// Yorum ekleme
function addDetailsComment() {
    const nicknameInput = document.getElementById('details-nickname-input');
    const commentInput = document.getElementById('details-comment-input');
    const nickname = nicknameInput.value.trim();
    const comment = commentInput.value.trim();

    if (!nickname || !comment) {
        alert('Lütfen hem nickname hem de yorum alanını doldurun.');
        return;
    }

    const currentPage = window.location.pathname;
    const contentId = document.getElementById('detailsModal').getAttribute('data-content-id');
    const contentType = currentPage.includes('film') ? 'movie' : 'tv';

    const comments = getComments(contentType, contentId);
    comments.push({
        nickname,
        comment,
        date: new Date().toLocaleDateString('tr-TR'),
    });

    localStorage.setItem(`${contentType}_${contentId}_comments`, JSON.stringify(comments));

    displayComments('details-comments-section', comments);

    nicknameInput.value = '';
    commentInput.value = '';
}
    
    addComment(contentType, contentId, nickname, comment);
    document.getElementById('details-comment-input').value = '';
    displayComments('details-comments-section', getComments(contentType, contentId));
 