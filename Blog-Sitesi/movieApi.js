const API_KEY = 'c9d5f0f01b098c021e6964b9fae786dd';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    const searchType = urlParams.get('searchType') || 'movie';

    if (query) {
        performSearch(query, searchType);
    }
});

// JSON verisini getirir api ile.

async function performSearch(query, type) {
    try {
        const url = `${BASE_URL}/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=tr-TR`;
        const response = await fetch(url);
        const data = await response.json();
        
        // Gelen JSON verisini konsola yazdır
        console.log("Gelen API Verisi:", data);

        // Sonuçları göster ve veritabanına kaydet
        displayResults(data.results, type);
        await saveResultsToDatabase(data.results, type);
    } catch (error) {
        console.error('Arama hatası:', error);
        document.getElementById('searchResults').innerHTML =
            '<p class="text-danger">Arama sırasında bir hata oluştu.</p>';
    }
}

//Arama sonuçlarını gösteren kısım,  dinamik bir arayüz oluşturur.
function displayResults(results, type) {
    const resultsDiv = document.getElementById('searchResults');
    const placeholderImage = 'https://via.placeholder.com/500x750?text=No+Image'; // Yedek resim URL'si

    if (!results || results.length === 0) {
        resultsDiv.innerHTML = '<p class="text-center">Sonuç bulunamadı.</p>';
        return;
    }

    const html = results.map(item => {
        switch (type) {
            case 'movie':
                return `
                    <div class="movie-card">
                        <img src="${item.poster_path ? IMAGE_BASE_URL + item.poster_path : placeholderImage}" 
                             alt="${item.title}" 
                             class="movie-poster"
                             onerror="this.src='${placeholderImage}'">
                        <div class="movie-info">
                            <h2 class="movie-title" onclick="showMovieDetails(${item.id})">${item.title}</h2>
                            <div class="release-date">
                                <i class="far fa-calendar-alt"></i> 
                                ${item.release_date ? new Date(item.release_date).toLocaleDateString('tr-TR') : 'Tarih belirtilmemiş'}
                            </div>
                            <div class="rating">
                                <i class="fas fa-star text-warning"></i> 
                                ${item.vote_average ? item.vote_average.toFixed(1) : 'N/A'} / 10
                            </div>
                            <div class="overview">${item.overview || 'Özet bulunmuyor.'}</div>
                        </div>
                    </div>
                `;
            // Diğer türler için case 'tv' ve case 'person' burada yer alacak
        }
    }).join('');

    resultsDiv.innerHTML = html;
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



// dönen sonuçları veritabanına kaydediyor.
async function saveResultsToDatabase(results, type) {
    for (const item of results) {
        // Sadece film veya dizi türü için kaydetme işlemi
        if (type === 'movie' || type === 'tv') {
            const releaseDate = type === 'movie' 
                ? item.release_date 
                : item.first_air_date;

            // Tarihi 'YYYY-MM-DD' formatına dönüştürme
            const formattedDate = releaseDate 
                ? new Date(releaseDate).toISOString().split('T')[0] // 'YYYY-MM-DD' formatına dönüştürme
                : null;

            const movieData = {
                tmdb_id: item.id,
                title: type === 'movie' ? item.title : item.name,
                release_date: formattedDate,  // Formatlı tarih
                imdb_rating: item.vote_average,  // IMDb benzeri puan (vote_average)
                overview: item.overview,
                // poster_path: item.poster_path, // İstenirse poster path eklenebilir
            };

            try {
                const response = await fetch('http://localhost:3000/add-movie', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(movieData),
                });

                const data = await response.json();
                console.log(data.message);
                console.log("Veritabanına Kaydedilen Veri:", movieData);
            } catch (error) {
                console.error('Veritabanı kaydı sırasında hata oluştu:', error);
            }
        }
    }
}







