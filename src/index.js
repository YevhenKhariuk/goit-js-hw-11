import 'slim-select/dist/slimselect.css';
import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

async function init() {
  try {
    loader.classList.remove('hidden');
    const breeds = await fetchBreeds();
    const options = breeds.map(breed => ({
      value: breed.id,
      text: breed.name,
    }));
    new SlimSelect({
      select: breedSelect,
      data: options,
    });
  } catch (err) {
    error.classList.remove('hidden');
    Notiflix.Notify.Failure('Помилка: не вдалося завантажити породи котів');
  } finally {
    loader.classList.add('hidden');
  }
}

async function handleBreedSelect(event) {
  try {
    loader.classList.remove('hidden');
    const breedId = event.target.value;
    const catData = await fetchCatByBreed(breedId);
    error.classList.add('hidden');
    displayCatInfo(catData);
  } catch (err) {
    error.classList.remove('hidden');
    Notiflix.Notify.Failure('Помилка: не вдалося завантажити дані про кота');
  } finally {
    loader.classList.add('hidden');
  }
}

function displayCatInfo(catData) {
  catInfo.innerHTML = '';

  const img = document.createElement('img');
  img.src = catData.url;
  img.alt = catData.breeds[0].name;
  catInfo.appendChild(img);

  const textContainer = document.createElement('div');

  const name = document.createElement('h2');
  name.textContent = catData.breeds[0].name;
  textContainer.appendChild(name);

  const description = document.createElement('p');
  description.textContent = catData.breeds[0].description;
  textContainer.appendChild(description);

  const temperamentHeader = document.createElement('span');
  temperamentHeader.textContent = 'Temperament: ';
  temperamentHeader.style.fontWeight = 'bold';
  const temperament = document.createElement('span');
  temperament.textContent = catData.breeds[0].temperament;
  textContainer.appendChild(temperamentHeader);
  textContainer.appendChild(temperament);

  catInfo.appendChild(textContainer);
}

init();
breedSelect.addEventListener('change', handleBreedSelect);
