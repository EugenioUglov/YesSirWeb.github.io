class AutocompleteView {
    constructor(controller) {
        this.controller = controller;
        this.setListeners();
    }

    setListeners() {
        const indexes_actionBlocks_by_tag = JSON.parse(localStorage['indexes_infoObjects_by_tag']);
        let tags = Object.keys(indexes_actionBlocks_by_tag);

        const input_field_request = $('#input_field_request');
        const input_field_tags_on_setting_actionBlock = $('.input_field_tags');
        const input_field_plus_tags = $('#search_by_tags_container').find('.input_field_plus_tags');
        const input_field_minus_tags = $('#search_by_tags_container').find('.input_field_minus_tags');
    
        const input_fields_for_autocomplete = [input_field_request, input_field_tags_on_setting_actionBlock, 
            input_field_plus_tags, input_field_minus_tags];

        for (const input_field of input_fields_for_autocomplete) {
            this.controller.applyTagsAutocomplete(input_field, tags);
        }
    }

}