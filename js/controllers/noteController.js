class NoteController {
    constructor(actionBlockService, noteService, pageService) {
        this.actionBlockService = actionBlockService;
        this.noteService = noteService;
        this.pageService = pageService;

        this.model = new NoteModel();
        this.view = new NoteView();

        this.bindViewEvents();
    }


    bindViewEvents() {
        this.view.bindClickBtnClose(this.#onClose);
    }

    #onClose = () => {
        this.noteService.close();
        
        if (window.location.hash.includes('#editActionBlock')) {
            this.actionBlockService.setDefaultValuesForSettingsElementsActionBlock();
        }

        this.pageService.openPreviousPage();
    }
}