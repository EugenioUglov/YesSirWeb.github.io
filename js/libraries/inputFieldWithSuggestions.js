class InputFieldWithSuggestions {
    #clickHandlerByOptionValue = {};
    

    create() {
        $('.inputFieldWithSuggestions').show();

        $(".inputFieldWithSuggestions").on('keyup', (e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
                if (this.#clickHandlerByOptionValue[$(".inputFieldWithSuggestions").val()] === undefined) {
                    return false;
                }

                this.#clickHandlerByOptionValue[$(".inputFieldWithSuggestions").val()]();
            }
        });
    }

    addOption({title, clickHandler}) {
        if (title === undefined) {
            throw new Error("Parameter title is not defined.");
        }

        if (clickHandler === undefined) {
            throw new Error("Parameter clickHandler is not defined.");
        }

        this.#clickHandlerByOptionValue[title] = clickHandler;

        const list = document.getElementById('searherOptions');

        let option = document.createElement('option');
        option.value = title;
        list.appendChild(option);
    }

    removeAllOptions() {
        this.#clickHandlerByOptionValue = {};

        const list = document.getElementById('searherOptions');
        list.innerHTML = '';
    }
}