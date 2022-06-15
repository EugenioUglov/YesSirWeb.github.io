class VoiceRecognitionService {
    constructor(voiceRecognitionManager, pageService) {
        this.voiceRecognitionManager = voiceRecognitionManager;
        this.pageService = pageService;
        this.view = new VoiceRecognitionView();
    }

    showSettings() {
        this.view.showSettings();
    }

    startRecognizing = (option = {
        callbackInterimTranscript: callbackInterimTranscript, 
        callbackFinalTranscript: callbackFinalTranscript, 
        callbackEnd: callbackEnd}) => {
            this.voiceRecognitionManager.startRecognizing(option);
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