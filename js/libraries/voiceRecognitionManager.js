class VoiceRecognitionManager {
    constructor() {
        this.#init();
    }

    #is_recognizing = false;
    #recognizer;
    
    #init() {
        if (this.isBrowserSupportRecognition) {
            // Create recognizer.
            this.#recognizer = new webkitSpeechRecognition();

            // Option for recognizing even before user stop to talk.
            this.#recognizer.interimResults = true;
            
            // Language for recognizing.
            this.#recognizer.lang = 'en-En';
        }
        else {
            console.log('Warning! Speech recognition is not supported in this browser');
        }
    }

    
    startRecognizing = (callbackInterimTranscript, callbackFinalTranscript, cllbackEnd) => {
        const that = this;

        let is_final_result = false;
        
        this.#recognizer.start();
        this.#is_recognizing = true;

        // Используем колбек для обработки результатов
        this.#recognizer.onresult = function (event) {
            let result = event.results[event.resultIndex];

            if (result.isFinal) {
                is_final_result = true;
                const final_transcript = result[0].transcript;
                
                if (callbackFinalTranscript) callbackFinalTranscript(final_transcript);
            }
            else {
                const interim_transcript = result[0].transcript;

                if (callbackInterimTranscript) callbackInterimTranscript(interim_transcript);
            }
        }

        this.#recognizer.onend = function() {
            if (is_final_result === false && that.#is_recognizing) { 
                that.startRecognizing(callbackInterimTranscript, callbackFinalTranscript, cllbackEnd);
            }
            else {
                that.#is_recognizing = false;
                if (cllbackEnd) cllbackEnd();
            }
        }
    }
    
    stopRecognizing = () => {
        if (this.#is_recognizing === false) return;

        this.#recognizer.stop();
        this.#is_recognizing = false;
    }

    setLanguge(new_language) {
        this.#recognizer.lang = new_language;
    }

    isRecognizing() {
        return this.#is_recognizing;
    }

    isBrowserSupportRecognition() {
        return 'webkitSpeechRecognition' in window;
    }
}