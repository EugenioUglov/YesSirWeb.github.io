class ActionBlockView {
    constructor(action_name_enum, content_type_description_by_action, action_description_by_action_name, fileManager, textManager, dropdownManager) {
        this.action_name_enum = action_name_enum;
        this.content_type_description_by_action = content_type_description_by_action;
        this.action_description_by_action_name = action_description_by_action_name;

        this.fileManager = fileManager;
        this.textManager = textManager; 
        this.dropdownManager = dropdownManager;
        
        this.#init();
        this.setEventListeners();
    }

    #init() {
        const dropdown_select_action_for_create_container =  $('#settings_action_block_container').find('.dropdown_select_action')[0];
        this.dropdownManager.setOptions(dropdown_select_action_for_create_container, this.action_description_by_action_name);
        let i_action = 0;
        const first_dropdown_item_text_for_create = dropdown_select_action_for_create_container[i_action].value;
        const content_type_description = this.content_type_description_by_action[first_dropdown_item_text_for_create];
    }

    addOnPage(id, actionBlock, parent_element = $('.actionBlocks_container').first(), isEditable = true) {
        if ( ! id) id = 'n';
        const actionBlock_html = this.#createHTMLContainerActionBlock(id, actionBlock, isEditable);

        // Add ActionBlock to parent element.
        parent_element.append(actionBlock_html);
        // Search for last actionBlock.
        const actionBlock_container = parent_element.children().last();

        return actionBlock_container;
    }

    updatePreview() {
        const actionBlock_preview = {
            title: $('#settings_action_block_container').find('.input_field_title')[0].value,
            imageURL: $('#settings_action_block_container').find('.input_field_image_URL')[0].value
        };
        
        // Set default values.
        $('#actionBlock-preview').find('.title')[0].innerText = '';
        $('#actionBlock-preview').find('.img').removeAttr('src');


        $('#actionBlock-preview').find('.title')[0].innerText = actionBlock_preview.title;
        
        if (actionBlock_preview.imageURL)
            $('#actionBlock-preview').find('.img').attr('src', actionBlock_preview.imageURL);
    }

    showActionBlocksContainer() {
        $('.actionBlocks_container').show();
        $('#welcome_page').hide();
        // Show search area with Info-Blocks.
        this.showPage();
        $('#fixed_btn_plus').css('visibility', 'visible');
    }

    hideActionBlocksContainer() {
        $('.actionBlocks_container').hide();
    }

    showSettingsToCreateActionBlock(action_name) {
        $('#btn_close').show();
        $('#elements_to_create_action-block').show();
        $('#settings_action_block_container').show();
        $('#btn_create_action-block').show();
        $('#btn_update_action-block').hide();
        $('#btn_delete_action-block').hide();
        $('#settings_action_block_container').find('.input_field_title')[0].focus();
        $('#btn_back').show();
        
        if (action_name) {
            const settings_action_block_container = $('#settings_action_block_container');
            settings_action_block_container.find('.dropdown_select_action').val(action_name);
            $('#title_action_descritption').text(this.content_type_description_by_action[action_name]);
        }
        
        this.updatePreview();
    }

    showElementsToUpdateActionBlock(actionBlock) {
        const settings_action_block_container = $('#settings_action_block_container');
        let action_name_of_actionBlock = actionBlock.action;
        if (action_name_of_actionBlock === 'showAlert') action_name_of_actionBlock = this.action_name_enum.showInfo;
        if (action_name_of_actionBlock === 'openUrl') action_name_of_actionBlock = this.action_name_enum.openURL;

        $('#btn_close').show();
        $('#elements_to_update_actionBlock').show();
        settings_action_block_container.show();
        $('#elements_for_delete_infoBlock').show();
        settings_action_block_container.find('.input_field_title')[0].focus();

        $('#btn_create_action-block').hide();
        $('#btn_update_action-block').show();
        $('#btn_delete_action-block').show();

        // Set value title.
        settings_action_block_container.find('.input_field_title')[0].value = actionBlock.title;
        
        let tags = '';

        // Set value tags
        for (const i_tag in actionBlock.tags) { 
            tags += actionBlock.tags[i_tag];
            if (i_tag < actionBlock.tags.length - 1) {
                tags += ', ';
            }
        }

        settings_action_block_container.find('.input_field_tags')[0].value = tags;

        // Set value dropdown.
        $('#settings_action_block_container').find('.type_action-block_container').show();
        settings_action_block_container.find('.dropdown_select_action').val(action_name_of_actionBlock);
        console.log('dropdown select action', settings_action_block_container.find('.dropdown_select_action').val());
        // DropDown to choose action of Action-Block hide.
        
        // Set value content.
        settings_action_block_container.find('.input_field_content')[0].value = actionBlock.content;
        
        // Set value image path.
        settings_action_block_container.find('.input_field_image_URL')[0].value = actionBlock.imageURL;
        
        if (settings_action_block_container.find('.input_field_image_URL')[0].value === 'undefined') {
            settings_action_block_container.find('.input_field_image_URL')[0].value = '';
        }

        const titles_elements = $('.title_actionBlock');

        for (const title_elem of titles_elements) {
            title_elem.innerText = actionBlock.title;
        }

        this.updatePreview();
        this.#onDropdownActionValueChange();
    }



    // showElementsForVoiceRecognitionManager() {
    //     $('#elements_for_voice_recognition_settings').show();
    // }

    showDataStorageSettings() {
        $('#elements_for_data_storage').show();
    }

    showElementsForFileManager() {
        $('#elements_for_file_manager').show();
    }

    onShowMainPage() {
        // Show button to add ActionBlock.
        $('#fixed_btn_plus').css('visibility', 'visible');
        $('#btn_create_default_ActionBlocks').hide();
    }

    onOpenMainPageWithoutActionBlocks() {
        this.hidePage();
        $('#welcome_page').show();
    }

    onOpenMainPageWithActionBlocks() {
        $('#welcome_page').hide();
        // Show search area with Info-Blocks.
        this.showPage();
    }

    updatePage() {
        $('#input_field_request')[0].value = '';
    }

    onPageContentChange() {
        const icon_plus = document.querySelector('.ico-btn');

        // Hide button to add ActionBlock.
        $('#fixed_btn_plus').css('visibility', 'hidden');
        this.hidePage();
        $('#btn_back').show();
    }

    showFixedBtnPlus() {
        $('#fixed_btn_plus').show();
    }

    hideFixedBtnPlus() {
        $('#fixed_btn_plus').hide();
    }

    onNoteExecuted() {
        // this.hidePage();
        $('#content_executed_from_actionBlock').show();
    }

    clear() {
        // Clear infoblocks.
        $('.actionBlocks_container')[0].innerHTML = '';
    }

    setEventListeners() {
        const that = this;

        $('#settings_action_block_container').find('.input_field_title').on('input', () => this.updatePreview());
        $('#settings_action_block_container').find('.input_field_image_URL').on('input', () => this.updatePreview());

        $('.btn_save').on('click', () => { $('#btn_back').hide(); });

        // On change value of dropdown to choose action.
        $('#settings_action_block_container').find('.dropdown_select_action')[0].onchange = function () {
            that.#onDropdownActionValueChange();
        };

        $('#dialog_upload_actionBloks_from_file').find('.btn_cancel')[0].addEventListener('click', function() {
        
        });
    }

    bindClickBtnCancelSettings(handler) {
        const btn_cancel_settings = $('#settings_action_block_container').find('#btn_cancel');

        btn_cancel_settings.on('click', () => { 
            this.closeSettings();
            handler();
        });
    }

    bindClickActionBlock(actionBlockClickHandler, settingsActionBlockClickHandler) {
        let is_mouse_enter_settings = false;

        const settings_container = $('.infoBlock').find('.settings');

        if (settings_container) {
            settings_container.mouseenter(function(){ is_mouse_enter_settings = true; });
            settings_container.mouseleave(function(){ is_mouse_enter_settings = false; });
            settings_container.on('click', onClickBtnSettings);

            function onClickBtnSettings(e) {
                var title = $(this).closest('.infoBlock').attr('value');
                settingsActionBlockClickHandler(title);
            }
        }
        
        // On click Action-Block.
        $('.infoBlock').on('click', function() {
            if (is_mouse_enter_settings) return false;
            // const title = $(this).attr('value');
            const title = $(this).text();
            
            actionBlockClickHandler(title);
        });
    }

    bindClickBtnRewriteActionBlocks(handler) {
        $('#dialog_upload_actionBloks_from_file').find('.btn_rewrite_actionBlocks')[0].addEventListener('click', function() {
            handler();
        });
    }

    bindClickBtnFixedPlus(handler) {
        $('#fixed_btn_plus').on('click', () => {
            $('#welcome_page').hide();
            $('#btn_scroll_up').hide();
            handler(); 
        });
    }

    /*
    bindClickBtnDownloadActionBlocks(handler) {
        $('#btn_download_actionBlocks')[0].addEventListener('click', () => {
            handler();
        });
    }
   

    bindUploadFileWithActionBlocks(handlerFileUploaded) {
        // On cLick button Upload file.
        $('#btn_upload_actionBlocks')[0].addEventListener('change', (event) => {
            this.fileManager.uploadFile(onFileLoaded);
        
            function onFileLoaded(content_of_file) {
                if (content_of_file === undefined) {
                    alert('Error! Data from the file has not been loaded');
                    return;
                }

                // Get actionBlocks from the file.
                let actionBlocks_from_file;
                
                try {
                    actionBlocks_from_file = JSON.parse(content_of_file);
                    console.log('file uploaded');
                    handlerFileUploaded(actionBlocks_from_file);
                }
                catch(error) {
                    alert('Content of file is not correct. File must contain an Action-Blocks data.');
                    console.log(error);
                    return;
                }
            }
        
            // Give possibility to load the same file again.
            $('#btn_upload_actionBlocks').value = '';
        });
    }
     */

    showListOfTypeActionBlocksToCreate() {
        $('#list_of_type_action-blocks_to_create').show();
    }

    hideListOfTypeActionBlocksToCreate() {
        $('#list_of_type_action-blocks_to_create').hide();
    }

    bindClickBtnSettingsToCreateNote(handler) {
        $('#btn_settings_to_create_note').on('click', () => {
            this.hideSettingsContainer();
            handler();
        });
    }

    bindClickBtnSettingsToCreateLink(handler) {
        $('#btn_settings_to_create_link').on('click', () => {
            this.hideSettingsContainer();
            handler();
        });
    }

    bindClickBtnSettingsToCreateFolder(handler) {
        $('#btn_settings_to_create_folder').on('click', () => {
            this.hideSettingsContainer();
            handler();
        });
    }

    bindClickBtnSettingsToCreateAdvancedActionBlock(handler) {
        $('#btn_settings_to_create_advanced_action-block').on('click', () => {
            // DropDown to choose action of Action-Block show.
            $('#settings_action_block_container').find('.type_action-block_container').show();
            $('#btn_create_default_ActionBlocks').show();
            handler();
        });
    }

    hideSettingsContainer() {
        $('#settings_action_block_container').find('.type_action-block_container').hide();
    }

    bindCreateActionBlock(handler) {
        $('#btn_create_action-block').on('click', () => {
            const settings_action_block_container = $('#settings_action_block_container');

            // Get title value.
            const input_field_title = settings_action_block_container.find('.input_field_title');
            const title = this.textManager.getTextInOneLine(input_field_title.val());
            
            
            if ( ! title) {
                alert('Impossible to create Action-Block. Title field is empty');
                return false;
            }
    
            // .Start tags.
            // Get tags values.
            let input_field_tags = settings_action_block_container.find('.input_field_tags')[0];
            let tags_from_field = input_field_tags.value;
            
    
            let title_without_symbols = title.replace(/[^a-zа-яё0-9\s]/gi, '');
    
            let tags_plus_title = '';
    
            if (tags_from_field) tags_plus_title += tags_from_field + ', ';
    
            // Add new tag getting text from title.
            tags_plus_title += title + ', ' + title_without_symbols;
            // .End tags.
    
    
    
            // Get action.
            //let selected_action = settings_action_block_container.find('.dropdown_select_action').find(':selected')[0];
            //let action_user_choose = selected_action.value;
    
            // infoBlockModel.action_for_new_actionBlock = $('.dropdown_select_action').find(':selected')[0].value;
            
            // if (infoBlockModel.action_for_new_actionBlock === undefined || infoBlockModel.action_for_new_actionBlock === null) {
            //     infoBlockModel.action_for_new_actionBlock = $('.dropdown_select_action').find(':selected')[0].value;
    
            //     if (infoBlockModel.action_for_new_actionBlock === undefined || infoBlockModel.action_for_new_actionBlock === null) {
            //         alert('Impossible to create command.\nProbably dropdown menu for action has been broken.');
            //     }
    
            //     return false;
            // }
    
            // Get content of action.
            const input_field_info_container = settings_action_block_container.find('.input_field_content');
            let content = input_field_info_container.val();
    
            if (content === '') {
                // infoBlockModel.action_for_new_actionBlock = action_name.showInfo;
                content = title;
                // alert('Impossible to create command. content field for action is empty');
                // return false;
            }
            
    
            //let input_field_action = settings_action_block_container.find('#input_field_action')[0];
    
            const input_field_image_URL_container = settings_action_block_container.find('.input_field_image_URL');
            const image_URL = input_field_image_URL_container.val();
    
            //console.log('title: " + input_field_title.value + " | tags: " + input_field_tags.value + " | action: " + action_user_choose + " | input_field_action: " + input_field_action.value + " | image path: " + image_URL.value);


            handler(title, tags_plus_title, content, image_URL);
        });
    }

    getUserAction() {
        return $('.dropdown_select_action').find(':selected')[0].value;
    }

    clearAllFields() {
        // Clear all fields.
        $('#settings_action_block_container').find('.resize_field').val('');
    }

    bindClickBtnCreateDefaultActionBlocks(handler) {
        $('#btn_create_default_ActionBlocks').on('click', () =>{
            this.closeSettings();
            handler();
        });
    }

    bindUpdateActionBlock(handler) {
        $('#btn_update_action-block').on('click', () => {
            // Get new title value.
            const input_field_title = $('#settings_action_block_container').find('.input_field_title');
            let title = input_field_title.val();
        
            if ( ! title) {
                alert('ERROR! Empty field for title');
                return;
            }
        
            // Get tags values
            const input_field_tags = $('#settings_action_block_container').find('.input_field_tags')[0];
            const tags_from_input_field = input_field_tags.value;
            let tags = tags_from_input_field;
        

        
            
        
            /*
            // Change all new lines to symbol ","
            let tags_without_new_line = tags_with_title.replaceAll('\n', ',');
            tags_without_new_line = tags_without_new_line.toLowerCase();
            tags = textManager.getArrayByText(tags_without_new_line);
            
        
            // Delete empty symbols from sides in text.
            for (const i_tag in tags) {
                tags[i_tag] = tags[i_tag].trim();
                console.log(tags[i_tag]);
            }
            console.log('tags array", tags);
        
            // Delete same tags.
            let tags_set = new Set(tags);
            console.log('tags_set", tags_set);
            
            tags = Array.from(tags_set);
            console.log('tags array from set", tags);
            */
        
            // Action.
            const dropdown_select_action_for_update = $('#settings_action_block_container').find('.dropdown_select_action');
            // Get selected action.
            const selected_action = dropdown_select_action_for_update.find(':selected')[0].value;

            if (selected_action === undefined || selected_action === null) {
                alert('Impossible to create command. Dropdown action_user_choose = undefined');
                return false;
            }
        
            // Get content.
            const input_field_info_container = $('#settings_action_block_container').find('.input_field_content');
            const content = input_field_info_container.val();
            
            if ( ! content) {
                alert('Impossible to create command. Action input field is empty');
                return false;
            }
        
        
            // Get image URL.
            const input_field_image_URL_container = $('#settings_action_block_container').find('.input_field_image_URL');
            const image_url = input_field_image_URL_container.val();

            handler(title, tags, selected_action, content, image_url);
        });
    }

    bindDeleteActionBlock(handler) {
        $('#btn_delete_action-block').on('click', () => {
            const title = $('#elements_to_update_actionBlock').find('.title_actionBlock')[0].innerText;
            handler(title);
        });
    }

    setDefaultValuesForSettingsElementsActionBlock() {
        const settings_action_block_container = $('#settings_action_block_container');
    
        // Get title value
        let input_field_title = settings_action_block_container.find('.input_field_title');
        input_field_title.val('');

        let input_field_info_container = settings_action_block_container.find('.input_field_content');
        input_field_info_container.val('');
        
        let input_field_tags = settings_action_block_container.find('.input_field_tags')[0];
        input_field_tags.value = '';
     
        
        let input_field_image_URL_container = settings_action_block_container.find('.input_field_image_URL');
        input_field_image_URL_container.val('');
    }

    closeSettings() {
        const elements_for_executed_actionBlock_array = document.getElementsByClassName('elements_for_executed_actionBlock');
    
        for (const elements_for_executed_actionBlock of elements_for_executed_actionBlock_array) {
            elements_for_executed_actionBlock.style.display = 'none';
        }
    
        this.setDefaultValuesForSettingsElementsActionBlock(); 
        // Clear executed content.
        $('#content_executed_from_actionBlock').hide();

        // Clear all input fields.
        this.clearAllFields();
    
        // Also close modal box (by standart logic of API).

        $('#btn_close').hide();
        $('#btn_back').hide();
    }

    isActionBlocksPageActive() {
        return $("#actionBlocks_page").is(":visible");
    }

    showAlert(content, title) {
        let dialog_info_elem = $('#dialog_info');
        $(".black_background").show();
        // Hide search area with Action-Blocks.
        this.hidePage();
    
        if (typeof dialog_info_elem[0].showModal === 'function') {
            dialog_info_elem[0].showModal();
    
            if (title) {
                // Set title of infoBlock.
                dialog_info_elem.find('.title')[0].innerText = title;
            }
    
            // Set content.
            dialog_info_elem.find('.text_info')[0].innerText = content;
    
            $(".black_background").show();
        } else {
            alert(content);
            console.log('WARNING! The <dialog> API is not supported by this browser');
        }
    }

    hidePage() {
        $('#actionBlocks_page').hide();
    }

    showPage() {
        $('#actionBlocks_page').show();
    }

    rotateFixedBtnPlus() {
        const icon_plus = document.querySelector('.ico-btn');
        icon_plus.classList.toggle('is-active');
    }


    #createHTMLContainerActionBlock = function(id, actionBlock, isEditable = true) {
        const title = actionBlock.title;
        const is_folder = actionBlock.action === this.action_name_enum.openFolder;
        let imageURL = actionBlock.imageURL;

        this.infoBlock_container;

        let title_html = '';

        if ( ! id) {
            console.log('ERROR! Id must be defined to create infoBlock'); 
            return;
        }

        if (title != undefined) {
            title_html = '<div class="title">' + title + '</div>';
        }

                
        let img_div_html = '';
        let folder_elem = '';
        let is_padding_top = false;
        const settings_html = '<div class="settings"><div class="icon"></div></div>';


        if (imageURL) {
            img_div_html = '<img class="img" src="' + imageURL + '">';
        }
        else {
            imageURL = '';
            img_div_html = '<img class="img">';
        }
        /*
        else {
            is_padding_top = true;
        }
        */

        if (is_folder)
        {
            folder_elem = '<div class="folder"></div>';
        }
        
        const id_html = 'infoBlock' + id; // title.replaceAll(' ', '_');

        let perspective_container_html = '<div id="' + id_html + '" class="perspective_img_effect_container">';
    
        let first_part_infoBlock_html = '';

        first_part_infoBlock_html = '<div id="' + id_html +  '" class="infoBlock" value="' + id + '">';

        // Set padding from settings button.
        /*
        if (is_padding_top) {
            first_part_infoBlock_html = '<div id="' + id_html +  '" class="infoBlock" style="padding-top:30px">';
        }
        else {
            first_part_infoBlock_html = '<div id="' + id_html +  '" class="infoBlock">';
        }
        */

        if (isEditable) {
            this.infoBlock_html = first_part_infoBlock_html + folder_elem + settings_html + img_div_html  + title_html +'</div>';
        }
        else {
            this.infoBlock_html = first_part_infoBlock_html + folder_elem + img_div_html  + title_html +'</div>';
        }

        return this.infoBlock_html;
    }

    #onDropdownActionValueChange() {
        let dropdown = $('#settings_action_block_container').find('.dropdown_select_action'); 
        const selected_action = dropdown.find(':selected')[0];
        $('#title_action_descritption').text(this.content_type_description_by_action[selected_action.value]);
    }
}