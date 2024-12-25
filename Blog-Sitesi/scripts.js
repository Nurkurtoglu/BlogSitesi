document.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const searchType = document.getElementById('searchType');

    // Enter tuşu ile arama
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });

    // Arama butonu ile arama
    searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        performSearch();
    });

    function performSearch() {
        const searchTerm = searchInput.value.trim();
        const selectedType = searchType.value;

        if (searchTerm) {
            window.location.href = `movie-details.html?query=${encodeURIComponent(searchTerm)}&type=${selectedType}`;
        } else {
            alert('Lütfen bir arama terimi girin!');
        }
    }
});
