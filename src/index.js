import axios from 'axios';

const searchForm = document.getElementById('search-form');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

let page = 1;
let searchQuery = '';

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  searchQuery = e.target.searchQuery.value.trim();
  if (searchQuery) {
    performSearch();
  }
});

loadMoreBtn.addEventListener('click', () => {
  performSearch();
});

async function performSearch() {
  clearGallery();

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '37652334-f3be52d10db73a6ca4f17c1cd',
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });

    const { totalHits, hits } = response.data;

    if (hits.length === 0) {
      showNotification('No images found for your search query.');
      return;
    }

    appendImages(hits);

    if (hits.length >= totalHits) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
    }

    page++;
  } catch (error) {
    showNotification(
      'An error occurred while fetching images. Please try again later.'
    );
  }
}

function appendImages(images) {
  const fragment = document.createDocumentFragment();

  images.forEach(image => {
    const imageCard = document.createElement('div');
    imageCard.classList.add('photo-card');

    const imageElement = document.createElement('img');
    imageElement.src = image.webformatURL;
    imageElement.alt = image.tags;

    const infoContainer = document.createElement('div');
    infoContainer.classList.add('info');

    const views = document.createElement('div');
    views.classList.add('info-item');
    views.textContent = `Views: ${image.views}`;

    const downloads = document.createElement('div');
    downloads.classList.add('info-item');
    downloads.textContent = `Downloads: ${image.downloads}`;

    infoContainer.appendChild(views);
    infoContainer.appendChild(downloads);

    imageCard.appendChild(imageElement);
    imageCard.appendChild(infoContainer);

    fragment.appendChild(imageCard);
  });

  gallery.appendChild(fragment);
}

function clearGallery() {
  gallery.innerHTML = '';
}

function showNotification(message) {
  alert(message);
}
