import axios from 'axios';
import * as notiflix from 'notiflix';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';
let page = 1;
const perPage = 40;
let totalHits = 0;

searchForm.addEventListener('submit', handleFormSubmit);
loadMoreBtn.addEventListener('click', fetchNextPage);

async function handleFormSubmit(event) {
  event.preventDefault();
  searchQuery = event.target.elements.searchQuery.value.trim();
  if (searchQuery === '') {
    return;
  }

  page = 1; // Reset the page number
  gallery.innerHTML = ''; // Clear the gallery
  loadMoreBtn.style.display = 'none'; // Hide the load more button
  fetchImages();
}

async function fetchImages() {
  try {
    const apiKey = '37652334-f3be52d10db73a6ca4f17c1cd'; // Replace with your actual API key
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

    const response = await axios.get(url);
    const { hits, totalHits: newTotalHits } = response.data;

    totalHits = newTotalHits;

    if (hits.length === 0) {
      notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    renderImages(hits);
    page++;

    if (page > 1) {
      loadMoreBtn.style.display = 'block';
    }

    if (hits.length < perPage || page * perPage >= totalHits) {
      loadMoreBtn.style.display = 'none';
      notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
    notiflix.Notify.failure(
      'An error occurred while fetching images. Please try again later.'
    );
  }
}

async function fetchNextPage() {
  loadMoreBtn.style.display = 'none'; // Hide the load more button
  await fetchImages();
}

function renderImages(images) {
  const imageCards = images.map(image => createImageCard(image));
  gallery.innerHTML += imageCards.join('');
}

function createImageCard(image) {
  return `
    <div class="photo-card">
      <a href="${image.largeImageURL}" data-lightbox="gallery">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Tags:</b> ${image.tags}
        </p>
        <p class="info-item">
          <b>Likes:</b> ${image.likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${image.views}
        </p>
      </div>
    </div>
  `;
}
