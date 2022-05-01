class PageController {
    constructor(pageService) {
        this.pageService = pageService;

        this.#setListeners();
    }



    #setListeners() {
        const that = this;

        window.onhashchange = function() {
            that.#onHashChanged();
        }
    }

    #onHashChanged() {
        this.pageService.handleHash();
    }
}
