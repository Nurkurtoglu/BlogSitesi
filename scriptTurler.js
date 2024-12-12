const API_KEY = 'api_key=c9d5f0f01b098c021e6964b9fae786dd';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

// Film türleri
const genres = [
    { id: 28, name: "Aksiyon" },
    { id: 12, name: "Macera" },
    { id: 16, name: "Animasyon" },
    { id: 35, name: "Komedi" },
    { id: 80, name: "Suç" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Aile" },
    { id: 14, name: "Fantastik" },
    { id: 36, name: "Tarih" },
    { id: 27, name: "Korku" },
    { id: 10402, name: "Müzik" },
    { id: 9648, name: "Gizem" },
    { id: 10749, name: "Romantik" },
    { id: 878, name: "Bilim Kurgu" },
    { id: 53, name: "Gerilim" },
    { id: 37, name: "Vahşi Batı" },
    { id: 10752, name: "Savaş" },
    { id: 99, name: "Belgesel" },
    { id: 10770, name: "TV Filmi" }
];

const tagsEl = document.getElementById('tags');
const contentEl = document.getElementById('content');

// Türleri oluştur
function setGenres() {
    genres.forEach(genre => {
        const tag = document.createElement('div');
        tag.classList.add('tag');
        tag.innerText = genre.name;
        tag.id = genre.id;

        tag.addEventListener('click', () => {
            const genreId = genre.id;
            const url = `${API_URL}&with_genres=${genreId}`; // API URL'sini oluştur
            getMovies(url); // Filmleri API'den getir
            highlightSelectedGenre(tag.id); // Seçilen türü vurgula
        });

        tagsEl.appendChild(tag);
    });
}

// Seçili türü vurgula
function highlightSelectedGenre(id) {
    document.querySelectorAll('.tag').forEach(tag => {
        tag.classList.remove('highlight');
    });
    document.getElementById(id).classList.add('highlight');
}

// Filmleri API'den getir
function getMovies(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.results.length > 0) {
                showMovies(data.results); // Filmleri göster
            } else {
                contentEl.innerHTML = '<h2>Sonuç Bulunamadı</h2>';
            }
        })
        .catch(err => {
            console.error('Hata:', err);
            contentEl.innerHTML = '<h2>Bir hata oluştu. Lütfen tekrar deneyin.</h2>';
        });
}

// Filmleri göster
function showMovies(movies) {
    contentEl.innerHTML = ''; // Önceki içerikleri temizle
    movies.forEach(movie => {
        const { title, poster_path, vote_average } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img src="${poster_path ? IMG_URL + poster_path : 'https://via.placeholder.com/500x750'}" alt="${title}">
            <h3>${title}</h3>
            <span>IMDb: ${vote_average}</span>
        `;
        contentEl.appendChild(movieEl);
    });
}

// Türleri başlat
setGenres();

