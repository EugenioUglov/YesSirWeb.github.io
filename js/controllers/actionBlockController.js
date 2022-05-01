class ActionBlockController {
    constructor(actionBlockService, dbManager, dropdownManager, 
        mapDataStructure, loadingService, dialogWindow, 
        scrollService, searchService, pageService, noteService
    ) {
        this.actionBlockService = actionBlockService;
        this.loadingService = loadingService;
        // this.logsController = logsController;
        this.dialogWindow = dialogWindow;
        this.mapDataStructure = mapDataStructure;
        this.scrollService = scrollService;
        this.searchService = searchService;
        this.pageService = pageService;
        this.noteService = noteService;

        this.#bindViewEvenets();
    }

    
    // getActionBlocks() {
    //     return this.actionBlockService.model.getActionBlocks();
    // }

    // createActionBlock(title, tags, action, content, image_URL) {
    //     const action_block =
    //     {
    //         title: title,
    //         tags: tags,
    //         action: action,
    //         content: content,
    //         imageURL: image_URL
    //     };

    //     const is_created = this.actionBlockService.model.add(action_block);

    //     if ( ! is_created) {
    //         return false;
    //     }

    //     this.#updatePage();
    
    //     return true;
    // }

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
                that.actionBlockService.createActionBlock(actionBlock.title, actionBlock.tags, actionBlock.action, actionBlock.content, 
                    actionBlock.imageURL, actionBlock.isEditable);
            });
        }
    }

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
        console.log('actionBlocks_to_show', actionBlocks_to_show);
    
        // Delete a folder from array. In order to don't show a folder with Action-Blocks.
        // if (i_actionBlock >= 0) {
        //     actionBlocks_to_show.splice(i_actionBlock, 1);
        // }

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

        const is_actionBlock_created = this.actionBlockService.createActionBlock(title, tags_plus_title, 
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
        const is_updated = this.actionBlockService.model.updateActionBlock(title, tags, selected_action, content, image_url);
        if (is_updated === false) return false;

        this.pageService.openPreviousPage();
        this.loadingService.stopLoading();
        this.actionBlockService.view.closeSettings();
        this.actionBlockService.view.setDefaultValuesForSettingsElementsActionBlock();
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




    #onClickBtnCancelSettings = () => {
        yesSir.voiceRecognitionService.stopRecognizing();
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