class AutocompleteView {
    constructor() {
        
    }

    bindApplyTags(handler) {
        const input_field_request = $('#input_field_request');
        const input_field_tags_on_setting_actionBlock = $('.input_field_tags');
        const input_field_plus_tags = $('#search_by_tags_container').find('.input_field_plus_tags');
        const input_field_minus_tags = $('#search_by_tags_container').find('.input_field_minus_tags');
    
        const input_fields_for_autocomplete = [input_field_request, input_field_tags_on_setting_actionBlock, 
            input_field_plus_tags, input_field_minus_tags];

        handler(input_fields_for_autocomplete);
    }
}