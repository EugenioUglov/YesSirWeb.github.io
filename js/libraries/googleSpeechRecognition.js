class GoogleSpeechRecognition {
    constructor() {
        this.#init();
    }

    #is_recognizing = false;
    #speechRecognition;
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
        // if (this.isBrowserSupportRecognition()) {
        //     // Create recognizer.
        //     this.#speechRecognition = new webkitSpeechRecognition();

        //     // Option for recognizing even before user stop to talk.
        //     this.#speechRecognition.interimResults = true;
        // }
        // else {
        //     console.log('Warning! Speech recognition is not supported in this browser');
        // }
    }

    startRecognizing = (option = {
        language: undefined,
        seconds_to_stop_recognizing_on_no_speech: undefined,
        callbackStart: undefined,
        callbackInterimTranscript: undefined, 
        callbackFinalTranscript: undefined,
        callbackFullTranscript: undefined,
        callbackEnd: undefined,
        callbackError: undefined
    }) => {    
        const that = this;

        console.log(option);

        const callbackStart = option.callbackStart;
        const callbackInterimTranscript = option.callbackInterimTranscript;
        const callbackFinalTranscript = option.callbackFinalTranscript;
        const callbackFullTranscript = option.callbackFullTranscript;
        const callbackEnd = option.callbackEnd;
        const callbackError = option.callbackError;
        const recognition_language = option.language != undefined ? option.language : 'en-US';
        let seconds_to_stop_recognizing_on_no_speech = option.seconds_to_stop_recognizing_on_no_speech != undefined ? option.seconds_to_stop_recognizing_on_no_speech : 0;

        let is_final_result = false;
        let timer_to_stop_speech_recognition;
        let full_transcript = "";
        
        this.#speechRecognition.lang = recognition_language;
        this.#speechRecognition.start();
        this.#is_recognizing = true;
        this.#speechRecognition.continuous = false;

        this.#speechRecognition.onstart = function() {
            if (callbackStart) callbackStart();
        }

        // Используем колбек для обработки результатов
        this.#speechRecognition.onresult = function (event) {
            let result = event.results[event.resultIndex];
            let interim_transcript;

            if (result.isFinal) {
                is_final_result = true;
                const final_transcript = result[0].transcript;
                full_transcript += final_transcript + " ";
                
                if (callbackFinalTranscript) callbackFinalTranscript(final_transcript);
                seconds_to_stop_recognizing_on_no_speech = option.seconds_to_stop_recognizing_on_no_speech;
                setTimerToStopSpeechRecognition(seconds_to_stop_recognizing_on_no_speech);

            }
            else {
                interim_transcript = result[0].transcript;
                if (callbackInterimTranscript) callbackInterimTranscript(interim_transcript);
                seconds_to_stop_recognizing_on_no_speech = option.seconds_to_stop_recognizing_on_no_speech;
                setTimerToStopSpeechRecognition(seconds_to_stop_recognizing_on_no_speech);
            }
            yesSir.modalBoxService.show({body_text: interim_transcript, footer_text: full_transcript, header_text: 'Speech assisstent'});
        }

        this.#speechRecognition.onend = function() {
            console.log("onend");
            if (is_final_result === false && that.#is_recognizing) { 
                that.startRecognizing(option);
            }
            else {
                that.#is_recognizing = false;
                if (callbackEnd) callbackEnd();
            }
        }

        this.#speechRecognition.onerror = function() {
            if (callbackError) callbackError();
        }

        function setTimerToStopSpeechRecognition(new_seconds) {
            console.log(callbackFullTranscript);

            if (timer_to_stop_speech_recognition) clearInterval(timer_to_stop_speech_recognition);
            timer_to_stop_speech_recognition = setTimeout(
                () => {
                    if (callbackFullTranscript) callbackFullTranscript(full_transcript); 
                    that.stopRecognizing();
                },
                new_seconds * 1000
            );
        }
    }

    startContinuousRecognizing(option = {
        language: undefined,
        seconds_to_stop_recognizing_on_no_speech: undefined,
        callbackFullTranscript: undefined,
        callbackFinalPhraseTranscript: undefined,
        callbackInterimPhraseTranscript: undefined
    }) {
        if (this.isBrowserSupportRecognition() === false) {
            alert('Warning! Speech recognition is not supported in this browser');
            return;
        }

        const that = this;
        let full_transcript = "";
        const speechRecognition = new webkitSpeechRecognition();


        // Set the properties for the Speech Recognition object
        speechRecognition.continuous = true;
        speechRecognition.interimResults = true;
        speechRecognition.lang = 'en-US';
        let timer_to_stop_speech_recognition;
        this.#is_recognizing = true;
        
        const seconds_to_stop_recognizing_on_no_speech = option.seconds_to_stop_recognizing_on_no_speech != undefined ? option.seconds_to_stop_recognizing_on_no_speech : 3;
        const callbackFullTranscript = option.callbackFullTranscript;
        const callbackFinalPhraseTranscript = option.callbackFinalPhraseTranscript;
        const callbackInterimPhraseTranscript = option.callbackInterimPhraseTranscript;
    
        speechRecognition.onstart = () => {
            console.log("Start");
        };
        speechRecognition.onerror = () => {
            console.log("error");
        };
        speechRecognition.onend = () => {
            console.log("end");
            this.#is_recognizing = false;
        };
    
        speechRecognition.onresult = (event) => {
            let final_transcript = '';
            let interim_transcript = '';
            let isFinal = false;

            // Loop through the results from the speech recognition object.
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                    full_transcript += final_transcript + '. ';
                    isFinal = true;
                    console.log(final_transcript);

                    if (callbackFinalPhraseTranscript) callbackFinalPhraseTranscript(final_transcript);

                    setTimerToStopSpeechRecognition(seconds_to_stop_recognizing_on_no_speech);
                } else {
                    interim_transcript += event.results[i][0].transcript;
                    console.log(interim_transcript);
                    if (callbackInterimPhraseTranscript) callbackInterimPhraseTranscript(interim_transcript);
                    setTimerToStopSpeechRecognition(seconds_to_stop_recognizing_on_no_speech);
                }
            }

            if (isFinal) {
            }
        };

        function setTimerToStopSpeechRecognition(new_seconds) {
            if (timer_to_stop_speech_recognition) clearInterval(timer_to_stop_speech_recognition);

            timer_to_stop_speech_recognition = setTimeout(
                () => {
                    if (callbackFullTranscript) callbackFullTranscript(full_transcript); 
                    // that.stopRecognizing();
                    speechRecognition.stop();
                    that.#is_recognizing = false;
                },
                new_seconds * 1000
            );
        }
        
        speechRecognition.start();      
    }


    startContinuousRecognizingTest(option = {
        language: undefined,
        seconds_to_stop_recognizing_on_no_speech: undefined,
        callbackFullTranscript: undefined,
        callbackFinalPhraseTranscript: undefined,
        callbackInterimPhraseTranscript: undefined
    }) {
        const that = this;
        let full_transcript = "";

        // this.#speechRecognition = new webkitSpeechRecognition();
        // Set the properties for the Speech Recognition object
        this.#speechRecognition.continuous = true;
        this.#speechRecognition.interimResults = true;
        this.#speechRecognition.lang = 'en-US';
        let timer_to_stop_speech_recognition;
        this.#is_recognizing = true;
        
        const seconds_to_stop_recognizing_on_no_speech = option.seconds_to_stop_recognizing_on_no_speech != undefined ? option.seconds_to_stop_recognizing_on_no_speech : 3;
        const callbackFullTranscript = option.callbackFullTranscript;
        const callbackFinalPhraseTranscript = option.callbackFinalPhraseTranscript;
        const callbackInterimPhraseTranscript = option.callbackInterimPhraseTranscript;
    
        this.#speechRecognition.onstart = () => {
            console.log("Start");
        };
        this.#speechRecognition.onerror = () => {
            console.log("error");
        };
        this.#speechRecognition.onend = () => {
            console.log("end");
            this.#is_recognizing = false;
        };
    
        this.#speechRecognition.onresult = (event) => {

            let final = "";
            let interim = "";

            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript
                    if (callbackFinalPhraseTranscript) callbackFinalPhraseTranscript(final);
                    console.log('final: ' + final)
                    setTimerToStopSpeechRecognition(seconds_to_stop_recognizing_on_no_speech);
                } else {
                    interim += event.results[i][0].transcript
                    console.log('interim: ' + interim)

                    if (callbackInterimPhraseTranscript) callbackInterimPhraseTranscript(interim);
                    setTimerToStopSpeechRecognition(seconds_to_stop_recognizing_on_no_speech);
                }
            }

            //!!!
            // let final_transcript = '';
            // let interim_transcript = '';
            // let isFinal = false;
            // // Loop through the results from the speech recognition object.
            // for (let i = event.resultIndex; i < event.results.length; ++i) {
            //     // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
            //     if (event.results[i].isFinal) {
            //         final_transcript += event.results[i][0].transcript;
            //         full_transcript += final_transcript + '. ';
            //         isFinal = true;
            //         console.log(final_transcript);

            //         if (callbackFinalPhraseTranscript) callbackFinalPhraseTranscript(final_transcript);

            //         setTimerToStopSpeechRecognition(seconds_to_stop_recognizing_on_no_speech);
            //     } else {
            //         interim_transcript += event.results[i][0].transcript;
            //         console.log(interim_transcript);
            //         if (callbackInterimPhraseTranscript) callbackInterimPhraseTranscript(interim_transcript);
            //         setTimerToStopSpeechRecognition(seconds_to_stop_recognizing_on_no_speech);
            //     }
            // }

            // if (isFinal) {
            // }
        };

        function setTimerToStopSpeechRecognition(new_seconds) {
            if (timer_to_stop_speech_recognition) clearInterval(timer_to_stop_speech_recognition);

            timer_to_stop_speech_recognition = setTimeout(
                () => {
                    if (callbackFullTranscript) callbackFullTranscript(full_transcript); 
                    that.stopRecognizing();
                },
                new_seconds * 1000
            );
        }
        
        this.#speechRecognition.start();      
    }

    startRecognizingTest(option = {
        language: undefined,
        seconds_to_stop_recognizing_on_no_speech: undefined,
        callbackStart: undefined,
        callbackInterimTranscript: undefined, 
        callbackFinalTranscript: undefined,
        callbackFullTranscript: undefined,
        callbackEnd: undefined,
        callbackError: undefined
    }) {
        const callbackInterimTranscript = option.callbackInterimTranscript;
        const callbackFinalTranscript = option.callbackFinalTranscript;

        var recognizing;
        var recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.start();
        
        recognition.onresult = function (event) {
            let final = "";
            let interim = "";

            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript
                    if (callbackFinalTranscript) callbackFinalTranscript(final);
        
                } else {
                    interim += event.results[i][0].transcript
                    if (callbackInterimTranscript) callbackInterimTranscript(interim);
                }
            }
        }
    }
    
    stopRecognizing = () => {
        if (this.#is_recognizing === false) return;

        this.#speechRecognition.stop();
        this.#is_recognizing = false;
    }

    setLanguge(new_language) {
        this.#speechRecognition.lang = new_language;
    }

    isRecognizing() {
        return this.#is_recognizing;
    }

    isBrowserSupportRecognition() {
        return 'webkitSpeechRecognition' in window;
    }


}