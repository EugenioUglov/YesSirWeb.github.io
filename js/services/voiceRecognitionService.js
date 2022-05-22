class VoiceRecognitionService {
    constructor(voiceRecognitionManager) {
        this.voiceRecognitionManager = voiceRecognitionManager;
        this.view = new VoiceRecognitionView();
    }

    showSettings() {
        this.view.showSettings();
    }

    startRecognizing = (callbackInterimTranscript, callbackFinalTranscript, cllbackEnd) => {
        this.voiceRecognitionManager.startRecognizing(callbackInterimTranscript, callbackFinalTranscript, cllbackEnd);
    }
    
    stopRecognizing = () => {
        console.log('stop rec');
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