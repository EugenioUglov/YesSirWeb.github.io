class ActionBlockController {
    constructor(dbManager) {
        this.model = new ActionBlockModel(dbManager);
        this.view = new ActionBlockView(this);
        this.setListeners();
    }
    
    updatePreview() {
        this.view.updatePreview();
    }



    /*
    infoBlocks_area.infoBlocks.createByInfoObjects = function(actionBlocks) {
        // Clear container for ActionBlocks.
        $('.actionBlocks_container')[0].innerHTML = '';
    
        console.log('actionBlocks', actionBlocks);
    
        if ( ! actionBlocks) return;
    
        for (const i_obj in actionBlocks) {
            const infoObj_curr = actionBlocks[i_obj];
            const id_number = parseInt(i_obj) + 1;
            
    
            actionBlockController.showActionBlock(id_number, infoObj_curr);
        }
    }
    */




    getActionBlocks() {
        return this.model.actionBlocks;
    }

    getActionBlocksOnPage() {
        return this.model.infoBlocks_on_page;
    }
    


    getActionBlocksFromLocalStorage() {
        return this.model.getActionBlocksFromLocalStorage();
    }
    

    createActionBlock(title, tags, action, info, image_path, isEditable = true) {
        tags = getNormalizedTags(tags);
    
        const action_block =
        {
            title: title,
            tags: tags,
            action: action,
            info: info,
            imagePath: image_path,
            isEditable: isEditable
        };
    
        this.model.add(action_block);

        this.onUpdate();
    
        return true;
    
        function getNormalizedTags(tags) {
            let normalizedTags;
        
            // Change all new lines to symbol ',".
            const tags_without_new_line = tags.replaceAll('\n', ',');
            //tags_lower_case = tags_without_new_line.toLowerCase();
        
            let tags_array = textAlgorithm.getArrayByText(tags_without_new_line);
            
            // Delete empty symbols from sides in text.
            for (const i_tag in tags_array) {
                tags_array[i_tag] = tags_array[i_tag].trim();
            }
        
            // Delete same tags.
            const tags_set = new Set(tags_array);
        
            normalizedTags = Array.from(tags_set);
        
            return normalizedTags;
        }
    }



    createDefaultActionBlocks() {
        const actionBlocks_to_create = infoBlockModel.getDefaultActionBlocks();

        actionBlocks_to_create.forEach(infoBlock => {
                console.log(infoBlock.title + ' created');
                this.createActionBlock(infoBlock.title, infoBlock.tags, infoBlock.action, infoBlock.info, 
                    infoBlock.imagePath, infoBlock.isEditable);
            }
        );
    }

    updateActionBlock() {
        const original_title = this.model.title_infoBlock_before_update;
    
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
    
        if (original_title != title) {
            // Add new tag getting text from title
    
            let title_without_symbols = title.replace(/[^a-zа-яё0-9\s]/gi, '');
            
    
            if (tags) tags = tags + ", ";
            
            // Add new tag getting text from title.
            tags += title + ", " + title_without_symbols;
        }
    
        
    
        /*
        // Change all new lines to symbol ","
        let tags_without_new_line = tags_with_title.replaceAll('\n', ',');
        tags_without_new_line = tags_without_new_line.toLowerCase();
        tags = textAlgorithm.getArrayByText(tags_without_new_line);
        
    
        // Delete empty symbols from sides in text.
        for (i_tag in tags) {
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
      
        // Get info.
        const input_field_info_container = $('#settings_action_block_container').find('.input_field_action_description');
        const info = input_field_info_container.val();
        
        if ( ! info) {
            alert('Impossible to create command. Action input field is empty');
            return false;
        }
      
      
        //let input_field_action = $('#settings_action_block_container').find('#input_field_action')[0];
      
        // Get image path
        const input_field_image_path_container = $('#settings_action_block_container').find('.input_field_image_path');
        const image_path = input_field_image_path_container.val();
      
       
        const index_of_title = infoBlockModel.getIndexByTitle(title);
        let is_obj_exists_in_infoObjects = false;
        if (index_of_title >= 0) {
            is_obj_exists_in_infoObjects = true;
        }
        console.log('is title exist: '  + is_obj_exists_in_infoObjects + ' | original: ' + original_title + ' | title: ' + title);
    
        if (is_obj_exists_in_infoObjects && original_title != title) {
            alert('Info already exists with title: ' + title);
            return;
        }
    
        const is_deleted_obj = infoBlockModel.deleteInfoObjByTitle(original_title);
        if ( ! is_deleted_obj) {
            alert('ERROR! Info container weren\'t delete');
            return;
        }
        
    
        const isInfoBlockCreated = this.createActionBlock(title, tags, selected_action, info, image_path);
    
        if ( ! isInfoBlockCreated) return;
    
        setDefaultValuesForSettingsElementsActionBlock();
        
        
        //clearContentInContainer($('#text_info_obj_create')[0]);
        //$('<br><div align='left'>" + "Result created info object:" + "</div>').appendTo($('#text_info_obj_create')[0]);
        //$('<div>" + JSON.stringify(infoObj_new) + "</div>').appendTo($('#text_info_obj_create')[0]);
    
        this.onUpdate();
        infoPageView.close();
    }
    
    updateDefaultInfoBlocks() {
        const isShowAlertOnError = false;

        let actionBlocks_to_create = infoBlockModel.getDefaultActionBlocks();

        // Delete previous default InfoBlocks.
        for (const infoBlock_to_delete of actionBlocks_to_create) {
            // Update site.
            infoBlockModel.deleteInfoObjByTitle(infoBlock_to_delete.title, isShowAlertOnError);
        }
        
        // Create default Info-Blocks.
        actionBlockController.createDefaultActionBlocks();
    }

    save(actionBlocks) {
        this.model.save(actionBlocks);

        return true;
    }
    
    deleteAll() {
        infoBlockModel.deleteAll();
        infoBlockModel.new_infoObjects_to_add = '';

        this.onUpdate();
    }

    onClickBtnDeleteAll() {
        const text_confirm_window = 'Are you sure you want to delete ALL commands?' + '\n'+
            '* It\'s recommended to download the commands first to save all created information';
    
        function onClickOkConfirm() {
            this.deleteAll();

            return;
        }
        function onClickCancelConfirm() {
          return;
        }
      
        dialogWindow.confirmAlert(text_confirm_window, onClickOkConfirm, onClickCancelConfirm);
    }

    executeActionBlock(actionBlock) {
        let obj = actionBlock;
        let action_name_of_actionBlock = obj.action;
        let action_info = obj.info;
    
    
        if (action_name_of_actionBlock === 'showAlert') action_name_of_actionBlock = action_name.showInfo;
        console.log('Im', action_name);
        console.log('IMust be', action_name.showInfo);
    
        if (action_name_of_actionBlock === action_name.openUrl) {
            openUrl(action_info);
        }
        // Action alertInfo must to include info option.
        else if (action_name_of_actionBlock === action_name.showInfo) {
            $('#btn_back_main').show();
            this.onPageContentChange();

            const isHTML = false;
            showInfo(action_info, obj.title, isHTML);
            
            
            const text_to_speak = action_info;

            const event = {
                name: 'executeActionBlock',
                data: text_to_speak
            };

            // Subject.
            observable.dispatchEvent(event.name, event.data);

            $('.btn_speak').show();
            $('#info_page_from_executed_action-block_container').show();
        }
        else if (action_name_of_actionBlock === action_name.showHTML) {
            $('#btn_back_main').show();
            this.onPageContentChange();
            const isHTML = true;
            showInfo(action_info, obj.title, isHTML);
            $('#info_page_from_executed_action-block_container').show();
        }
        else if (action_name_of_actionBlock === action_name.openFolder) {
            //console.log('open folder from infoblock');
            actionBlockController.openFolder(obj, action_info);
        }
        else if (action_name_of_actionBlock === action_name.createInfoBlock) {
            $('#btn_back_main').show();
            this.view.showElementsToCreateInfoBlock();
            this.onPageContentChange();
        }
        else if (action_name_of_actionBlock === action_name.showFileManager) {
            $('#btn_back_main').show();
            this.showElementsForFileManager();
        }
        else if (action_name_of_actionBlock === action_name.showDataStorageManager) {
            $('#btn_back_main').show();
            this.showElementsForDataStorageManager();
        }
        else if (action_name_of_actionBlock === action_name.showElementsForVoiceRecognitionManager) {
            $('#btn_back_main').show();
            this.showElementsForVoiceRecognitionManager();
        }
        else if (action_name_of_actionBlock === action_name.showLogs) {
            $('#btn_back_main').show();
            this.showLogs();
        }
        else {
            console.log('ERROR!!! Action of infoObj doesn\'t exist. action_name: ', action_name_of_actionBlock);
        }
    }
    
    onClickFixedBtnPlus() {
        if (isMenuCreateTypeActionBlockOpen) {
            $('#list_of_type_action-blocks_to_create').hide();
        }
        else {
            $('#list_of_type_action-blocks_to_create').show();
        }
    
        console.log(this);
        this.view.fixed_btn_plus.rotateIcon();
        isMenuCreateTypeActionBlockOpen = ! isMenuCreateTypeActionBlockOpen;
    }

    showActionBlocks(infoBlocks_to_show) {
        $('.icon_spinner').show();
        $('.actionBlocks_container').hide();
        console.log('hide');
        
        this.model.updateIndexes();
        
        // IF infoBLocks in parameter THEN return emty array.
        if ( ! infoBlocks_to_show) {
            return [];
        }
        else if (Array.isArray(infoBlocks_to_show) === false) {
            infoBlocks_to_show = [infoBlocks_to_show];
        }
        
        console.log('infoBlocks_to_show', infoBlocks_to_show);
    
        const data_storage = STORAGE[siteSettingsModel.get().storage];
        let data_storage_for_label_help = '';
    
        if (data_storage === STORAGE.database) {
            data_storage_for_label_help = 'database';
        }
        else {
            data_storage_for_label_help = 'browser';
        }
        
    
        label_help.innerText = 'Found ' + infoBlocks_to_show.length + ' results | ' 
            + 'Saved in ' + data_storage_for_label_help + ' storage';  
    
        this.clearInfoBlocksArea();
    
        infoBlocks_area.page_curr = 1;
        const max_count_pages_infoBlocks_on_page = 12;
        const infoBlocks_on_page = {}; 
       
        let i_infoBlock_container = 0;
        infoBlocks_on_page[i_infoBlock_container] = [];
        let number_infoBlock_curr = 0;
    
    
        // Push infoObjects to array sepparate by pages.
        for (const i_obj in infoBlocks_to_show) {
            this.showActionBlock(i_obj, infoBlocks_to_show[i_obj]);
            continue;
            infoBlocks_on_page[i_infoBlock_container].push(infoBlocks_to_show[i_obj]);
            number_infoBlock_curr = Number(i_obj) + 1;
            //console.log(number_infoBlock_curr + "%" + max_count_pages_infoBlocks_on_page, infoBlocks_to_show[i_obj]);
    

            if ((number_infoBlock_curr != infoBlocks_to_show.length) && (number_infoBlock_curr % max_count_pages_infoBlocks_on_page === 0)) {
                console.log('!!!');
                //console.log(i_obj);
                i_infoBlock_container++;
                infoBlocks_on_page[i_infoBlock_container] = [];
                
                let page_curr_for_infoBlock_containers = i_infoBlock_container + 1;
                //console.log(page_curr_for_infoBlock_containers);
    
                /*
                // Show dots.
                if ($('.dots').is(':hidden')) {
                    let page_first = 1;
                    showPageDots(page_first);
                    let dot_to_active = $('.dots')[0].children[0];
                    dot_to_active.className += " active";
    
                    $('.dots').show();
                }
                */
                // .START - Show arrows.
                if ($('.page_control_elements').is(':hidden')) {
                    $('.page_control_elements').show();
                }
                // .END - Show arrows.
                
                // showPageDots(page_curr_for_infoBlock_containers);
                console.log('Action-Block to show', infoBlocks_to_show[i_obj]);
                
            }
            
        }
        
        const count_pages = Object.keys(infoBlocks_on_page).length;
        this.model.count_pages = count_pages;

        if (count_pages > 1) {
            // Set text number of page.
            const current_page = 1;
            setNumberPage(current_page, count_pages);
        }
    
        this.model.infoBlocks_on_page = infoBlocks_on_page[0];
        infoBlockModel.infoBlocks_on_page = infoBlocks_on_page;
        
        
        $('.icon_spinner').hide();
        $('.actionBlocks_container').show();
        console.log('show');
    
        return infoBlocks_on_page;
    }

    showActionBlock(id, actionBlock) {
        const actionBlock_html = this.view.addOnPage(id, actionBlock);
        this.setListenerForActionBlock(actionBlock, actionBlock_html);
    }

    showActionBlocksFromStorageAsync() {
        $('.icon_spinner').show();
        $('.actionBlocks_container').hide();

        const that = this;
        this.model.getActionBlocksFromStorageAsync(onGetCallback);

        function onGetCallback(actionBlocks_from_DB) {
            // IF data from DB and from localStorage is equal THEN return.
            if (JSON.stringify(actionBlocks_from_DB) === JSON.stringify(that.model.getActionBlocksFromLocalStorage())) {
                console.log('Data from DB is the same as in localStorage');

                that.showActionBlocks(that.model.getActionBlocksFromLocalStorage());
            }
            else {
                fileManagerController.downloadActionBlocks();
                
                that.model.setActionBlocks(actionBlocks_from_DB);

                dialogDatabaseView.show();
            }
        }
    }

    openFolder(folderObj, tags) {
        let data_to_show;
        if ( ! tags) {
            console.log('Warning! Tags for folder don\'t exist');
            return;
        }
      
        this.clearInfoBlocksArea();
        $('#input_field_request')[0].value = "";
        // Get command text from input field and find possible search data.
        data_to_show = infoBlockModel.getByPhrase(tags);
    
    
        // Delete from array a folder. For don't show a folder with showed infoBlocks.
        console.log('Delete folder', data_to_show)
        let i_infoObject_to_delete = search.getIndexInfoObjByTitle(data_to_show, folderObj.title);
        console.log(i_infoObject_to_delete);
        if (i_infoObject_to_delete >= 0) {
            data_to_show.splice(i_infoObject_to_delete, 1);
        }
    
        // Show infoBlocks.
        //actionBlockController.showActionBlocks(data_to_show);
        
    
        // Paste tags to input field.
        $('#input_field_request')[0].value = tags;
    
        focusInputField();
    
        // !!!
        infoBlockModel.infoBlocks_on_page = actionBlockController.showActionBlocks(data_to_show);
        
        /*
        if (data_to_show.length === 1) {
            // Open the first infoObject
    
            let infoObj = data_to_show[0];
            actionBlockController.executeActionBlock(infoObj);
        }
        */
    }

    getAll() {
        return infoBlockModel.getAll();
    }

    
    showElementsToUpdateInfoBlock(actionBlock) {
        this.onPageContentChange();
        this.view.showElementsToUpdateInfoBlock(actionBlock);
    }

    showElementsForFileManager() {
        this.onPageContentChange();
        $('#elements_for_file_manager').show();
    }

    showElementsForDataStorageManager() {
        this.onPageContentChange();
        $('#elements_for_data_storage').show();
    }

    showLogs() {
        this.onPageContentChange();
        $('#elements_for_logs').show();
    }

    showElementsForVoiceRecognitionManager() {
        this.onPageContentChange();
        $('#elements_for_voice_recognition_settings').show();
    }

    onPageContentChange() {
        this.view.onPageContentChange(isMenuCreateTypeActionBlockOpen);
        isMenuCreateTypeActionBlockOpen = false;
    }

    showSettingsForNoteActionBlock() {
        this.showSettingsForActionBlockByActionName(action_name.showInfo);
    }

    showSettingsForLinkActionBlock() {
        this.showSettingsForActionBlockByActionName(action_name.openUrl);
    }

    showSettingsForFolderActionBlock() {
        this.showSettingsForActionBlockByActionName(action_name.openFolder);
    }

    showSettingsForAdvancedActionBlock() {
        this.showSettingsForActionBlockByActionName(action_name.openUrl);
        // DropDown to choose action of Action-Block show.
        $('#settings_action_block_container').find('.type_action-block_container').show();
    }
    
    showSettingsForActionBlockByActionName(action_name) {
        infoBlockModel.action_for_new_actionBlock = action_name;
        $('#list_of_type_action-blocks_to_create').hide();
        // DropDown to choose action of Action-Block hide.
        $('#settings_action_block_container').find('.type_action-block_container').hide();
        this.view.showElementsToCreateInfoBlock();
        isMenuCreateTypeActionBlockOpen = false;
        
        this.onPageContentChange();
        $('#title_action_descritption').text(content_type_description_by_action[action_name]);
    }


    setListenerForActionBlock(actionBlock, infoBlock_container) {
        let is_mouse_eneter_settings = false;
        const that = this;
        
        function onClickBtnSettings(e) {
            that.model.title_infoBlock_before_update = actionBlock.title;
            that.showElementsToUpdateInfoBlock(actionBlock);
        }
    
        // On click infoBlock.
        infoBlock_container.on('click', () => {
            if (is_mouse_eneter_settings) return false;
    
            this.executeActionBlock(actionBlock);
            
        });
    
        const settings_container = infoBlock_container.find('.settings')[0];
    
        if (settings_container) {
            settings_container.onmouseenter = function(){is_mouse_eneter_settings = true;};
            settings_container.onmouseleave = function(){is_mouse_eneter_settings = false;};
            settings_container.addEventListener('click', onClickBtnSettings);
        }
    }

    setListeners() {
        const that = this;


        observable.listen('clickBtnRewrite', function(observable, eventType, data) {
            console.log(data);

            that.model.setActionBlocks(that.model.actionBlocks_from_database);
            that.showActionBlocks(that.model.actionBlocks);
        });
    }

    onClickBtnDeleteInfoBlock() {
        const title = $('#settings_action_block_container').find('.input_field_title')[0].value;
        const infoObjects = infoBlockModel.getAll();
        
        //  let i_infoObject_to_delete = binarySearchInObjectsArrByTitle(infoObjects, title);
        const i_infoObject_to_delete = infoBlockModel.getIndexByTitle(title);
    
        if (i_infoObject_to_delete < 0) {
            alert('Command doesn\'t exist with title: ' + title);
            return;
        }
    
        const text_confirm_window = 'Are you sure you want to delete' + '\n' + ' "' + title + '" ?';
    
        function onClickOkConfirm() {
            // Delete infoObject from array
            // infoObjects.splice(i_infoObject_to_delete, 1);
           
            infoBlockModel.deleteInfoObjByTitle(title);
    
            this.onUpdate();
            infoPageView.close();
    
            return;
        }
    
        function onClickCancelConfirm() {
            return;
        }
      
        dialogWindow.confirmAlert(text_confirm_window, onClickOkConfirm, onClickCancelConfirm);
        this.onUpdate();
    }

    clearInfoBlocksArea() {
        this.view.clearInfoBlocksArea();
    }

    onClickBtnCreateActionBlock() {
        // Get title value.
        const input_field_title = settings_action_block_container.find('.input_field_title');
        const title = textAlgorithm.getTextInOneLine(input_field_title.val());
        console.log(title);
        
        
        if ( ! title) {
            alert('Impossible to create command. Title field is empty');
            return false;
        }

        // .Start tags.
        // Get tags values.
        let input_field_tags = settings_action_block_container.find('.input_field_tags')[0];
        let tags_from_field = input_field_tags.value;
        

        let title_without_symbols = title.replace(/[^a-zа-яё0-9\s]/gi, '');
        console.log('title_without_symbols', title_without_symbols);

        let tags_plus_title = '';

        if (tags_from_field) tags_plus_title += tags_from_field + ', ';

        // Add new tag getting text from title.
        tags_plus_title += title + ', ' + title_without_symbols;
        // .End tags.



        // Get action.
        //let selected_action = settings_action_block_container.find('.dropdown_select_action').find(':selected')[0];
        //let action_user_choose = selected_action.value;

        if (infoBlockModel.action_for_new_actionBlock === undefined || infoBlockModel.action_for_new_actionBlock === null) {
            alert('Impossible to create command.\nProbably dropdown menu for action has been broken.');
            return false;
        }

        // Get info of action.
        const input_field_info_container = settings_action_block_container.find('.input_field_action_description');
        let info = input_field_info_container.val();

        if ( ! info) {
            infoBlockModel.action_for_new_actionBlock = action_name.showInfo;
            info = title;
            // alert('Impossible to create command. Info field for action is empty');
            // return false;
        }
        


        //let input_field_action = settings_action_block_container.find('#input_field_action')[0];

        const input_field_image_path_container = settings_action_block_container.find('.input_field_image_path');
        const image_path = input_field_image_path_container.val();

        //console.log(action_description_container.val())

        /*
        clearContentInContainer($('#text_info_obj_create')[0]);
        $('<br><div align='left'>" + "Result created info object:" + "</div>').appendTo($('#text_info_obj_create')[0]);
        $('<div>" + JSON.stringify(infoObj_new) + "</div>').appendTo($('#text_info_obj_create')[0]);
        */

        //console.log('title: " + input_field_title.value + " | tags: " + input_field_tags.value + " | action: " + action_user_choose + " | input_field_action: " + input_field_action.value + " | image path: " + image_path.value);
        
        const isInfoBlockCreated = actionBlockController.createActionBlock(title, tags_plus_title, infoBlockModel.action_for_new_actionBlock, info, image_path);

        if ( ! isInfoBlockCreated) return;
        
        // Clear all fields.
        settings_action_block_container.find('.resize_field').val('');


        //setDefaultValuesForSettingsElementsActionBlock();
        infoPageView.close();
    }



    onUpdate() {
        $('#input_field_request')[0].value = '';

        //const infoObjects_from_localStorage = infoBlockModel.getAll();
        const actionBlocks = this.model.get();
        
        // Refresh Action-Blocks on page.
        infoBlockModel.infoBlocks_on_page = this.showActionBlocks(actionBlocks);
    
        // Scroll top.
        scrollView.scrollTo();
    }
}

const infoBlockController = {};


const settings_action_block_container = $('#settings_action_block_container');


const btn_delete_all_infoBlocks = $('#btn_delete_all_infoBlocks')[0];



let isMenuCreateTypeActionBlockOpen = false;




$('#btn_create_infoBlock')[0].addEventListener('click', function () {

});


function setDefaultValuesForSettingsElementsActionBlock() {
    // Get title value
    let input_field_title = $('#settings_action_block_container').find('.input_field_title');
    input_field_title.val('');
    let input_field_tags = $('#settings_action_block_container').find('.input_field_tags')[0];
    input_field_tags.value = '';
    let input_field_info_container = $('#settings_action_block_container').find('.input_field_action_description');
    input_field_info_container.val('');
    let input_field_image_path_container = $('#settings_action_block_container').find('.input_field_image_path');
    input_field_image_path_container.val('');
}
