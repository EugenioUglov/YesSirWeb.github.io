const last_site_version = 3;


window.addEventListener('load', function () {
    onStart();
});

function onStart() {
    $("#welcome_page").hide();
    
    const user_site_version = localStorage["siteVersion"];

    // Hide fixed buttons of show info panel.
    document.getElementById("fixed_elements_on_show_info").style.display = "none";
    // document.getElementById("accordions_with_settings").style.display = "none";
    const elements_for_executed_infoBlock_array = document.getElementsByClassName("elements_for_executed_infoBlock");

    for (const elements_for_executed_infoBlock of elements_for_executed_infoBlock_array) {
        elements_for_executed_infoBlock.style.display = "none";
    }
    
    // Set text gray in input field command.
    $("#input_field_request")[0].style.color = "gray";
    // Focus on input field command.
    $("#input_field_request")[0].focus();

    // Hide elements.
    blackBackgroundView.disable();
    $(".dots").hide();
    $(".page_control_elements").hide();
    $("#authorization_form").hide();
    $(".btn_speak_info").hide();
    $("#btn_scroll_up").hide();


    // IF in localStorage exists authorization user data THEN get infoObjects from DB. 
    if (siteSettingsModel.get().storage === STORAGE.database) {
        $("#rb_storage_db")[0].checked = true;
        rb_storage_db.onChecked();

        if (authorizationDataModel.get()) {
            const nickname = authorizationDataModel.get().nickname;
            const password = authorizationDataModel.get().password;
            
            $("#input_field_nickname")[0].value = nickname;
            $("#input_field_password")[0].value = password;

            
            label_help.innerText = "Connecting to the Database..";
            
            dbManager.authorization(nickname, password, onAuthorization);

            function onAuthorization(DB_responce) {
                console.log(DB_responce);
                label_help.innerText = "Waiting for responce from Database..";
                $("#autorization_log").text("Waiting for responce from Database..");
                $("#autorization_log").css("color", "gray");

                if (DB_responce) {
                    if (DB_responce.access) {
                        // Set text: authorization completed successfully.
                        $("#autorization_log").text("Authorization completed successfully for user: " + nickname);
                        $("#autorization_log").css("color", "green");

                        
                        label_help.innerText = "Database connection is completed successfully";

                        // Set authorization data to localStorage.
                        localStorage["authorization"] = '{"nickname" : "' + nickname + '" , "password" : "' + password + '" , "id" : "' + DB_responce.id + '" }';
                        
                        // Get data from DB.
                        getDataFromDatabase(onGetUserDataFromDB);



                        // Set infoObjects from DB
                        let data_to_show = infoBlockModel.getAll();
                        infoBlockModel.infoBlocks_on_page = infoBlockView.showInfoBlocksOnPages(data_to_show);
                        infoBlockModel.showed_infoObjects = data_to_show;

                        console.log("Authorization data", DB_responce);
                        $("#btn_authorization")[0].disabled = false;
                        window.scrollTo(pageXOffset, 0);
                        return;

                        function onGetUserDataFromDB(DB_responce) {
                            // Get user_data from DB field.
                        
                            console.log("dbData", DB_responce);
                        
                            // is_possible_get_infoObjects_from_DB
                            if (DB_responce) {
                                if (DB_responce["user_data"]) {
                                    let userDataFromDB;
                                    
                                    // IF data from DB parsed successfully THEN go next.
                                    try {
                                        userDataFromDB = JSON.parse(DB_responce["user_data"]);
                                    }
                                    catch {
                                        alert("ERROR!!! InfoObjects have not been loaded from DB. \nProbably infoOBjects data from DB are broken");
                                        return;
                                    }
                        
                        
                                    let infoObjects_from_DB = JSON.parse(userDataFromDB["infoObjects"]);
                                    
                                    console.log("infoObjects_from_DB", infoObjects_from_DB);
                                    console.log("infoObjects_from_localStorage", infoBlockModel.getAll());
                                    
                                    if (infoObjects_from_DB.length) {
                                        // IF data from DB and from localStorage is equal THEN return.
                                        if (JSON.stringify(infoObjects_from_DB) === JSON.stringify(infoBlockModel.getAll())) {

                                        }
                                        else {
                                            infoBlockModel.new_infoObjects_to_add = infoObjects_from_DB;
                                            dialogDatabaseView.show();
                                        }

                                        onGetInfoBlocksFromStorage();
                                        
                                        return;
                                    }
                                }
                            }
                            else {
                                infoBlockModel.saveToDatabase();
                            }
                            // IF data infoObjects weren't loaded from DB THEN set current infoObjects to DB.
                            infoBlockModel.saveToDatabase();
                        }

                        function getDataFromDatabase(onGetUserData) {
                            if ( ! authorizationDataModel.get()) {
                                return false;
                            }

                            let user_id = authorizationDataModel.get().id;
                            dbManager.getUserData(user_id, onGetUserDataFromDB);
                            
                            return true;
                        }
                    }
                }

                label_help.innerText = "Database connection is failed";
                $("#autorization_log").text("ERROR!!! Connection to DB is failed");
                $("#autorization_log").css("color", "red");
                $("#btn_authorization")[0].disabled = false;
            }
            
        }
    }
    else if (siteSettingsModel.get().storage === STORAGE.localStorage || 
        siteSettingsModel.get().storage == undefined) {
            let data_to_show = infoBlockModel.getAll();
            infoBlockModel.infoBlocks_on_page = infoBlockView.showInfoBlocksOnPages(data_to_show);
            infoBlockModel.showed_infoObjects = data_to_show;
            siteSettingsModel.set(STORAGE.localStorage);
            onGetInfoBlocksFromStorage();
    }


    // .START (Activate accordion)
    let acc = document.getElementsByClassName("accordion");

    for (let i = 0; i < acc.length; i++) {
        acc[i].onclick = function () {
            this.classList.toggle("active");
            this.nextElementSibling.classList.toggle("show");
        }
    }
    // .END (Activate accordion)


    /*

    // .START (Create "Update command accordion container")
    let dropdown_select_action_for_update = $("#settings_action_block_container").find(".dropdown_select_action");
    dropdown.setOptions(dropdown_select_action_for_update, ACTION_CONTEXT);
    let first_dropdown_item_text_for_update = dropdown_select_action_for_update[0][0].value;
    let text_info_container_for_update = ACTION_TARGETS[first_dropdown_item_text_for_update];
    let info_container_update = $("#settings_action_block_container").find(".action_description_container")[0];
    inputField.add(info_container_update, text_info_container_for_update);
    // .END (Create "Update command accordion container")
    */

    resizeContentDialogInfo();
    window.addEventListener('resize', onWindowResize);

    function onGetInfoBlocksFromStorage() {
        console.log("onGetInfoBlocksFromStorage");
        console.log("user_site_version: " + user_site_version);
        console.log("last_site_version: " + last_site_version);

        console.log("showed infoObjects", infoBlockModel.showed_infoObjects);
       
        if (infoBlockModel.showed_infoObjects) {
            if (infoBlockModel.showed_infoObjects.length > 0) {
                if (user_site_version != last_site_version) {
                    infoBlockView.updateDefaultInfoBlocks();
            
                    localStorage["siteVersion"] = last_site_version;
                    
                }
                
                applyTagsAutocomplete();
            }
            else {
                $("#search_area").hide();
                $("#welcome_page").show();
            }
        }
        else {
            $("#search_area").hide();
            $("#welcome_page").show();
        }
    }

    $('#btn_search_by_tags').click(function() {
        console.log("search by tags");

        const input_field_plus_tags = $("#search_by_tags_container").find(".input_field_plus_tags");
        const user_plus_tags = input_field_plus_tags.val();

        const input_field_minus_tags = $("#search_by_tags_container").find(".input_field_minus_tags");
        const user_minus_tags = input_field_minus_tags.val();

        if ( ! user_plus_tags) return;

        // Show Action-Blocks by tags.

        // Get command text from input field and find possible search data.
        infoObjects_to_show = infoBlockModel.getByTags(user_plus_tags, user_minus_tags);
    
        console.log("infoObjects_to_show", infoObjects_to_show);

    
        if ( ! infoObjects_to_show) {
            infoObjects_to_show = [];
        }

        // Show infoBlocks separated by pages.
        infoBlockModel.infoBlocks_on_page = infoBlockView.showInfoBlocksOnPages(infoObjects_to_show);
        
        infoBlockModel.showed_infoObjects = infoObjects_to_show;
    
        const isExecuteInfoBlockByTitle = false;

        if (isExecuteInfoBlockByTitle) {
            // IF infoObject has been found with the same title THEN execute action.
            for (infoObj of infoObjects_to_show) {
                if (textAlgorithms.isSame(infoObj.title, command)) {
                    infoBlockView.executeActionByObj(infoObj);
                    
                    break;
                }
            }
        }
    
    });

}


function onWindowResize() {
    resizeContentDialogInfo();
}

// Resize content in dialog info.
function resizeContentDialogInfo() {
    let width_dialog_info = $(".content").css("width");
    $(".dialog_content").css({
        "width": "250px"
    });
}


function applyTagsAutocomplete() {
    const indexes_infoObjects_by_tag = JSON.parse(localStorage["indexes_infoObjects_by_tag"]);
    const tags = Object.keys(indexes_infoObjects_by_tag);

    const input_field_request = $("#input_field_request");
    const input_field_tags_on_setting_actionBlock = $(".input_field_tags");
    const input_field_plus_tags = $('#search_by_tags_container').find('.input_field_plus_tags');
    const input_field_minus_tags = $('#search_by_tags_container').find('.input_field_minus_tags');
    

    input_fields_request = [input_field_request];
    input_fields_tags = [input_field_tags_on_setting_actionBlock, input_field_plus_tags, input_field_minus_tags];

    function split( val ) {
        return val.split( /,\s*/ );
    }
    function extractLast( term ) {
        return split( term ).pop();
    }

    for (const input_field_tags of input_fields_tags) {
        // Autocomplete for input field with tags
        input_field_tags
        // don't navigate away from the field on tab when selecting an item
        .on("keydown", function( event ) {
            if ( event.keyCode === $.ui.keyCode.TAB &&
            $( this ).autocomplete( "instance" ).menu.active ) {
                event.preventDefault();
            }
        })
        .autocomplete({
            minLength: 0,
            source: function( request, response ) {
                request.term = textAlgorithms.getLastWord(request.term);
                // delegate back to autocomplete, but extract the last term
                response( $.ui.autocomplete.filter(
                    tags, extractLast( request.term ) ) );
            },
            focus: function() {
            // prevent value inserted on focus
            return false;
            },
            select: function( event, ui ) {
            terms = split( this.value );
            var terms = this.value.split(',');
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push( " " + ui.item.value );
            // add placeholder to get the comma-and-space at the end
            //terms.push( "" );
            this.value = terms.join( "," );
            return false;
            }
        });
    }
      
    // Autocomplete with request.
    input_field_request
    // don't navigate away from the field on tab when selecting an item
    .on("keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
        $( this ).autocomplete( "instance" ).menu.active ) {
            event.preventDefault();
        }
    })
    .autocomplete({
        minLength: 0,
        source: function( request, response ) {
            request.term = textAlgorithms.getLastWord(request.term);
            // delegate back to autocomplete, but extract the last term
            response( $.ui.autocomplete.filter(
                tags, extractLast( request.term ) ) );
        },
        focus: function() {
        // prevent value inserted on focus
        return false;
        },
        select: function( event, ui ) {
        terms = split( this.value );
        var terms = this.value.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
        // remove the current input
        terms.pop();
        // add the selected item
        terms.push( ui.item.value );
        // add placeholder to get the comma-and-space at the end
        //terms.push( "" );
        this.value = terms.join( " " );
        return false;
        }
    });
    

    
}