class ActionBlockController {
    constructor(actionBlockService, dbManager, observable, fileManager, textManager, dropdownManager, 
        mapDataStructure, loadingService, pageController, dialogWindow, 
        scrollService, searchService, pageService, noteService
    ) {
        this.actionBlockService = actionBlockService;
        this.fileManager = fileManager;
        this.observable = observable;
        this.textManager = textManager;
        this.loadingService = loadingService;
        // this.logsController = logsController;
        this.pageController = pageController;
        this.dialogWindow = dialogWindow;
        this.mapDataStructure = mapDataStructure;
        this.scrollService = scrollService;
        this.searchService = searchService;
        this.pageService = pageService;
        this.noteService = noteService; 
        //this.model = new ActionBlockModel(dbManager, textManager, observable, dataStorageController, mapDataStructure, logsController, fileManager);
        // this.view = new ActionBlockView(fileManager, textManager, dropdownManager);
        this.#bindViewEvenets();
    }

    
    // getActionBlocks() {
    //     return this.actionBlockService.model.getActionBlocks();
    // }

    createActionBlock(title, tags, action, content, image_URL) {
        const action_block =
        {
            title: title,
            tags: tags,
            action: action,
            content: content,
            imageURL: image_URL
        };

        const is_created = this.actionBlockService.model.add(action_block);

        if ( ! is_created) {
            return false;
        }

        this.#updatePage();
    
        return true;
    }

    updateDefaultActionBlocks = () => {
        const that = this;
        const isShowAlertOnError = false;

        const actionBlocks_to_create = this.actionBlockService.model.getDefaultActionBlocks();

        // Delete previous default Action-Blocks.
        for (const actionBlock_to_delete of actionBlocks_to_create) {
            // Update site.
            this.actionBlockService.model.deleteActionBlockByTitle(actionBlock_to_delete.title, isShowAlertOnError);
        }
        
        // Create default Action-Blocks.
        createDefaultActionBlocks();
        this.actionBlockService.showActionBlocks();

        return;

        function createDefaultActionBlocks() {
            actionBlocks_to_create.forEach(actionBlock => {
                that.createActionBlock(actionBlock.title, actionBlock.tags, actionBlock.action, actionBlock.content, 
                    actionBlock.imageURL, actionBlock.isEditable);
            });
        }
    }



    // executeActionBlockByTitle(title) {
    //     console.log('executeActionBlockByTitle', title);
    //     const that = this;
        

    //     // if (this.is_actionBlock_executed) return;
        
    //     const actionBlock = this.actionBlockService.model.getActionBlockByTitle(title);
        
    //     const obj = actionBlock;
    //     let action_name_of_actionBlock = obj.action;
   
    //     let content = obj.content;

    //     if (content === undefined) { 
    //         console.log('Warning! Something wrong with contant. ' +
    //             'Maybe you use "content" instead "info" for ' +
    //             'Action-Blocks or content is undefined');
    //         content = obj.info;
    //     }
    
    
    //     // Support old version with old action names.
    //     if (action_name_of_actionBlock === 'showAlert') action_name_of_actionBlock = this.actionBlockService.model.getActionNameEnum().showInfo;
    //     else if (action_name_of_actionBlock === 'openUrl') action_name_of_actionBlock = this.actionBlockService.model.getActionNameEnum().openURL;
        
    
    //     if (action_name_of_actionBlock === this.actionBlockService.model.getActionNameEnum().openURL || action_name_of_actionBlock === this.actionBlockService.model.getActionNameEnum().openUrl) {
    //         console.log('open URL');
    //         const url = getValidURL(content);
    //         // open in new tab.
    //         let new_tab = window.open(url, '_blank');

    //         if (window.location.hash.includes('#request')) {
    //             if (window.location.hash.includes('executebytitle=true')) {
    //                 console.log('new_hash has executebytitle=true');
    //                 const text_to_cut = window.location.hash;
    //                 const from_character_hash = null;
    //                 const to_character_hash = '&executebytitle';

    //                 const request_hash = that.textManager.getCuttedText(text_to_cut, from_character_hash, to_character_hash);
    //                 const new_hash = request_hash + '&executebytitle=false';

    //                 window.location.hash = new_hash;
    //             }
    //         }

    //         function getValidURL(url) {
    //             let valid_url = url;

    //             if (url.toLowerCase().includes('http') === false) {
    //                 valid_url = 'http://'+ url;
    //             }

    //             return valid_url;
    //         }

    //         return;
    //     }
    //     // Action alertInfo must to include info option.
    //     else if (action_name_of_actionBlock === this.actionBlockService.model.getActionNameEnum().showInfo) {
    //         this.actionBlockService.view.onPageContentChange();
    //         this.actionBlockService.view.onNoteExecuted();

    //         const isHTML = false;
    //         this.noteService.openNote(content, obj.title, isHTML);

    //         this.actionBlockService.view.hidePage();
    //     }
    //     else if (action_name_of_actionBlock === this.actionBlockService.model.getActionNameEnum().showHTML) {
    //         this.actionBlockService.view.onPageContentChange();
    //         const isHTML = true;
    //         this.noteService.openNote(content, obj.title, isHTML);
    //         $('#content_executed_from_actionBlock').show();


    //         that.noteService.is_note_opened = true;
    //         // Set position top.
    //         that.scrollService.setPosition(0, 0);

    //     }
    //     else if (action_name_of_actionBlock === this.actionBlockService.model.getActionNameEnum().openFolder) {
    //         //console.log('open folder from actionblock');
    //         this.openFolder(i_actionBlock);

    //         // const event_folder_opened = {
    //         //     name: 'actionBlockFolderExecuted',
    //         //     data: {
    //         //         tags: content
    //         //     }
    //         // };
            
    //         // this.observable.dispatchEvent(event_folder_opened.name, event_folder_opened.data);

    //         this.searchService.setTextToInputField(content);
    //         this.searchService.focusInputField();
    //     }
    //     /*
    //     else if (action_name_of_actionBlock === this.actionBlockService.model.getActionNameEnum().showFileManager) {
    //         this.actionBlockService.view.onPageContentChange();
    //         this.actionBlockService.view.showElementsForFileManager();
    //     }
    //     */
    //     else {
    //         console.log('ERROR! Action of Action-Block doesn\'t exist. action_name: ', action_name_of_actionBlock);
    //         return;
    //     }
    // }

    // showActionBlocks = (actionBlocks_to_show, count_actionBlocks_to_show_at_time = 50) => {
    //     console.log('window.location.hash', window.location.hash);
    //     if (window.location.hash.includes('#executebytitle=true')) return;

    //     const that = this;

    //     that.actionBlockService.showActionBlocks(actionBlocks_to_show, count_actionBlocks_to_show_at_time = 50);
    //     console.log('actionblocks showed now bind it!');
    //     // that.actionBlockService.view.bindClickActionBlock(that.#onClickActionBlock, that.#onClickSettingsActionBlock);
    // }
    
    
    // showActionBlocksFromStorage = () => {
    //     const that = this;
    //     this.actionBlockService.view.hideActionBlocksContainer();

    //     this.actionBlockService.model.getActionBlocksFromStorageAsync(onGetActionBlocks);

    //     function onGetActionBlocks(actionBlocks_from_user_storage) {
    //         const actionBlocks_from_localStorage = that.actionBlockService.model.getActionBlocksFromLocalStorageAsync();
    //         // IF data is equal to data from localStorage THEN show Action-Blocks. 
    //         // ELSE open dialog database.
    //         if (that.mapDataStructure.getStringified(actionBlocks_from_user_storage) === that.mapDataStructure.getStringified(actionBlocks_from_localStorage)) {
    //             that.actionBlockService.model.setActionBlocks(actionBlocks_from_user_storage);
    //             that.actionBlockService.showActionBlocks(actionBlocks_from_user_storage);
    //         }
    //         else {
    //             that.actionBlockService.downloadFileWithActionBlocks(actionBlocks_from_localStorage);

    //             that.dataStorageController.showDatabaseDialog();
    //         }

    //         that.observable.dispatchEvent('actionBlocksLoaded', 'Action-Blocks loaded');

    //     }
    // }



    // addOnPageNextActionBlocks() {
    //     if (this.actionBlockService.model.actionBlocks_to_show === undefined) {
    //         return;
    //     }

    //     let count_actionBlocks_curr = 0;
    //     const max_count_actionBlocks_to_add_on_page = 50;

    //     const actionBlocks = this.actionBlockService.model.actionBlocks_to_show;
        
    //     let i;

    //     for (i = this.actionBlockService.index_last_showed_actionBlock; i < actionBlocks.length; i++) {
    //         if (count_actionBlocks_curr >= max_count_actionBlocks_to_add_on_page) {
    //             break;
    //         }

    //         this.actionBlockService.showActionBlock(actionBlocks[i]);
    //         count_actionBlocks_curr++;
    //     }
        
    //     this.actionBlockService.index_last_showed_actionBlock = i;

    //     //this.actionBlockService.view.bindClickActionBlock(this.#onClickActionBlock, this.#onClickSettingsActionBlock);
    // }


    openFolder(actionBlock_title) {
        const actionBlocks = this.actionBlockService.model.getActionBlocks();
        const actionBlock = actionBlocks.get(actionBlock_title);
        const tags_to_search = actionBlock.content;

        let actionBlocks_to_show;

        if ( ! tags_to_search) {
            console.log('Warning! Tags for folder don\'t exist');
            return;
        }
      
        this.actionBlockService.view.clear();
        // Get command text from input field and find possible search data.
        actionBlocks_to_show = this.actionBlockService.model.getByPhrase(tags_to_search);
    
        // Delete a folder from array. In order to don't show a folder with Action-Blocks.
        if (i_actionBlock >= 0) {
            actionBlocks_to_show.splice(i_actionBlock, 1);
        }

        this.actionBlockService.showActionBlocks(actionBlocks_to_show);
        
        /*
        if (actionBlocks_to_show.length === 1) {
            // Open the first infoObject
    
            let infoObj = actionBlocks_to_show[0];
            this.actionBlockService.executeActionBlock(infoObj);
        }
        */
    }

    onClickBtnRewriteActionBlocks = function() {
        const that = this;
        const text_confirm_window = 'All current Action-Blocks will be deleted ' +
            'and replaced with Action-Blocks retrieved from the database.' +
            '\n' + 'Are you sure you want to replace it now?';
    
        this.dialogWindow.confirmAlert(text_confirm_window, onClickOkConfirm, onClickCancelConfirm);
    
        function onClickOkConfirm() {
            $('#dialog_database_manager')[0].close();
            that.actionBlockService.model.setActionBlocks(that.actionBlockService.model.actionBlocks_from_database);
            that.actionBlockService.showActionBlocks();

            return;
        }
    
        function onClickCancelConfirm() {
            return;
        }
    }

    onClickBtnDeleteActionBlock = (title) => {
        const that = this;

        this.pageService.openPreviousPage();
        this.loadingService.stopLoading();
        this.actionBlockService.view.closeSettings();

        const text_confirm_window = 'Are you sure you want to delete' + '\n' + ' "' + title + '" ?';
    
        function onClickOkConfirm() {
            that.actionBlockService.model.deleteActionBlockByTitle(title);
    
            that.#updatePage();

            return;
        }
    
        function onClickCancelConfirm() {
            return;
        }
      
        this.dialogWindow.confirmAlert(text_confirm_window, onClickOkConfirm, onClickCancelConfirm);
    }

    onClickBtnCreateActionBlock = (title, tags_plus_title, content, image_URL) => {
        const that = this;

        this.loadingService.startLoading();

        const is_actionBlock_created = this.createActionBlock(title, tags_plus_title, 
            //this.actionBlockService.model.action_for_new_actionBlock, 
            that.actionBlockService.view.getUserAction(),
            content, image_URL);

        if ( ! is_actionBlock_created) return;

        this.actionBlockService.view.closeSettings();
        this.actionBlockService.view.clearAllFields();
        this.pageService.openPreviousPage();
        this.loadingService.stopLoading();
    }

    onClickBtnUpdateActionBlock = (title, tags, selected_action, content, image_url) => {
        this.pageService.openPreviousPage();
        this.loadingService.stopLoading();

        this.actionBlockService.view.closeSettings();
        this.actionBlockService.view.setDefaultValuesForSettingsElementsActionBlock();
        this.actionBlockService.model.updateActionBlock(title, tags, selected_action, content, image_url);
    
        // Scroll top.
        this.scrollService.scrollTo();
        this.actionBlockService.view.updatePage();
        
        // Refresh Action-Blocks on page.
        this.actionBlockService.showActionBlocks();
    }
    
    // uploadFileWithActionBlocks = (actionBlocks_from_file) => {
    //     this.actionBlockService.view.closeSettings();
    //     this.actionBlockService.model.setActionBlocks(actionBlocks_from_file);
    //     this.actionBlockService.showActionBlocks();
    //     this.searchService.clearInputField();
    // }

    showElementsForDataStorageManager() {
        this.actionBlockService.view.showElementsForDataStorageManager();
    }

    showElementsToCreateActionBlock() {
        this.actionBlockService.view.showElementsToCreateActionBlock();
    }

    #onClickBtnCancelSettings = () => {
        voiceRecognitionService.stopRecognizing();
        this.pageService.openPreviousPage();
    }
    
    #bindViewEvenets() {
        this.actionBlockService.view.bindClickBtnFixedPlus(this.#onClickBtnFixedPlus);
        this.actionBlockService.view.bindClickBtnCreateDefaultActionBlocks(this.updateDefaultActionBlocks);
        //this.actionBlockService.view.bindUploadFileWithActionBlocks(this.uploadFileWithActionBlocks);
        
        this.actionBlockService.view.bindClickBtnSettingsToCreateNote(this.actionBlockService.showSettingsToCreateNote);
        this.actionBlockService.view.bindClickBtnSettingsToCreateLink(this.actionBlockService.showSettingsToCreateLink);
        this.actionBlockService.view.bindClickBtnSettingsToCreateFolder(this.actionBlockService.showSettingsToCreateFolder);
        this.actionBlockService.view.bindClickBtnSettingsToCreateAdvancedActionBlock(this.actionBlockService.showSettingsToCreateAdvancedActionBlock);

        this.actionBlockService.view.bindCreateActionBlock(this.onClickBtnCreateActionBlock);
        this.actionBlockService.view.bindUpdateActionBlock(this.onClickBtnUpdateActionBlock);
        this.actionBlockService.view.bindDeleteActionBlock(this.onClickBtnDeleteActionBlock);
        this.actionBlockService.view.bindClickBtnRewriteActionBlocks(this.actionBlockService.onClickBtnRewriteActionBlocks);

        this.actionBlockService.view.bindClickBtnCancelSettings(this.#onClickBtnCancelSettings);
    }

    #onClickBtnFixedPlus = () => {
        this.actionBlockService.switchStateMenuTypeActionBlocksToCreate();
    }

    #updatePage() {
        this.actionBlockService.view.updatePage();
        
        // Refresh Action-Blocks on page.
        this.actionBlockService.showActionBlocks();

        // Scroll top.
        this.scrollService.scrollTo();
    }
}