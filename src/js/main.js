import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { imageCreate } from './imageCreate';
import { getRefs } from './refs';
import { fetchImages, page, perPage, resetPage } from './imgAPI.js';

const refs = getRefs();

const optionsSL = {
  overlayOpacity: 0.5,
  captionsData: 'alt',
  captionDelay: 250,
};

let gallery = new SimpleLightbox('.gallery a', optionsSL);
gallery.on('show.simplelightbox');

let searchValue = '';

refs.searchForm.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onNextImagesAdd);

async function onSearch(e) {
  e.preventDefault();
  searchValue = e.currentTarget.elements.searchQuery.value.trim();
  if (searchValue === '') {
    refs.searchForm.reset();
    clearAll();
    buttonHidden();
    messageEmpty();
    return;
  } else {
    try {
      resetPage();
      const result = await fetchImages(searchValue);
      if (result.hits < 1) {
        refs.searchForm.reset();
        clearAll();
        buttonHidden();
        messageFailure();
      } else {
        refs.searchForm.reset();
        refs.gallery.innerHTML = imageCreate(result.hits);
        gallery.refresh();
        buttonUnHidden();
        Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
      }
    } catch (error) {
      ifError();
    }
  }
}

async function onNextImagesAdd() {
  try {
    const result = await fetchImages(searchValue);
    const totalPages = page * perPage;
    if (result.totalHits <= totalPages) {
      buttonHidden();
      messageEndResalts();
    }
    refs.gallery.insertAdjacentHTML('beforeend', imageCreate(result.hits));
    smothScroll();
    gallery.refresh();
  } catch (error) {
    ifError();
  }
}

function clearAll() {
  refs.gallery.innerHTML = '';
}

function buttonHidden() {
  refs.btnLoadMore.classList.add('visually-hidden');
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

function messageEmpty() {
  Notiflix.Report.info(
    'Wow',
    "We're sorry, but you cannot search by empty field.",
    'Try again'
  );
}

function messageFailure() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function messageEndResalts() {
  Notiflix.Report.info(
    'Wow',
    "We're sorry, but you've reached the end of search results.",
    'Okay'
  );
}
