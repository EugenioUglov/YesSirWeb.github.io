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
    $("#input_field_command")[0].style.color = "gray";
    // Focus on input field command.
    $("#input_field_command")[0].focus();

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
    let info_container_update = $("#settings_action_block_container").find(".info_container")[0];
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


