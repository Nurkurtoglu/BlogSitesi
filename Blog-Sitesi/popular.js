const API_KEY = 'c9d5f0f01b098c021e6964b9fae786dd';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let allMovies = [];
let allShows = [];

// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('populer-filmler.html')) {
        fetchTopRatedMovies();
    } else if (currentPage.includes('populer-diziler.html')) {
        fetchTopRatedTVShows();
    }
});

// En çok oy alan filmler
async function fetchTopRatedMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=tr-TR&page=1`);
        const data = await response.json();
        allMovies = data.results;
        displayMovies(data.results);
    } catch (error) {
        console.error('Filmler yüklenirken hata:', error);
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

// Film detaylarını göster
async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=tr-TR`);
        const movie = await response.json();
        
        const isLiked = getLikeStatus('movie', movieId);
        const comments = getComments('movie', movieId);
        
        document.getElementById('movieModalLabel').textContent = movie.title;
        document.getElementById('movie-poster').src = `${IMG_BASE_URL}${movie.poster_path}`;
        document.getElementById('movie-title').textContent = movie.title;
        document.getElementById('movie-overview').textContent = movie.overview;
        document.getElementById('movie-rating').textContent = `${movie.vote_average.toFixed(1)}/10`;
        
        // Beğeni butonunu güncelle
        const likeButton = document.getElementById('like-button');
        likeButton.className = `btn ${isLiked ? 'btn-success' : 'btn-primary'} me-2`;
        likeButton.innerHTML = `<i class="fas fa-thumbs-up"></i> ${isLiked ? 'Beğenildi' : 'Beğen'}`;
        
        // Beğeni butonuna tıklama olayı ekle
        likeButton.onclick = () => {
            const newIsLiked = toggleLike('movie', movieId);
            updateLikeButton(likeButton, newIsLiked);
            displayMovies(allMovies);
        };
        
        // Yorumları göster
        displayComments('comments-section', comments);
        
        // Yorum gönderme olayını ekle
        document.getElementById('add-comment').onclick = () => {
            const nickname = document.getElementById('comment-nickname').value.trim();
            const comment = document.getElementById('comment-input').value.trim();
            
            if (!nickname) {
                alert('Lütfen bir nickname girin!');
                return;
            }
            if (!comment) {
                alert('Lütfen bir yorum yazın!');
                return;
            }
            
            addComment('movie', movieId, nickname, comment);
            document.getElementById('comment-input').value = '';
            displayComments('comments-section', getComments('movie', movieId));
        };
        
        new bootstrap.Modal(document.getElementById('movieModal')).show();
    } catch (error) {
        console.error('Film detayları yüklenirken hata:', error);
    }
}

// Beğeni işlemini handle et
function handleLike(movieId) {
    const newIsLiked = toggleLike('movie', movieId);
    displayMovies(allMovies);
}

// Beğeni durumunu kontrol et
function getLikeStatus(type, id) {
    const key = `${type}_${id}_liked`;
    return localStorage.getItem(key) === 'true';
}

// Beğeni durumunu değiştir
function toggleLike(type, id) {
    const key = `${type}_${id}_liked`;
    const currentStatus = getLikeStatus(type, id);
    const newStatus = !currentStatus;
    localStorage.setItem(key, newStatus.toString());
    return newStatus;
}

// Beğeni butonunu güncelle
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

// Tür filtreleme
function filterByGenre() {
    const selectedGenre = document.getElementById('genreSelect').value;
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('populer-filmler.html')) {
        if (selectedGenre === '') {
            displayMovies(allMovies);
        } else {
            const filteredMovies = allMovies.filter(movie => 
                movie.genre_ids.includes(parseInt(selectedGenre))
            );
            displayMovies(filteredMovies);
        }
    } else if (currentPage.includes('populer-diziler.html')) {
        if (selectedGenre === '') {
            displayTVShows(allShows);
        } else {
            const filteredShows = allShows.filter(show => 
                show.genre_ids.includes(parseInt(selectedGenre))
            );
            displayTVShows(filteredShows);
        }
    }
}

// Yorumları localStorage'dan al
function getComments(type, id) {
    const key = `${type}_${id}_comments`;
    return JSON.parse(localStorage.getItem(key) || '[]');
}

// Yorum ekle
function addComment(type, id, nickname, comment) {
    const key = `${type}_${id}_comments`;
    const comments = getComments(type, id);
    const newComment = {
        nickname,
        comment,
        date: new Date().toLocaleString('tr-TR')
    };
    comments.push(newComment);
    localStorage.setItem(key, JSON.stringify(comments));
}

// Yorumları görüntüle
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

// En çok oy alan diziler
async function fetchTopRatedTVShows() {
    try {
        const response = await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=tr-TR&page=1`);
        const data = await response.json();
        allShows = data.results;
        displayTVShows(data.results);
    } catch (error) {
        console.error('Diziler yüklenirken hata:', error);
    }
}

// Dizileri görüntüle
function displayTVShows(shows) {
    const tvShowList = document.getElementById('tv-show-list');
    tvShowList.innerHTML = '';

    shows.forEach(show => {
        const tvCard = `
            <div class="col-md-3 mb-4">
                <div class="card text-white bg-dark">
                    <img src="${IMG_BASE_URL}${show.poster_path}" class="card-img-top" alt="${show.name}">
                    <div class="card-body">
                        <h5 class="card-title">${show.name}</h5>
                        <button class="btn w-100" 
                                style="background-color: #0d6efd; color: #f4e243; font-weight: bold;"
                                onmouseover="this.style.backgroundColor='#0b5ed7'" 
                                onmouseout="this.style.backgroundColor='#0d6efd'"
                                onclick="showTVDetails(${show.id})"
                                data-bs-toggle="modal" 
                                data-bs-target="#detailsModal">
                            Detayları Gör
                        </button>
                    </div>
                </div>
            </div>
        `;
        tvShowList.innerHTML += tvCard;
    });
}

// Dizi kartı oluşturma fonksiyonunda
function createTVShowCard(show) {
    const col = document.createElement('div');
    col.className = 'col-md-3 mb-4';
    
    col.innerHTML = `
        <div class="card bg-dark text-white">
            <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="card-img-top" alt="${show.name}">
            <div class="card-body">
                <h5 class="card-title">${show.name}</h5>
                <p class="card-text">Puan: ${show.vote_average}</p>
                <button class="btn btn-warning" onclick="showTVDetails(${show.id})" data-bs-toggle="modal" data-bs-target="#detailsModal">
                    Detaylar
                </button>
            </div>
        </div>
    `;
    
    return col;
}

// Dizi detaylarını gösteren fonksiyon
async function showTVDetails(id) {
    try {
        const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=tr-TR`);
        const show = await response.json();
        
        document.getElementById('detailsModalLabel').textContent = show.name;
        document.getElementById('details-title').textContent = show.name;
        document.getElementById('details-overview').textContent = show.overview;
        document.getElementById('details-rating').textContent = `${show.vote_average.toFixed(1)}/10`;
        document.getElementById('details-poster').src = `${IMG_BASE_URL}${show.poster_path}`;
        
        // Beğeni butonunu ayarla
        const likeButton = document.getElementById('details-like-button');
        likeButton.style.backgroundColor = '#474c52'; // Koyu gri arka plan
        likeButton.style.color = '#f4e243'; // Sarı yazı
        likeButton.style.borderColor = '#f4e243'; // Sarı kenarlık
        
        // Hover efektleri
        likeButton.onmouseover = function() {
            this.style.backgroundColor = '#3a3e43'; // Hover durumunda biraz daha koyu
        }
        likeButton.onmouseout = function() {
            this.style.backgroundColor = '#474c52';
        }
        
        likeButton.onclick = () => handleLike('tv', id);
        
        // Yorumları göster
        const comments = getComments('tv', id);
        displayComments('details-comments-section', comments);
        
        // Yorum gönderme olayını ekle
        document.getElementById('add-comment').onclick = () => {
            const nickname = document.getElementById('details-nickname-input').value.trim();
            const comment = document.getElementById('details-comment-input').value.trim();
            
            if (!nickname) {
                alert('Lütfen bir nickname girin!');
                return;
            }
            if (!comment) {
                alert('Lütfen bir yorum yazın!');
                return;
            }
            
            addComment('tv', id, nickname, comment);
            document.getElementById('details-comment-input').value = '';
            displayComments('details-comments-section', getComments('tv', id));
        };
        
        // Modal'ı göster
        const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
        modal.show();
    } catch (error) {
        console.error('Dizi detayları yüklenirken hata:', error);
    }
}

// Beğeni olayını işle
function handleLike(type, id) {
    const isLiked = toggleLike(type, id);
    const likeButton = document.getElementById('details-like-button');
    const likeCount = document.getElementById('details-like-count');
    
    updateLikeButton(likeButton, isLiked);
    
    // Beğeni sayısını güncelle
    const likes = getLikeCount(type, id);
    likeCount.textContent = `${likes} beğeni`;
    likeCount.style.color = '#f4e243'; // Sarı renk
}
