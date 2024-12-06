// TMDB API Anahtarınızı buraya ekleyin
const API_KEY = "c9d5f0f01b098c021e6964b9fae786dd"; // YOUR_API_KEY kısmını kendi TMDB API anahtarınızla değiştirin

// Haftanın en popüler filmlerini getir
function fetchWeeklyMovies() {
  const movieUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=tr-TR&page=1`;
  
  fetch(movieUrl)
    .then((response) => response.json())
    .then((data) => {
      const weeklyContent = document.getElementById("weekly-content");
      
      data.results.slice(0, 5).forEach((movie) => { // İlk 5 filmi al
        const movieCard = `
          <div class="highlight-card">
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}" class="highlight-image">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average} | ${movie.release_date}</p>
            <p>${movie.overview.substring(0, 100)}...</p>
          </div>
        `;
        weeklyContent.innerHTML += movieCard;
      });
    })
    .catch((error) => console.error("Hata:", error));
}

// Haftanın en popüler dizilerini getir
function fetchWeeklyTVShows() {
  const tvUrl = `https://api.themoviedb.org/3/trending/tv/week/popular?api_key=${API_KEY}&language=tr-TR&page=1`;
  
  fetch(tvUrl)
    .then((response) => response.json())
    .then((data) => {
      const weeklyContent = document.getElementById("weekly-content");
      
      data.results.slice(0, 5).forEach((tvShow) => { // İlk 5 diziyi al
        const tvCard = `
          <div class="highlight-card">
            <img src="https://image.tmdb.org/t/p/w200${tvShow.poster_path}" alt="${tvShow.name}" class="highlight-image">
            <h3>${tvShow.name}</h3>
            <p>⭐ ${tvShow.vote_average} | ${tvShow.first_air_date}</p>
            <p>${tvShow.overview.substring(0, 100)}...</p>
          </div>
        `;
        weeklyContent.innerHTML += tvCard;
      });
    })
    .catch((error) => console.error("Hata:", error));
}

// Sayfa yüklendiğinde popüler içerikleri getir
document.addEventListener("DOMContentLoaded", () => {
  fetchWeeklyMovies();
  fetchWeeklyTVShows();
});
