class PageView {
    constructor() {

    }

    #showed_elements = [];

    showElement(element) {
        element.show();
        this.#showed_elements.push(element);
    }

    hideShowedElements() {
        console.log('hide elements', this.#showed_elements);
        this.#showed_elements.forEach(element => element.hide());
        this.#showed_elements = [];
    }
}