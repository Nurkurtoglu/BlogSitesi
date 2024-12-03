// const BASE_URL = 'https://api.themoviedb.org/3';  //TMDB base URL
// const URL = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieName)}&language=tr-TR`;
// const IMAGE_URL = 'https://image.tmdb.org/t/p/w500'; // Resim URL formatı

// // Film/Dizi arama fonksiyonu
// async function searchMedia() {
//   const query = document.getElementById('searchInput').value;
//   if (query) {
//     const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}&language=tr`;

//     try {
//       const response = await fetch(url);
//       const data = await response.json();

//       if (data.results) {
//         displaySearchResults(data.results);
//       } else {
//         alert('Sonuç bulunamadı.');
//       }
//     } catch (error) {
//       console.error('Veri çekme hatası:', error);
//     }
//   }
// }
// // */
// //  ********************************************************************** Arama sonuçlarını görüntüleme fonksiyonu
// function displaySearchResults(results) {
//   const resultsContainer = document.getElementById('searchResults');
//   resultsContainer.innerHTML = ''; // Önceki sonuçları temizle

//   results.forEach(result => {
//     const resultElement = document.createElement('div');
//     resultElement.classList.add('result');
//     resultElement.innerHTML = `
//       <img src="${IMAGE_URL + (result.poster_path || result.backdrop_path)}" alt="${result.title || result.name}">
//       <h3>${result.title || result.name}</h3>
//       <p>${result.release_date || result.first_air_date}</p>
//       <button onclick="getMediaDetails(${result.id}, '${result.media_type}')">Detayları Göster</button>
//     `;
//     resultsContainer.appendChild(resultElement);
//   });
// }
// // *************************************************************************************************
// // Film/Dizi ID'si ile detayları alma fonksiyonu
// async function getMediaDetails(id, type) {
//   let url = '';
//   if (type === 'movie') {
//     url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=tr`;
//   } else if (type === 'tv') {
//     url = `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=tr`;
//   }

//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     if (data) {
//       displayMediaDetails(data, type);
//     }
//   } catch (error) {
//     console.error('Detaylar alınırken hata oluştu:', error);
//   }
// }
// // *****************************************************************************
// // Film/Dizi detaylarını görüntüleme fonksiyonu
// function displayMediaDetails(media, type) {
//   const mediaContainer = document.getElementById('mediaDetails');
//   mediaContainer.innerHTML = `
//     <h3>${media.title || media.name}</h3>
//     <img src="${IMAGE_URL + media.poster_path}" alt="${media.title || media.name}">
//     <p><strong>Puan:</strong> ${media.vote_average}</p>
//     <p><strong>Türler:</strong> ${media.genres.map(genre => genre.name).join(', ')}</p>
//     <p><strong>Konusu:</strong> ${media.overview}</p>
//   `;
// }

// document.getElementById('searchButton').addEventListener('click', searchMedia);
// ----------------------------------------------------------------------------------------------------------------------------------------------
// const API_KEY = 'c9d5f0f01b098c021e6964b9fae786dd'; // TMDB API anahtarını buraya ekle


// // film/dizi adıyla filmin puanını donduren fonksiyon
// async function getMovieRating(movieName){

//   const URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}&language=tr-TR`;
  
//   try{
//     const RESPONSE = await fetch(URL);
//     if(RESPONSE.ok) {
//       const data = await RESPONSE.json();
//       if(data.results && data.results.length > 0) {
//           return data.results[0].vote_average;
//       } else {
//         return "Film bulunamadi.";
//       }
//     } else {
//       return "Bir hata olustu."
//     }
//   } catch (error) {
//     return "Bir hata olustu: " + error.message;
//   }  
// }


// async function fetchMovieRating(params) {
  
// }
// https://api.themoviedb.org/3/search/movie?api_key=c9d5f0f01b098c021e6964b9fae786dd&query=${encodeURIComponent(dune)}&language=tr-TR
const API_KEY = 'c9d5f0f01b098c021e6964b9fae786dd'; // TMDB API anahtarınız

// Film özetini alma fonksiyonu
async function getMovieOverwiev(movieName) {
  const URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}&language=tr-TR`;

  try {
    const RESPONSE = await fetch(URL);
    if (RESPONSE.ok) {
      const data = await RESPONSE.json();
      if (data.results && data.results.length > 0) {
        return data.results[0]; // Film bilgilerini döndür
      } else {
        return "Film Bulunamadi.";
      }
    } else {
      return "Bir hata olustu.";
    }
  } catch (error) {
    return `Bir hata olustu: ${error.message}`;
  }
}

// Butona tıklama olayını dinle
document.getElementById("searchButton").addEventListener("click", function(event) {
  event.preventDefault();  // Formun yenilenmesini engeller

  // Arama kutusundaki değeri alalım
  const movieName = document.getElementById("searchInput").value;

  // getMovieOverwiev fonksiyonunu çağırarak film özetini al
  getMovieOverwiev(movieName).then(movie => {
    const movieDetailsDiv = document.getElementById("movieDetails");

    // Film verisini sayfada göster
    if (typeof movie === 'string') {
      movieDetailsDiv.innerHTML = `<p>${movie}</p>`;
    } else {
      movieDetailsDiv.innerHTML = `
        <h2>${movie.title}</h2>
        <p><strong>Özet:</strong> ${movie.overview}</p>
        <p><strong>Yıl:</strong> ${movie.release_date}</p>
        <p><strong>Puan:</strong> ${movie.vote_average} / 10</p>
        <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" style="width:200px;">
      `;
    }
    // Sayfayı movieDetails div'ine kaydır
  movieDetailsDiv.scrollIntoView({ behavior: "smooth" });
  });
});


// // film konusunu yazdırma/gösterme
// async function filmBilgileriniGoster(filmIsmi) {
//   let pDOM = document.getElementById("filmKonu")
//   const overwiev = await getMovieOverwiev(filmIsmi)
//   pDOM.innerHTML = overwiev
  
// }

// filmBilgileriniGoster("örümcek adam ")


// // filmin adıyla fotosonu dondurme
// async function getMoviePoster(movieName){

//   const URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}&language=tr-TR`;
  
//   try{
//     const RESPONSE = await fetch(URL);
//     if(RESPONSE.ok) {
//       const data = await RESPONSE.json();
//       if(data.results && data.results.length > 0) {
//           const posterPath = data.results[0].poster_path;

//           // Eğer poster_path varsa, görselin tam URL'sini oluştur
//         if (posterPath) {
//           const posterURL = `https://image.tmdb.org/t/p/w500${posterPath}`;
//           return posterURL;  // Poster görseli URL'sini döndür
//       } else{
//         return "Poster Url Bulunamadi"
//       }
//     } else {
//       return "Film bulunamadi."
//     }
//   } else {
//     return "Bir Hata olustu."
//   }
//   } catch (error) {
//     return "Bir hata olustu: " + error.message;
//   }  
// }

// //  filmin posterini getir
// async function filmPosteriGoster(movieName) {
//   const posterURL = await getMoviePoster(movieName)
//   let imgDOM = document.getElementById("filmPoster")

//   // eger poster url si vasra gorseli ekle
//   if(posterURL !== "Poster Bulunamadi. " && posterURL !== "Film Bulunamdi."){
//     imgDOM.src = posterURL // poster gorselini ekle
//   } else {
//     imgDOM.alt = posterURL; // gelmezse hat mesajini goster
//   }
// }

// filmPosteriGoster("örümcek adam 1")
