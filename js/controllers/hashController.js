class HashController {
    constructor(pageService) {
        this.pageService = pageService;

        this.#setListeners();
    }

    
    #setListeners() {
        const that = this;

        window.onhashchange = function() {
            console.log('hash changed');
            that.#onHashChanged();
        }
    }

    #onHashChanged() {
        this.pageService.handleHash();
    }
}