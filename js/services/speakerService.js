class SpeakerService {
    constructor() {
        this.model = new SpeakerModel();
        this.view = new SpeakerView();
    }

    #language = 'en-US';
    #text_to_speak = '';

    speak(text_to_speak = this.#text_to_speak, callbackEndSpeak) {
        const message = new SpeechSynthesisUtterance();
        message.lang = this.#language;
        message.text = text_to_speak;
        const speak_bot = message;

        speak_bot.onend = () => {
            if (callbackEndSpeak) callbackEndSpeak();
        }

        window.speechSynthesis.speak(message);
    }

    stopSpeak() {
        window.speechSynthesis.cancel();
    }

    setLanguage(new_language) {
        this.#language = new_language;
    }

    setTextToSpeak(new_text_to_speak) {
        this.#text_to_speak = new_text_to_speak;
    }
}