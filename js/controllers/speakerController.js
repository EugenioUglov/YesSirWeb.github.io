class SpeakerController {
    constructor(speakerService) {
        this.view = new SpeakerView();
        this.speakerService = speakerService;

        this.#bindViewEvents();
    }
    
    #is_speaking_now = false;

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

    onClickBtnSpeak = () => {
        if (this.#is_speaking_now) {
            this.stopSpeak();
        }
        else {
            this.speak();
        }
    }



    #bindViewEvents() {
        this.view.bindClickBtnSpeak(this.onClickBtnSpeak);
    }
}