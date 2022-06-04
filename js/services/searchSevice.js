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

    getTextFromMainInputField() {
        this.view.getTextFromMainInputField();
    }


    focusInputField() {
        this.view.focus();
    }
}