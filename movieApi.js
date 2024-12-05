const API_KEY = 'c9d5f0f01b098c021e6964b9fae786dd';

async function fetchMovieDetails(movieName) {
    const URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}&language=tr-TR&region=TR&include_adult=false`;

    try {
        const response = await fetch(URL);
        if (response.ok) {
            const data = await response.json();
            const movieDetailsDiv = document.getElementById("movieDetails");

            if (data.results && data.results.length > 0) {
                // Sort results to prioritize exact matches
                data.results.sort((a, b) => {
                    if (a.title.toLowerCase() === movieName.toLowerCase()) return -1;
                    if (b.title.toLowerCase() === movieName.toLowerCase()) return 1;
                    return 0;
                });

                // Display all results with new layout and clickable titles
                movieDetailsDiv.innerHTML = data.results.map(movie => `
                    <div class="movie-container" style="display: flex; gap: 20px; margin-bottom: 30px; background-color: #444; padding: 20px; border-radius: 10px;">
                        <div class="movie-poster" style="flex-shrink: 0;">
                            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" 
                                 alt="${movie.title}" 
                                 style="width: 200px; border-radius: 5px;">
                        </div>
                        <div class="movie-info" style="flex-grow: 1;">
                            <h2 style="color: #fff; margin-bottom: 15px; cursor: pointer;" 
                                onclick="showDetailedMovie(${movie.id})"
                                onmouseover="this.style.color='#ffd700'" 
                                onmouseout="this.style.color='#fff'">
                                ${movie.title}
                            </h2>
                            <p style="color: #ddd; line-height: 1.6;">${movie.overview || 'Özet bulunmuyor.'}</p>
                            <div style="margin-top: 15px; color: #aaa;">
                                <p><strong>Yayın Tarihi:</strong> ${formatDate(movie.release_date) || 'Belirtilmemiş'}</p>
                                <p><strong>Puan:</strong> ${movie.vote_average.toFixed(1)} / 10</p>
                            </div>
                        </div>
                    </div>
                `).join('');
            } else {
                movieDetailsDiv.innerHTML = "<p>Film bulunamadı.</p>";
            }
        } else {
            movieDetailsDiv.innerHTML = "<p>Bir hata oluştu.</p>";
        }
    } catch (error) {
        document.getElementById("movieDetails").innerHTML = `<p>Bir hata oluştu: ${error.message}</p>`;
    }
}

async function showDetailedMovie(movieId) {
    const detailURL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=tr-TR&append_to_response=credits,videos`;
    
    try {
        const response = await fetch(detailURL);
        if (response.ok) {
            const movie = await response.json();
            const movieDetailsDiv = document.getElementById("movieDetails");

            movieDetailsDiv.innerHTML = `
                <div class="movie-detail" style="padding: 20px; color: white;">
                    <div style="display: flex; gap: 30px;">
                        <div class="poster" style="flex-shrink: 0;">
                            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" 
                                 alt="${movie.title}" 
                                 style="width: 300px; border-radius: 10px;">
                        </div>
                        <div class="info" style="flex-grow: 1;">
                            <h1 style="margin-bottom: 20px;">${movie.title}</h1>
                            <div class="metadata" style="margin-bottom: 20px; color: #aaa;">
                                <span>${formatDate(movie.release_date)}</span> • 
                                <span>${movie.runtime} dakika</span> • 
                                <span>${movie.genres.map(g => g.name).join(', ')}</span>
                            </div>
                            <div class="score" style="margin-bottom: 20px;">
                                <h3>Kullanıcı Puanı</h3>
                                <div style="font-size: 1.5em; color: #ffd700;">
                                    ${(movie.vote_average * 10).toFixed(0)}%
                                </div>
                            </div>
                            <div class="overview">
                                <h3>Özet</h3>
                                <p style="line-height: 1.6;">${movie.overview || 'Özet bulunmuyor.'}</p>
                            </div>
                            <div class="cast" style="margin-top: 20px;">
                                <h3>Başrol Oyuncuları</h3>
                                <div style="display: flex; gap: 15px; margin-top: 10px; overflow-x: auto;">
                                    ${movie.credits.cast.slice(0, 5).map(actor => `
                                        <div style="text-align: center; min-width: 100px;">
                                            ${actor.profile_path ? `
                                                <img src="https://image.tmdb.org/t/p/w185/${actor.profile_path}" 
                                                     alt="${actor.name}"
                                                     style="width: 100px; border-radius: 5px; margin-bottom: 5px;">
                                            ` : `
                                                <div style="width: 100px; height: 150px; background-color: #555; border-radius: 5px; margin-bottom: 5px;"></div>
                                            `}
                                            <p style="font-size: 0.9em; margin: 0;">${actor.name}</p>
                                            <p style="font-size: 0.8em; color: #aaa; margin: 0;">${actor.character}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

function formatDate(dateString) {
    if (!dateString) return 'Belirtilmemiş';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
}

// Event listeners
document.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.getElementById("searchButton");
    if (searchButton) {
        searchButton.addEventListener("click", function(event) {
            event.preventDefault();
            const movieName = document.getElementById("searchInput").value;
            
            if (movieName) {
                fetchMovieDetails(movieName);
            } else {
                alert("Lütfen bir film adı girin!");
            }
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const movieName = urlParams.get('movieName');
    if (movieName) {
        fetchMovieDetails(movieName);
    }
});