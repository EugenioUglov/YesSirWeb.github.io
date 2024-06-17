class InputFieldWithSuggestions {
    #executeHandlerByOptionValue = {};
    #viewElement = {
        inputFieldWithSuggestionsClass: $('.inputFieldWithSuggestions'),
        searherOptionsId: 'searherOptions'
    };
    

    create() {
        this.#viewElement.inputFieldWithSuggestionsClass.show();

        this.#viewElement.inputFieldWithSuggestionsClass.on('keyup', (e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
                console.log(this.#executeHandlerByOptionValue);
                if (this.#executeHandlerByOptionValue[this.#viewElement.inputFieldWithSuggestionsClass.val()] === undefined) {
                    return false;
                }

                this.#executeHandlerByOptionValue[this.#viewElement.inputFieldWithSuggestionsClass.val()]();
            }
        });
    }

    addOption({title, executeHandler}) {
        if (title === undefined) {
            throw new Error("Parameter title is not defined.");
        }

        if (executeHandler === undefined) {
            throw new Error("Parameter executeHandler is not defined.");
        }

        this.#executeHandlerByOptionValue[title] = executeHandler;

        const list = document.getElementById(this.#viewElement.searherOptionsId);

        let option = document.createElement('option');
        option.value = title;
        list.appendChild(option);
    }

    setOptions({optionObjects: optionObjects}) {
        this.removeAllOptions();
        console.log(optionObjects);

        optionObjects.forEach(option => {
            this.addOption({title: option.title, executeHandler: option.executeHandler});
        });
    }

    removeAllOptions() {
        this.#executeHandlerByOptionValue = {};

        const list = document.getElementById(this.#viewElement.searherOptionsId);
        list.innerHTML = '';
    }
}