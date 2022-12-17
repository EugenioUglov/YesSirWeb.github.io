class ActionBlockController {
    constructor(actionBlockService, loadingService, dialogWindow, 
         searchService, pageService, noteService
    ) {
        this.actionBlockService = actionBlockService;
        this.loadingService = loadingService;
        this.dialogWindow = dialogWindow;
        this.searchService = searchService;
        this.pageService = pageService;
        this.noteService = noteService;

        this.#bindViewEvenets();
    }
    
    #onClickBtnShowSettingsToCreateAdvancedActionBlock = () => {
        this.pageService.setHashCreateActionBlock();
    };

    #onClickBtnShowSettingsToCreateNote = () => {
        this.pageService.openPageSettingsToCreateNote();
    };

    #onClickBtnShowSettingsToCreateLink = () => {
        this.pageService.openPageSettingsToCreateLink();
    };

    #onClickBtnCreateActionBlock = (title, tags_plus_title, action, content, image_URL) => {
        const is_actionBlock_created = this.actionBlockService.createActionBlock(title, tags_plus_title, action, content, image_URL);

      
        if (is_actionBlock_created === false){ 
            // console.log('yess ' + is_actionBlock_created);
            
            return false;
        }
        
        this.pageService.openMainPage();
        
    };

    #bindViewEvenets() {
        this.actionBlockService.view.bindClickBtnFixedPlus(this.actionBlockService.switchStateMenuTypeActionBlocksToCreate);
        this.actionBlockService.view.bindClickBtnCreateActionBlock(this.#onClickBtnCreateActionBlock);
        this.actionBlockService.view.bindClickBtnOpenActionBlockSettings(this.actionBlockService.openActionBlockSettings);
        this.actionBlockService.view.bindClickBtnSaveEditedActionBlock(this.actionBlockService.updateActionBlock);
        this.actionBlockService.view.bindClickBtnDeleteActionBlock(this.actionBlockService.deleteActionBlock);
        this.actionBlockService.view.bindClickBtnRewriteActionBlocks(this.actionBlockService.rewriteActionBlocks);
        this.actionBlockService.view.bindClickBtnCreateDefaultActionBlocks(this.actionBlockService.updateDefaultActionBlocks);        
        this.actionBlockService.view.bindClickBtnShowSettingsToCreateNote(this.#onClickBtnShowSettingsToCreateNote);
        this.actionBlockService.view.bindClickBtnShowSettingsToCreateLink(this.#onClickBtnShowSettingsToCreateLink);
        this.actionBlockService.view.bindClickBtnShowSettingsToCreateFolder(this.actionBlockService.showSettingsToCreateFolder);
        this.actionBlockService.view.bindClickBtnShowSettingsToCreateAdvancedActionBlock(this.#onClickBtnShowSettingsToCreateAdvancedActionBlock);
        this.actionBlockService.view.bindClickBtnCancelSettings(this.actionBlockService.closeActionBlockSettings);
    }
}