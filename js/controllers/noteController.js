class NoteController {
    constructor(actionBlockService, noteService, hashService) {
        this.actionBlockService = actionBlockService;
        this.noteService = noteService;
        this.hashService = hashService;

        this.model = new NoteModel();
        this.view = new NoteView();

        this.bindViewEvents();
    }


    bindViewEvents() {
        this.view.bindClickBtnClose(this.#onClose);
    }

    #onClose = () => {
        this.noteService.close();
        console.log('last scroll pos: ' + yesSir.actionBlockService.getScrollPositionOnExecuteBlock());
        if (window.location.hash.toUpperCase().includes('#editActionBlock'.toUpperCase())) {
            this.actionBlockService.setDefaultValuesForSettingsElementsActionBlock();
        }

        this.hashService.setHashMainPrevious();
        // this.hashService.openPreviousPage();
    }
}