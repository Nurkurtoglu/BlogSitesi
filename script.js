// const API_KEY = "c9d5f0f01b098c021e6964b9fae786dd";

// function fetchWeeklyMovies() {
//   const movieUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=tr-TR&page=1`;
  
//   fetch(movieUrl)
//     .then((response) => response.json())
//     .then((data) => {
//       const weeklyContent = document.getElementById("weekly-content");
//       if (!data.results || data.results.length === 0) {
//         weeklyContent.innerHTML = "<p>Bu hafta için popüler film bulunamadı.</p>";
//         return;
//       }
//       data.results.slice(0, 5).forEach((movie) => {
//         if (!movie.poster_path || !movie.title) return; // Eksik verileri atlar
//         const movieCard = `
//           <div class="highlight-card">
//             <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}" class="highlight-image">
//             <h3>${movie.title}</h3>
//             <p>⭐ ${movie.vote_average || "N/A"} | ${movie.release_date || "Tarih belirtilmemiş"}</p>
//             <p>${movie.overview ? movie.overview.substring(0, 100) : "Açıklama yok"}...</p>
//           </div>
//         `;
//         weeklyContent.innerHTML += movieCard;
//       });
//     })
//     .catch((error) => console.error("Film verisi getirilemedi:", error));
// }

// function fetchWeeklyTVShows() {
//   const tvUrl = `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}&language=tr-TR&page=1`;
  
//   fetch(tvUrl)
//     .then((response) => response.json())
//     .then((data) => {
//       const weeklyContent = document.getElementById("weekly-content");
//       if (!data.results || data.results.length === 0) {
//         weeklyContent.innerHTML = "<p>Bu hafta için popüler dizi bulunamadı.</p>";
//         return;
//       }
//       data.results.slice(0, 5).forEach((tvShow) => {
//         if (!tvShow.poster_path || !tvShow.name) return; // Eksik verileri atlar
//         const tvCard = `
//           <div class="highlight-card">
//             <img src="https://image.tmdb.org/t/p/w200${tvShow.poster_path}" alt="${tvShow.name}" class="highlight-image">
//             <h3>${tvShow.name}</h3>
//             <p>⭐ ${tvShow.vote_average || "N/A"} | ${tvShow.first_air_date || "Tarih belirtilmemiş"}</p>
//             <p>${tvShow.overview ? tvShow.overview.substring(0, 100) : "Açıklama yok"}...</p>
//           </div>
//         `;
//         weeklyContent.innerHTML += tvCard;
//       });
//     })
//     .catch((error) => console.error("Dizi verisi getirilemedi:", error));
// }

// document.addEventListener("DOMContentLoaded", () => {
//   fetchWeeklyMovies();
//   fetchWeeklyTVShows();
// });

// // Modal içerik doldurma fonksiyonu
// function showMovieDetails(movieId) {
//   fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=tr`)
//       .then(response => response.json())
//       .then(data => {
//           const modalContent = `
//               <h3>${data.title} (${data.release_date.split('-')[0]})</h3>
//               <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title}" class="img-fluid">
//               <p><strong>Özet:</strong> ${data.overview}</p>
//               <p><strong>Türler:</strong> ${data.genres.map(genre => genre.name).join(', ')}</p>
//               <p><strong>Ortalama Puan:</strong> ${data.vote_average}/10</p>
//               <div>
//                   <label for="userComment">Yorumunuzu Ekleyin:</label>
//                   <textarea id="userComment" class="form-control" rows="3"></textarea>
//                   <button class="btn btn-primary mt-2">Gönder</button>
//               </div>
//           `;
//           document.getElementById('modalContent').innerHTML = modalContent;
//           const movieModal = new bootstrap.Modal(document.getElementById('movieModal'));
//           movieModal.show();
//       })
//       .catch(error => console.error('Detaylar yüklenemedi:', error));
// }

// // Örnek film sonuçlarını listeleme
// function displaySearchResults(results) {
//   const searchResults = document.getElementById('searchResults');
//   searchResults.innerHTML = '';
//   results.forEach(movie => {
//       const movieElement = document.createElement('div');
//       movieElement.className = 'movie-item';
//       movieElement.innerHTML = `
//           <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}" class="img-fluid">
//           <h5>${movie.title}</h5>
//       `;
//       movieElement.addEventListener('click', () => showMovieDetails(movie.id));
//       searchResults.appendChild(movieElement);
//   });
// }

const API_KEY = 'c9d5f0f01b098c021e6964b9fae786dd'; // TMDB API anahtarınızı buraya ekleyin
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Filmleri (fetchTrendingMovies)çek ve listele
async function fetchMovies() {
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=tr-TR`);
    const data = await response.json();
    displayMovies(data.results);
}

// Filmleri listele
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
                        <button class="btn btn-primary" onclick="showMovieDetails(${movie.id})">Detayları Gör</button>
                    </div>
                </div>
            </div>
        `;
        movieList.innerHTML += movieCard;
    });
}

// Film detaylarını modalda göster
async function showMovieDetails(movieId) {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=tr-TR`);
    const movie = await response.json();

    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-overview').textContent = movie.overview;
    document.getElementById('movie-rating').textContent = movie.vote_average;
    document.getElementById('movie-poster').src = `${IMG_BASE_URL}${movie.poster_path}`;

    // Modal aç
    const movieModal = new bootstrap.Modal(document.getElementById('movieModal'));
    movieModal.show();
}

// Yorum ekle
document.getElementById('add-comment').addEventListener('click', () => {
    const commentInput = document.getElementById('comment-input');
    const comment = commentInput.value.trim();

    if (comment) {
        const commentsSection = document.getElementById('comments-section');
        commentsSection.innerHTML += `<p>${comment}</p>`;
        commentInput.value = '';
    }
});

// // Sayfa yüklendiğinde filmleri çek
// fetchMovies();


// Diziler kısmı

// Haftanın en popüler dizilerini çek
async function fetchTrendingTVShows() {
    try {
        const response = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=tr-TR`);
        if (!response.ok) throw new Error("Diziler alınamadı");
        const data = await response.json();
        displayTVShows(data.results);
    } catch (error) {
        console.error("Diziler yüklenirken hata oluştu:", error);
    }
}

// Dizileri listele
function displayTVShows(tvShows) {
    const tvShowList = document.getElementById('tv-show-list');
    tvShowList.innerHTML = '';

    tvShows.forEach(show => {
        const tvCard = `
            <div class="col-md-3 mb-4">
                <div class="card text-white bg-dark">
                    <img src="${IMG_BASE_URL}${show.poster_path}" class="card-img-top" alt="${show.name}">
                    <div class="card-body">
                        <h5 class="card-title">${show.name}</h5>
                        <button class="btn btn-primary" onclick="showTVDetails(${show.id})">Detayları Gör</button>
                    </div>
                </div>
            </div>
        `;
        tvShowList.innerHTML += tvCard;
    });
}

// Dizi detaylarını göster
async function showTVDetails(tvId) {
    try {
        const response = await fetch(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&language=tr-TR`);
        if (!response.ok) throw new Error("Dizi detayları alınamadı");
        const tvData = await response.json();

        // Modal verilerini doldur
        document.getElementById('tvModalLabel').innerText = tvData.name;
        document.getElementById('tv-poster').src = `${IMG_BASE_URL}${tvData.poster_path}`;
        document.getElementById('tv-title').innerText = tvData.name;
        document.getElementById('tv-overview').innerText = tvData.overview;
        document.getElementById('tv-rating').innerText = tvData.vote_average;

        // Modal'ı aç
        new bootstrap.Modal(document.getElementById('tvModal')).show();
    } catch (error) {
        console.error("Dizi detayları yüklenirken hata oluştu:", error);
    }
}

// Yakında Gelecek Filmleri Çek ve Listele
async function fetchUpcomingMovies() {
    const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=tr-TR`);
    const data = await response.json();
    displayUpcoming(data.results, 'upcoming-movie-list', 'movie');
}

// Bugün Yayınlanacak Dizileri Çek ve Listele
async function fetchUpcomingTVShows() {
    const response = await fetch(`${BASE_URL}/tv/airing_today?api_key=${API_KEY}&language=tr-TR`);
    const data = await response.json();
    displayUpcoming(data.results, 'upcoming-tv-list', 'tv');
}

// Yakında Gelecek İçerikleri Listele
function displayUpcoming(items, containerId, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    items.forEach(item => {
        const title = type === 'movie' ? item.title : item.name;
        const posterPath = item.poster_path ? `${IMG_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/500';
        const card = `
            <div class="col-md-3 mb-4">
                <div class="card text-white bg-dark">
                    <img src="${posterPath}" class="card-img-top" alt="${title}">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <button class="btn btn-primary" onclick="showDetails('${type}', ${item.id})">Detayları Gör</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Detayları Göster
async function showDetails(type, id) {
    const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=tr-TR`);
    const data = await response.json();

    document.getElementById('details-title').textContent = type === 'movie' ? data.title : data.name;
    document.getElementById('details-overview').textContent = data.overview || 'Açıklama mevcut değil.';
    document.getElementById('details-rating').textContent = data.vote_average || 'N/A';
    document.getElementById('details-poster').src = data.poster_path
        ? `${IMG_BASE_URL}${data.poster_path}`
        : 'https://via.placeholder.com/500';

    const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    modal.show();
}


// Sayfa yüklendiğinde hem filmleri hem dizileri getir
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies(); // Filmler için var olan fonksiyon
    fetchTrendingTVShows(); // Diziler için eklediğimiz fonksiyon
    fetchUpcomingMovies();
    fetchUpcomingTVShows();
});



