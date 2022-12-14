import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { imageCreate } from './imageCreate';
import { getRefs } from './refs';

const refs = getRefs();
const optionsSL = {
  overlayOpacity: 0.5,
  captionsData: 'alt',
  captionDelay: 250,
};

let simpleLightbox;

import { fetchImages, page, perPage, resetPage } from './imgAPI.js';

let searchValue = '';

refs.searchForm.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onNextImagesAdd);

async function onSearch(e) {
  e.preventDefault();
  searchValue = e.currentTarget.elements.searchQuery.value.trim();
  if (searchValue === '') {
    clearAll();
    buttonHidden();
    Notify.info('You cannot search by empty field, try again.');
    return;
  } else {
    try {
      resetPage();
      const result = await fetchImages(searchValue);
      if (result.hits < 1) {
        refs.searchForm.reset();
        clearAll();
        buttonHidden();
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        refs.searchForm.reset();
        refs.gallery.innerHTML = imageCreate(result.hits);
        simpleLightbox = new SimpleLightbox('.gallery a', optionsSL).refresh();
        buttonUnHidden();
        Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
      }
    } catch (error) {
      ifError();
    }
  }
}

async function onNextImagesAdd() {
  simpleLightbox.destroy();
  try {
    const result = await fetchImages(searchValue);
    const totalPages = page * perPage;
    if (result.totalHits <= totalPages) {
      Notiflix.Report.info(
        'Wow',
        "We're sorry, but you've reached the end of search results.",
        'Okay'
      );
      buttonHidden();
    }
    refs.gallery.insertAdjacentHTML('beforeend', imageCreate(result.hits));
    smothScroll();
    simpleLightbox = new SimpleLightbox('.gallery a', optionsSL).refresh();
  } catch (error) {
    ifError();
  }
}

function clearAll() {
  refs.gallery.innerHTML = '';
}

function buttonHidden() {
  refs.btnLoadMore.classList.add('hidden');
}

function buttonUnHidden() {
  refs.btnLoadMore.classList.remove('visually-hidden');
}

function ifError() {
  clearAll();
  buttonHidden();
  Notiflix.Report.info('Oh', 'Something get wrong, please try again', 'Okay');
}

function smothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery--card')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 3.9,
    behavior: 'smooth',
  });
}
