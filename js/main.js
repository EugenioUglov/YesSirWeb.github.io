class YesSir {
    constructor() {
        const inputDeviceManager = new InputDeviceManager();
        this.googleSpeechRecognition = new GoogleSpeechRecognition();
        this.googleTextToSpeech = new GoogleTextToSpeech();
        this.textManager = new TextManager();
        this.fileManager = new FileManager(this.textManager);
        this.dateManager = new DateManager();
        this.voiceRecognitionManager = new VoiceRecognitionManager();
        this.speakerManager = new SpeakerManager();
        this.dropdownManager = new DropdownManager();
        this.mapDataStructure = new MapDataStructure();
        this.dbManager = new DBManager();
        this.arrayManager = new ArrayManager();
        this.hashManager = new HashManager();
        this.blockManager = new BlockManager();
        this.domElementManager = new DOMElementManager;

        this.keyCodeByKeyName = inputDeviceManager.getKeyCodeByKeyName();
        this.dialogWindow = new DialogWindow();
        this.observable = new Observable();
        
        this.modalBoxService = new ModalBoxService();
        this.firebaseService = new FirebaseService();
        this.modalLoadingService = new ModalLoadingService(this.modalBoxService);
        this.noteSpeakerService = new NoteSpeakerService(this.speakerManager);
        this.dataStorageService = new DataStorageService(this.dialogWindow);
        this.searchService = new SearchSevice();
        this.scrollService = new ScrollService();
        this.logsService = new LogsService(this.fileManager, this.dateManager);
        this.autocompleteService = new AutocompleteService(this.textManager);
        this.hashService = new HashService(this.textManager, this.noteSpeakerService, this.searchService, this.scrollService);
        this.voiceRecognitionService = new VoiceRecognitionService(this.voiceRecognitionManager, this.hashService);
        this.loadingService = new LoadingService();
        this.noteService = new NoteService(this.noteSpeakerService, this.hashService);
        this.actionBlockService = new ActionBlockService(this.dbManager, this.fileManager, 
            this.textManager, this.dropdownManager, this.dataStorageService, this.mapDataStructure, 
            this.logsService, this.dialogWindow, this.keyCodeByKeyName, this.scrollService, 
            this.searchService, this.loadingService, this.hashService, this.noteService, this.dateManager, this.modalLoadingService);
    }
}

let yesSir;


(function(){
    yesSir = new YesSir();
    yesSir.loadingService.startLoading();


    window.addEventListener('load', function () {
        onPageLoaded();
    });

    function onPageLoaded() {
        // Initialize Libraries.
        const observable = yesSir.observable;
        const dateManager = yesSir.dateManager;

        const keyCodeByKeyName = yesSir.keyCodeByKeyName;
        const textManager = yesSir.textManager;
        const dialogWindow = yesSir.dialogWindow;
        const fileManager = yesSir.fileManager;
        dropdownManager = yesSir.dropdownManager;
        mapDataStructure = yesSir.mapDataStructure;
        dbManager = yesSir.dbManager;
        arrayManager = yesSir.arrayManager;

        
        // Initialize Services.
        const voiceRecognitionService = yesSir.voiceRecognitionService;
        const autocompleteService = yesSir.autocompleteService;
        const scrollService = yesSir.scrollService;
        const searchService = yesSir.searchService;
        const logsService = yesSir.logsService;
        const loadingService = yesSir.loadingService;
        const noteService = yesSir.noteService;
        const dataStorageService = yesSir.dataStorageService;
        const hashService = yesSir.hashService;
        const actionBlockService = yesSir.actionBlockService;

        // Initialize Controller.
        const logsController = new LogsController(fileManager);
        const noteSpeakerController = new NoteSpeakerController(yesSir.noteSpeakerService, noteService);
        const loadingController = new LoadingController();
        const actionBlockController = new ActionBlockController(actionBlockService,
            loadingService, dialogWindow, searchService, hashService, noteService);
        const autocompleteController = new AutocompleteController(hashService, actionBlockService, autocompleteService);
        const voiceRecognitionController = new VoiceRecognitionController(voiceRecognitionService, observable, hashService);
        const scrollController = new ScrollController(scrollService, actionBlockService);
        const searchController = new SearchController(searchService, actionBlockService, hashService, textManager, keyCodeByKeyName);
        const noteController = new NoteController(actionBlockService, noteService, hashService);
        const dataStorageController = new DataStorageController(actionBlockService, dataStorageService, hashService);
        const speechRecognitionController = new SpeechRecognitionController();
        const hashController = new HashController(hashService);

        

        $('.btn_speech_recognition_info').click(function() {
            yesSir.googleTextToSpeech.speak(
                'Per salvare le informazioni puoi cliccare sul pulsante Salva informazioni con assistente vocale. Per ottenere informazioni clicca sul pulsante Trova informazioni con l\'assistente vocale. Grazie e buona fortuna!', 
                'it-IT'
                // ,
                // () => {
                //     yesSir.googleTextToSpeech.speak(
                //         'Ciao, sono il tuo assistente vocale. Posso salvare le tue informazioni e ricordarti quando ne hai bisogno. Può essere più semplice utilizzare il riconoscimento vocale piuttosto che salvarlo digitando del testo.', 'it-IT'
                //     );
                // }
            );
        });

        function startContinuousRecognizing(option = {
            callbackFullTranscript: undefined
        }) {
            let final_phrases_transcript = '';

            yesSir.googleSpeechRecognition.startContinuousRecognizing({
                seconds_to_stop_recognizing_on_no_speech: 1,
                callbackInterimPhraseTranscript: function (interim_phrase_transcript) { 
                    yesSir.modalBoxService.show({body_text: interim_phrase_transcript, footer_text: final_phrases_transcript, header_text: 'Speech assisstent'});
                },
                callbackFinalPhraseTranscript: function (final_phrase_transcript) {
                    final_phrases_transcript += final_phrase_transcript + '. ';
                    yesSir.modalBoxService.show({body_text: final_phrase_transcript, footer_text: final_phrases_transcript, header_text: 'Speech assisstent'});
                },
                callbackFullTranscript: function(full_transcript) {
                    yesSir.modalBoxService.show({footer_text: full_transcript, header_text: 'Speech assisstent'});
                    if (option.callbackFullTranscript) option.callbackFullTranscript(full_transcript);
                }
            });
        }

        $('.btn_speech_assistant').click(function() {
            yesSir.googleTextToSpeech.speak(
                'How can I help you?', 
                'en-US',
                () => {
                    startContinuousRecognizing({callbackFullTranscript: function(full_transcript) {
                            let final_transcript_lowercase = full_transcript.toLowerCase();

                            startConversationToCreateInfo();

                            function startConversationToCreateInfo() {
                                let index_start_title = 0;
                                let index_end_title = 0;
                                let index_start_content = 0;
                                let pronounced_title_keyword;
                                let pronounced_response_keyword;
    
                                const title_user_keywords = ['when i asked you', 'if i asked you', 'when i ask you', 'if i ask you', 'when i tell you', 'if i tell you' , 'when i asked',  'when i ask', 'if i asked', 'if i ask', 'when i tell', 'if i tell'];
                                const response_user_keywords = ['then tell me', 'then answer me', 'then answer',  'then tell'];

                                for (i = 0; i < title_user_keywords.length; i++) {
                                    const title_user_keyword = title_user_keywords[i];

                                    console.log("check " + title_user_keyword + "in " + final_transcript_lowercase);

                                    if (final_transcript_lowercase.includes(title_user_keyword)) {
                                        console.log('title_user_keyword: ' + title_user_keyword);
                                        pronounced_title_keyword = title_user_keyword;
    
                                        const index_start_title_user_keyword = final_transcript_lowercase.indexOf(title_user_keyword);
                                        index_start_title = index_start_title_user_keyword + title_user_keyword.length;
                                        break;
                                    }
                                }
                           
                                for (i = 0; i < response_user_keywords.length; i++) {
                                    const response_user_keyword = response_user_keywords[i];

                                    if (final_transcript_lowercase.includes(response_user_keyword)) {
                                        console.log('response_user_keyword: ' + response_user_keyword);
                                        pronounced_response_keyword = response_user_keyword;
    
                                        const index_start_response_user_keyword = final_transcript_lowercase.indexOf(response_user_keyword);
                                        index_end_title = index_start_response_user_keyword - 1;
                                        index_start_content = index_start_response_user_keyword + response_user_keyword.length;
    
                                        break;
                                    }
                                }
    
                                if (pronounced_title_keyword != undefined && pronounced_response_keyword != undefined) {
                                    const title_to_create = final_transcript_lowercase.slice(index_start_title, index_end_title);
    
                                    if (index_start_content === 0) {
                                        content_to_create = title_to_create;
                                    }
                                    else {
                                        content_to_create = final_transcript_lowercase.slice(index_start_content);
                                    }
        
        
                                    const replaceWordsMapObj = {
                                        i:"you",
                                        you:"me",
                                        me: "you"
                                    };
        
                                    const when_you_tell_from_speech_assistant = pronounced_title_keyword.replace(/i|you|me/gi, function(matched){
                                        return replaceWordsMapObj[matched];
                                    });
        
                                    // const then_i_tell_from_speech_assistant = pronounced_response_keyword.replace(/i|you|me/gi, function(matched){
                                    //     return replaceWordsMapObj[matched];
                                    // }); 

                                    const then_i_tell_from_speech_assistant = "then response will be";
        
                                    const phrase_to_tell = when_you_tell_from_speech_assistant + " : \"" + title_to_create + "\" " + then_i_tell_from_speech_assistant + " \"" + content_to_create + "\"It's right?"
                                    console.log(phrase_to_tell);
                                    console.log('index_start_title: ' + index_start_title);
                                    console.log('index_end_title: ' + index_end_title);
                                    console.log('index_start_content: ' + index_start_content);
                                    console.log('final_transcript_lowercase: ' + final_transcript_lowercase);
                                    console.log('title: ' + title_to_create);
                                    console.log('content: ' + content_to_create);

                                    yesSir.googleTextToSpeech.speak(
                                        phrase_to_tell, 
                                        'en-US',
                                        () => {
                                            startContinuousRecognizing({
                                                callbackFullTranscript: function(full_transcript) {
                                            // yesSir.googleSpeechRecognition.startRecognizing({
                                            //     callbackFinalTranscript: (final_transcript) => {
                                                    let final_transcript_lowercase = full_transcript.toLowerCase();
        
                                                    if (final_transcript_lowercase.includes("ye")) {
                                                        yesSir.googleTextToSpeech.speak(
                                                            'Perfect! I\'m saving this data.', 
                                                            'en-US',
                                                            () => {
                                                                yesSir.actionBlockService.createActionBlock(title_to_create, title_to_create, yesSir.actionBlockService.model.getActionNameEnum().showInfo, content_to_create);
                                                            }
                                                        );
                                                    }
                                                    else {
                                                        yesSir.googleTextToSpeech.speak(
                                                            'I\'m sorry, In that case, I\'m switching off. You can try again later.', 
                                                            'en-US',
                                                            () => {}
                                                        );
                                                    }
                                                },
                                            });
                                        }
                                    );
                                }
                                else {
                                    const actionBlock = yesSir.actionBlockService.getActionBlockByTitle(final_transcript_lowercase);

                                    if (actionBlock) {
                                        yesSir.googleTextToSpeech.speak(actionBlock.content, 'en-US');
                                    }
                                    else {
                                        const actionBlocks_by_phrase = yesSir.actionBlockService.getActionBlocksByPhrase(final_transcript_lowercase);
                                        console.log(actionBlocks_by_phrase);

                                        if (actionBlocks_by_phrase === undefined || actionBlocks_by_phrase.length < 1) {
                                            yesSir.googleTextToSpeech.speak(
                                                'I\'m sorry but I don\'t understand this request. You can try again if you wish.', 
                                                'en-US'
                                            );
                                        }
                                        else {
                                            // for (let index = 0; index < actionBlocks_by_phrase.length; index++) {
                                                let i_actionBlock_by_phrase = 0;
                                                let actionBlock_suggestion = actionBlocks_by_phrase[i_actionBlock_by_phrase];
                                                if (actionBlock_suggestion != undefined) {
                                                    tellActionBlockSuggestion(actionBlock_suggestion);
                                                }
                                                else {
                                                    yesSir.googleTextToSpeech.speak(
                                                        'I\'m sorry, In that case, I\'m switching off. You can try again later.', 
                                                        'en-US',
                                                        () => {}
                                                    );
                                                }

                                                function tellActionBlockSuggestion(actionBlock_suggestion) {
                                                    yesSir.googleTextToSpeech.speak(
                                                        'Maybe you wanted to say ' + actionBlock_suggestion.title, 
                                                        'en-US',
                                                        () => {
                                                            startContinuousRecognizing({
                                                                callbackFullTranscript: (final_transcript) => {
                                                                    let final_transcript_lowercase = final_transcript.toLowerCase();
                        
                                                                    if (final_transcript_lowercase.includes("ye")) {
                                                                        yesSir.googleTextToSpeech.speak(
                                                                            actionBlock_suggestion.content, 
                                                                            'en-US',
                                                                            () => {
                                                                                
                                                                            }
                                                                        );
                                                                    }
                                                                    else {
                                                                        yesSir.googleTextToSpeech.speak(
                                                                            'Do you want to hear next suggestion?', 
                                                                            'en-US',
                                                                            () => {
                                                                                startContinuousRecognizing({
                                                                                    callbackFullTranscript: (final_transcript) => {
                                                                                        let final_transcript_lowercase = final_transcript.toLowerCase();

                                                                                        i_actionBlock_by_phrase++;
                                                                                        actionBlock_suggestion = actionBlocks_by_phrase[i_actionBlock_by_phrase];

                                                                                        if (actionBlock_suggestion === undefined) {
                                                                                            yesSir.googleTextToSpeech.speak(
                                                                                                'I\'m sorry, In that case, I\'m switching off. You can try again later.', 
                                                                                                'en-US',
                                                                                                () => {}
                                                                                            );
                                                                                        }
                                                                                        else {
                                                                                            if (final_transcript_lowercase.includes("ye")) {
    
                                                                                                tellActionBlockSuggestion(actionBlock_suggestion);
                                                                                            }
                                                                                            else {
                                                                                                yesSir.googleTextToSpeech.speak(
                                                                                                    'I\'m sorry, In that case, I\'m switching off. You can try again later.', 
                                                                                                    'en-US',
                                                                                                    () => {}
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                    },
                                                                                });
                                                                            }
                                                                        );
                                                                    }
                                                                },
                                                            });
                                                        }
                                                    );
                                                }
                                            // }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            );
        });

        $('.btn_speech_recognition_saver').click(function(){
            let title_for_actionBlock = '';
            let content_for_actionBlock = '';

            yesSir.googleTextToSpeech.speak(
                'Dimmi un\'informazione che vuoi salvare.', 
                'it-IT',
                () => {
                    yesSir.googleSpeechRecognition.startRecognizing({
                        language: 'it-IT',
                        callbackFinalTranscript: function(final_transcript) {
                            content_for_actionBlock = final_transcript;
                            console.log(content_for_actionBlock);
                        },
                        callbackEnd: function() {
                            yesSir.googleTextToSpeech.speak(
                                'Grazie. Dimmi cosa mi chiederai per ricevere quest\'informazione?', 
                                'it-IT',
                                () => {
                                    yesSir.googleSpeechRecognition.startRecognizing({
                                        language: 'it-IT',
                                        callbackFinalTranscript(final_transcript) {
                                            title_for_actionBlock = final_transcript;
                                            console.log(title_for_actionBlock);
                                        },
                                        callbackEnd: function() {
                                            const is_created = actionBlockService.createActionBlock(title_for_actionBlock, title_for_actionBlock, 'showInfo', content_for_actionBlock, '');

                                            if (is_created === false) {
                                                yesSir.googleTextToSpeech.speak('Mi dispiace ma per qualsiasi motivo le informazioni non sono state salvate. Contattare lo sviluppatore per avvisare di questo problema. Grazie per la comprensione.', 'it-IT');
                                            }
                                            else {
                                                yesSir.googleTextToSpeech.speak('Perfetto! Quando fai clic sul pulsante \"Trova informazioni con l\'assistente vocale\" e me lo chiederai ' + title_for_actionBlock + ' .Te lo dirò ' + content_for_actionBlock, 'it-IT');
                                            }
                                        }
                                    })
                                }
                            );
                        }
                    });
                }
            );
        });

        $('.btn_speech_recognition_searcher').click(function() {
            yesSir.googleTextToSpeech.speak(
                'Chiedimi cosa vuoi trovare.', 
                'it-IT',
                () => {
                    yesSir.googleSpeechRecognition.startRecognizing({
                        language: 'it-IT',
                        callbackFinalTranscript: function(final_transcript) {
                            console.log(final_transcript);
                            const actionBlock = actionBlockService.getActionBlockByTitle(final_transcript);
                            console.log(actionBlock);
                            if (actionBlock === undefined) {
                                yesSir.googleTextToSpeech.speak(
                                    'Mi dispiace ma non riesco a trovare nessuna informazione come ' + final_transcript, 
                                    'it-IT'
                                );
                            } else {
                                yesSir.googleTextToSpeech.speak(
                                    actionBlock.content, 
                                    'it-IT'
                                );
                            }
                        }
                    });
                }
            );
        });
        
        //autocompleteController.bindApplyTags(onAutocompleteItemSelected);
        actionBlockService.showActionBlocksFromStorage();
        yesSir.loadingService.stopLoading();


        // resizeContentDialogInfo();
        // window.addEventListener('resize', onWindowResize);
    }


    function onWindowResize() {
        resizeContentDialogInfo();
    }

    // Resize content in dialog info.
    function resizeContentDialogInfo() {
        let width_dialog_info = $(".content").css("width");
        
        $(".dialog_content").css({
            "width": "250px"
        });
    }
})();