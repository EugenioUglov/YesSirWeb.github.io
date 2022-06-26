class ActionBlockController {
    constructor(actionBlockService, loadingService, dialogWindow, 
        scrollService, searchService, pageService, noteService
    ) {
        this.actionBlockService = actionBlockService;
        this.loadingService = loadingService;
        this.dialogWindow = dialogWindow;
        this.scrollService = scrollService;
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
        this.actionBlockService.createActionBlock(title, tags_plus_title, action, content, image_URL);
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