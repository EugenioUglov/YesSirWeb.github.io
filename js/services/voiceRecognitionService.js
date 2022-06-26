class VoiceRecognitionService {
    constructor(voiceRecognitionManager, pageService) {
        this.voiceRecognitionManager = voiceRecognitionManager;
        this.pageService = pageService;
    }

    #view = new VoiceRecognitionView();

    showSettings() {
        this.view.showSettings();
    }

    startRecognizing = () => {
        const that = this;
        const option = {
            callbackInterimTranscript: onInterimTranscript, 
            callbackFinalTranscript: onFinalTranscript, 
            callbackEnd: onEnd
        };

        that.#view.showProgressRecognition();

        function onInterimTranscript(interim_transcript) {
            
            that.pageService.setHashRequest({
                request_value: interim_transcript, 
                is_execute_actionBlock_by_title: false
            });
        }

        function onFinalTranscript(final_transcript) {                   
            input_field_request.style.color = 'black';
            const last_character_final_transcript = final_transcript[final_transcript.length - 1];

            if (last_character_final_transcript === '.') {
                final_transcript = final_transcript.substr(0, final_transcript.length - 1);
            }

            that.pageService.setHashRequest({
                request_value: final_transcript,
                is_execute_actionBlock_by_title: true,
                is_listen_text: true
            });
        }

        function onEnd() {
            that.#onStopRecognizing();
        }

        this.voiceRecognitionManager.startRecognizing(option);
    }
    
    stopRecognizing = () => {
        this.voiceRecognitionManager.stopRecognizing();
        this.#onStopRecognizing();
    }

    setLanguge(new_language) {
        this.voiceRecognitionManager.setLanguge(new_language)
    }

    isRecognizing() {
        return this.voiceRecognitionManager.isRecognizing();
    }


    #onStopRecognizing() {
        this.#view.showStopRecognition();
    }
}