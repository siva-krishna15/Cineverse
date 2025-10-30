const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const searchForm = document.querySelector('.searchbtn form');
const searchInput = document.getElementById('movie-search');

const moviesContainer = document.querySelector('.Area');

async function getMovies() {
    let allMovies = [];

    for (let page = 2; page <= 6; page++) {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
  const data = await response.json();
  allMovies = allMovies.concat(data.results);
    }
    showMovies(allMovies);
}

getMovies();

function showMovies(movies) {
  moviesContainer.innerHTML = '';
  
  movies.forEach(movie => {
    const {id, title, poster_path, release_date, vote_average } = movie;
    const year = release_date ? release_date.split('-')[0] : 'N/A';
    const imageSrc = poster_path ? IMG_URL + poster_path : '/no-image.jpg';
    
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.id = id;

    tile.innerHTML = `
      <div class="tmb">
        <img src="${imageSrc}" alt="${title}">
      </div>
      <p class="title">${title}</p>
      <p class="description">
        <span class="genre"> ${vote_average || 'N/A'} ⭐</span>
        <span class="year">${year}</span>
      </p>
    `;

    tile.addEventListener('click', () => {
      window.open(`movie.html?id=${id}`, '_blank');
    });

    moviesContainer.appendChild(tile);
  });
}

async function searchMovies(query) {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`);
    const data = await response.json();
    showMovies(data.results);
    

  const area = document.querySelector('.Area');
  let backBtn = document.querySelector('.back-button');

  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.classList.add('back-button');
    backBtn.textContent = '← Back to Home';
    backBtn.onclick = () => {
      window.location.href = 'index.html'; // back to home
    };
    area.prepend(backBtn);
  }
}

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();

    if (query) {
        searchMovies(query);
    } else {
        getMovies();
    }
});