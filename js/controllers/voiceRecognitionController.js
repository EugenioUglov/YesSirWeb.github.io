class VoiceRecognitionController {
    constructor(voiceRecognitionService, observable) {
        this.model = new VoiceRecognitionModel();
        this.view = new VoiceRecognitionView();
        this.observable = observable;
        this.event = this.model.getEvent();
        this.voiceRecognitionService = voiceRecognitionService;
        this.recognizer;

        this.#bindViewEvenets();
    }

    #bindViewEvenets() {
        this.view.bindClickBtnVoiceRecognition(this.onClickBtnVoiceRecognition);
    }


    onClickBtnVoiceRecognition = () => {
        const that = this;

        if (this.voiceRecognitionService.isRecognizing()) {
            this.voiceRecognitionService.stopRecognizing();
        }
        else {
            this.voiceRecognitionService.startRecognizing(
            //     {
            //     callbackInterimTranscript: onInterimTranscript, 
            //     callbackFinalTranscript: onFinalTranscript
            // }
            );

            // function onInterimTranscript(interim_transcript) {
            //     hashService.setHashRequest({
            //         request_value: interim_transcript, 
            //         is_execute_actionBlock_by_title: false
            //     });
            // }

            // function onFinalTranscript(final_transcript) {                   
            //     input_field_request.style.color = 'black';
            //     const last_character_final_transcript = final_transcript[final_transcript.length - 1];

            //     if (last_character_final_transcript === '.') {
            //         final_transcript = final_transcript.substr(0, final_transcript.length - 1);
            //     }

            //     hashService.setHashRequest({
            //         request_value: final_transcript,
            //         is_execute_actionBlock_by_title: true,
            //         is_listen_text: true
            //     });
            // }
        }
    }


    initOld() {
        const that = this;

        const languages = this.model.getLanguages();

        function onClickBtnVoiceRecognition(event) {
            // console.log('start voice recognition');
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
            // console.log('LOAD from local storage: the last used language is: ' +  dropdown_select_language[localStorage.getItem('i_language')].text);

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




        let recognition;


        if (!('webkitSpeechRecognition' in window)) {
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
                    }
                }

                final_transcript = capitalize(final_transcript);
                
            };
        }

        // Android works just with this result. PC works with this (final result) and continuos speech result.
        function onSpeechResult(speech_text) {
            let selected_language_user = dropdown_select_language.options[dropdown_select_language.selectedIndex].text;
        }


        updateDialect();



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

        function onValueChangedInfoDropDown(selected) {
            let selectedValue = selected.value;
            alert(selectedValue);

            // set value in combobox: None Film
            info_dropdownList.selectedIndex = 0;

            //let selectIndex=selectObj.selectedIndex;
            //let selectValue=selectObj.options[selectIndex].text;
            //let output=document.getElementById("output");
            //output.innerHTML=selectValue;
        }
    }
}