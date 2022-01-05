class SpeakerController {
    constructor(observable) {
        this.speakerView = new SpeakerView(this);
        this.speakerModel =  new SpeakerModel();
        this.observable = observable;

        this.setListeners();
    }
    
    speakHandler() {
        if (this.speakerModel.is_speaking_now) {
            this.stopSpeak();
        }
        else {
            this.speak(this.speakerModel.text_to_speak);
        }
    }

    speak(text_to_speak) {
        this.speakerModel.is_speaking_now = true;
        this.speakerModel.text_to_speak = text_to_speak;

        const speak_bot = this.speakerView.speak(text_to_speak);

        speak_bot.onend = () => {
            this.speakerView.changeTextForSpeakButton('Speak');
            this.speakerModel.is_speaking_now = false;
        }
    }

    stopSpeak() {
        this.speakerView.stop();
        this.speakerModel.is_speaking_now = false;
    }

    onClickBtnSpeak(event) {
        // Don't close panel after click speak button.
        event.preventDefault();

        this.speakHandler();
    }

    setTextForSpeech(text) {
        this.speakerModel.text_to_speak = text;
    }

    setListeners() {
        const that = this;

        this.observable.listen('executeActionBlock', function(observable, eventType, data) {
            that.speak(data);
        });

        this.observable.listen('closeContentContainer', function(observable, eventType, data) {
            that.stopSpeak();
        });
    }

    
}





