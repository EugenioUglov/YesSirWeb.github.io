class NoteSpeakerService {
    constructor(speakerManager) {
        this.speakerManager = speakerManager;
        
        this.model = new NoteSpeakerModel();
        this.view = new NoteSpeakerView();
        
    }

    speak = () => {
        this.speakerManager.speak(this.view.getContent());
        this.view.changeTextForSpeakButton('Stop');
    }

    stopSpeak() {
        this.speakerManager.stopSpeak();
        this.view.changeTextForSpeakButton('Listen');
    }

    changeTextForSpeakButton(new_text) {
        this.view.changeTextForSpeakButton(new_text);
    }

    setLanguage(new_language) {
        this.model.setLanguage(new_language);
    }

    showBtnSpeaker() {
        this.view.showBtnSpeaker();
    }

    hideBtnSpeaker() {
        this.view.hideBtnSpeaker();
    }

    bindClickBtnSpeaker = (handler) => {
        this.view.bindClickBtnSpeaker(handler);
    }

    isSpeaking() {
        return this.speakerManager.isSpeaking();
    }
}