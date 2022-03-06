class ActionBlockController {
    constructor(dbManager, observable, fileManager, textAlgorithm, dropdownManager, dataStorageController) {
        this.fileManager = fileManager;
        this.observable = observable;
        this.textAlgorithm = textAlgorithm;
        this.is_settings_to_update_actionBlock_opened = false;
        this.is_actionBlock_executed = false;
        this.is_result_voice_search = false; 
        this.model = new ActionBlockModel(dbManager, textAlgorithm, observable, dataStorageController);
        this.view = new ActionBlockView(fileManager, textAlgorithm, dropdownManager);
        this.#setListeners();
        this.#bindViewEvenets();
        this.#init();
    }

    #actionBlocks_to_show = [];
    index_last_showed_actionBlock = 0;

    #init() {
        const that = this;

        this.model.onStartSave = function() {
            that.onStartSave();
        }

        this.model.onSaved = function() {
            that.onSaved();
        }
    }

    onStartSave() {
        
    }

    onSaved() {

    }

    

    
    #onClickBtnFixedPlus = () => {
        this.view.onClickBtnFixedPlus();

        if (this.model.is_menu_create_type_actionBlock_open) {
            this.view.hideListOfTypeActionBlocksToCreate();
        }
        else {
            this.view.showListOfTypeActionBlocksToCreate();
        }

        this.model.is_menu_create_type_actionBlock_open = ! this.model.is_menu_create_type_actionBlock_open;
    }

    showByRequest = (request, is_execute_actionBlock_by_title = true) => {
        const that = this;

        console.log('showByRequest');

        this.index_last_showed_actionBlock = 0;
        
        const event_actionBlocks_start_show = {
            name: 'actionBlocksStartShow',
            data: {
                logs: 'Action-Blocks start show'
            }
        }

        this.observable.dispatchEvent(event_actionBlocks_start_show.name, event_actionBlocks_start_show.data);

        //setTimeout(show, 1);

        //function show() {
            let actionBlocks_to_show;

            if (request === '') {
                // Show data in images.
                infoBlockModel.infoBlocks_on_page = that.showActionBlocks();
    
                return;
            }
            
    
    
            // Get request text from input field and find possible search data.
            actionBlocks_to_show = that.getActionBlocksByPhrase(request);

        
            if ( ! actionBlocks_to_show) {
                actionBlocks_to_show = [];
            }
    
            // Show Action-Blocks separated by pages.
            infoBlockModel.infoBlocks_on_page = that.showActionBlocks(actionBlocks_to_show);
            
            console.log('+++++++++++A');
            console.log('is_execute_actionBlock_by_title', is_execute_actionBlock_by_title);
            if (is_execute_actionBlock_by_title) {
                // IF ActionBlock has been found with the same title THEN execute action.
                for (const actionBlock of actionBlocks_to_show) {
                    console.log('actionBlock', actionBlock.title + ' is same to_');
                    console.log('request', request);
                    if (that.textAlgorithm.isSame(actionBlock.title, request)) {
                        const i_actionBlock = that.model.getIndexActionBlockByTitle(actionBlock.title);
                        console.log('execute', i_actionBlock);
                        that.executeActionBlockByIndex(i_actionBlock);
                        
                        break;
                    }
                }
            }
            console.log('+++++++++++A');
    
            // IF has been found just one infoObject THEN execute action.
            /*
            if (actionBlocks_to_show.length === 1) {
                let infoObj = actionBlocks_to_show[0];
                actionBlockController.executeActionBlock(infoObj);
            }
            */
        //}
        
    }

    showSettingsToCreateNote = () => {
         this.#showSettingsToCreateActionBlock(action_name.showInfo);
    }

    showSettingsToCreateLink = () => {
        this.#showSettingsToCreateActionBlock(action_name.openURL);
    }

    showSettingsToCreateFolder = () => {
        this.#showSettingsToCreateActionBlock(action_name.openFolder);
    }

    showSettingsToCreateAdvancedActionBlock = () => {
        this.#showSettingsToCreateActionBlock(action_name.openURL);
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
        return this.model.getActionBlocks();
    }

    getActionBlocksOnPage() {
        return this.model.infoBlocks_on_page;
    }

    getIndexesActionBlocksByTag() {
        return this.model.getIndexesActionBlocksByTag();
    }
    

    createActionBlock(title, tags, action, content, image_URL, is_editable = true) {
        const action_block =
        {
            title: title,
            tags: tags,
            action: action,
            content: content,
            imageURL: image_URL,
            is_editable: is_editable
        };
    
        const is_created = this.model.add(action_block);

        if ( ! is_created) {
            return false;
        }

        this.onUpdate();
    
        return true;
    }

    updateDefaultActionBlocks = () => {
        const that = this;
        const isShowAlertOnError = false;

        const actionBlocks_to_create = this.model.getDefaultActionBlocks();

        // Delete previous default Action-Blocks.
        for (const actionBlock_to_delete of actionBlocks_to_create) {
            // Update site.
            this.model.deleteActionBlockByTitle(actionBlock_to_delete.title, isShowAlertOnError);
        }
        
        // Create default Action-Blocks.
        createDefaultActionBlocks();
        this.showActionBlocks();

        return;

        function createDefaultActionBlocks() {
            actionBlocks_to_create.forEach(actionBlock => {
                    that.createActionBlock(actionBlock.title, actionBlock.tags, actionBlock.action, actionBlock.content, 
                        actionBlock.imageURL, actionBlock.isEditable);
                }
            );
        }
    }

    save(actionBlocks) {
        this.model.saveAsync(actionBlocks);
    }
    
    onClickBtnDeleteAll() {
        const text_confirm_window = 'Are you sure you want to delete ALL commands?' + '\n' +
            '* It\'s recommended to download the commands first to save all created information';
    
        function onClickOkConfirm() {
           // this.deleteAll();

            return;
        }
        function onClickCancelConfirm() {
          return;
        }
      
        dialogWindow.confirmAlert(text_confirm_window, onClickOkConfirm, onClickCancelConfirm);
    }

    executeActionBlockByIndex(i_actionBlock) {
        const that = this;

        if (this.is_actionBlock_executed) return;
        

        const actionBlocks = this.model.getActionBlocks();
        const actionBlock = actionBlocks[i_actionBlock];
        const obj = actionBlock;
        let action_name_of_actionBlock = obj.action;
   
        let content = obj.content;
        if (content === undefined) { 
            console.log('Warning! Something wrong with contant. Maybe you use "content" instead "info" for Action-Blocks or content is undefined');
            content = obj.info;
        }
    
    
        if (action_name_of_actionBlock === 'showAlert') action_name_of_actionBlock = action_name.showInfo;
        else if (action_name_of_actionBlock === 'openUrl') action_name_of_actionBlock = action_name.openURL;
    
        if (action_name_of_actionBlock === action_name.openURL || action_name_of_actionBlock === action_name.openUrl) {
            this.view.openURL(content);
            console.log('URL opened');

            const event_actionBlock_openURL_executed = {
                name: 'actionBlockOpenURLExecuted',
                data: {
                    index: i_actionBlock,
                    log: 'actionBlockOpenURLExecuted'
                }
            };

            that.observable.dispatchEvent(event_actionBlock_openURL_executed.name, event_actionBlock_openURL_executed.data);

            return;
        }
        // Action alertInfo must to include info option.
        else if (action_name_of_actionBlock === action_name.showInfo) {
            console.log('note executed');
            this.is_actionBlock_executed = true;
            this.onPageContentChange();
            this.view.onNoteExecuted();

            const isHTML = false;
            this.view.showInfo(content, obj.title, isHTML);

            if (this.is_result_voice_search) {
                speakerController.speak(content);
                this.is_result_voice_search = false;
            }

            const event_actionBlock_content_executed = {
                name: 'actionBlockContentExecuted',
                data: {
                    index: i_actionBlock,
                    log: 'actionBlockContentExecuted'
                }
            };

            that.observable.dispatchEvent(event_actionBlock_content_executed.name, event_actionBlock_content_executed.data);

            const event_actionBlock_note_executed = {
                name: 'actionBlockNoteExecuted',
                data: {
                    index: i_actionBlock,
                    log: 'actionBlockNoteExecuted',
                    content: content
                }
            };

            that.observable.dispatchEvent(event_actionBlock_note_executed.name, event_actionBlock_note_executed.data);

        }
        else if (action_name_of_actionBlock === action_name.showHTML) {
            this.is_actionBlock_executed = true;
            this.onPageContentChange();
            const isHTML = true;
            this.view.showInfo(content, obj.title, isHTML);
            $('#content_executed_from_actionBlock').show();

            const event_actionBlock_content_executed = {
                name: 'actionBlockContentExecuted',
                data: {
                    index: i_actionBlock,
                    log: 'actionBlockContentExecuted'
                }
            };

            that.observable.dispatchEvent(event_actionBlock_content_executed.name, event_actionBlock_content_executed.data);

        }
        else if (action_name_of_actionBlock === action_name.openFolder) {
            //console.log('open folder from actionblock');
            this.openFolder(i_actionBlock);

            const event_folder_opened = {
                name: 'actionBlockFolderExecuted',
                data: {
                    tags: content
                }
            };
            
            this.observable.dispatchEvent(event_folder_opened.name, event_folder_opened.data);
            
        }
        /*
        else if (action_name_of_actionBlock === action_name.showFileManager) {
            this.onPageContentChange();
            this.view.showElementsForFileManager();
        }
        */
        else {
            console.log('ERROR! Action of Action-Block doesn\'t exist. action_name: ', action_name_of_actionBlock);
            return;
        }

        const event_actionBlock_executed = {
            name: 'actionBlockExecuted',
            data: {
                index: i_actionBlock,
                log: 'actionBlockExecuted'
            }
        };

        that.observable.dispatchEvent(event_actionBlock_executed.name, event_actionBlock_executed.data);
    }
    


    showActionBlocks = (actionBlocks_to_show) => {
        if (window.location.hash.includes('#indexActionBlock')) return;

        console.log('== showActionBlocks ==');
        const that = this;


        this.view.hideActionBlocksContainer();

        const event_actionBlocks_start_show = {
            name: 'actionBlocksStartShow',
            data: {
                logs: 'Action-Blocks start show'
            }
        }
        
        this.observable.dispatchEvent(event_actionBlocks_start_show.name, event_actionBlocks_start_show.data);

        that.index_last_showed_actionBlock = 0;

        if (actionBlocks_to_show === undefined) {
            actionBlocks_to_show = that.getActionBlocks();
        }
        
        // IF infoBLocks in parameter THEN return emty array.
        if ( ! actionBlocks_to_show) {
            return [];
        }
        else if (Array.isArray(actionBlocks_to_show) === false) {
            actionBlocks_to_show = [actionBlocks_to_show];
        }

        that.#actionBlocks_to_show = actionBlocks_to_show;
    
        that.clear();
    
        infoBlocks_area.page_curr = 1;
        const max_count_pages_actionBlocks_on_page = 12;
        const infoBlocks_on_page = {}; 
        
        let i_infoBlock_container = 0;
        infoBlocks_on_page[i_infoBlock_container] = [];
        let number_infoBlock_curr = 0;

        const count_actionBlocks_to_show = 50;


        let i;

        for (i = 0; i < actionBlocks_to_show.length; i++) {
            if (i >= count_actionBlocks_to_show - 1) {
                break;
            }

            that.showActionBlock(actionBlocks_to_show[i]);
        }

        that.index_last_showed_actionBlock = i;


        // Push Action-Blocks to array sepparate by pages.
        for (const i_obj in actionBlocks_to_show) {
            break;
            infoBlocks_on_page[i_infoBlock_container].push(actionBlocks_to_show[i_obj]);
            number_infoBlock_curr = Number(i_obj) + 1;
            //console.log(number_infoBlock_curr + "%" + max_count_pages_actionBlocks_on_page, actionBlocks_to_show[i_obj]);
    

            if ((number_infoBlock_curr != actionBlocks_to_show.length) && (number_infoBlock_curr % max_count_pages_actionBlocks_on_page === 0)) {
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
                console.log('Action-Block to show', actionBlocks_to_show[i_obj]);
                
            }
            
        }
        
        const count_pages = Object.keys(infoBlocks_on_page).length;
        that.model.count_pages = count_pages;

        if (count_pages > 1) {
            // Set text number of page.
            const current_page = 1;
            setNumberPage(current_page, count_pages);
        }
    
        that.model.infoBlocks_on_page = infoBlocks_on_page[0];
        infoBlockModel.infoBlocks_on_page = infoBlocks_on_page;
        

        that.view.showActionBlocksContainer();
        
        that.view.bindClickActionBlock(that.#onClickActionBlock, that.#onClickSettingsActionBlock);
        

        const event_actionBlocks_showed = {
            name: 'actionBlocksShowed',
            data: {
                log: 'actionBlocksShowed'
            }
        }

        that.observable.dispatchEvent(event_actionBlocks_showed.name, event_actionBlocks_showed.data);
       
        
        console.log('====');

        return infoBlocks_on_page;
    
    }

    showActionBlock(actionBlock) {
        const actionBlock_html = this.view.addOnPage(this.model.getIndexActionBlockByTitle(actionBlock.title), actionBlock);
    }

    showActionBlocksFromStorage = () => {
        const that = this;
        console.log("1");
        console.log(this.model.getActionBlocks());
        this.view.hideActionBlocksContainer();

        this.model.getActionBlocksFromStorageAsync(onGetActionBlocksCallback);

        function onGetActionBlocksCallback(actionBlocks) {
            const actionBlocks_from_localStorage = that.model.getActionBlocksFromLocalStorageAsync();
            const actionBlokcs_from_user_storage = actionBlocks;
            console.log('actionBlocks_from_localStorage', actionBlocks_from_localStorage);
            console.log('actionBlokcs_from_user_storage', actionBlokcs_from_user_storage);

            // IF data is equal to data from localStorage THEN show Action-Blocks. 
            // ELSE open dialog database.
            if (JSON.stringify(actionBlokcs_from_user_storage) === JSON.stringify(actionBlocks_from_localStorage)) {
                that.model.setActionBlocks(actionBlocks);
                that.showActionBlocks(actionBlocks);
            }
            else {
                that.downloadFileWithActionBlocks(actionBlocks_from_localStorage);
                console.log("3");
                console.log(that.model.getActionBlocks());
                
                that.observable.dispatchEvent('actionBlocksFromDatabaseNotEqualCurrentActionBlocksLoaded', 'Action-Blocks loaded');
                
                console.log("4");
                console.log(that.model.getActionBlocks());
            }

            console.log('dispatchEvent: actionBlocksLoaded');
            that.observable.dispatchEvent('actionBlocksLoaded', 'Action-Blocks loaded');

            
            console.log("5");
            console.log(that.model.getActionBlocks());
        }
    }

    showActionBlocksByTags(user_plus_tags, user_minus_tags) {
        // Get command text from input field and find possible search data.
        let actionBlocks_to_show = this.model.getActionBlocksByTags(user_plus_tags, user_minus_tags);


        if ( ! actionBlocks_to_show) {
            actionBlocks_to_show = [];
        }

        // Show infoBlocks separated by pages.
        infoBlockModel.infoBlocks_on_page = this.showActionBlocks(actionBlocks_to_show);
    }

    addOnPageNextActionBlocks() {
        console.log('== addOnPageNextActionBlocks ==');
        if (this.#actionBlocks_to_show === undefined) {
            return;
        }

        let count_actionBlocks_curr = 0;
        const max_count_actionBlocks_to_add_on_page = 50;

        const actionBlocks = this.#actionBlocks_to_show;

        console.log(`add Action-Blocks from index ${this.index_last_showed_actionBlock} to ${this.index_last_showed_actionBlock + max_count_actionBlocks_to_add_on_page}`);
        
        let i;

        for (i = this.index_last_showed_actionBlock; i < actionBlocks.length; i++) {
            if (count_actionBlocks_curr >= max_count_actionBlocks_to_add_on_page) {
                break;
            }

            this.showActionBlock(actionBlocks[i]);
            count_actionBlocks_curr++;
        }
        
        this.index_last_showed_actionBlock = i;
        
        console.log('index_last_showed_actionBlock', this.index_last_showed_actionBlock);

        console.log('====');

        this.view.bindClickActionBlock(this.#onClickActionBlock, this.#onClickSettingsActionBlock);
    }



    getActionBlocksByPhrase(phrase) {
        return this.model.getByPhrase(phrase);
    }
    


    openFolder(i_actionBlock) {
        const actionBlocks = this.model.getActionBlocks();
        const actionBlock = actionBlocks[i_actionBlock];
        const obj = actionBlock;
        const search_tags = actionBlock.content;

        let actionBlocks_to_show;

        if ( ! search_tags) {
            console.log('Warning! Tags for folder don\'t exist');
            return;
        }
      
        this.clear();
        // Get command text from input field and find possible search data.
        actionBlocks_to_show = this.model.getByPhrase(search_tags);
    
    
        // Delete a folder from array. In order to don't show a folder with Action-Blocks.
        if (i_actionBlock >= 0) {
            actionBlocks_to_show.splice(i_actionBlock, 1);
        }

        
        infoBlockModel.infoBlocks_on_page = this.showActionBlocks(actionBlocks_to_show);
        
        /*
        if (actionBlocks_to_show.length === 1) {
            // Open the first infoObject
    
            let infoObj = actionBlocks_to_show[0];
            actionBlockController.executeActionBlock(infoObj);
        }
        */
    }

    onPageContentChange() {
        console.log('onPageContentChange()');
        this.view.onPageContentChange(this.model.is_menu_create_type_actionBlock_open);
    }

    clear() {
        this.view.clear();
    }

    onClickBtnRewriteActionBlocks = function() {
        const text_confirm_window = 'All current Action-Blocks will be deleted and replaced with Action-Blocks retrieved from the database.' + 
            '\n' + 'Are you sure you want to replace it now?';
    
        dialogWindow.confirmAlert(text_confirm_window, onClickOkConfirm, onClickCancelConfirm);
    
        function onClickOkConfirm() {
            $('#dialog_database_manager')[0].close();
            observable.dispatchEvent('clickBtnRewrite', 'Click button Rewrite');
            
            return;
        }
    
        function onClickCancelConfirm() {
            return;
        }
    }

    onClickBtnDeleteActionBlock = (title) => {
        const event_new_settings_for_actionBlocks_applied = {
            name: 'new_settings_for_actionBlocks_applied',
            data: {
                log: 'new_settings_for_actionBlocks_applied'
            }
        };

        this.observable.dispatchEvent(event_new_settings_for_actionBlocks_applied.name, 
            event_new_settings_for_actionBlocks_applied.data);

        const that = this;

        this.view.closeSettings();
        
        /*
        const i_actionBlock_to_delete = this.model.getIndexActionBlockByTitle(title);
    
        if (i_actionBlock_to_delete < 0) {
            alert('Action-Block doesn\'t exist with title: ' + title);
            return;
        }
        */

        const text_confirm_window = 'Are you sure you want to delete' + '\n' + ' "' + title + '" ?';
    
        function onClickOkConfirm() {
            that.model.deleteCurrentActionBlock();
    
            that.onUpdate();
            
            const event_actionBlock_deleted = {
                name: 'actionBlockDeleted',
                data: {
                    log: 'Action-Block deleted ' + title
                }
            };
            
            that.observable.dispatchEvent(event_actionBlock_deleted.name, event_actionBlock_deleted.data);
            

            return;
        }
    
        function onClickCancelConfirm() {
            return;
        }
      
        dialogWindow.confirmAlert(text_confirm_window, onClickOkConfirm, onClickCancelConfirm);
    }

    onClickBtnCreateActionBlock = (title, tags_plus_title, content, image_URL) => {
        const event_onClickBtnCreateActionBlock = {
            name: 'btnCreateActionBlockClicked',
            data: {
                log: 'btnCreateActionBlockClicked'
            }
        };

        this.observable.dispatchEvent(event_onClickBtnCreateActionBlock.name, 
            event_onClickBtnCreateActionBlock.data);

        const is_actionBlock_created = this.createActionBlock(title, tags_plus_title, 
            infoBlockModel.action_for_new_actionBlock, content, image_URL);

        if ( ! is_actionBlock_created) return;

        this.view.closeSettings();
        this.view.clearAllFields();

        const event_new_settings_for_actionBlocks_applied = {
            name: 'new_settings_for_actionBlocks_applied',
            data: {
                log: 'new_settings_for_actionBlocks_applied'
            }
        };

        this.observable.dispatchEvent(event_new_settings_for_actionBlocks_applied.name, 
            event_new_settings_for_actionBlocks_applied.data);
    }

    onClickBtnUpdateActionBlock = (title, tags, selected_action, content, image_url) => {
        const event_new_settings_for_actionBlocks_applied = {
            name: 'new_settings_for_actionBlocks_applied',
            data: {
                log: 'new_settings_for_actionBlocks_applied'
            }
        };

        this.observable.dispatchEvent(event_new_settings_for_actionBlocks_applied.name, 
            event_new_settings_for_actionBlocks_applied.data);

        this.view.closeSettings();
        this.view.setDefaultValuesForSettingsElementsActionBlock();

        const that = this;
        const original_title = this.model.title_actionBlock_before_update;

  
        // Check new title validation.
        if (original_title != title) {
            const is_new_title_valid = checkNewTitleValidation();

            if (is_new_title_valid == false) {
                return false;
            }

            addTitleToTags();
        }

        //const is_deleted = this.model.deleteActionBlockByTitle(original_title);
        const is_deleted = this.model.deleteCurrentActionBlock();
        if ( ! is_deleted) {
            alert('ERROR! Action-Block hasn\'t been deleted');
            return;
        }
        
    
        const isActionBlockCreated = this.createActionBlock(title, tags, selected_action, content, image_url);
    
        if ( ! isActionBlockCreated) {
            alert('ERROR! Action-Bclok hasn\'t been created.');
            return;
        }
    
    
    
        this.onUpdate();
        return true;
        

        function checkNewTitleValidation() {
            const index_of_title = that.model.getIndexActionBlockByTitle(title);
            let is_actionBlock_aleready_exists = false;
    
            if (index_of_title >= 0) {
                is_actionBlock_aleready_exists = true;
            }
        
            if (is_actionBlock_aleready_exists) {
                alert('Action-Block already exists with title: ' + title);
                return false;
            }

            return true;
        }

        function addTitleToTags() {
            // Add new tag getting text from title
    
            const title_without_symbols = title.replace(/[^a-zа-яё0-9\s]/gi, '');
            
    
            if (tags) tags = tags + ", ";
            
            // Add new tag getting text from title.
            tags += title + ", " + title_without_symbols;
        }
    }
    

    onUpdate() {
        this.view.onUpdate();
        
        // Refresh Action-Blocks on page.
        infoBlockModel.infoBlocks_on_page = this.showActionBlocks();
    

        const event_actionBlocks_updated = {
            name: 'actionBlocksUpdated',
            data: {
                log: 'actionBlocksUpdated'
            }
        };

        observable.dispatchEvent(event_actionBlocks_updated.name, event_actionBlocks_updated.data);
    }

    downloadFileWithActionBlocks = (actionBlocks) => {
        if ( ! actionBlocks) actionBlocks = this.getActionBlocks();
        const content = JSON.stringify(actionBlocks);

        const date = new Date();
        // Get date in format day.month.year hours.minutes.seconds.
        // const date_text = date.today() + '  ' + date.timeNow();

        //months from 1-12
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const year = date.getUTCFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        const date_text = '' + year + month + day + '_' + hours + minutes + seconds;

        // Set variable for name of the saving file with date and time. 
        const file_name = 'Action-Blocks ' + date_text;
        const extension = '.json';

        this.fileManager.downloadFile(content, file_name, extension);
    }

    uploadFileWithActionBlocks = (actionBlocks_from_file) => {
        this.view.closeSettings();

        const event_file_actionBlocks_uploaded = {
            name: 'fileActionBlocksUploaded',
            data: {
                log: 'fileActionBlocksUploaded',
                actionBlocks: actionBlocks_from_file
            }
        };

        this.observable.dispatchEvent(event_file_actionBlocks_uploaded.name, event_file_actionBlocks_uploaded.data);
    }


    showElementsForVoiceRecognitionManager() {
        this.view.showElementsForVoiceRecognitionManager();
    }

    showElementsForDataStorageManager() {
        this.view.showElementsForDataStorageManager();
    }

    showElementsToCreateActionBlock() {
        this.view.showElementsToCreateActionBlock();
    }

    
    #onClickActionBlock = (i_actionBlock) => {
        //this.executeActionBlockByIndex(i_actionBlock);

        const that = this;

        const actionBlocks = this.model.getActionBlocks();
        const actionBlock = actionBlocks[i_actionBlock];
        const obj = actionBlock;
        let action_name_of_actionBlock = obj.action;
        let content = obj.content;

        const event_actionBlock_executed = {
            name: 'actionBlockClicked',
            data: {
                index: i_actionBlock,
                log: 'actionBlockClicked'
            }
        };

        that.observable.dispatchEvent(event_actionBlock_executed.name, event_actionBlock_executed.data);

        console.log('onClickActionBlock');
    }

    #onClickSettingsActionBlock = (i_actionBlock) => {
        this.is_settings_to_update_actionBlock_opened = true;
        console.log('is_settings_to_update_actionBlock_opened', this.is_settings_to_update_actionBlock_opened);

        const event_settings_actionBlock = {
            name: 'settingsActionBlockShowed',
            data: {
                log: 'Settings Action Block Showed'
            }
        };

        this.observable.dispatchEvent(event_settings_actionBlock.name, event_settings_actionBlock.data);

        const actionBlocks = this.model.getActionBlocks();
        const actionBlock = actionBlocks[i_actionBlock];
        this.model.title_actionBlock_before_update = actionBlock.title;
        this.onPageContentChange();
        this.view.showElementsToUpdateActionBlock(actionBlock);
        this.model.i_actionBlock_opened_settings = i_actionBlock;
    }

    #onClickBtnCancelSettings = () => {
        const event = {
            name: 'noteClosed',
            data: 'Note closed'
        };

        this.observable.dispatchEvent(event.name, event.data);
    }
    
    #bindViewEvenets() {
        this.view.bindClickBtnFixedPlus(this.#onClickBtnFixedPlus);
        this.view.bindClickBtnDefaultActionBlocks(this.updateDefaultActionBlocks);
        //this.view.bindClickBtnDownloadActionBlocks(this.downloadFileWithActionBlocks);
        //this.view.bindUploadFileWithActionBlocks(this.uploadFileWithActionBlocks);
        
        this.view.bindClickBtnSettingsToCreateNote(this.showSettingsToCreateNote);
        this.view.bindClickBtnSettingsToCreateLink(this.showSettingsToCreateLink);
        this.view.bindClickBtnSettingsToCreateFolder(this.showSettingsToCreateFolder);
        this.view.bindClickBtnSettingsToCreateAdvancedActionBlock(this.showSettingsToCreateAdvancedActionBlock);

        this.view.bindCreateActionBlock(this.onClickBtnCreateActionBlock);
        this.view.bindUpdateActionBlock(this.onClickBtnUpdateActionBlock);
        this.view.bindDeleteActionBlock(this.onClickBtnDeleteActionBlock);
        this.view.bindClickBtnRewriteActionBlocks(this.onClickBtnRewriteActionBlocks);

        this.view.bindClickBtnCancelSettings(this.#onClickBtnCancelSettings);
    }

   
    
    
    #showSettingsToCreateActionBlock = (action_name) => {
        infoBlockModel.action_for_new_actionBlock = action_name;

        this.view.showElementsToCreateActionBlock(action_name);
        this.model.is_menu_create_type_actionBlock_open = false;
        
        this.onPageContentChange();

        const event_settings_actionBlock = {
            name: 'settingsActionBlockShowed',
            data: {
                log: 'Settings Action Block Showed'
            }
        };

        this.observable.dispatchEvent(event_settings_actionBlock.name, event_settings_actionBlock.data);
    }

    #setListeners() {
        const that = this;

        setObservableListener();

        function setObservableListener() {
            that.observable.listen('hashChanged', function(observable, eventType, data){
                that.view.clear();

                if (window.location.hash === '#main' || window.location.hash === '' || window.location.hash === '#undefined') {
                    console.log('ActionBlock listen main page');

                    if (that.getActionBlocks().length > 0) {
                        that.view.onOpenMainPageWithActionBlocks();
                        that.showActionBlocks();
                    }
                    else {
                        that.view.onOpenMainPageWithoutActionBlocks();
                    }
                    
                    that.view.onShowMainPage();
                }
                else if (window.location.hash.includes('#request')) {
                    console.log('ActionBlock listen request');
                    showByRequestFromHash();
    
                    function showByRequestFromHash() {
                        let request = '';
                        const text_to_cut = window.location.hash;
                        const from_character_request = '=';
        
                        let is_execute_actionBlock_by_title = false;
        
                        if (window.location.hash.includes('&executebytitle=false')) {
                            is_execute_actionBlock_by_title = false;
                            const to_character_request = '&executebytitle';
                            request = that.textAlgorithm.getCuttedText(text_to_cut, from_character_request, to_character_request);
                        }
                        else if (window.location.hash.includes('&executebytitle=true')) {
                            is_execute_actionBlock_by_title = true;
                            const to_character_request = '&executebytitle';
                            request = that.textAlgorithm.getCuttedText(text_to_cut, from_character_request, to_character_request);
                        }
                        else {
                            request = that.textAlgorithm.getCuttedText(text_to_cut, from_character_request);
                        }
                        
                        request = that.textAlgorithm.replaceSymbols(request, '%20', ' ');
        
        
                        const last_character_of_requets = request.slice(-1);;
        
                        if (last_character_of_requets === ' ') {
                            is_execute_actionBlock_by_title = false;
                        }
        
                        that.showByRequest(request, is_execute_actionBlock_by_title);
                    }
                }
                else if (window.location.hash.includes('#indexActionBlock')) {
                    console.log('executeActionBlockFromHash');

                    executeActionBlockFromHash();
    
                    function executeActionBlockFromHash() {
                        const text_to_cut = window.location.hash;
                        const from_character = '=';
        
                        const i_actionBlock = that.textAlgorithm.getCuttedText(text_to_cut, from_character);
                        that.executeActionBlockByIndex(i_actionBlock);
                    }
                }
            });
    
            /*
            that.observable.listen('requestEntered', function(observable, eventType, data){
                const request = data.request;
                let is_execute_actionBlock_by_title = true;
                if (data.is_execute_actionBlock_by_title != undefined) is_execute_actionBlock_by_title = data.is_execute_actionBlock_by_title;
    
                that.showByRequest(request, is_execute_actionBlock_by_title);
            });
            */
    
            that.observable.listen('databaseDialogCanceled', function(observable, eventType, data) {
                console.log('databaseDialogCanceled');
                const actionBlocks_from_localStorage = that.model.getActionBlocksFromLocalStorageAsync();
                that.model.setActionBlocks(actionBlocks_from_localStorage);
                that.showActionBlocks();
            });

            that.observable.listen('resultVoiceRecognition', function(observable, eventType, data){
                that.is_result_voice_search = true;
            });

            that.observable.listen('keyUpOnRequestFieldPressed', function(observable, eventType, data){
                that.view.hideActionBlocksContainer();
                const request = data.request;
                const clicked_keyCode = data.keyCode;
                let is_execute_actionBlock_by_title = false;
    
                that.showByRequest(request, is_execute_actionBlock_by_title);
            });
            
            
            that.observable.listen('clickBtnRewrite', function(observable, eventType, data) {
                that.model.setActionBlocks(that.model.actionBlocks_from_database);
                that.showActionBlocks();
            });
    
            that.observable.listen('fileActionBlocksUploaded', function(observable, eventType, data) {
                that.model.setActionBlocks(data.actionBlocks);
                that.showActionBlocks();
            });
    
            
            that.observable.listen('btnClearRequestFieldClicked', function(observable, eventType, data) {
                that.showActionBlocks();
            });
            
            that.observable.listen('btnAuthorizationClicked', function(observable, eventType, data) {
                that.showActionBlocksFromStorage();
            });
    
            that.observable.listen('rbLocalStorageClicked', function(observable, eventType, data) {
                infoBlockModel.infoBlocks_on_page = that.showActionBlocks();
            });
    
            that.observable.listen('scrolledToBottom', function(observable, eventType, data) {
                if ($("#main_page_container").is(":visible") === false) return;

                that.addOnPageNextActionBlocks();
            });

            that.observable.listen('noteClosed', function(observable, eventType, data) {
                that.is_actionBlock_executed = false;

                if (that.is_settings_to_update_actionBlock_opened) {
                    that.is_settings_to_update_actionBlock_opened = false;
                    that.view.setDefaultValuesForSettingsElementsActionBlock();
                }

                that.view.showActionBlocksContainer();
            });            
        }
    }
}