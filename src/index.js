import 'normalize.css';
import SearchImagesAPI from "./js/searchImagesAPI";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { createImageCart } from "./js/renderImageCard";


const gallery = document.querySelector(".gallery");
const simpleLightBox = new SimpleLightbox(".gallery a");
const form = document.querySelector(".search-form");
const loadMoreBtn = document.querySelector(".load-more");


const api = new SearchImagesAPI();

const slowScroll = () => {
	const { height: cardHeight } = document
		.querySelector('.gallery')
		.firstElementChild.getBoundingClientRect();

	window.scrollBy({
		top: cardHeight * 4,
		behavior: 'smooth',
	});
}


const onFormSubmit = (event) => {
	event.preventDefault();
	let request = form.elements.searchQuery.value.trim();
	if (request === "") {
		return Notify.failure("❌ Sorry, but you entered nothig. Please try again.");
	}
	api.changeSearchName(request)
	api.resetPage()
	gallery.innerHTML = "";
	api.getImages()
		.then(data => {
			Notify.success(`Hooray! We found ${data.totalHits} images.`);
			let cards = data.hits.reduce((markup, hit) => markup + createImageCart(hit), "");
			gallery.insertAdjacentHTML('beforeend', cards);
			loadMoreBtn.style.display = "inline-block"
			simpleLightBox.refresh();
		})
		.catch(() => {
			Notify.failure("❌ Sorry, there are no images matching your search query. Please try again.");
			loadMoreBtn.style.display = "none"
		})
}

const onClickLoadMore = (event) => {
	event.preventDefault();
	api.getImages()
		.then(data => {
			let cards = data.hits.reduce((markup, hit) => markup + createImageCart(hit), "");
			gallery.insertAdjacentHTML('beforeend', cards);
			simpleLightBox.refresh();
			slowScroll();
		})
		.catch(() => {
			Notify.failure("❌ We're sorry, but you've reached the end of search results.");
			loadMoreBtn.style.display = "none"
		})
}

form.addEventListener("submit", onFormSubmit);
loadMoreBtn.addEventListener("click", onClickLoadMore);
