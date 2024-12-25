const API_KEY = '1bfdbff05c2698dc917dd28c08d41096';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Yeni çıkan dizileri getir
async function fetchNewTVShows() {
    try {
        const response = await fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=tr-TR&page=1`);
        const data = await response.json();
        console.log('Gelen dizi verileri:', data); // Debug için log
        displayTVShows(data.results);
    } catch (error) {
        console.error('Hata:', error);
    }
}

// Dizileri görüntüle
function displayTVShows(shows) {
    const tvShowList = document.getElementById('tv-show-list');
    if (!tvShowList) {
        console.error('tv-show-list elementi bulunamadı');
        return;
    }
    
    tvShowList.innerHTML = '';

    shows.forEach(show => {
        if (!show.poster_path) return; // Posteri olmayan dizileri atla
        
        const tvCard = `
            <div class="col-md-3 mb-4">
                <div class="card text-white bg-dark h-100">
                    <img src="${IMG_BASE_URL}${show.poster_path}" class="card-img-top" alt="${show.name}"
                         onerror="this.src='placeholder.jpg'">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${show.name}</h5>
                        <p class="card-text flex-grow-1">${show.overview ? show.overview.slice(0, 100) + '...' : 'Açıklama bulunmuyor.'}</p>
                        <button class="btn w-100 mt-auto" 
                                style="background-color: #474c52; color: #f4e243; border-color: #f4e243;"
                                onmouseover="this.style.backgroundColor='#3a3e43'" 
                                onmouseout="this.style.backgroundColor='#474c52'"
                                onclick="showTVDetails(${show.id})"
                                data-bs-toggle="modal" 
                                data-bs-target="#detailsModal">
                            Detayları Gör
                        </button>
                    </div>
                </div>
            </div>
        `;
        tvShowList.innerHTML += tvCard;
    });
}

// Dizi detaylarını göster
async function showTVDetails(id) {
    try {
        const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=tr-TR`);
        const show = await response.json();

        document.getElementById('detailsModalLabel').textContent = show.name;
        document.getElementById('details-title').textContent = show.name;
        document.getElementById('details-overview').textContent = show.overview;
        document.getElementById('details-rating').textContent = `${show.vote_average.toFixed(1)}/10`;
        document.getElementById('details-poster').src = `${IMG_BASE_URL}${show.poster_path}`;

        // Modal'a dizi ID'sini ata
        const modalElement = document.getElementById('detailsModal');
        modalElement.setAttribute('data-show-id', id);

        // Beğeni durumunu kontrol et
        const isLiked = getLikeStatus('tv', id);
        const likeButton = document.getElementById('details-like-button');
        updateLikeButton(likeButton, isLiked);

        // Yorumları göster
        const comments = getComments('tv', id);
        displayComments('details-comments-section', comments);
    } catch (error) {
        console.error('Dizi detayları yüklenirken hata:', error);
    }
}


// Tür filtreleme
function filterShows() {
    const genreId = document.getElementById('genre-select').value;
    if (genreId === '') {
        fetchNewTVShows();
        return;
    }

    fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&language=tr-TR&with_genres=${genreId}&sort_by=first_air_date.desc`)
        .then(response => response.json())
        .then(data => displayTVShows(data.results))
        .catch(error => console.error('Hata:', error));
}

// Beğeni ve yorum fonksiyonları
function getLikeStatus(type, id) {
    const likes = JSON.parse(localStorage.getItem('likes') || '{}');
    return likes[`${type}_${id}`] || false;
}
function updateLikeButton(button, isLiked) {
    if (isLiked) {
        button.innerHTML = '<i class="fas fa-heart"></i> Beğenildi';
        button.style.backgroundColor = '#f4e243';
        button.style.color = '#474c52';
    } else {
        button.innerHTML = '<i class="far fa-heart"></i> Beğen';
        button.style.backgroundColor = '#474c52';
        button.style.color = '#f4e243';
    }
}


function getComments(type, id) {
    const comments = JSON.parse(localStorage.getItem('comments') || '{}');
    return comments[`${type}_${id}`] || [];
}

function displayComments(elementId, comments) {
    const container = document.getElementById(elementId);
    container.innerHTML = comments.map(comment => `
        <div class="comment mb-2 text-white">
            <strong>${comment.nickname}</strong>: ${comment.text}
        </div>
    `).join('');
}


// Yorum ekleme
function addDetailsComment() {
    const nickname = document.getElementById('details-nickname-input').value.trim();
    const text = document.getElementById('details-comment-input').value.trim();
    const modalElement = document.getElementById('detailsModal');
    const showId = modalElement.getAttribute('data-show-id');

    if (!nickname || !text) {
        alert('Lütfen nickname ve yorum giriniz.');
        return;
    }

    const comments = getComments('tv', showId);
    comments.push({ nickname, text });

    localStorage.setItem('comments', JSON.stringify({
        ...JSON.parse(localStorage.getItem('comments') || '{}'),
        [`tv_${showId}`]: comments
    }));

    displayComments('details-comments-section', comments);

    // Input alanlarını temizle
    document.getElementById('details-nickname-input').value = '';
    document.getElementById('details-comment-input').value = '';
    
}

// Sayfa yüklendiğinde dizileri getir
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sayfa yüklendi, veriler getiriliyor...'); // Debug için log
    fetchNewTVShows();
}); 
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sayfa yüklendi, veriler getiriliyor...');
    fetchNewTVShows();

    // Beğen butonu için olay dinleyicisi ekle
    const likeButton = document.getElementById('details-like-button');
    if (likeButton) {
        likeButton.addEventListener('click', function () {
            const modalElement = document.getElementById('detailsModal');
            const showId = modalElement.getAttribute('data-show-id');
            const isLiked = getLikeStatus('tv', showId);

            const likes = JSON.parse(localStorage.getItem('likes') || '{}');
            likes[`tv_${showId}`] = !isLiked;
            localStorage.setItem('likes', JSON.stringify(likes));

            updateLikeButton(this, !isLiked);
        });
    }
});
