class NoteService {
    constructor(noteSpeakerService) {
        this.noteSpeakerService = noteSpeakerService;

        this.model = new NoteModel();
        this.view = new NoteView();
    }

    openNote(content, title, isHTML) {
        this.view.showInfo(content, title, isHTML);
        console.log('ishtml', isHTML);

        if (isHTML === false) {
            this.noteSpeakerService.showBtnSpeaker();
        }
    }

    close = () => {
        this.view.close();
        
        this.noteSpeakerService.hideBtnSpeaker();
        this.noteSpeakerService.stopSpeak();
    }

    bindClickBtnClose(handler) {
        this.view.bindClickBtnClose(handler);
    }
}