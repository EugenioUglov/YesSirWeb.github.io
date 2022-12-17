class VoiceRecognitionManager {
    constructor() {
        this.#init();
    }

    #is_recognizing = false;
    #recognizer;
    #languages =
    [
        ['English',         ['en-US', 'United States'],
                            ['en-AU', 'Australia'],
                            ['en-CA', 'Canada'],
                            ['en-IN', 'India'],
                            ['en-NZ', 'New Zealand'],
                            ['en-ZA', 'South Africa'],
                            ['en-GB', 'United Kingdom']],
        ['Italiano',        ['it-IT', 'Italia'],
                            ['it-CH', 'Svizzera']],
        ['Español',         ['es-AR', 'Argentina'],
                            ['es-BO', 'Bolivia'],
                            ['es-CL', 'Chile'],
                            ['es-CO', 'Colombia'],
                            ['es-CR', 'Costa Rica'],
                            ['es-EC', 'Ecuador'],
                            ['es-SV', 'El Salvador'],
                            ['es-ES', 'España'],
                            ['es-US', 'Estados Unidos'],
                            ['es-GT', 'Guatemala'],
                            ['es-HN', 'Honduras'],
                            ['es-MX', 'México'],
                            ['es-NI', 'Nicaragua'],
                            ['es-PA', 'Panamá'],
                            ['es-PY', 'Paraguay'],
                            ['es-PE', 'Perú'],
                            ['es-PR', 'Puerto Rico'],
                            ['es-DO', 'República Dominicana'],
                            ['es-UY', 'Uruguay'],
                            ['es-VE', 'Venezuela']],
        ['Pусский',         ['ru-RU']],
    ];
    
    #init() {
        if (this.isBrowserSupportRecognition()) {
            // Create recognizer.
            this.#recognizer = new webkitSpeechRecognition();

            // Option for recognizing even before user stop to talk.
            this.#recognizer.interimResults = true;
        }
        else {
            console.log('Warning! Speech recognition is not supported in this browser');
        }
    }

    startRecognizing = (option = {
        callbackStart: undefined,
        callbackInterimTranscript: undefined, 
        callbackFinalTranscript: undefined, 
        callbackEnd: undefined,
        callbackError: undefined,
        language: undefined}) => {    
            const that = this;

            const callbackStart = option.callbackStart;
            const callbackInterimTranscript = option.callbackInterimTranscript;
            const callbackFinalTranscript = option.callbackFinalTranscript;
            const callbackEnd = option.callbackEnd;
            const callbackError = option.callbackError;
            const recognition_language = option.language != undefined ? option.language : 'en-US';

            let is_final_result = false;
            
            this.#recognizer.lang = recognition_language;
            this.#recognizer.start();
            this.#is_recognizing = true;

            this.#recognizer.onstart = function() {
                if (callbackStart) callbackStart();
            }

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
                that.startRecognizing(option);
            }
            else {
                that.#is_recognizing = false;
                if (callbackEnd) callbackEnd();
            }
        }

        this.#recognizer.onerror = function() {
            if (callbackError) callbackError();
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