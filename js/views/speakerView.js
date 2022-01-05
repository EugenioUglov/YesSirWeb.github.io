class SpeakerView {
    constructor(controller) {
        this.controller = controller; 
        this.btn_speaker = $('.btn_speak');

        this.setListeners();
    }

    speak(text, language = 'en-US') {
        const message = new SpeechSynthesisUtterance();
        message.lang = language;
        message.text = text;
        window.speechSynthesis.speak(message);
       
        this.changeTextForSpeakButton('Stop speak');
        
        return message;
    }

    stop() {
        window.speechSynthesis.cancel();
        this.changeTextForSpeakButton('Speak');
    }

    changeTextForSpeakButton(text) {
        const buttons_speakers = this.btn_speaker;

        for(const btn_speaker of buttons_speakers) {
            btn_speaker.innerText = text;
        }
    }

    setListeners() {
        this.btn_speaker.on('click', () => this.controller.onClickBtnSpeak(event));
    }
}