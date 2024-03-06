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
    // Disable all buttons.
    $(":submit, :button").attr("disabled", "disabled");
    yesSir.loadingService.startLoading();
    this.actionBlockService
      .createActionBlock(title, tags_plus_title, action, content, image_URL)
      .then((is_actionBlock_created) => {
        yesSir.loadingService.stopLoading();

        // Enable all buttons.
        $(":submit, :button").attr("disabled", false);

        if (is_actionBlock_created === false) {
          return false;
        }

        this.hashService.openMainPage();
      });
  };

  
  #onClickBtnCreateActionBlockWithAutomation = (
    title,
    tags_plus_title,
    action,
    content,
    image_URL
  ) => {
    // Disable all buttons.
    $(":submit, :button").attr("disabled", "disabled");
    yesSir.loadingService.startLoading();
    this.actionBlockService
      .createActionBlockWithAutomation(title, tags_plus_title, action, content, image_URL)
      .then((is_actionBlock_created) => {
        yesSir.loadingService.stopLoading();

        // Enable all buttons.
        $(":submit, :button").attr("disabled", false);

        if (is_actionBlock_created === false) {
          return false;
        }

        this.hashService.openMainPage();
      });
  };

  #bindViewEvenets() {
    this.actionBlockService.view.bindClickBtnFixedPlus(
      this.actionBlockService.switchStateMenuTypeActionBlocksToCreate
    );
    this.actionBlockService.view.bindClickBtnCreateActionBlock(
      this.#onClickBtnCreateActionBlock
    );
    this.actionBlockService.view.bindClickBtnCreateActionBlockWithAutomation(
      this.#onClickBtnCreateActionBlockWithAutomation
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
