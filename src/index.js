import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
let searchQuery = '';
let page = 1;
const perPage = 40;
let totalHits = 0;
let lightbox;
let isLoading = false;

searchForm.addEventListener('submit', handleFormSubmit);

async function handleFormSubmit(event) {
  event.preventDefault();
  searchQuery = event.target.elements.searchQuery.value.trim();
  if (searchQuery === '') {
    return;
  }

  page = 1; // Reset the page number
  gallery.innerHTML = ''; // Clear the gallery
  const response = await fetchImages();

  if (response) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  } else {
    showNoImagesMessage();
  }
}

async function fetchImages() {
  try {
    if (isLoading) {
      return false;
    }

    isLoading = true;

    const apiKey = '37652334-f3be52d10db73a6ca4f17c1cd'; // Replace with your actual API key
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

    const response = await axios.get(url);
    const { hits, totalHits: newTotalHits } = response.data;

    totalHits = newTotalHits; // Update the totalHits count

    if (page === 1 && hits.length > 0) {
      renderImages(hits);
      page++;
      // Refresh the lightbox
      lightbox.refresh();
      if (totalHits > perPage * (page - 1)) {
        showLoader();
        isLoading = false;
      } else {
        hideLoader();
      }
      return true;
    } else if (page > 1 && hits.length > 0) {
      renderImages(hits);
      page++;
      if (totalHits > perPage * (page - 1)) {
        showLoader();
        isLoading = false;
      } else {
        hideLoader();
      }
      return true;
    } else {
      hideLoader();
      return false;
    }
  } catch (error) {
    console.log(error);
    hideLoader();
    // Handle the error
    return false;
  }
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

// Initialize the lightbox
document.addEventListener('DOMContentLoaded', () => {
  lightbox = new SimpleLightbox('.gallery a', {
    animationSpeed: 300,
    captions: true,
    captionSelector: 'p.info-item',
  });
});

// Infinite scrolling
window.addEventListener('scroll', () => {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    if (totalHits > perPage * (page - 1) && !isLoading) {
      fetchImages();
    }
  }
});

// Smooth scroll after form submission
searchForm.addEventListener('submit', () => {
  window.scroll({
    top: gallery.offsetTop,
    behavior: 'smooth',
  });
});

function showLoader() {
  const loader = document.createElement('div');
  loader.classList.add('loader');
  gallery.appendChild(loader);
}

function hideLoader() {
  const loader = document.querySelector('.loader');
  if (loader) {
    gallery.removeChild(loader);
  }
}

function showNoImagesMessage() {
  Notiflix.Notify.failure('No images found.');
}

// Override Notiflix styles for "No images found" message
const customStyles = document.createElement('style');
customStyles.innerHTML = `
  .notiflix-info {
    background-color: red;
    color: white;
  }
`;
document.head.appendChild(customStyles);
