class NoteService {
    constructor(noteSpeakerService, hashService) {
        this.noteSpeakerService = noteSpeakerService;
        this.hashService = hashService;

        this.model = new NoteModel();
        this.view = new NoteView();
    }

    openNote(content, title, isHTML) {
        const that = this;
        const elements_to_show = this.view.showInfo(content, title, isHTML);

        elements_to_show.forEach(element_to_show => {
            that.hashService.showElement(element_to_show);
        });
        

        if (isHTML === false) {
            const BTN_SPEAKER = this.noteSpeakerService.showBtnSpeaker();
            
            this.hashService.showElement(BTN_SPEAKER);
        }

        if (window.location.hash.includes('&listen')) {
            this.noteSpeakerService.speak();
        }
    }

    close = () => {
        yesSir.voiceRecognitionService.stopRecognizing();
        this.noteSpeakerService.removeFromPage();
    }

    bindClickBtnClose(handler) {
        this.view.bindClickBtnClose(handler);
    }
}