import axios from 'axios';

export const DEFAULT_PAGE = 1;
export let page = DEFAULT_PAGE;
export const perPage = 40;

export async function fetchImages(searchValue) {
  const searchParams = new URLSearchParams({
    key: '31994022-24f6d7612a194f8b404d57867',
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: perPage,
    page,
  });
  const images = await axios
    .get(`https://pixabay.com/api/?${searchParams}`)
    .then((page += 1));
  return images.data;
}

export function resetPage() {
  page = DEFAULT_PAGE;
}
