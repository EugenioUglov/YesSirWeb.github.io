class SearchView {
    constructor() {
        this.#setEventListeners();
        this.#init();
    }



    #init() {
        // Set text gray in input field command.
        $('#input_field_request')[0].style.color = 'gray';
    }

    getTextFromMainInputField() {
        const user_phrase = $('#input_field_request')[0].value;
        return user_phrase;
    }

    setTextToInputField(text) {
        $('#input_field_request')[0].value = text;
    }

    getPlusTags() {
        const input_field_plus_tags = $("#search_by_tags_container").find(".input_field_plus_tags");
        const user_plus_tags = input_field_plus_tags.val();

        return user_plus_tags;
    }

    getMinusTags() {
        const input_field_minus_tags = $("#search_by_tags_container").find(".input_field_minus_tags");
        const user_minus_tags = input_field_minus_tags.val();

        return user_minus_tags;
    }

    setTextColorInInputField(new_color) {
        // Set color of text in input field command to black.
        $('#input_field_request')[0].style.color = new_color;
    }

    clear() {
        $('#input_field_request')[0].value = '';
    }

    focusInputFieldPlusTags() {
        $('.input_field_plus_tags').focus();
    }

    focusInputFieldMinusTags() {
        $('.input_field_minus_tags').focus();
    }

    bindClickBtnEnterRequest(handler) {
        // console.log('bindClickBtnEnterRequest');
        const that = this;
        $('#btn_accept_input_field_request').on('click', () => { 
            that.setTextColorInInputField('black'); 
            handler();
        });
    }
    
    bindClickBtnClearRequestField(handler) {
        $('#btn_clear_input_field_request').on('click', () => {
            handler();
            $("#input_field_request")[0].focus();
        });
    }

    bindKeyUpRequestField(handler) {
        // Execute a function when the user releases a key on the keyboard.
        $('#input_field_request').on('keyup', function(e) {
            const request = $('#input_field_request')[0].value;
            handler(request, e.keyCode);
        });
    }

    bindChangeInputRequestField(handler) {
        // Execute a function when the user releases a key on the keyboard.
        // $('#input_field_request').on('change keydown paste input', function(e) {
        $('#input_field_request').on('paste input', function(e) {
            const request = $('#input_field_request')[0].value;
            handler(request, e.keyCode);
        });
    }

    bindClickBtnSearchByTags(handler) {
        $('#btn_search_by_tags').click(() => {
            handler(this.getPlusTags(), this.getMinusTags());
        });

        // $('.input_field_minus_tags').keypress((event) => {
        //     // Enter.
        //     if (event.keyCode == 13) {
        //         event.preventDefault();
        //         handler(this.getPlusTags(), this.getMinusTags());
        //     }
        // });
    }


    bindKeypressInputFieldPlusTags(handler) {
        const that = this;

        $('.input_field_plus_tags').on('keyup', function(event) {
            if (event.keyCode == 13)  {
                event.preventDefault();
    
                // that.focusInputFieldMinusTags();
            }
            else {
                handler(event);
            }
        });
    }

    bindKeypressInputFieldMinusTags(handler) {
        const that = this;

        $('.input_field_minus_tags').on('keyup', function(event) {
            if (event.keyCode == 13)  {
                event.preventDefault();
    
                // that.focusInputFieldPlusTags();  
            }
            else {
                handler(event);
            }
        });
    }

    #setEventListeners() {
        const that = this;

        /*execute a function when someone writes in the text field:*/
        $('#input_field_request').on('input', function(e) {
            const lastCharacter = e.data;
            
            $('#input_field_request')[0].style.color = 'gray';
            return;
        });
        
        $('#btn_advanced_settings_for_search').click(function() {
            if ($('#advanced_settings').is(':visible')) {
                // console.log('#advanced_settings hide');
                $('#advanced_settings').hide();
            }
            else {
                // console.log('#advanced_settings show');
                $('#advanced_settings').show();
            }
        });

        $("#rb_search_by_request").on("click", function() {
            $("#search_by_tags_container").hide();
            $("#autocomplete").show();
        });
        
        $("#rb_search_by_tags").on("click", function() {
            $("#autocomplete").hide();
            $("#search_by_tags_container").show();
        });

        $("#input_field_request")[0].onfocus = () => {
            $("#autocomplete")[0].style.boxShadow = "0px 0px 5px 1px #4285f4"; 
            $("#autocomplete")[0].style.webkitBoxShadow =  "0px 0px 5px 2px #4285f4";
            $("#autocomplete")[0].style.mozBoxShadow = "0px 0px 5px 2px #4285f4";
        }
        
        $("#input_field_request").focusout(function(){
            $("#autocomplete")[0].style.boxShadow = null;
            $("#autocomplete")[0].webkitBoxShadow =  null;
            $("#autocomplete")[0].mozBoxShadow =  null;
        });

        $("#btn_accept_input_field_request").click(function(){
            $("#input_field_request")[0].focus();
        });
        
        $("#btn_voice_recognition").click(function(){
            $("#input_field_request")[0].focus();
        });

        // IF mouse over input field THEN set new title with text inside input field.
        /*
        $('#input_field_request')[0].addEventListener('mouseenter', function( event ) {
            $(this).attr('title', $('#input_field_request')[0].value);
        });
        */
    }

    focus() {
        // Focus on input field command.
        $('#input_field_request')[0].focus();            
        $('#input_field_request')[0].select();
        $('#input_field_request')[0].selectionStart = $('#input_field_request')[0].value.length;
    }
}