class SearchSevice {
    constructor() {
        this.view = new SearchView();
    }

    clearInputField() {
        this.view.clear();
    }

    setTextToInputField(text) {
        this.view.setTextToInputField(text)
    }

    focusInputField() {
        this.view.focus();
    }
}