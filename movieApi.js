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
                            <h2 class="movie-title">${item.title}</h2>
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

// Modal içerik doldurma fonksiyonu
function showMovieDetails(movieId) {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=tr`)
        .then(response => response.json())
        .then(data => {
            const modalContent = `
                <h3>${data.title} (${data.release_date.split('-')[0]})</h3>
                <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title}" class="img-fluid">
                <p><strong>Özet:</strong> ${data.overview}</p>
                <p><strong>Türler:</strong> ${data.genres.map(genre => genre.name).join(', ')}</p>
                <p><strong>Ortalama Puan:</strong> ${data.vote_average}/10</p>
                <div>
                    <label for="userComment">Yorumunuzu Ekleyin:</label>
                    <textarea id="userComment" class="form-control" rows="3"></textarea>
                    <button class="btn btn-primary mt-2">Gönder</button>
                </div>
            `;
            document.getElementById('modalContent').innerHTML = modalContent;
            const movieModal = new bootstrap.Modal(document.getElementById('movieModal'));
            movieModal.show();
        })
        .catch(error => console.error('Detaylar yüklenemedi:', error));
}

// Örnek film sonuçlarını listeleme
function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    results.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie-item';
        movieElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}" class="img-fluid">
            <h5>${movie.title}</h5>
        `;
        movieElement.addEventListener('click', () => showMovieDetails(movie.id));
        searchResults.appendChild(movieElement);
    });
}




