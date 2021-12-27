class SpeakerController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.btn_speaker = undefined;
    }

    init() {
        const btn_speaker = $(".btn_speak_info")[0];
        this.btn_speaker = btn_speaker;

        btn_speaker.addEventListener('click', () => {
            this.onClickBtnSpeak(btn_speaker, event);
        });
    }

    speak() {
        const speak_bot = this.view.speak(this.model.text_to_speak);
        this.view.changeSpeakButtonText(this.btn_speaker, "Stop speak");

        speak_bot.onend = () => {
            this.view.changeSpeakButtonText(this.btn_speaker, "Speak");
            this.model.is_speaking_now = false;
        }

        this.model.is_speaking_now = true;
    }

    stopSpeak() {
        this.view.stop();
        this.view.changeSpeakButtonText(this.btn_speaker, "Speak");
        this.model.is_speaking_now = false;
    }

    onClickBtnSpeak(btn_speaker, event) {
        // Don't close panel after click speak button.
        event.preventDefault();

        if (this.model.is_speaking_now) {
            this.stopSpeak();
        }
        else {
            this.speak();
        }
    }



    setTextForSpeech(text) {
        console.log(this.model);
        this.model.text_to_speak = text;
        
    }
}




