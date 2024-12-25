const API_KEY = 'c9d5f0f01b098c021e6964b9fae786dd';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const genre = urlParams.get('genre');
    const type = urlParams.get('type');
    const startDate = urlParams.get('start-date');
    const endDate = urlParams.get('end-date');

    if (genre && type && startDate && endDate) {
        performSearch(genre, type, startDate, endDate);
    }
});

// FilterStrategy sınıfı (filtreleme stratejisi)
class FilterStrategy {
    applyFilter(data, filters) {
        throw new Error('applyFilter() method must be implemented');
    }
}

// GenreFilter (Tür filtresi)
class GenreFilter extends FilterStrategy {
    applyFilter(data, filters) {
        return data.filter(item => item.genre_ids.includes(parseInt(filters.genre)));
    }
}

// DateRangeFilter (Tarih Aralığı filtresi)
class DateRangeFilter extends FilterStrategy {
    applyFilter(data, filters) {
        return data.filter(item => {
            const releaseDate = new Date(item.release_date || item.first_air_date);
            return releaseDate >= new Date(filters.startDate) && releaseDate <= new Date(filters.endDate);
        });
    }
}

// FilterContext (Filtreleme Bağlamı)
class FilterContext {
    constructor() {
        this.strategy = null;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    applyFilter(data, filters) {
        return this.strategy.applyFilter(data, filters);
    }
}


async function performSearch(genre, type, startDate, endDate) {
    try {
        let url = `${BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genre}&language=tr-TR`;

        // Tarih aralığı filtresi
        if (startDate && endDate) {
            url += `&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        // Gelen JSON verisini konsola yazdır
        console.log("Gelen API Verisi:", data);

        // Filtreleme işlemi için strateji belirleyelim
        const filterContext = new FilterContext();

        // Tür filtresi
        if (genre) {
            filterContext.setStrategy(new GenreFilter());
            data.results = filterContext.applyFilter(data.results, { genre });
        }

        // Tarih aralığı filtresi
        if (startDate && endDate) {
            filterContext.setStrategy(new DateRangeFilter());
            data.results = filterContext.applyFilter(data.results, { startDate, endDate });
        }

        // Sonuçları göster
        displayResults(data.results, type);
    } catch (error) {
        console.error('Arama hatası:', error);
        document.getElementById('searchResults').innerHTML =
            '<p class="text-danger">Arama sırasında bir hata oluştu.</p>';
    }
}
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
                    <div class="col-md-4">
                        <div class="movie-card">
                            <img src="${item.poster_path ? IMAGE_BASE_URL + item.poster_path : placeholderImage}" 
                                 alt="${item.title}" class="movie-poster" onerror="this.src='${placeholderImage}'">
                            <div class="movie-info">
                                <h2 class="movie-title">${item.title}</h2>
                                <div class="release-date">${item.release_date ? new Date(item.release_date).toLocaleDateString('tr-TR') : 'Tarih belirtilmemiş'}</div>
                                <div class="rating">${item.vote_average ? item.vote_average.toFixed(1) : 'N/A'} / 10</div>
                                <div class="overview">${item.overview || 'Özet bulunmuyor.'}</div>
                            </div>
                        </div>
                    </div>
                `;
            case 'tv':
                return `
                    <div class="col-md-4">
                        <div class="tv-card">
                            <img src="${item.poster_path ? IMAGE_BASE_URL + item.poster_path : placeholderImage}" 
                                 alt="${item.name}" class="tv-poster" onerror="this.src='${placeholderImage}'">
                            <div class="tv-info">
                                <h2 class="tv-title">${item.name}</h2>
                                <div class="first-air-date">${item.first_air_date ? new Date(item.first_air_date).toLocaleDateString('tr-TR') : 'Tarih belirtilmemiş'}</div>
                                <div class="rating">${item.vote_average ? item.vote_average.toFixed(1) : 'N/A'} / 10</div>
                                <div class="overview">${item.overview || 'Özet bulunmuyor.'}</div>
                            </div>
                        </div>
                    </div>
                `;
            default:
                return '';
        }
    }).join('');

    resultsDiv.innerHTML = html;
}

