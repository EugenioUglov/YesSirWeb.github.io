class SpeakerController {
    constructor(observable) {
        this.view = new SpeakerView(this);
        this.model =  new SpeakerModel();
        this.observable = observable;

        this.#setListeners();
        this.#bindViewEvents();
    }
    

    speak(text_to_speak, onEndSpeak) {
        this.model.is_speaking_now = true;
        this.model.text_to_speak = text_to_speak;

        const speak_bot = this.view.speak(text_to_speak);

        speak_bot.onend = () => {
            this.view.changeTextForSpeakButton('Speak');
            this.model.is_speaking_now = false;
            if (onEndSpeak) onEndSpeak();
        }
    }

    stopSpeak() {
        this.view.stop();
        this.model.is_speaking_now = false;
    }

    onClickBtnSpeak = () => {
        if (this.model.is_speaking_now) {
            this.stopSpeak();
        }
        else {
            this.speak(this.model.text_to_speak);
        }
    }

    setTextForSpeech(text) {
        this.model.text_to_speak = text;
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