class VoiceRecognitionService {
    constructor(voiceRecognitionManager) {
        this.voiceRecognitionManager = voiceRecognitionManager;
    }

    startRecognizing = (callbackInterimTranscript, callbackFinalTranscript, cllbackEnd) => {
        this.voiceRecognitionManager.startRecognizing(callbackInterimTranscript, callbackFinalTranscript, cllbackEnd);
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