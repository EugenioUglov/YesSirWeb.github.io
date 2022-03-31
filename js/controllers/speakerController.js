class SpeakerController {
    constructor(speakerService, observable) {
        this.view = new SpeakerView(this);
        this.observable = observable;
        this.speakerService = speakerService;

        this.#setListeners();
        this.#bindViewEvents();
    }
    
    #is_speaking_now = false;
    #text_to_speak = false;

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

    setTextForSpeech(text) {
        this.speakerService.setTextToSpeak(text);
    }

    #setListeners() {
        const that = this;

        this.observable.listen('noteClosed', function(observable, eventType, data) {
            that.stopSpeak();
            that.setTextForSpeech('');
            that.view.hideBtnSpeakContent();
        });

        this.observable.listen('actionBlockNoteExecuted', function(observable, eventType, data) {
            that.setTextForSpeech(data.content);
        });
    }

    #bindViewEvents() {
        this.view.bindClickBtnSpeak(this.onClickBtnSpeak);
    }
}