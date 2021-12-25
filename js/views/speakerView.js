const speakerView = {};

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