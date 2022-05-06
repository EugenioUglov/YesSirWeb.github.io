class NoteSpeakerController {
    constructor(noteSpeakerService, noteService) {
        this.noteSpeakerService = noteSpeakerService;
        this.noteService = noteService;
        
        this.#bindViewEvents();
    }


    #onClickBtnSpeaker = () => {
        if (this.noteSpeakerService.isSpeaking()) {
            this.noteSpeakerService.stopSpeak();
        }
        else {
            this.noteSpeakerService.speak();
        }
    }


    #bindViewEvents() {
        this.noteSpeakerService.bindClickBtnSpeaker(this.#onClickBtnSpeaker);
    }
}