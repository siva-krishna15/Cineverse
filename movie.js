
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const container = document.querySelector('.movieabout');

const params = new URLSearchParams(window.location.search);
const movieId = params.get('id');

async function getMovieDetails() {
  if (!movieId) {
    container.innerHTML = '<p>Movie not found!</p>';
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
    const movie = await response.json();
    showMovieDetails(movie);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    container.innerHTML = '<p>Error loading movie details.</p>';
  }
}

function showMovieDetails(movie) {
  const {
    title,
    poster_path,
    overview,
    release_date,
    vote_average,
    genres,
    tagline,
    runtime
  } = movie;

  const year = release_date ? release_date.split('-')[0] : 'N/A';
  const imageSrc = poster_path ? IMG_URL + poster_path : '/no-image.jpg';
  const genreNames = genres.map(g => g.name).join(', ');

  container.innerHTML = `
    <div class="poster">
      <img src="${imageSrc}" alt="${title}">
    </div>
    <div class="details">
    <button class="back-button" onclick="goBack()"> ← Back to Home </button>
      <p class="moviename"><strong>${title}</strong> (${year})</p>
      <p class="movierating">⭐ ${vote_average || 'N/A'}</p>
      <p class="overview">${overview || 'No overview available.'}</p>
      <p class="genre"><strong>Genre:</strong> ${genreNames}</p>
      <p class="runtime"><strong>Runtime:</strong> ${runtime} mins</p>
      <p class="tagline"><em>${tagline || ''}</em></p>
      <div id="ott-availability" class="ott-section"></div>
    </div>
  `;
  getOTT(movie.id);
}

getMovieDetails();


function goBack() {
  window.location.href = 'index.html';
}

async function getOTT(movieId) {
  try {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`);
    const data = await res.json();

    const ott = document.getElementById('ott-availability');
    const india = data.results && data.results.IN;

    if (india && india.flatrate && india.flatrate.length > 0) {
      const providers = india.flatrate.map(p => p.provider_name).join(', ');
      ott.innerHTML = `<p><strong>Available On:</strong> ${providers}</p>`;
    } else {
      ott.innerHTML = `<p><strong>Available On:</strong> Not available on any OTT right now.</p>`;
    }

  } catch (err) {
    console.error(err);
    document.getElementById('ott-info').innerHTML = `<p>Error loading OTT info.</p>`;
  }
}
