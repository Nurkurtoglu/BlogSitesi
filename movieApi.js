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

        async function performSearch(query, type) {
            try {
                const url = `${BASE_URL}/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=tr-TR`;
                const response = await fetch(url);
                const data = await response.json();
                
                displayResults(data.results, type);
            } catch (error) {
                console.error('Arama hatası:', error);
                document.getElementById('searchResults').innerHTML = 
                    '<p class="text-danger">Arama sırasında bir hata oluştu.</p>';
            }
        }

        function displayResults(results, type) {
            const resultsDiv = document.getElementById('searchResults');
            
            if (!results || results.length === 0) {
                resultsDiv.innerHTML = '<p class="text-center">Sonuç bulunamadı.</p>';
                return;
            }

            const html = results.map(item => {
                switch(type) {
                    case 'movie':
                        return `
                            <div class="movie-card">
                                <img src="${item.poster_path ? IMAGE_BASE_URL + item.poster_path : 'placeholder.jpg'}" 
                                     alt="${item.title}" 
                                     class="movie-poster"
                                     onerror="this.src='placeholder.jpg'">
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
                    case 'tv':
                        return `
                            <div class="movie-card">
                                <img src="${item.poster_path ? IMAGE_BASE_URL + item.poster_path : 'placeholder.jpg'}" 
                                     alt="${item.name}" 
                                     class="movie-poster"
                                     onerror="this.src='placeholder.jpg'">
                                <div class="movie-info">
                                    <h2 class="movie-title">${item.name}</h2>
                                    <div class="release-date">
                                        <i class="far fa-calendar-alt"></i> 
                                        ${item.first_air_date ? new Date(item.first_air_date).toLocaleDateString('tr-TR') : 'Tarih belirtilmemiş'}
                                    </div>
                                    <div class="rating">
                                        <i class="fas fa-star text-warning"></i> 
                                        ${item.vote_average ? item.vote_average.toFixed(1) : 'N/A'} / 10
                                    </div>
                                    <div class="overview">${item.overview || 'Özet bulunmuyor.'}</div>
                                </div>
                            </div>
                        `;
                    case 'person':
                        return `
                            <div class="movie-card">
                                <img src="${item.profile_path ? IMAGE_BASE_URL + item.profile_path : 'placeholder.jpg'}" 
                                     alt="${item.name}" 
                                     class="movie-poster"
                                     onerror="this.src='placeholder.jpg'">
                                <div class="movie-info">
                                    <h2 class="movie-title">${item.name}</h2>
                                    <div class="known-for">Bilinen işleri: ${item.known_for_department || 'Belirtilmemiş'}</div>
                                    <div class="popularity">
                                        <i class="fas fa-users"></i> Popülerlik: ${item.popularity?.toFixed(1) || 'N/A'}
                                    </div>
                                    <div class="known-for-movies">
                                        <h3>Bilinen Projeleri:</h3>
                                        ${item.known_for?.map(work => `<div>${work.title || work.name}</div>`).join('') || 'Bilgi bulunmuyor.'}
                                    </div>
                    </div>
                        `;
                }
            }).join('');

            resultsDiv.innerHTML = html;
        }