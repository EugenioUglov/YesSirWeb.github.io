class GoogleTextToSpeech {
    constructor() {

    }

    #is_speaking = false;

    speak(text_to_speak, language = 'en-US', callbackEndSpeak) {
        const that = this;

        const speechSynthesis = new SpeechSynthesisUtterance();
        speechSynthesis.lang = language;
        speechSynthesis.text = text_to_speak;
        const speak_bot = speechSynthesis;
        this.#is_speaking = true;

        speak_bot.onend = () => {
            that.#is_speaking = false;
            if (callbackEndSpeak) callbackEndSpeak();
        }

        window.speechSynthesis.speak(speechSynthesis);
    }

    stopSpeak() {
        window.speechSynthesis.cancel();
        this.#is_speaking = false;
    }

    isSpeaking() {
        return this.#is_speaking;
    }
}
