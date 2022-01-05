class SearchView {
    constructor() {
        this.setListener();
    }

    setListener() {
        $('#btn_advanced_settings_for_search').click(function() {
            if ($('#rb_search_mode_container').is(':visible')) $('#rb_search_mode_container').hide();
            else $('#rb_search_mode_container').show();
        });

        $("#rb_search_by_request").on("click", function() {
            $("#search_by_tags_container").hide();
            $("#autocomplete").show();
        });
        
        $("#rb_search_by_tags").on("click", function() {
            $("#autocomplete").hide();
            $("#search_by_tags_container").show();
        });

        $('#btn_search_by_tags').click(function() {
            this.searchByTags();
        });

        $('.input_field_plus_tags').keypress(function(event) {
            // Enter.
            if (event.keyCode == 13)  {
                event.preventDefault();
                $('.input_field_minus_tags').focus();
            }
        });
    
        $('.input_field_minus_tags').keypress((event) => {
            // Enter.
            if (event.keyCode == 13) {
                event.preventDefault();
                this.searchByTags();
            }
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

        $("#btn_clear_input_field_request").click(function(){
            $("#input_field_request")[0].focus();
        });
        
        $("#btn_accept_command").click(function(){
            $("#input_field_request")[0].focus();
        });
        
        
        $("#btn_voice_recognition").click(function(){
            $("#input_field_request")[0].focus();
        });
    }

    searchByTags() {
        console.log("search by tags");

        const input_field_plus_tags = $("#search_by_tags_container").find(".input_field_plus_tags");
        const user_plus_tags = input_field_plus_tags.val();

        const input_field_minus_tags = $("#search_by_tags_container").find(".input_field_minus_tags");
        const user_minus_tags = input_field_minus_tags.val();

        if ( ! user_plus_tags) return;

        // Show Action-Blocks by tags.

        // Get command text from input field and find possible search data.
        let actionBlocks_to_show = infoBlockModel.getByTags(user_plus_tags, user_minus_tags);
    
        console.log("actionBlocks_to_show", actionBlocks_to_show);

    
        if ( ! actionBlocks_to_show) {
            actionBlocks_to_show = [];
        }

        // Show infoBlocks separated by pages.
        infoBlockModel.infoBlocks_on_page = actionBlockController.showActionBlocks(actionBlocks_to_show);
    }

    focus() {
        // Focus on input field command.
        $('#input_field_request')[0].focus();
    }
}