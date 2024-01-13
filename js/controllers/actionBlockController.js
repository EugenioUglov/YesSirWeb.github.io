class ActionBlockController {
  constructor(
    actionBlockService,
    loadingService,
    dialogWindow,
    searchService,
    hashService,
    noteService
  ) {
    this.actionBlockService = actionBlockService;
    this.loadingService = loadingService;
    this.dialogWindow = dialogWindow;
    this.searchService = searchService;
    this.hashService = hashService;
    this.noteService = noteService;

    this.#bindViewEvenets();
  }

  #onClickBtnShowSettingsToCreateAdvancedActionBlock = () => {
    this.hashService.setHashCreateActionBlock();
  };

  #onClickBtnShowSettingsToCreateNote = () => {
    this.hashService.openPageSettingsToCreateNote();
  };

  #onClickBtnShowSettingsToCreateLink = () => {
    this.hashService.openPageSettingsToCreateLink();
  };

  #onClickBtnCreateActionBlock = (
    title,
    tags_plus_title,
    action,
    content,
    image_URL
  ) => {
    this.actionBlockService.createActionBlock(
      title,
      tags_plus_title,
      action,
      content,
      image_URL,
      (is_actionBlock_created) => {
        if (is_actionBlock_created === false) {
          return false;
        }

        this.hashService.openMainPage();
      }
    );
  };

  #bindViewEvenets() {
    this.actionBlockService.view.bindClickBtnFixedPlus(
      this.actionBlockService.switchStateMenuTypeActionBlocksToCreate
    );
    this.actionBlockService.view.bindClickBtnCreateActionBlock(
      this.#onClickBtnCreateActionBlock
    );
    this.actionBlockService.view.bindClickBtnOpenActionBlockSettings(
      this.actionBlockService.openActionBlockSettings
    );
    this.actionBlockService.view.bindClickBtnSaveEditedActionBlock(
      this.actionBlockService.updateActionBlock
    );
    this.actionBlockService.view.bindClickBtnDeleteActionBlock(
      this.actionBlockService.deleteActionBlock
    );
    this.actionBlockService.view.bindClickBtnRewriteActionBlocks(
      this.actionBlockService.rewriteActionBlocks
    );
    this.actionBlockService.view.bindClickBtnCreateDefaultActionBlocks(
      this.actionBlockService.updateDefaultActionBlocks
    );
    this.actionBlockService.view.bindClickBtnShowSettingsToCreateNote(
      this.#onClickBtnShowSettingsToCreateNote
    );
    this.actionBlockService.view.bindClickBtnShowSettingsToCreateLink(
      this.#onClickBtnShowSettingsToCreateLink
    );
    this.actionBlockService.view.bindClickBtnShowSettingsToCreateFolder(
      this.actionBlockService.showSettingsToCreateFolder
    );
    this.actionBlockService.view.bindClickBtnShowSettingsToCreateAdvancedActionBlock(
      this.#onClickBtnShowSettingsToCreateAdvancedActionBlock
    );
    this.actionBlockService.view.bindClickBtnCancelSettings(
      this.actionBlockService.closeActionBlockSettings
    );
  }
}
