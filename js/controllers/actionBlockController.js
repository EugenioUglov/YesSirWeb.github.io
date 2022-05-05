class ActionBlockController {
    constructor(actionBlockService, dbManager, dropdownManager, 
        mapDataStructure, loadingService, dialogWindow, 
        scrollService, searchService, pageService, noteService
    ) {
        this.actionBlockService = actionBlockService;
        this.loadingService = loadingService;
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




    

    // rewriteActionBlocks = function() {
    //     const that = this;
    //     const text_confirm_window = 'All current Action-Blocks will be deleted ' +
    //         'and replaced with Action-Blocks retrieved from the database.' +
    //         '\n' + 'Are you sure you want to replace it now?';
    
    //     this.dialogWindow.confirmAlert(text_confirm_window, onClickOkConfirm, onClickCancelConfirm);
    
    //     function onClickOkConfirm() {
    //         $('#dialog_database_manager')[0].close();
    //         that.actionBlockService.model.setActionBlocks(that.actionBlockService.model.actionBlocks_from_database);
    //         that.actionBlockService.showActionBlocks();

    //         return;
    //     }
    
    //     function onClickCancelConfirm() {
    //         return;
    //     }
    // }

    // onClickBtnDeleteActionBlock = (title) => {
    //     const that = this;

    //     this.pageService.openPreviousPage();
    //     this.loadingService.stopLoading();
    //     this.actionBlockService.view.closeSettings();

    //     const text_confirm_window = 'Are you sure you want to delete' + '\n' + ' "' + title + '" ?';
    
    //     function onClickOkConfirm() {
    //         that.actionBlockService.model.deleteActionBlockByTitle(title);
    
    //         that.#updatePage();

    //         return;
    //     }
    
    //     function onClickCancelConfirm() {
    //         return;
    //     }
      
    //     this.dialogWindow.confirmAlert(text_confirm_window, onClickOkConfirm, onClickCancelConfirm);
    // }

    // onClickBtnCreateActionBlock = (title, tags_plus_title, content, image_URL) => {
    //     const that = this;

    //     this.loadingService.startLoading();

    //     const is_actionBlock_created = this.actionBlockService.createActionBlock(title, tags_plus_title, 
    //         that.actionBlockService.view.getUserAction(), content, image_URL);

    //     if ( ! is_actionBlock_created) return;

    //     this.actionBlockService.view.closeSettings();
    //     this.actionBlockService.view.clearAllFields();
    //     this.pageService.openPreviousPage();
    //     this.loadingService.stopLoading();
    // }

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
        this.actionBlockService.view.bindClickBtnCreateDefaultActionBlocks(this.actionBlockService.updateDefaultActionBlocks);
        //this.actionBlockService.view.bindUploadFileWithActionBlocks(this.uploadFileWithActionBlocks);
        
        this.actionBlockService.view.bindClickBtnSettingsToCreateNote(this.actionBlockService.showSettingsToCreateNote);
        this.actionBlockService.view.bindClickBtnSettingsToCreateLink(this.actionBlockService.showSettingsToCreateLink);
        this.actionBlockService.view.bindClickBtnSettingsToCreateFolder(this.actionBlockService.showSettingsToCreateFolder);
        this.actionBlockService.view.bindClickBtnSettingsToCreateAdvancedActionBlock(this.actionBlockService.showSettingsToCreateAdvancedActionBlock);

        this.actionBlockService.view.bindCreateActionBlock(this.actionBlockService.createActionBlock);
        this.actionBlockService.view.bindUpdateActionBlock(this.actionBlockService.updateActionBlock);
        this.actionBlockService.view.bindDeleteActionBlock(this.actionBlockService.deleteActionBlock);
        this.actionBlockService.view.bindClickBtnRewriteActionBlocks(this.actionBlockService.rewriteActionBlocks);

        this.actionBlockService.view.bindClickBtnCancelSettings(this.#onClickBtnCancelSettings);
    }

    #onClickBtnFixedPlus = () => {
        this.actionBlockService.switchStateMenuTypeActionBlocksToCreate();
    }
}