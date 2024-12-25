const API_KEY = 'c9d5f0f01b098c021e6964b9fae786dd';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', function() {
    // URL'den parametreleri al
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const genre = urlParams.get('genre');
    const year = urlParams.get('year');

    console.log('Parametreler:', { type, genre, year });

    // Sonuçları göster
    fetchFilteredResults(type, genre, year);
});

async function fetchFilteredResults(type, genre, year) {
    try {
        const endpoint = type === 'movie' ? 'discover/movie' : 'discover/tv';
        let url = `${BASE_URL}/${endpoint}?api_key=${API_KEY}&language=tr-TR&sort_by=popularity.desc`;

        if (genre) {
            url += `&with_genres=${genre}`;
        }
        if (year) {
            if (type === 'movie') {
                url += `&primary_release_year=${year}`;
            } else {
                url += `&first_air_date_year=${year}`;
            }
        }

        console.log('Fetch URL:', url);

        const response = await fetch(url);
        const data = await response.json();
        
        console.log('API Yanıtı:', data);

        if (data.results && data.results.length > 0) {
            if (type === 'movie') {
                displayMovies(data.results);
            } else {
                displayTVShows(data.results);
            }
            updateTitle(type, genre, year);
        } else {
            document.getElementById('results-container').innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-warning">Sonuç bulunamadı.</p>
                </div>
            `;
            updateTitle(type, genre, year);
        }
    } catch (error) {
        console.error('Veri çekerken hata:', error);
        document.getElementById('results-container').innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">Bir hata oluştu: ${error.message}</p>
            </div>
        `;
    }
}

function displayMovies(movies) {
    const container = document.getElementById('results-container');
    container.innerHTML = '';

    movies.forEach(movie => {
        const card = `
            <div class="col-md-3 mb-4">
                <div class="card text-white bg-dark">
                    <img src="${IMG_BASE_URL}${movie.poster_path}" 
                         class="card-img-top" 
                         alt="${movie.title}"
                         onerror="this.src='https://via.placeholder.com/500x750.png?text=Resim+Bulunamadı'">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <p class="card-text small">${movie.release_date ? new Date(movie.release_date).getFullYear() : 'Tarih belirtilmemiş'}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <button class="btn btn-details" 
                                    onclick="showMovieDetails(${movie.id})"
                                    data-bs-toggle="modal" 
                                    data-bs-target="#movieModal">
                                Detaylar
                            </button>
                            <span class="badge bg-warning text-dark">
                                ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

function displayTVShows(shows) {
    const container = document.getElementById('results-container');
    container.innerHTML = '';

    shows.forEach(show => {
        const card = `
            <div class="col-md-3 mb-4">
                <div class="card text-white bg-dark">
                    <img src="${IMG_BASE_URL}${show.poster_path}" 
                         class="card-img-top" 
                         alt="${show.name}"
                         onerror="this.src='https://via.placeholder.com/500x750.png?text=Resim+Bulunamadı'">
                    <div class="card-body">
                        <h5 class="card-title">${show.name}</h5>
                        <p class="card-text small">${show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'Tarih belirtilmemiş'}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <button class="btn btn-details" 
                                    onclick="showTVDetails(${show.id})"
                                    data-bs-toggle="modal" 
                                    data-bs-target="#detailsModal">
                                Detaylar
                            </button>
                            <span class="badge bg-warning text-dark">
                                ${show.vote_average ? show.vote_average.toFixed(1) : 'N/A'}/10
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

function updateTitle(type, genre, year) {
    const titleElement = document.getElementById('results-title');
    let title = type === 'movie' ? 'Filmler' : 'Diziler';
    
    if (genre || year) {
        title += ' - Filtreler: ';
        if (genre) title += `Tür: ${getGenreName(genre)}, `;
        if (year) title += `Yıl: ${year}`;
    }
    
    titleElement.textContent = title;
}

function getGenreName(genreId) {
    const genres = {
        28: 'Aksiyon',
        12: 'Macera',
        16: 'Animasyon',
        35: 'Komedi',
        18: 'Drama',
        27: 'Korku'
        // Diğer türleri ekleyebilirsiniz
    };
    return genres[genreId] || 'Bilinmeyen Tür';
}

// Film detaylarını göster
async function showMovieDetails(id) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=tr-TR`);
        const movie = await response.json();
        
        document.getElementById('movieModalLabel').textContent = movie.title;
        document.getElementById('movie-title').textContent = movie.title;
        document.getElementById('movie-overview').textContent = movie.overview;
        document.getElementById('movie-rating').textContent = `${movie.vote_average.toFixed(1)}/10`;
        document.getElementById('movie-poster').src = `${IMG_BASE_URL}${movie.poster_path}`;
        
        // Beğeni butonunu ayarla
        const likeButton = document.getElementById('like-button');
        
        // Beğeni durumunu kontrol et ve butonu güncelle
        const isLiked = localStorage.getItem(`movie_${id}_liked`) === 'true';
        if (isLiked) {
            likeButton.innerHTML = '<i class="fas fa-heart"></i> Beğenildi';
            likeButton.style.backgroundColor = '#f4e243';
            likeButton.style.color = '#000';
            likeButton.style.borderColor = '#f4e243';
        } else {
            likeButton.innerHTML = '<i class="fas fa-heart"></i> Beğen';
            likeButton.style.backgroundColor = '#212529';
            likeButton.style.color = '#f4e243';
            likeButton.style.borderColor = '#f4e243';
        }
        
        // Beğeni butonuna tıklama olayı ekle
        likeButton.onclick = function() {
            const currentStatus = localStorage.getItem(`movie_${id}_liked`) === 'true';
            const newStatus = !currentStatus;
            localStorage.setItem(`movie_${id}_liked`, newStatus.toString());
            
            if (newStatus) {
                this.innerHTML = '<i class="fas fa-heart"></i> Beğenildi';
                this.style.backgroundColor = '#f4e243';
                this.style.color = '#000';
                this.style.borderColor = '#f4e243';
            } else {
                this.innerHTML = '<i class="fas fa-heart"></i> Beğen';
                this.style.backgroundColor = '#212529';
                this.style.color = '#f4e243';
                this.style.borderColor = '#f4e243';
            }
        };
        
        // Yorumları göster
        const comments = getComments('movie', id);
        displayComments('comments-section', comments);
        
        // Yorum ekleme olayını düzelt
        document.getElementById('add-comment').onclick = function() {
            const nickname = document.getElementById('comment-nickname').value.trim();
            const comment = document.getElementById('comment-input').value.trim();
            
            if (!nickname || !comment) {
                alert('Lütfen hem nickname hem de yorum alanını doldurun.');
                return;
            }
            
            addComment('movie', id, nickname, comment);
            document.getElementById('comment-nickname').value = '';
            document.getElementById('comment-input').value = '';
            displayComments('comments-section', getComments('movie', id));
        };
    } catch (error) {
        console.error('Film detayları yüklenirken hata:', error);
    }
}

// Dizi detaylarını göster
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
        
        // Beğeni durumunu kontrol et ve butonu güncelle
        const isLiked = localStorage.getItem(`tv_${id}_liked`) === 'true';
        if (isLiked) {
            likeButton.innerHTML = '<i class="fas fa-heart"></i> Beğenildi';
            likeButton.style.backgroundColor = '#f4e243';
            likeButton.style.color = '#000';
            likeButton.style.borderColor = '#f4e243';
        } else {
            likeButton.innerHTML = '<i class="fas fa-heart"></i> Beğen';
            likeButton.style.backgroundColor = '#212529';
            likeButton.style.color = '#f4e243';
            likeButton.style.borderColor = '#f4e243';
        }
        
        // Beğeni butonuna tıklama olayı ekle
        likeButton.onclick = function() {
            const currentStatus = localStorage.getItem(`tv_${id}_liked`) === 'true';
            const newStatus = !currentStatus;
            localStorage.setItem(`tv_${id}_liked`, newStatus.toString());
            
            if (newStatus) {
                this.innerHTML = '<i class="fas fa-heart"></i> Beğenildi';
                this.style.backgroundColor = '#f4e243';
                this.style.color = '#000';
                this.style.borderColor = '#f4e243';
            } else {
                this.innerHTML = '<i class="fas fa-heart"></i> Beğen';
                this.style.backgroundColor = '#212529';
                this.style.color = '#f4e243';
                this.style.borderColor = '#f4e243';
            }
        };
        
        // Yorumları göster
        const comments = getComments('tv', id);
        displayComments('details-comments-section', comments);
        
        // Yorum ekleme olayını düzelt
        document.querySelector('.btn-outline-warning[onclick="addDetailsComment()"]').onclick = function() {
            const nickname = document.getElementById('details-nickname-input').value.trim();
            const comment = document.getElementById('details-comment-input').value.trim();
            
            if (!nickname || !comment) {
                alert('Lütfen hem nickname hem de yorum alanını doldurun.');
                return;
            }
            
            addComment('tv', id, nickname, comment);
            document.getElementById('details-nickname-input').value = '';
            document.getElementById('details-comment-input').value = '';
            displayComments('details-comments-section', getComments('tv', id));
        };
    } catch (error) {
        console.error('Dizi detayları yüklenirken hata:', error);
    }
}

// Yorumları göster
function displayComments(containerId, comments) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    if (comments.length === 0) {
        container.innerHTML = '<p class="text-muted">Henüz yorum yapılmamış.</p>';
        return;
    }

    comments.forEach(comment => {
        container.innerHTML += `
            <div class="comment mb-3">
                <strong class="text-warning">${comment.nickname}</strong>
                <p class="mb-1">${comment.comment}</p>
                <small class="text-muted">${new Date(comment.timestamp).toLocaleString()}</small>
                    </div>
                `;
    });
}

// Yorum ekle
function addComment(type, id, nickname, comment) {
    const key = `${type}_${id}_comments`;
    const comments = JSON.parse(localStorage.getItem(key) || '[]');
    
    comments.push({
        nickname,
        comment,
        timestamp: new Date().toISOString()
    });
    
    localStorage.setItem(key, JSON.stringify(comments));
}

// Yorumları getir
function getComments(type, id) {
    const key = `${type}_${id}_comments`;
    return JSON.parse(localStorage.getItem(key) || '[]');
}

