class VoiceRecognitionService {
    constructor() {
        this.#init();
    }

    #is_recognizing = false;
    #recognizer;


    #init() {
        if ('webkitSpeechRecognition' in window) {
            // Создаем распознаватель
            this.#recognizer = new webkitSpeechRecognition();

            // Ставим опцию, чтобы распознавание началось ещё до того, как пользователь закончит говорить
            this.#recognizer.interimResults = true;
            
            // Какой язык будем распознавать?
            this.#recognizer.lang = 'en-En';
        }
        else {
            console.log('Warning! Speech recognition is not supported in this browser');
        }
    }


    show() {
        this.view.show();
    }

    startRecognizing = (callbackInterimTranscript, callbackFinalTranscript, cllbackEnd) => {
        if (this.#is_recognizing) return;
        const that = this;

        let is_final_result = false;
        
        console.log('start voice recognition');
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
            if (is_final_result === false && that.#is_recognizing) that.startRecognizing();
            else {
                that.#is_recognizing = false;
                cllbackEnd();
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
}