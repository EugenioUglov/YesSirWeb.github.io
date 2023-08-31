class HashController {
    constructor(hashService) {
        this.hashService = hashService;

        this.#setListeners();
    }

    
    #setListeners() {
        const that = this;

        window.onhashchange = function() {
            that.#onHashChanged();
        }
    }

    #onHashChanged() {
        this.hashService.handleHash();
    }
}