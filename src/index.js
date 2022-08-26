import './css/styles.css';
import ImgApiService from './photos-api';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
searchForm.addEventListener('submit', onFormSubmit);

const imgApiService = new ImgApiService();
const options = {
  threshold: 0.2,
};
const newObserver = new IntersectionObserver(newObserverCallback, options);

function onFormSubmit(e) {
  e.preventDefault();

  gallery.innerHTML = '';
  imgApiService.query = e.currentTarget.elements.searchQuery.value;

  if (imgApiService.query === '') {
    return;
  }
  imgApiService.resetPage();
  imgApiService.getPhoto().then(data => {
    if (data.length === 0) {
      console.log(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    createMarkup(data);
  });
}

function createMarkup(photos) {
  const markup = photos
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <a href="${largeImageURL}"><div class="img-card"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="250" /></div>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div></a>
</div>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  const lastCard = document.querySelector('.photo-card:last-child');
  if (lastCard) {
    newObserver.observe(lastCard);
  }
}

function newObserverCallback(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      newObserver.unobserve(entry.target);

      imgApiService.getPhoto().then(data => {
        createMarkup(data);
      });
    }
  });
}
