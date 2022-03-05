class AutocompleteController {
    constructor(textAlgorithm) {
        this.textAlgorithm = textAlgorithm;
        this.view = new AutocompleteView();
        this.init();
    }

    init() {


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
        
        function split(val) {
            return val.split( /,\s*/ );
        }
        function extractLast(term) {
            return split(term).pop();
        }

        // Autocomplete for input field with tags.
        input_field
        // don't navigate away from the field on tab when selecting an item.
        .on('keydown', function(event) {
            if (
                event.keyCode === 17 || 
                event.keyCode === 18 ||
                event.keyCode === 32
            ) {
                console.log('clicked', event.keyCode);
                return;    
            }

            if 
            (
                event.keyCode === $.ui.keyCode.TAB &&
                    $(this).autocomplete('instance').menu.active
            ) {
                console.log('autocomplete');
                event.preventDefault();
            }
        })
        .autocomplete({
            minLength: 0,
            source: function(request, response) {
                request.term = that.textAlgorithm.getLastWord(request.term);
                let tags_for_autocomplete = $.ui.autocomplete.filter(tags, extractLast(request.term));
                const i_first_tag = 0;
                const i_last_tag = 10;
                tags_for_autocomplete = tags_for_autocomplete.splice(i_first_tag, i_last_tag);

                // delegate back to autocomplete, but extract the last term.
                response(tags_for_autocomplete);
            },
            focus: function() {
                // prevent value inserted on focus.
                return false;
            },
            select: function(event, ui) {
                console.log('select', event);
                let text_from_input_field = this.value;
                // Delete spaces from the sides.
                text_from_input_field.trim();
                const last_index_space = text_from_input_field.lastIndexOf(' ');
                let last_index_symbol_separator = last_index_space;
                const text_from_last_index_space = text_from_input_field.substring(last_index_space + 1, text_from_input_field.length);
                const last_index_comma = text_from_last_index_space.lastIndexOf(',');

                if (last_index_comma >= 0) {
                    last_index_symbol_separator = text_from_input_field.lastIndexOf(',');
                }

                const text_from_input_field_wihout_last_word = text_from_input_field.substring(0, last_index_symbol_separator + 1);

                const selected_item_autocomplete = ui.item.value;
                this.value = text_from_input_field_wihout_last_word + selected_item_autocomplete;

                callbackSelect();

                return false;
            }
        });
    }
}