class DOMElementManager {
    #showed_elements = [];

    constructor() {

    }

    showElement(element_css_selector) {
        $(element_css_selector).show();
        this.#showed_elements.push(element_css_selector);
    }

    hideElement(element_css_selector) {
        const index = this.#showed_elements.indexOf(element_css_selector);
        
        if (index !== -1) {
            this.#showed_elements.splice(index, 1);
        }

        $(element_css_selector).hide();
    }

    hideShowedElements() {
        for (const element_css_selector of this.#showed_elements) {
            $(element_css_selector).hide();
        }
    }
}