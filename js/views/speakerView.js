class SpeakerView {
    constructor() {
        
    }

    speak(text) {
        const message = new SpeechSynthesisUtterance();
        message.lang = "en-US";
        message.text = text;
        window.speechSynthesis.speak(message);
        
        return message;
    }

    changeSpeakButtonText(btn_speaker, text) {
        btn_speaker.innerText = text;
    }

    stop() {
        window.speechSynthesis.cancel();
    }
}

/*
speakerView.start = function(text) {
    const message = new SpeechSynthesisUtterance();
    message.lang = "en-US";
    message.text = text;
    window.speechSynthesis.speak(message);
    return message;
}

speakerView.stop = function() {
    window.speechSynthesis.cancel();
}
*/