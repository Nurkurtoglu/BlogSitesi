// const API_KEY = 'c9d5f0f01b098c021e6964b9fae786dd';
// const BASE_URL = 'https://api.themoviedb.org/3';
// const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// // URL'den arama sorgusunu al
// const urlParams = new URLSearchParams(window.location.search);
// const searchQuery = urlParams.get('query');

// if (searchQuery) {
//     searchMovies(searchQuery);
// }

// async function searchMovies(query) {
//     try {
//         const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=tr-TR&query=${query}`);
//         const data = await response.json();
//         displayResults(data.results);
//     } catch (error) {
//         console.error('Arama hatası:', error);
//     }
// }

// function displayResults(movies) {
//     const container = document.getElementById('searchResults');
//     container.innerHTML = '';

//     const row = document.createElement('div');
//     row.className = 'row';

//     movies.forEach(movie => {
//         const movieDiv = document.createElement('div');
//         movieDiv.className = 'movie-item';
//         movieDiv.innerHTML = `
//             <div class="movie-card">
//                 <div class="movie-poster-container">
//                     <img src="${movie.poster_path ? IMG_BASE_URL + movie.poster_path : 'https://via.placeholder.com/500x750.png?text=Resim+Bulunamadı'}" 
//                          alt="${movie.title}" 
//                          class="movie-poster">
//                     <div class="movie-overlay">
//                         <button class="btn-details" 
//                                 onclick="showMovieDetails(${movie.id})" 
//                                 data-bs-toggle="modal" 
//                                 data-bs-target="#movieModal">
//                             <i class="fas fa-info-circle"></i> Detaylar
//                         </button>
//                     </div>
//                 </div>
//                 <div class="movie-info">
//                     <div>
//                         <h3 class="movie-title">${movie.title}</h3>
//                         <p class="movie-overview">${movie.overview || 'Açıklama bulunmuyor.'}</p>
//                     </div>
//                     <div class="movie-meta">
//                         <span class="movie-date">
//                             <i class="far fa-calendar-alt"></i>
//                             ${movie.release_date ? new Date(movie.release_date).getFullYear() : 'Tarih belirtilmemiş'}
//                         </span>
//                         <span class="rating-badge">
//                             <i class="fas fa-star"></i>
//                             ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
//                         </span>
//                     </div>
//                 </div>
//             </div>
//         `;
//         row.appendChild(movieDiv);
//     });

//     container.appendChild(row);
// }

// async function showMovieDetails(id) {
//     try {
//         const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=tr-TR`);
//         const movie = await response.json();
        
//         document.getElementById('movieModalLabel').textContent = movie.title;
//         document.getElementById('movie-title').textContent = movie.title;
//         document.getElementById('movie-overview').textContent = movie.overview;
//         document.getElementById('movie-rating').textContent = `${movie.vote_average.toFixed(1)}/10`;
//         document.getElementById('movie-poster').src = `${IMG_BASE_URL}${movie.poster_path}`;
        
//         // Beğeni butonunu ayarla
//         const likeButton = document.getElementById('like-button');
        
//         // Beğeni durumunu kontrol et ve butonu güncelle
//         const isLiked = localStorage.getItem(`movie_${id}_liked`) === 'true';
//         if (isLiked) {
//             likeButton.innerHTML = '<i class="fas fa-heart"></i> Beğenildi';
//             likeButton.style.backgroundColor = '#f4e243';
//             likeButton.style.color = '#000';
//             likeButton.style.borderColor = '#f4e243';
//         } else {
//             likeButton.innerHTML = '<i class="fas fa-heart"></i> Beğen';
//             likeButton.style.backgroundColor = '#212529';
//             likeButton.style.color = '#f4e243';
//             likeButton.style.borderColor = '#f4e243';
//         }
        
//         // Beğeni butonuna tıklama olayı ekle
//         likeButton.onclick = function() {
//             const currentStatus = localStorage.getItem(`movie_${id}_liked`) === 'true';
//             const newStatus = !currentStatus;
//             localStorage.setItem(`movie_${id}_liked`, newStatus.toString());
            
//             if (newStatus) {
//                 this.innerHTML = '<i class="fas fa-heart"></i> Beğenildi';
//                 this.style.backgroundColor = '#f4e243';
//                 this.style.color = '#000';
//                 this.style.borderColor = '#f4e243';
//             } else {
//                 this.innerHTML = '<i class="fas fa-heart"></i> Beğen';
//                 this.style.backgroundColor = '#212529';
//                 this.style.color = '#f4e243';
//                 this.style.borderColor = '#f4e243';
//             }
//         };
        
//         // Yorumları göster
//         const comments = getComments('movie', id);
//         displayComments('comments-section', comments);
        
//         // Yorum ekleme olayını düzelt
//         document.getElementById('add-comment').onclick = function() {
//             const nickname = document.getElementById('comment-nickname').value.trim();
//             const comment = document.getElementById('comment-input').value.trim();
            
//             if (!nickname || !comment) {
//                 alert('Lütfen hem nickname hem de yorum alanını doldurun.');
//                 return;
//             }
            
//             addComment('movie', id, nickname, comment);
//             document.getElementById('comment-nickname').value = '';
//             document.getElementById('comment-input').value = '';
//             displayComments('comments-section', getComments('movie', id));
//         };
//     } catch (error) {
//         console.error('Film detayları yüklenirken hata:', error);
//     }
// }

// // Yorumları göster
// function displayComments(containerId, comments) {
//     const container = document.getElementById(containerId);
//     container.innerHTML = '';
    
//     if (comments.length === 0) {
//         container.innerHTML = '<p class="text-muted">Henüz yorum yapılmamış.</p>';
//         return;
//     }
    
//     comments.forEach(comment => {
//         container.innerHTML += `
//             <div class="comment mb-3">
//                 <strong class="text-warning">${comment.nickname}</strong>
//                 <p class="mb-1">${comment.comment}</p>
//                 <small class="text-muted">${new Date(comment.timestamp).toLocaleString()}</small>
//             </div>
//         `;
//     });
// }

// // Yorum ekle
// function addComment(type, id, nickname, comment) {
//     const key = `${type}_${id}_comments`;
//     const comments = JSON.parse(localStorage.getItem(key) || '[]');
    
//     comments.push({
//         nickname,
//         comment,
//         timestamp: new Date().toISOString()
//     });
    
//     localStorage.setItem(key, JSON.stringify(comments));
// }

// // Yorumları getir
// function getComments(type, id) {
//     const key = `${type}_${id}_comments`;
//     return JSON.parse(localStorage.getItem(key) || '[]');
// }

// // Alt arama butonu için arama fonksiyonu
// function handleSearch(event) {
//     event.preventDefault();
//     const searchQuery = document.getElementById('bottom-search-input').value;
//     if (searchQuery.trim()) {
//         searchMovies(searchQuery);
//         // Sayfayı arama sonuçlarına kaydır
//         document.querySelector('.search-results').scrollIntoView({ behavior: 'smooth' });
//     }
// }

const API_KEY = 'c9d5f0f01b098c021e6964b9fae786dd';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// URL'den arama sorgusunu al
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('query');

if (searchQuery) {
    searchMovies(searchQuery);
}

async function searchMovies(query) {
    try {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=tr-TR&query=${query}`);
        const data = await response.json();
        displayResults(data.results);
        await saveResultsToDatabase(data.results);
    } catch (error) {
        console.error('Arama hatası:', error);
    }
}

function displayResults(movies) {
    const container = document.getElementById('searchResults');
    container.innerHTML = '';

    const row = document.createElement('div');
    row.className = 'row';

    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.className = 'movie-item';
        movieDiv.innerHTML = `
            <div class="movie-card">
                <div class="movie-poster-container">
                    <img src="${movie.poster_path ? IMG_BASE_URL + movie.poster_path : 'https://via.placeholder.com/500x750.png?text=Resim+Bulunamadı'}" 
                         alt="${movie.title}" 
                         class="movie-poster">
                    <div class="movie-overlay">
                        <button class="btn-details" 
                                onclick="showMovieDetails(${movie.id})" 
                                data-bs-toggle="modal" 
                                data-bs-target="#movieModal">
                            <i class="fas fa-info-circle"></i> Detaylar
                        </button>
                    </div>
                </div>
                <div class="movie-info">
                    <div>
                        <h3 class="movie-title">${movie.title}</h3>
                        <p class="movie-overview">${movie.overview || 'Açıklama bulunmuyor.'}</p>
                    </div>
                    <div class="movie-meta">
                        <span class="movie-date">
                            <i class="far fa-calendar-alt"></i>
                            ${movie.release_date ? new Date(movie.release_date).getFullYear() : 'Tarih belirtilmemiş'}
                        </span>
                        <span class="rating-badge">
                            <i class="fas fa-star"></i>
                            ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        `;
        row.appendChild(movieDiv);
    });

    container.appendChild(row);
}

async function showMovieDetails(id) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=tr-TR`);
        const movie = await response.json();
        
        document.getElementById('movieModalLabel').textContent = movie.title;
        document.getElementById('movie-title').textContent = movie.title;
        document.getElementById('movie-overview').textContent = movie.overview;
        document.getElementById('movie-rating').textContent = `${movie.vote_average.toFixed(1)}/10`;
        document.getElementById('movie-poster').src = `${IMG_BASE_URL}${movie.poster_path}`;
        
        // Beğeni butonu ayarla
        const likeButton = document.getElementById('like-button');
        
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
        
        const comments = getComments('movie', id);
        displayComments('comments-section', comments);
        
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

async function saveResultsToDatabase(movies) {
    for (const movie of movies) {
        const movieData = {
            tmdb_id: movie.id,
            title: movie.title,
            release_date: movie.release_date,
            imdb_rating: movie.vote_average,
            overview: movie.overview
        };

        try {
            const response = await fetch('http://localhost:3000/add-movie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movieData),
            });

            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.error('Veritabanı kaydı sırasında hata oluştu:', error);
        }
    }
}

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

function getComments(type, id) {
    const key = `${type}_${id}_comments`;
    return JSON.parse(localStorage.getItem(key) || '[]');
}

function handleSearch(event) {
    event.preventDefault();
    const searchQuery = document.getElementById('bottom-search-input').value;
    if (searchQuery.trim()) {
        searchMovies(searchQuery);
        document.querySelector('.search-results').scrollIntoView({ behavior: 'smooth' });
    }
}





