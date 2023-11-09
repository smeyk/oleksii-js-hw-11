import axios from "axios";

export default class SearchImagesAPI {
	constructor() {
		this.baseURL = "https://pixabay.com/api/";
		this.apiKey = "40459099-8508bb33dcb1298bac83d73fe";
		this.searchName = "";
		this.imageType = "photo";
		this.orientation = "horizontal";
		this.safesearch = true;
		this.page = 1;
		this.perPage = 40;
		this.totalPages = 0;
	}
	getImages() {
		const url = `${this.baseURL}?key=${this.apiKey}&q=${this.searchName}&image_type=${this.imageType}&orientation=${this.orientation}&safesearch=${this.safesearch}&page=${this.page}&per_page=${this.perPage}`

		return axios.get(url)
			.then(response => {
				if (response.status !== 200 || response.data.hits.length === 0) {
					throw new Error(response.data.error);
				}
				this.nextPage();
				return response.data;
			})

	}
	nextPage() {
		this.page += 1;
	}
	resetPage() {
		this.page = 1;
	}
	get changeSearchName() {
		return this.searchName;
	}
	set changeSearchName(name) {
		this.searchName = name;
	}
}

