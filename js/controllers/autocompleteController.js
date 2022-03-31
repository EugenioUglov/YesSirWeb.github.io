class AutocompleteController {
    constructor(autocompleteService, textManager) {
        this.autocompleteService = autocompleteService;
        this.textManager = textManager;
        this.view = new AutocompleteView();
        this.#init();
    }

    #init() {

    }

    bindApplyTags(callbackSelect) {
        const that = this;

        /* Get tags */
        if ( ! localStorage['indexes_actionBlocks_by_tag']) {
            return;
        }

        const indexes_actionBlocks_by_tag = JSON.parse(localStorage['indexes_actionBlocks_by_tag']);
        const tags = Object.keys(indexes_actionBlocks_by_tag);
        
        this.view.bindApplyTags(applyTagsAutocompleteForInputFields);

        function applyTagsAutocompleteForInputFields(input_fields_for_autocomplete) {
            for (const input_field of input_fields_for_autocomplete) {
                that.applyTagsAutocomplete(input_field, tags, callbackSelect);
            }
        }
    }

    applyTagsAutocomplete(input_field, tags, callbackSelect) {
        const that = this;
        this.autocompleteService.applyTagsAutocomplete(input_field, tags, callbackSelect);
    }
}