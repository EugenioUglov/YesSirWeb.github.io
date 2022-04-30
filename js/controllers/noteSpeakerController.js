class NoteSpeakerController {
    constructor(noteService, speakerController) {
        this.noteService = noteService;
        this.speakerController = speakerController;
        
        this.model = new NoteSpeakerModel();
        this.view = new NoteSpeakerView();

        this.#init();
    }

    #init() {
        this.noteService.view.bindClickBtnClose(this.#onNoteClosed);
    }

    #onNoteClosed() {
        that.speakerController.stopSpeak();
        that.speakerController.setTextForSpeech('');
        that.speakerController.view.hideBtnSpeakContent();
    }
}