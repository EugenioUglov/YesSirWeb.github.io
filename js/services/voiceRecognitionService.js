class VoiceRecognitionService {
    constructor(voiceRecognitionManager) {
        this.voiceRecognitionManager = voiceRecognitionManager;
        this.view = new VoiceRecognitionView();
    }

    showSettings() {
        this.view.showSettings();
    }

    startRecognizing = (parameter = {
        callbackInterimTranscript: callbackInterimTranscript, 
        callbackFinalTranscript: callbackFinalTranscript, 
        callbackEnd: callbackEnd}) => {
            this.voiceRecognitionManager.startRecognizing(parameter);
    }
    
    stopRecognizing = () => {
        this.voiceRecognitionManager.stopRecognizing();
    }

    setLanguge(new_language) {
        this.voiceRecognitionManager.setLanguge(new_language)
    }

    isRecognizing() {
        return this.voiceRecognitionManager.isRecognizing();
    }

    isBrowserSupportRecognition() {
        return this.voiceRecognitionManager.isBrowserSupportRecognition();
    }
}