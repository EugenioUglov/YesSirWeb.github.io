class VoiceRecognitionController {
    constructor(voiceRecognitionService, observable) {
        this.model = new VoiceRecognitionModel();
        this.view = new VoiceRecognitionView();
        this.observable = observable;
        this.event = this.model.getEvent();
        this.voiceRecognitionService = voiceRecognitionService;
        this.recognizer;
        //this.initOld();
        //this.#init();
        this.#bindViewEvenets();
    }

    #init() {
        const that = this;
        

        if ('webkitSpeechRecognition' in window) {
            // Создаем распознаватель
            this.recognizer = new webkitSpeechRecognition();

            // Ставим опцию, чтобы распознавание началось ещё до того, как пользователь закончит говорить
            this.recognizer.interimResults = true;
            
            // Какой язык будем распознавать?
            this.recognizer.lang = 'en-En';
        
            const that = this;
            let isFinalResult = false;

            // Используем колбек для обработки результатов
            this.recognizer.onresult = function (event) {
                let result = event.results[event.resultIndex];

                if (result.isFinal) {
                    isFinalResult = true;
                    const final_transcript = result[0].transcript;                    
                    input_field_request.style.color = 'black';
                    const last_character_final_transcript = final_transcript[final_transcript.length - 1];

                    if (last_character_final_transcript === '.') {
                        final_transcript = final_transcript.substr(0, final_transcript.length - 1);
                    }
                    
                    window.location.hash = '#request=' + final_transcript + '&executebytitle=true';
                } else {
                    const interim_transcript = result[0].transcript;

                    window.location.hash = '#request=' + interim_transcript + '&executebytitle=false';
                }
            }

            this.recognizer.onend = function() {
                if (isFinalResult === false && that.voiceRecognitionService.isRecognizing()) that.voiceRecognitionService.startRecognizing();
                else {
                    this.isRecognizing = false;
                }
            }
        }
    }

    

    #bindViewEvenets() {
        this.view.bindClickBtnVoiceRecognition(this.onClickBtnVoiceRecognition);
    }


    onClickBtnVoiceRecognition = () => {
        const that = this;
        console.log('isrec', this.voiceRecognitionService.isRecognizing());

        if (this.voiceRecognitionService.isRecognizing()) {
            this.voiceRecognitionService.stopRecognizing();
        }
        else {
            this.voiceRecognitionService.startRecognizing(onInterimTranscript, onFinalTranscript);

            function onInterimTranscript(interim_transcript) {
                window.location.hash = '#request=' + interim_transcript + '&executebytitle=false';
            }

            function onFinalTranscript(final_transcript) {                   
                input_field_request.style.color = 'black';
                const last_character_final_transcript = final_transcript[final_transcript.length - 1];

                if (last_character_final_transcript === '.') {
                    final_transcript = final_transcript.substr(0, final_transcript.length - 1);
                }

                window.location.hash = '#request=' + final_transcript + '&executebytitle=true' + '&listen';
            }
        }
    }

    /*
    startRecognizing = (event) => {
        if (this.isRecognizing) return;
        
        console.log('start voice recognition');
        this.recognizer.start();
        this.isRecognizing = true;
    }
    
    stopRecognizing = (event) => {
        if (this.isRecognizing === false) return;

        console.log('stop voice recognition');
        this.recognizer.stop();
        this.isRecognizing = false;
    }
    */
 

    initOld() {
        const that = this;

        const languages = this.model.getLanguages();

        function onClickBtnVoiceRecognition(event) {
            console.log('start voice recognition');
            startButton(event);
        }

        this.view.bindClickBtnVoiceRecognition(onClickBtnVoiceRecognition);

        //  dropBoxMenu.addItem(element, textDropDownMenu, textRightDropDownMenu);
        const voiceRecognition = {};

        let continuos_speech_text = "";

        let dropdown_select_language = document.getElementById('dropdown_select_language');

        let final_transcript = '';
        let recognizing = false;
        let ignore_onend;
        let start_timestamp;

        dropdown_select_language.addEventListener('click', function(e) {
            updateDialect();
        });

        for (let i = 0; i < languages.length; i++) {
            dropdown_select_language.options[i] = new Option(languages[i][0], i);
        }



        updateDialect();
        //select_dialect.selectedIndex = 6;

        if(localStorage.getItem('i_language') != undefined) {
            console.log('LOAD from local storage: the last used language is: ' + 
                dropdown_select_language[localStorage.getItem('i_language')].text);

            dropdown_select_language.selectedIndex = localStorage.getItem('i_language');
        }

        // retrieve the jQuery wrapped dom object identified by the selector '#mySel'
        let sel = $('#dropdown_select_language');
        // assign a change listener to it
        sel.change(function(){ //inside the listener
            // retrieve the value of the object firing the event (referenced by this)
            let i_language = $(this).val();

            localStorage.setItem('i_language', i_language);
        }); // close the change listener


        function updateDialect() {
            for (let i = select_dialect.options.length - 1; i >= 0; i--) {
                select_dialect.remove(i);
            }
            
            let list = languages[dropdown_select_language.selectedIndex];

            for (let i = 1; i < list.length; i++) {
                select_dialect.options.add(new Option(list[i][1], list[i][0]));
            }
            
            select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
        }



        function onload() { 
            
        }

        let recognition;


        if (!('webkitSpeechRecognition' in window)) {
            upgrade();
        } else {
            recognition = new webkitSpeechRecognition();
            
            btn_voice_recognition.style.display = 'inline-block';

            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onstart = function() {
                recognizing = true;
                img_voice_recognition.src = './icons/mic-animate.gif';

                const event_start = {
                    name: that.event.start,
                    data: 'Speak recognition: Speak now'
                }

                that.observable.dispatchEvent(event_start.name, event_start.data);
            };

            recognition.onerror = function(event) {
                if (event.error == 'no-speech') {
                    img_voice_recognition.src = './icons/mic.gif';
                    ignore_onend = true;

                    if (that.observable) {
                        const event_error = {
                            name: that.event.error.no_speech,
                            data: 'Speak recognition: No speech' 
                        }

                        that.observable.dispatchEvent(event_error.name, event_error.data);
                    }
                }
                if (event.error == 'audio-capture') {
                    img_voice_recognition.src = './icons/mic.gif';
                    ignore_onend = true;
                    
                    if (that.observable) {
                        const event_error = {
                            name: that.event.error.audio_capture,
                            data: 'Speak recognition: Microphone weren\'t found'
                        }

                        that.observable.dispatchEvent(event_error.name, event_error.data);
                    }
                }
                if (event.error == 'not-allowed') {
                    if (event.timeStamp - start_timestamp < 100) {
                        if (that.observable) {
                            const event_error = {
                                name: that.event.error.not_allowed,
                                data: 'Speak recognition: Not-allowed'
                            }
    
                            that.observable.dispatchEvent(event_error.name, event_error.data);
                        }
                } else {
                    if (that.observable) {
                        const event_error = {
                            name: that.event.error.not_allowed,
                            data: 'Speak recognition: Speech denied'
                        }

                        that.observable.dispatchEvent(event_error.name, event_error.data);
                    }
                }

                ignore_onend = true;

                }
            };

            recognition.onend = function() {
                recognizing = false;

                if (ignore_onend) {
                    return;
                }

                img_voice_recognition.src = './icons/mic.gif';

                if ( ! final_transcript) {
                    // Speak recognition: Speak continue.
                    return;
                }
                
                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                    let range = document.createRange();
                    range.selectNode(document.getElementById('final_span'));
                    window.getSelection().addRange(range);
                }

            };

            recognition.onresult = function(event) {
                let input_field_request = document.getElementById('input_field_request');
                let interim_transcript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final_transcript += event.results[i][0].transcript;
                        onSpeechResult(final_transcript);
                    } else {
                        interim_transcript += event.results[i][0].transcript;
                        onContinousResult(interim_transcript);
                    }
                }

                final_transcript = capitalize(final_transcript);
                
                // Paste text to big speech field
                //final_span.innerHTML = linebreak(final_transcript);
                //interim_span.innerHTML = linebreak(interim_transcript);
                continuos_speech_text = interim_transcript;


                // if coninous speech.
                if (interim_transcript) {
                    // Set text continous.
                    //input_field_request.value = continuos_speech_text;
                    // Set color for text.
                    //input_field_request.style.color = 'gray';
                    
                    if 
                    (
                        interim_transcript.includes('ok') || interim_transcript.includes('okay') || 
                        interim_transcript.includes('enter') || interim_transcript.includes('accept') || 
                        interim_transcript.includes('finish') || interim_transcript.includes('stop') || interim_transcript.includes('принять') || 
                        interim_transcript.includes('finito')
                    ) {
                        recognition.stop();
                    }

                    window.location.hash = '#request=' + interim_transcript + '&executebytitle=false';
                    
                }
                // if finish speech.
                else if (final_transcript) {
                    recognition.stop();
                    input_field_request.style.color = 'black';
                    const last_character_final_transcript = final_transcript[final_transcript.length - 1];

                    if (last_character_final_transcript === '.') {
                        final_transcript = final_transcript.substr(0, final_transcript.length - 1);
                    }

                    window.location.hash = '#request=' + final_transcript + '&executebytitle=true';

                    final_transcript = '';
                }
            };
        }

        // Android works just with this result. PC works with this (final result) and continuos speech result.
        function onSpeechResult(speech_text) {
            let language = 'en';

            console.log('user phrase: ', speech_text);
            
            //document.body.innerHTML += 'finish';
            let selected_language_user = dropdown_select_language.options[dropdown_select_language.selectedIndex].text;
            

            // ENGLISH
            if(selected_language_user === 'English'){
                // Execute action on get phrase.
                
                language = 'en';

                if(speech_text.includes('stop')) {
                    if (recognizing) {
                        recognition.stop();
                        return;
                    }
                }
            }

            // RUSSIAN
            else if(selected_language_user === 'Pусский') {
                console.log('selected_language_user: ' + selected_language_user);

                language = 'ru';

                if(speech_text.includes('стоп')) {
                    if (recognizing) {
                        recognition.stop();
                        return;
                    }
                }
            }
            
            else if(selected_language_user === 'Italiano') {
                language = 'it';
                
                if(speech_text.includes('ferma')) {
                    if (recognizing) {
                        recognition.stop();
                        return;
                    }
                }
            }
            
            //system.onGetPhrase(speech_text, language);
        }

        function onContinousResult(speech_text) {
        }

        updateDialect();

        function upgrade() {
            btn_voice_recognition.style.visibility = 'hidden';
        }


        function linebreak(s) {
            let two_line = /\n\n/g;
            let one_line = /\n/g;

            return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
        }


        function capitalize(s) {
            let first_char = /\S/;
            
            return s.replace(first_char, function(m) { return m.toUpperCase(); });
        }




        function startButton(event) {
            if (recognizing) {
                recognition.stop();
                return;
            }
            final_transcript = '';
            recognition.lang = select_dialect.value;
            recognition.start();
            ignore_onend = false;
            img_voice_recognition.src = './icons/mic-slash.gif';
            start_timestamp = event.timeStamp;
        }

        function showInfo(s) {
            /*
            if (s) {
                for (let child = info.firstChild; child; child = child.nextSibling) {
                    if (child.style) {
                        child.style.display = child.id == s ? 'inline' : 'none';
                    }
                }
                info.style.visibility = 'visible';
            } else {
                info.style.visibility = 'hidden';
            }
            */
        }



        voiceRecognition.stop = function() {
            if (recognizing) {
                recognition.stop();
            }
        }


        function onValueChangedInfoDropDown(selected) {
            let selectedValue = selected.value;
            alert(selectedValue);

            // set value in combobox: None Film
            info_dropdownList.selectedIndex = 0;

            //let selectIndex=selectObj.selectedIndex;
            //let selectValue=selectObj.options[selectIndex].text;
            //let output=document.getElementById("output");
            //alert(selected_film.value);
            //output.innerHTML=selectValue;
        }
    }
}