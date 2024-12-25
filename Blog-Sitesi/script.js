const API_KEY = 'c9d5f0f01b098c021e6964b9fae786dd';
const BASE_URL = 'https://api.themoviedb.org/3';

// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Sayfa yüklendi, veriler getiriliyor...');
    try {
        await Promise.all([
            getTrendingMovies(),
            getTrendingTVShows(),
            getUpcomingMovies(),
            getAiringTodayTVShows()
        ]);
        console.log('Tüm veriler başarıyla yüklendi');
    } catch (error) {
        console.error('Veri yükleme hatası:', error);
    }
});

// Trend Filmler
async function getTrendingMovies() {
    try {
        console.log('Trend filmler getiriliyor...');
        const response = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=tr-TR`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Trend filmler alındı:', data.results.length);
        displayMovies(data.results, 'movie-list');
    } catch (error) {
        console.error('Trend filmler yüklenirken hata:', error);
        displayError('movie-list', 'Filmler yüklenirken bir hata oluştu.');
    }
}

// Trend Diziler
async function getTrendingTVShows() {
    try {
        console.log('Trend diziler getiriliyor...');
        const response = await fetch(`${BASE_URL}/trending/tv/day?api_key=${API_KEY}&language=tr-TR`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Trend diziler alındı:', data.results.length);
        displayTVShows(data.results, 'tv-show-list');
    } catch (error) {
        console.error('Trend diziler yüklenirken hata:', error);
        displayError('tv-show-list', 'Diziler yüklenirken bir hata oluştu.');
    }
}

// Yakında Çıkacak Filmler
async function getUpcomingMovies() {
    try {
        console.log('Yakında çıkacak filmler getiriliyor...');
        const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=tr-TR&region=TR`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Yakında çıkacak filmler alındı:', data.results.length);
        displayMovies(data.results, 'upcoming-movie-list');
    } catch (error) {
        console.error('Yakında çıkacak filmler yüklenirken hata:', error);
        displayError('upcoming-movie-list', 'Filmler yüklenirken bir hata oluştu.');
    }
}

// Bugün Yayınlanacak Diziler
async function getAiringTodayTVShows() {
    try {
        console.log('Bugün yayınlanacak diziler getiriliyor...');
        const response = await fetch(`${BASE_URL}/tv/airing_today?api_key=${API_KEY}&language=tr-TR`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Bugün yayınlanacak diziler alındı:', data.results.length);
        displayTVShows(data.results, 'upcoming-tv-list');
    } catch (error) {
        console.error('Bugün yayınlanacak diziler yüklenirken hata:', error);
        displayError('upcoming-tv-list', 'Diziler yüklenirken bir hata oluştu.');
    }
}

// Hata Mesajı Gösterme
function displayError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    ${message}
                </div>
            </div>
        `;
    }
}

// Filmleri Görüntüleme
function displayMovies(movies, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`${containerId} ID'li container bulunamadı`);
        return;
    }

    if (!movies || movies.length === 0) {
        container.innerHTML = '<p class="text-white">Gösterilecek film bulunamadı.</p>';
        return;
    }

    // Scroll container ve content div'lerini oluştur
    container.innerHTML = `
        <div class="scroll-container">
            <div class="scroll-content">
                ${movies.map(movie => `
                    <div class="card bg-dark text-white">
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
                             class="card-img-top" 
                             alt="${movie.title}"
                             onerror="this.src='https://via.placeholder.com/500x750.png?text=Resim+Bulunamadı'">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                            <p class="card-text">${movie.overview ? movie.overview.slice(0, 100) + '...' : 'Açıklama bulunmuyor'}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <button class="btn btn-primary" 
                                        onclick="showMovieDetails(${movie.id})">
                                    Detaylar
                                </button>
                                <span class="badge bg-warning text-dark">
                                    ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10
                                </span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Dizileri Görüntüleme
function displayTVShows(shows, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`${containerId} ID'li container bulunamadı`);
        return;
    }

    if (!shows || shows.length === 0) {
        container.innerHTML = '<p class="text-white">Gösterilecek dizi bulunamadı.</p>';
        return;
    }

    // Scroll container ve content div'lerini oluştur
    container.innerHTML = `
        <div class="scroll-container">
            <div class="scroll-content">
                ${shows.map(show => `
                    <div class="card bg-dark text-white">
                        <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" 
                             class="card-img-top" 
                             alt="${show.name}"
                             onerror="this.src='https://via.placeholder.com/500x750.png?text=Resim+Bulunamadı'">
                        <div class="card-body">
                            <h5 class="card-title">${show.name}</h5>
                            <p class="card-text">${show.overview ? show.overview.slice(0, 100) + '...' : 'Açıklama bulunmuyor'}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <button class="btn btn-primary" 
                                        onclick="showTVDetails(${show.id})">
                                    Detaylar
                                </button>
                                <span class="badge bg-warning text-dark">
                                    ${show.vote_average ? show.vote_average.toFixed(1) : 'N/A'}/10
                                </span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Film Detayları Modalı
async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=tr-TR`);
        const movie = await response.json();
        
        // Mevcut yorumları ve beğeni durumunu al
        const comments = getComments('movie', movieId);
        const isLiked = getLikeStatus('movie', movieId);
        
        document.getElementById('movieModalLabel').textContent = movie.title;
        document.getElementById('movie-poster').src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        document.getElementById('movie-title').textContent = movie.title;
        document.getElementById('movie-overview').textContent = movie.overview || 'Açıklama bulunmuyor';
        document.getElementById('movie-rating').textContent = `${movie.vote_average.toFixed(1)}/10`;
        
        // Beğeni butonunu güncelle
        const likeButton = document.getElementById('like-button');
        updateLikeButton(likeButton, isLiked);
        
        // Beğeni butonuna tıklama olayı ekle
        likeButton.onclick = () => {
            toggleLike('movie', movieId);
            updateLikeButton(likeButton, getLikeStatus('movie', movieId));
        };
        
        // Yorumları göster ve yorum ekleme fonksiyonları...
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

// Dizi Detayları Modalı
async function showTVDetails(tvId) {
    try {
        const response = await fetch(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&language=tr-TR`);
        const show = await response.json();
        
        // Mevcut yorumları ve beğeni durumunu al
        const comments = getComments('tv', tvId);
        const isLiked = getLikeStatus('tv', tvId);
        
        document.getElementById('tvModalLabel').textContent = show.name;
        document.getElementById('tv-poster').src = `https://image.tmdb.org/t/p/w500${show.poster_path}`;
        document.getElementById('tv-title').textContent = show.name;
        document.getElementById('tv-overview').textContent = show.overview || 'Açıklama bulunmuyor';
        document.getElementById('tv-rating').textContent = `${show.vote_average.toFixed(1)}/10`;
        
        // Beğeni butonunu güncelle
        const likeButton = document.getElementById('tv-like-button');
        updateLikeButton(likeButton, isLiked);
        
        // Beğeni butonuna tıklama olayı ekle
        likeButton.onclick = () => {
            toggleLike('tv', tvId);
            updateLikeButton(likeButton, getLikeStatus('tv', tvId));
        };
        
        // Yorumları göster ve yorum ekleme fonksiyonları...
        displayComments('tv-comments-section', comments);
        
        // Yorum gönderme olayını ekle
        document.getElementById('tv-add-comment').onclick = () => {
            const nickname = document.getElementById('tv-comment-nickname').value.trim();
            const comment = document.getElementById('tv-comment-input').value.trim();
            
            if (!nickname) {
                alert('Lütfen bir nickname girin!');
                return;
            }
            if (!comment) {
                alert('Lütfen bir yorum yazın!');
                return;
            }
            
            addComment('tv', tvId, nickname, comment);
            document.getElementById('tv-comment-input').value = '';
            displayComments('tv-comments-section', getComments('tv', tvId));
        };
        
        new bootstrap.Modal(document.getElementById('tvModal')).show();
    } catch (error) {
        console.error('Dizi detayları yüklenirken hata:', error);
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

// Beğeni durumunu kontrol et
function getLikeStatus(type, id) {
    const key = `${type}_${id}_liked`;
    return localStorage.getItem(key) === 'true';
}

// Beğeni durumunu değiştir
function toggleLike(type, id) {
    const key = `${type}_${id}_liked`;
    const currentStatus = getLikeStatus(type, id);
    localStorage.setItem(key, (!currentStatus).toString());
}

// Beğeni butonunu güncelle
function updateLikeButton(button, isLiked) {
    if (isLiked) {
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');
        button.innerHTML = '<i class="fas fa-thumbs-up"></i> Beğenildi';
    } else {
        button.classList.remove('btn-success');
        button.classList.add('btn-primary');
        button.innerHTML = '<i class="fas fa-thumbs-up"></i> Beğen';
    }
}


