class InputFieldWithSuggestions {
    #executeHandlerByOptionValue = {};
    

    create() {
        $('.inputFieldWithSuggestions').show();

        $(".inputFieldWithSuggestions").on('keyup', (e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
                console.log(this.#executeHandlerByOptionValue);
                if (this.#executeHandlerByOptionValue[$(".inputFieldWithSuggestions").val()] === undefined) {
                    return false;
                }

                this.#executeHandlerByOptionValue[$(".inputFieldWithSuggestions").val()]();
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

        const list = document.getElementById('searherOptions');

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

        const list = document.getElementById('searherOptions');
        list.innerHTML = '';
    }
}