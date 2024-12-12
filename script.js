const API_KEY = "c9d5f0f01b098c021e6964b9fae786dd";

function fetchWeeklyMovies() {
  const movieUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=tr-TR&page=1`;
  
  fetch(movieUrl)
    .then((response) => response.json())
    .then((data) => {
      const weeklyContent = document.getElementById("weekly-content");
      if (!data.results || data.results.length === 0) {
        weeklyContent.innerHTML = "<p>Bu hafta için popüler film bulunamadı.</p>";
        return;
      }
      data.results.slice(0, 5).forEach((movie) => {
        if (!movie.poster_path || !movie.title) return; // Eksik verileri atlar
        const movieCard = `
          <div class="highlight-card">
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}" class="highlight-image">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average || "N/A"} | ${movie.release_date || "Tarih belirtilmemiş"}</p>
            <p>${movie.overview ? movie.overview.substring(0, 100) : "Açıklama yok"}...</p>
          </div>
        `;
        weeklyContent.innerHTML += movieCard;
      });
    })
    .catch((error) => console.error("Film verisi getirilemedi:", error));
}

function fetchWeeklyTVShows() {
  const tvUrl = `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}&language=tr-TR&page=1`;
  
  fetch(tvUrl)
    .then((response) => response.json())
    .then((data) => {
      const weeklyContent = document.getElementById("weekly-content");
      if (!data.results || data.results.length === 0) {
        weeklyContent.innerHTML = "<p>Bu hafta için popüler dizi bulunamadı.</p>";
        return;
      }
      data.results.slice(0, 5).forEach((tvShow) => {
        if (!tvShow.poster_path || !tvShow.name) return; // Eksik verileri atlar
        const tvCard = `
          <div class="highlight-card">
            <img src="https://image.tmdb.org/t/p/w200${tvShow.poster_path}" alt="${tvShow.name}" class="highlight-image">
            <h3>${tvShow.name}</h3>
            <p>⭐ ${tvShow.vote_average || "N/A"} | ${tvShow.first_air_date || "Tarih belirtilmemiş"}</p>
            <p>${tvShow.overview ? tvShow.overview.substring(0, 100) : "Açıklama yok"}...</p>
          </div>
        `;
        weeklyContent.innerHTML += tvCard;
      });
    })
    .catch((error) => console.error("Dizi verisi getirilemedi:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  fetchWeeklyMovies();
  fetchWeeklyTVShows();
});




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

