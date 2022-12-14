export function imageCreate(images) {
  return images
    .map(
      image =>
        `<div class="gallery--card">
            <a href="${image.largeImageURL}">
              <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" 
              class="gallery--image" />
            </a>
            <div class="galery--info">
                <p class="galery--item">Likes ${image.likes}</p>
                <p class="galery--item">Views ${image.views}</p>
                <p class="galery--item">Comments ${image.comments}</p>
                <p class="galery--item">Downloads ${image.downloads}</p>
            </div>
        </div>`
    )
    .join('');
}
