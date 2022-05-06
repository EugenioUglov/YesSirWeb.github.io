class SpeakerManager {
    constructor() {

    }

    #language = 'en-US';
    #is_speaking = false;

    speak(text_to_speak, callbackEndSpeak) {
        const that = this;

        const message = new SpeechSynthesisUtterance();
        message.lang = this.#language;
        message.text = text_to_speak;
        const speak_bot = message;
        this.#is_speaking = true;

        speak_bot.onend = () => {
            that.#is_speaking = false;
            if (callbackEndSpeak) callbackEndSpeak();
        }

        window.speechSynthesis.speak(message);
    }

    stopSpeak() {
        window.speechSynthesis.cancel();
        this.#is_speaking = false;
    }

    setLanguage(new_language) {
        this.#language = new_language;
    }

    isSpeaking() {
        return this.#is_speaking;
    }
}