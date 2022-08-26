import axios from 'axios';

export default class ImgApiService {
  constructor() {
    this.searchQuery = '';
    this.pageNum = 1;
  }
  async getPhoto() {
    try {
      const response = await axios
        .get(
          `https://pixabay.com/api/?key=29444023-fe7d4e5e60b2e765be0bef471&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.pageNum}&per_page=40`
        )
        .catch(function (error) {
          if (error.response) {
            console.log(
              "We're sorry, but you've reached the end of search results."
            );
          }
        });
      this.nextPage();
      const photos = response.data.hits;

      return photos;
    } catch (error) {}
  }
  nextPage() {
    this.pageNum += 1;
  }
  resetPage() {
    this.pageNum = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
