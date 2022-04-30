class SpeakerModel {
    constructor() {

    }

    #is_speaking_now = false;
    #language = 'en-US';
    #text_to_speak = '';

    speak(text_to_speak, onEndSpeak) {
        const that = this;
        this.#is_speaking_now = true;

        this.speakerService.speak(text_to_speak, onEndSpeak);
        that.view.changeTextForSpeakButton('Stop speak');

        function onEndSpeak() {
            that.view.changeTextForSpeakButton('Speak');
            that.#is_speaking_now = false;
        }
    }

    stopSpeak() {
        window.speechSynthesis.cancel();
        this.view.changeTextForSpeakButton('Speak');
        this.#is_speaking_now = false;
    }

    setTextForSpeech(text) {
        this.speakerService.setTextToSpeak(text);
    }


    #bindViewEvents() {
        this.view.bindClickBtnSpeak(this.onClickBtnSpeak);
    }

}