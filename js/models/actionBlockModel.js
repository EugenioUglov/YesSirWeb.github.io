class ActionBlockModel {
    #textManager;
    #dateManager

    constructor(dbManager, textManager, dataStorageService, mapDataStructure, fileManager, dateManager) {
        this.#textManager = textManager;
        this.title_actionBlock_before_update = '';
        this.dbManager = dbManager;
        this.dataStorageService = dataStorageService;
        this.mapDataStructure = mapDataStructure;
        this.fileManager = fileManager;

        this.#dateManager = dateManager;

        this.actionBlocks = [];
        this.actionBlocks_from_database = [];
        // this.indexes_actionBlocks_by_tag = [];
        this.infoBlocks_on_page = '';
        this.is_menu_create_type_actionBlock_open = false;
        // this.actionBlocks_to_show = [];
    
        this.action_description_by_action_name = {
            openURL: 'Open URL',
            showInfo: 'Show info',
            openFolder: 'Create folder (Search info by tags)',
            showHTML: 'Show info in HTML mode'
        };

        this.#init();
    }
    


    #actionBlocks_map;
    //#index_actionBlock_by_title = {};
    #titles_actionBlocksMap_by_tag = {};
    
    #init() {
        this.#actionBlocks_map = new Map();
    }



    getActionBlocks() {
        return this.#actionBlocks_map;
    }
    
    getActionBlocksFromStorageAsync(onGetCallback) {
        return this.getActionBlocksMapFromStorageAsync(onGetCallback);
    }

    getActionBlocksMapFromStorageAsync(onGetCallback) {
        const that = this;

        if (this.dataStorageService.getUserStorage() === that.dataStorageService.getStorageNameEnum().database) {
            getActionBlocksFromDatabase(onGetCallback, onFail);

            function onFail() {
                alert('Current Action-Blocks will be synchronized');

                $('#autorization_log').text('ERROR! Data loading is failed');
                $('#autorization_log').css('color', 'red');

                // localStorage.removeItem('authorization');
                that.dataStorageService.setUserStorage(that.dataStorageService.getStorageNameEnum().localStorage);
                that.getActionBlocksFromLocalStorageAsync(onGetCallback);
                that.saveInDatabase();
            }
        }
        else if (this.dataStorageService.getUserStorage() === that.dataStorageService.getStorageNameEnum().localStorage) {
            that.getActionBlocksFromLocalStorageAsync(onGetCallback);
        }

        function getActionBlocksFromDatabase(onGetCallback, failCallback) {
            let authorization_data;
            if (localStorage['authorization']) authorization_data = JSON.parse(localStorage['authorization']);
            console.log('authorization data', localStorage['authorization']);

            if (authorization_data) {
                const nickname = authorization_data.nickname;
                const password = authorization_data.password;
                
                $('#input_field_nickname')[0].value = nickname;
                $('#input_field_password')[0].value = password;

                $('#autorization_log').text('Connecting to database..');
                
                
                that.dbManager.authorization(nickname, password, onAuthorization, onAuthorizationFail);

                function onAuthorizationFail() {
                    console.log('fail storage');
                    alert('Data synchronization error! Current Action-Blocks will be saved in the browser storage');

                    $('#autorization_log').text('ERROR! Connection to database is failed');
                    $('#autorization_log').css('color', 'red');
    
                    localStorage.removeItem('authorization');
                    that.dataStorageService.setUserStorage(that.dataStorageService.getStorageNameEnum().localStorage);
                    that.getActionBlocksFromLocalStorageAsync(onGetCallback);
                }

                function onAuthorization(DB_responce) {
                    $('#autorization_log').text('Waiting for responce from database..');
                    $('#autorization_log').css('color', 'gray');

                    if (DB_responce) {
                        if (DB_responce.access) {
                            // Set text: authorization completed successfully.
                            $('#autorization_log').text('Authorization completed successfully for user: ' + nickname);
                            $('#autorization_log').css('color', 'green');

                            // Set authorization data to localStorage.
                            authorization_data = {
                                id: DB_responce.id,
                                nickname: nickname,
                                password: password
                            };


                            localStorage['authorization'] = JSON.stringify(authorization_data);

                            // !!!
                            // const event_database_connection_success = {
                            //     name: 'databaseConnectionSuccess',
                            //     data: {
                            //         log: 'Database connection is completed successfully for user: ' + nickname
                            //     }
                            // };

                            // that.observable.dispatchEvent(event_database_connection_success.name, event_database_connection_success.data);
                            that.dataStorageService.setUserStorage(that.dataStorageService.getStorageNameEnum().database);

                            // Get data from DB.
                            if ( ! authorization_data) {
                                alert('Error authorization');
                                return false;
                            }

                            const user_id = authorization_data.id;
                            that.dbManager.getUserData(user_id, onGetUserDataFromDB);

                            $('#btn_authorization')[0].disabled = false;
                            window.scrollTo(pageXOffset, 0);

                            return;


                            function onGetUserDataFromDB(DB_responce) {
                                console.log('onGetUserDataFromDB', DB_responce);
                                // Get user_data from DB field.

                                // is_possible_get_actionBlocks_from_database.
                                if (DB_responce) {
                                    if (DB_responce['user_data']) {
                                        let userDataFromDB;
                                        let actionBlocks_from_database = new Map();
                                        
                                        // IF data from DB parsed successfully THEN go next.
                                        try {
                                            userDataFromDB = JSON.parse(DB_responce['user_data']);
                                            actionBlocks_from_database = that.mapDataStructure.getParsed(userDataFromDB['actionBlocks']);
                                        }
                                        catch {
                                            onGetActionBlocksFailed();

                                            return;
                                        }

                                        if (that.mapDataStructure.isMap(actionBlocks_from_database) === false) {
                                            onGetActionBlocksFailed();
                                            
                                            return;
                                        }

                                        function onGetActionBlocksFailed() {
                                            const date_text = that.#dateManager.getDateNow() + '-' + that.#dateManager.getTimeNow();
                                            

                                            const content = DB_responce['user_data'];
                                            const file_name = 'Broken Action-Blocks from database ' + date_text;
                                            const extension = '.json';
                                    
                                            that.fileManager.downloadFile(content, file_name, extension);

                                            alert('ERROR! Action-Blocks have not been loaded from database. \nProbably data is broken.');

                                            failCallback();
                                        }

                                        that.actionBlocks_from_database = actionBlocks_from_database;

                                        console.log('data from DB', that.actionBlocks_from_database);

                                        onGetCallback(that.actionBlocks_from_database);
                                        
                                        return;
                                    }
                                }
                            }
                        }
                        else {
                            console.log('fail access');
                            onAuthorizationFail();  
                        }
                    }

                    onGetCallback(null);

                    $('#autorization_log').text('ERROR! Connection to database is failed');
                    $('#autorization_log').css('color', 'red');
                    $('#btn_authorization')[0].disabled = false;
                }
            }
            else {
                alert('Error on authorization to database! Data is out of sync.\n\n\
                    Data will be updated in the browser storage.\nLog in again to sync your data.');

                $('#autorization_log').text('ERROR! Connection to database is failed');
                $('#autorization_log').css('color', 'red');
                failCallback();
            }

        }
    }

    getActionBlockByTitle(title) {
        return this.getActionBlocks().get(title);
    }

    getActionBlocksFromLocalStorageAsync(onGetCallback) {
        let actionBlocks_from_localStorage = new Map;
        const key = 'actionBlocks';
        
        if (localStorage.getItem(key)) {
            actionBlocks_from_localStorage = this.mapDataStructure.getParsed(localStorage.getItem(key));
        }
        
        if (onGetCallback) onGetCallback(actionBlocks_from_localStorage);

        return actionBlocks_from_localStorage;
    }

    getByPhrase(user_phrase) {
        const that = this;
        
        // Delete characters "," from phrase.
        user_phrase = user_phrase.replaceAll(',', '');
    
        // If phrase doesn't exist.
        if ( ! user_phrase) {
            console.log('Action-Blocks don\'t exist with tags: ' + user_phrase);
            return;
        }
    
        if (user_phrase === undefined || user_phrase === null) {
            let error_text = 'user_phrase not defined during information searching';
            console.log(error_text);
        }
    
        // Here all objects from a storage which info can to be looking by user.
        let found_actionBlocks = [];
        
        const actionBlocks = this.getActionBlocks();
        
        user_phrase = user_phrase.toLowerCase();
        const user_words = this.#textManager.splitText(user_phrase, ' ');
        
        const titles_actionBlocks_to_show = getTitlesActionBlocksByTags(user_words);
        
            
        // Create an array with actionBlocks and priority value to show.
        for (const title_actionBlock of titles_actionBlocks_to_show) {
            let actionBlock = this.getActionBlockByTitle(title_actionBlock);
            const priority_actionBlock = this.#getPriorityActionBlockByPhrase(actionBlock, user_phrase);

            actionBlock.priority = priority_actionBlock;
    
            if (priority_actionBlock > 0) {
                // Push current obj.
                found_actionBlocks.push(actionBlock);
            }
        }

        found_actionBlocks = Array.from(found_actionBlocks).reverse();
        
        const property_in_actionBlock_for_sort = 'priority';
        const is_sort_from_A_to_Z = false;
    
        // Sort by priority.
        const actionBlocks_sorted_by_priority = this.#getSortedActionBlocksByProperty(found_actionBlocks, property_in_actionBlock_for_sort, is_sort_from_A_to_Z);
    
        return actionBlocks_sorted_by_priority;
    
        function getTitlesActionBlocksByTags(user_words) {
            const indexes_infoObjects_to_show = [];
            
            // Push index of infoObj by user phrase if it doesn't exist yet in array. 
            for (const i_user_word in user_words) {
                // One user word of phrase.
                const user_word = user_words[i_user_word];
                // Indexes of current tag.
                const indexes_infoObjects_curr = that.#titles_actionBlocksMap_by_tag[user_word];
    
                // For each index of infoObject for current tag.
                for (const i_index_infoObj_to_show in indexes_infoObjects_curr) {
                    let i_infoObj_to_show = indexes_infoObjects_curr[i_index_infoObj_to_show];
    
                    let index_exist_in_indexes_infoObjects = arrayManager.isValueExistsInArray(indexes_infoObjects_to_show, i_infoObj_to_show);
    
                    if (index_exist_in_indexes_infoObjects) {
                        continue;
                    }
    
                    indexes_infoObjects_to_show.push(i_infoObj_to_show);
                }
            }
    
            return indexes_infoObjects_to_show;
        }
    }

    getActionBlocksByTags(user_phrase, minus_tags) {
        const that = this;

        // Delete characters ',' from phrase.
        user_phrase = user_phrase.replaceAll(',', ' ');
        minus_tags = minus_tags.replaceAll(',', ' ');
    
        // If phrase doesn't exist.
        if ( ! user_phrase) {
            console.log('Action-Blocks don\'t exist with tags: ' + user_phrase);
            return;
        }
    
        if (user_phrase === undefined || user_phrase === null) {
            let error_text = 'user_phrase not defined during information searching';
            console.log(error_text);
        }

        // Here all objects from a storage which info can to be looking by user.
        let searched_infoObjects = [];
        
        user_phrase = user_phrase.toLowerCase();
        minus_tags = minus_tags.toLowerCase();

        const user_tags = this.#textManager.splitText(user_phrase, ' ');
        const user_minus_tags = this.#textManager.splitText(minus_tags, ' ');
        
        const titles_actionBlocks_to_show = getTitlesActionBlocksByTags(user_tags, user_minus_tags);
        
            
        // Create an array with actionBlocks and priority value to show.
        for (let title_actionBlock of titles_actionBlocks_to_show) {
            let actionBlock = this.getActionBlockByTitle(title_actionBlock);
            const priority_actionBlock = this.#getPriorityActionBlockByPhrase(actionBlock, user_phrase);

            actionBlock.priority = priority_actionBlock;
    
            if (priority_actionBlock > 0) {
                // Push current obj
                searched_infoObjects.push(actionBlock);
            }
        }
    
        const property_in_actionBlock_for_sort = 'priority';
        let is_sort_from_A_to_Z = false;
    
        // Sort by priority.
        searched_infoObjects = this.#getSortedActionBlocksByProperty(searched_infoObjects, 
            property_in_actionBlock_for_sort, is_sort_from_A_to_Z);
    
        return searched_infoObjects;

        function getTitlesActionBlocksByTags(tags, minus_tags) {
            let titles_actionBlocks_to_show = [];
    
            // Push index of Action-blocks by user phrase if it doesn't exist yet in array. 
            for (const i_tag in tags) {
                // One user word of phrase.
                const tag = tags[i_tag];
    
                if (that.#titles_actionBlocksMap_by_tag[tag] === undefined) {
                    return [];
                }
                
                // If array with indexes to show is empty. 
                if (titles_actionBlocks_to_show.length < 1) {
                    // Add all Action-Blocks indexes of tag to array.
                    titles_actionBlocks_to_show = titles_actionBlocks_to_show.concat(that.#titles_actionBlocksMap_by_tag[tag]);
                }
                else {
                    titles_actionBlocks_to_show = arrayManager.getSameItemsFromArrays
                    (
                        titles_actionBlocks_to_show, that.#titles_actionBlocksMap_by_tag[tag]
                    );
    
                    if (titles_actionBlocks_to_show.length < 1) {
                        // No same indexes in tags after comparation.
    
                        return []; 
                    }
                }
            }
    
            titles_actionBlocks_to_show = getTitlesActionBlocksWithoutMinusTags(titles_actionBlocks_to_show, minus_tags);
    
            return titles_actionBlocks_to_show;
    
    
            function getTitlesActionBlocksWithoutMinusTags(titles_actionBlocks_to_show, minus_tags) {
                // Delete items with minus tags.
                for (const minus_tag of minus_tags) {
                    for (const i_index_infoObj_to_show in titles_actionBlocks_to_show) {
                        const i_infoObj_to_show = titles_actionBlocks_to_show[i_index_infoObj_to_show];
    
                        // Compare minus tag with each Action-Block that has this tag.
                        for (const index_actionBlock_with_minus_tag of that.#titles_actionBlocksMap_by_tag[minus_tag]) {
                            if (index_actionBlock_with_minus_tag === i_infoObj_to_show) {
                                titles_actionBlocks_to_show[i_index_infoObj_to_show] = undefined;
                            }
                        }
                    }
                }
    
                // Delete all undefined elements from array.
                titles_actionBlocks_to_show = titles_actionBlocks_to_show.filter(function(x) {
                    return x !== undefined;
                });
    
    
                return titles_actionBlocks_to_show;
            }
        }
    }

    getDefaultActionBlocks = function() {
        const actionBlock_create = {
            title: 'Create Action-Block',
            tags: 'Create Action-Block, default',
            action: 'showHTML',
            content: '<script>actionBlockService.showSettingsToCreateActionBlock()</script>',
            imageURL: 'https://i.ibb.co/K6kqJQc/plus.png'
        };

        const actionBlock_create_note = {
            title: 'Create a note by voice',
            tags: 'create note, voice recognition, default',
            action: 'showHTML',
            content: getContentActionBlockCreateNote(),
            imageURL: 'https://i.ibb.co/K6kqJQc/plus.png'
        };
        
        const actionBlock_open_file_manager = {
            title: 'Open File Manager',
            tags: 'File manager, save, upload, download, file, default',
            action: 'showHTML',
            content: getContentActionBlockOpenFileManager(),
            imageURL: 'https://icon-library.com/images/file-download-icon/file-download-icon-19.jpg'
        };
    
        const actionBlock_open_data_storage_manager = {
            title: 'Open Data Storage Manager',
            tags: 'Data Storage Manager, localstorage, database, default',
            action: 'showHTML',
            content: '<script>actionBlockService.showDataStorageSettings()</script>',
            imageURL: 'https://www.sostechgroup.com/wp-content/uploads/2016/08/ThinkstockPhotos-176551504.jpg'
        };
    
        const actionBlock_facebook_of_developer = {
            title: 'Open Facebook page of developer',
            tags: 'facebook, account, developer, contact, message, default',
            action: 'openURL',
            content: 'https://www.facebook.com/eugeniouglov',
            imageURL: 'https://i.ibb.co/QJ4y5v3/DEVELOPER-facebook.png'
        };
    
        const actionBlock_email_of_developer = {
            title: 'Write email to developer - eugeniouglov@gmail.com',
            tags: 'email, developer, contact, message, gmail, mail, default',
            action: 'openURL',
            content: 'mailto:eugeniouglov@gmail.com',
            imageURL: 'https://i.ibb.co/dMHPk78/DEVELOPER-gmail.png'
        };
    
        const actionBlock_logs = {
            title: 'Show logs',
            tags: 'logs, default',
            action: 'showHTML',
            content: '<script>yesSir.logsService.showContainerWithLogs()</script>',
            imageURL: 'https://pbs.twimg.com/profile_banners/240696823/1528203940/1500x500'
        };
    
        const actionBlock_voiceRecognitionSettings = {
            title: 'Open voice recognition settings',
            tags: 'voice recognition, default',
            action: 'showHTML',
            content: '<script>yesSir.voiceRecognitionService.show()</script>',
            imageURL: 'https://walkthechat.com/wp-content/uploads/2015/02/voice-recognition.jpg'
        };

        const default_actionBlocks = [
            actionBlock_create,
            actionBlock_create_note,

            actionBlock_facebook_of_developer, 
            actionBlock_email_of_developer,
            
            actionBlock_open_file_manager,
            actionBlock_open_data_storage_manager,
            actionBlock_logs,
            actionBlock_voiceRecognitionSettings
        ];

        function getContentActionBlockOpenFileManager() {
            return `<div id="elements_for_file_manager" class="elements_for_executed_actionBlock" padding-top: 50px;">
            <br><br>
        
            <div class="outline">
                <p>Save Action-Blocks to the file</p>
                <button class="btn_download_actionBlocks btn" title="Save Action-Blocks in the file">Download Action-Blocks file</button>
                <br><br>
            </div>
            <br>
            <div class="outline">
                <p>Upload file with Action-Blocks</p>
                <div class="upload_commands_container">
                    <button type="file" class="btn" title="Upload file with Action-Blocks"><input class="btn_upload_actionBlocks" type="file" name="file" title=" ">
                    </button>
                </div>
            </div>
            <br>
            </div>
            
            <script>
            $('.btn_upload_actionBlocks').on('change', (event) => {
                fileManager.uploadFile(onFileLoaded);
        
                function onFileLoaded(content_of_file) {
                    actionBlockService.saveActionBlocksFromFile(content_of_file);
        
                    // Give possibility to load the same file again.
                    $('.btn_upload_actionBlocks').value = '';
        
                    window.location.hash = "main";
                }
            });
        
            $('.btn_download_actionBlocks')[0].addEventListener('click', () => {
                actionBlockService.downloadFileWithActionBlocks();
            });
            </script>`;
        }
    
        function getContentActionBlockCreateNote() {
            return `<script>
            actionBlockService.showSettingsToCreateActionBlock('showInfo');

            $('#settings_action_block_container').find('.dropdown_select_action').val('showInfo');
            $('#title_action_descritption').text(actionBlockService.model.getContentTypeDescriptionByActionEnum['showInfo']);

  
            /*
            let is_recognizer_active = true;
            
            // Создаем распознаватель
            const recognizer = new webkitSpeechRecognition();
            
            // Ставим опцию, чтобы распознавание началось ещё до того, как пользователь закончит говорить
            recognizer.interimResults = true;
            
            // Какой язык будем распознавать?
            recognizer.lang = 'en-En';

            $('.btn').on('click', () => {
                console.log('stop voice recognition');
                is_recognizer_active = false;
                recognizer.stop();
            });
            */

            
            
            voiceRecognitionForContent();
            
            function voiceRecognitionForContent() {
               $('.input_field_content').focus();
               yesSir.speakerService.speak('Please, tell the text of the note', onEndSpeak);
            
                function onEndSpeak() {
                    console.log('on end speaker');
                    /*
                    let isFinalResult = false;
            
                    // Используем колбек для обработки результатов
                    recognizer.onresult = function (event) {
                        let result = event.results[event.resultIndex];
                        console.log('result', result);
            
                        if (result.isFinal) {
                            isFinalResult = true;
                            const user_final_speech_text = result[0].transcript;
                            $('.input_field_content').val(user_final_speech_text);
                            yesSir.speakerService.speak('Thank you!');
                            voiceRecognitionForCommand();
                        } else {
                            const user_cotinuous_speech_text = result[0].transcript;
                            $('.input_field_content').val(user_cotinuous_speech_text);
                        }
                    }
                    recognizer.onend = function() {
                        if (isFinalResult === false && 
                            is_recognizer_active) recognizer.start();
                    }
                    */

                    // Начинаем слушать микрофон и распознавать голос
                    yesSir.voiceRecognitionService.startRecognizing(onInterimTranscript, onFinalTranscript, onEndVoiceRecognition);

                    function onInterimTranscript(result_text) {
                        $('.input_field_content').val(result_text);
                    }

                    function onFinalTranscript(result_text) {
                        $('.input_field_content').val(result_text);
                        yesSir.speakerService.speak('Thank you!');
                        voiceRecognitionForCommand();
                    }

                    function onEndVoiceRecognition() {
                        console.log('end');
                    }
                }
            }
            
            function voiceRecognitionForCommand() {
               $('.input_field_title').focus();
               yesSir.speakerService.speak('Please, tell the command that opens this note', onEndSpeak);
            
                function onEndSpeak() {
                    /*
                    let isFinalResult = false;
            
                    // Используем колбек для обработки результатов
                    recognizer.onresult = function (event) {
                        let result = event.results[event.resultIndex];
            
                        if (result.isFinal) {
                            isFinalResult = true;
                            const user_final_speech_text = result[0].transcript;
                            $('.input_field_title').val(user_final_speech_text);
                            
                            yesSir.speakerService.speak('Thank you!');
                            voiceRecognitionSaveResult();
                    
                        } else {
                            const user_cotinuous_speech_text = result[0].transcript;
                            $('.input_field_title').val(user_cotinuous_speech_text);
                        }
                            
                
                        }
                        recognizer.onend = function() {
                              if (isFinalResult === false &&
                                is_recognizer_active) recognizer.start();
                        }
                    // Начинаем слушать микрофон и распознавать голос
                    recognizer.start(); 
                    */

                    // Начинаем слушать микрофон и распознавать голос
                    yesSir.voiceRecognitionService.startRecognizing(onInterimTranscript, onFinalTranscript, onEndVoiceRecognition);

                    function onInterimTranscript(result_text) {
                        $('.input_field_title').val(result_text);
                    }

                    function onFinalTranscript(result_text) {
                        $('.input_field_title').val(result_text);
                        yesSir. speakerService.speak('Thank you!');
                        voiceRecognitionSaveResult();
                    }

                    function onEndVoiceRecognition() {
                        console.log('end');
                    }
                }
            }
            
            function voiceRecognitionSaveResult() {
                yesSir.speakerService.speak('Do you want to save this note?', onEndSpeak);
            
                function onEndSpeak() {
                    /*
                    let isFinalResult = false;
            
                    // Используем колбек для обработки результатов
                    recognizer.onresult = function (event) {
                        let result = event.results[event.resultIndex];
            
                        if (result.isFinal) {
                            const user_text = result[0].transcript;

                            if (result[0].transcript.includes('no') || result[0].transcript.includes('nope') || result[0].transcript.includes("don't")) {
                                isFinalResult = true;
                                yesSir.speakerService.speak("Ok. I didn't save the note. You can customize the note manually. I'm switching off");
                              
                              return;
                            }
                            else if (result[0].transcript.includes('save') || result[0].transcript.includes('yes') || result[0].transcript.includes('yeah') || result[0].transcript.includes('want')) {
                                isFinalResult = true;
                                yesSir.speakerService.speak('Ok. Note has been saved!', onEndSpeak);
                                
                                function onEndSpeak() {
                                    $('#btn_create_action-block').click();
                                }
                                return;
                            }
                        } else {
                            console.log('Промежуточный результат: ', result[0].transcript);
                        }
            
            
            
                    }
                    recognizer.onend = function() {
                            console.log('onend | isFinalResult', isFinalResult);
                            if (isFinalResult === false &&
                                is_recognizer_active) recognizer.start();
                    }
                    // Начинаем слушать микрофон и распознавать голос
                    recognizer.start(); 
                    */

                    // Начинаем слушать микрофон и распознавать голос
                    yesSir.voiceRecognitionService.startRecognizing(onInterimTranscript, onFinalTranscript, onEndVoiceRecognition);

                    function onInterimTranscript(result_text) {
                    }

                    function onFinalTranscript(result_text) {
                        if (result_text.includes('no') || result_text.includes('nope') || result_text.includes("don't")) {
                            isFinalResult = true;
                            yesSir.speakerService.speak("Ok. I didn't save the note. You can customize the note manually. I'm switching off");
                          
                            return;
                        }
                        else if (result_text.includes('save') || result_text.includes('yes') || 
                            result_text.includes('yeah') || result_text.includes('want')) {
                                isFinalResult = true;
                                yesSir.speakerService.speak('Ok. Note has been saved!', onEndSpeak);
                                
                                function onEndSpeak() {
                                    $('#btn_create_action-block').click();
                                }

                                return;
                        }
                    }

                    function onEndVoiceRecognition() {
                        console.log('end');
                    }
                }
            }
                </script>`;
        }

        return default_actionBlocks;
    }

    getActionNameEnum() {
        const ACTION_NAME_ENUM = {
            openURL: 'openURL',
            showInfo: 'showInfo',
            openFolder: 'openFolder',
            showHTML: 'showHTML',
            // createActionBlock: 'createActionBlock',
            //showFileManager: 'showFileManager',
            //showDataStorageManager: 'showDataStorageManager',
            //showLogs: 'showLogs',
        };

        return ACTION_NAME_ENUM;
    }

    getContentTypeDescriptionByActionEnum() {
        // Titles for input field info of action.
        const CONTENT_TYPE_DESCRIPTION_BY_ACTION_ENUM = {
            openURL: 'URL',
            showInfo: 'Description',
            openFolder: 'Tags to search',
            showHTML: 'HTML code'
        };
        
        return CONTENT_TYPE_DESCRIPTION_BY_ACTION_ENUM;
    }

    setActionBlocks(actionBlocks_map_new) {
        this.#actionBlocks_map.clear()

        if ( ! actionBlocks_map_new) actionBlocks_map_new = new Map();
        else {
            actionBlocks_map_new.forEach(actionBlock => {
                this.#actionBlocks_map.set(actionBlock.title, actionBlock);
            });
        }

        this.#onUpdateVarialbeWithActionBlocks();

        return this.#actionBlocks_map;
    }

    setActionBlocksFromUserStorageAssync(callbackSetActionBlocks, callbackUserStorageDifferentFromLocal) {
        const that = this;

        this.getActionBlocksFromStorageAsync(onGetActionBlocks);

        function onGetActionBlocks(actionBlocks_from_user_storage) {
            const actionBlocks_from_localStorage = that.getActionBlocksFromLocalStorageAsync();

            // IF data is equal to data from localStorage THEN show Action-Blocks
            // ELSE open dialog database.
            if (that.dataStorageService.getUserStorage() === that.dataStorageService.getStorageNameEnum().localStorage) {
                that.setActionBlocks(actionBlocks_from_user_storage);
                if (callbackSetActionBlocks) callbackSetActionBlocks();
                // that.showActionBlocks();
            }
            else {
                if (that.mapDataStructure.getStringified(actionBlocks_from_user_storage) === that.mapDataStructure.getStringified(actionBlocks_from_localStorage)) {
                    that.setActionBlocks(actionBlocks_from_user_storage);
                    if (callbackSetActionBlocks) callbackSetActionBlocks();
                    // that.showActionBlocks();
                }
                else {
                   // that.downloadFileWithActionBlocks(actionBlocks_from_localStorage);
                    that.dataStorageService.view.showDatabaseDialog();
                    if (callbackUserStorageDifferentFromLocal) callbackUserStorageDifferentFromLocal();
                }
            }

            // that.pageService.setHashChangeListenerActiveState(true);
        }

        return this.#actionBlocks_map;
    }

    add(actionBlock_to_add, is_show_alert_on_error = true) {
        actionBlock_to_add.tags = this.#getNormalizedTags(actionBlock_to_add.tags);

        if (this.#actionBlocks_map.has(actionBlock_to_add.title)) {
            if (is_show_alert_on_error) alert('Action-Block with current title already exists. Title: ' + actionBlock_to_add.title);
            else {
                console.log('Action-Block with current title already exists. Title: ' + actionBlock_to_add.title);
            }

            return false;
        }

        this.#actionBlocks_map.set(actionBlock_to_add.title, actionBlock_to_add);
        
        this.#onUpdateVarialbeWithActionBlocks();
    
        return true;
    }
    
    /* OLD
    saveAsync(actionBlocks, callBackSavedSuccessfully, callBackError) {
        const that = this;
        this.actionBlocks = actionBlocks;

        this.logsController.showLog('Data is saving... Don\'t close this tab');

        let isSavedInLocalStorage = saveInLocalStorage(actionBlocks);
    
        if (this.dataStorageService.getUserStorage() === that.dataStorageService.getStorageNameEnum().database)
        {
            // Send to DB.
            saveInDatabase(onUpdatedUserData, onDatabaseError);
            
            function onUpdatedUserData() {
                that.observable.dispatchEvent('userDataUpdated', 'userDataUpdated');
                
                if (callBackSavedSuccessfully) callBackSavedSuccessfully();
            }

            function onDatabaseError() {
                that.observable.dispatchEvent('databaseOperationFailed', 'databaseOperationFailed');
                if (callBackError) callBackError();
            }
        }
        else {
            if (callBackSavedSuccessfully) callBackSavedSuccessfully();
        }
    
    

        function saveInDatabase(callBackUpdatedUserData, callBackDatabaseError) {
            console.log("saveInDatabase");
            const actionBlocks_to_DB_string = JSON.stringify(that.getActionBlocks());

            let authorizationData;
            if (localStorage['authorization']) authorizationData = JSON.parse(localStorage['authorization']);

            if ( ! authorizationData) {
                alert('ERROR! Not saved in database. Authorization error.');
                callBackDatabaseError();
                return false; 
            }
            // if 
            // (
            //     JSON.stringify(that.actionBlocks_from_database) === actionBlocks_to_DB_string
            // ) {
            //     console.log('that.actionBlocks_from_database', that.actionBlocks_from_database);
            //     console.log('actionBlocks_to_DB_string', actionBlocks_to_DB_string);
            //     console.log('Not saved in database. Data the same.');
            //     callBackDatabaseError();
            //     return false;    
            // }
            
            // Set object to save in DB
            const userData_to_DB_obj = {
                actionBlocks: actionBlocks_to_DB_string
            };
            // Stringify object for DB
            const userData_to_DB_string = JSON.stringify(userData_to_DB_obj);

            // Upload data to user field
            const user_id = authorizationData.id;
            const data_to_send = userData_to_DB_string;
            that.dbManager.setUserData(user_id, data_to_send, callBackUpdatedUserData, onFailSaveUserData);
            
            function onFailSaveUserData() {
                return false;
            }

            return true;
        }
    
        function saveInLocalStorage(actionBlocks) {
            const key = 'actionBlocks';
            localStorage.setItem(key, JSON.stringify(actionBlocks));

            return true;
        }
    }
    */

    // NEW
    saveAsync(actionBlocks, callBackSavedSuccessfully, callBackError) {
        const that = this;

        if ( ! actionBlocks) {
            actionBlocks = this.#actionBlocks_map;
        }

        yesSir.logsService.showLog('Data is saving... Don\'t close this tab');
        

        let isSavedInLocalStorage = this.saveInLocalStorage(actionBlocks);
    
        if (this.dataStorageService.getUserStorage() === that.dataStorageService.getStorageNameEnum().database)
        {
            // Send to DB.
            that.saveInDatabase();
        }
        else {
            if (callBackSavedSuccessfully) callBackSavedSuccessfully();
        }
    }

    saveInDatabase() {
        const that = this;

        const actionBlocks_to_DB_string = this.mapDataStructure.getStringified(this.getActionBlocks());

        let authorization_data;
        if (localStorage['authorization']) authorization_data = JSON.parse(localStorage['authorization']);

        if ( ! authorization_data) {
            alert('ERROR! Data has not been saved in database. Authorization error.');
            onDatabaseError();
            return false; 
        }
        
        // Set object to save in DB
        const userData_to_DB_obj = {
            actionBlocks: actionBlocks_to_DB_string
        };

        // Stringify object for DB
        const userData_to_DB_string = JSON.stringify(userData_to_DB_obj);

        // Upload data to user field
        const user_id = authorization_data.id;
        const data_to_send = userData_to_DB_string;
        that.dbManager.setUserData(user_id, data_to_send, onUpdatedUserData, onFailSaveUserData);
        //console.log('Send data to DB', data_to_send);
        
        function onFailSaveUserData() {
            return false;
        }

        return true;

        function onUpdatedUserData() {
            // that.observable.dispatchEvent('userDataUpdated', 'userDataUpdated');
        }

        
        function onDatabaseError() {
            // that.observable.dispatchEvent('databaseOperationFailed', 'databaseOperationFailed');
            that.dataStorageService.setUserStorage(that.dataStorageService.getStorageNameEnum().localStorage);
        }
    }

    saveInLocalStorage(actionBlocks) {
        //console.log('Before Save in localstorage', actionBlocks);
        const actionBlocks_to_save = this.mapDataStructure.getStringified(actionBlocks);
        //console.log('Save in localstorage stringified', actionBlocks_to_save);
        const key = 'actionBlocks';
        localStorage.setItem(key, actionBlocks_to_save);

        return true;
    }

    updateActionBlock(title, tags, action, content, image_URL) {
        const original_title = this.title_actionBlock_before_update;
  
        // Check new title validation.
        if (original_title != title) {
            const is_actionBlock_exists_by_title = this.getActionBlockByTitle(title);
            
            if (is_actionBlock_exists_by_title) {
                alert('Action-Block with current title already exists. Title: ' + title);
                return false;
            }

            addTitleToTags();
        }

        const is_deleted = this.deleteActionBlockByTitle(original_title);

        if ( ! is_deleted) {
            alert('ERROR! Action-Block hasn\'t been deleted');
            return false;
        }
        
        const action_block =
        {
            title: title,
            tags: tags,
            action: action,
            content: content,
            imageURL: image_URL
        };

        const is_created = this.add(action_block);
    
        if (! is_created) {
            alert('ERROR! Action-Bclok hasn\'t been created.');
            return false;
        }

        return true;
        

        function addTitleToTags() {
            // Add new tag getting text from title.
    
            const title_without_symbols = title.replace(/[^a-zа-яё0-9\s]/gi, '');
            
            if (tags) tags = tags + ", ";
            
            // Add new tag getting text from title.
            tags += title + ", " + title_without_symbols;
        }
    }

    deleteActionBlockByTitle(title, is_show_alert_on_error = true) {
        const is_deleted = this.#actionBlocks_map.delete(title);

        this.#onUpdateVarialbeWithActionBlocks();
    
        return is_deleted;
    }



    #onUpdateVarialbeWithActionBlocks() {
        this.saveAsync(this.getActionBlocks());
        //this.#updateTagsIndexes();
        this.#updateTagsIndexesForMap();
        // this.#updateTitleIndexes();
    }

    #updateTagsIndexes() {
        const that = this;

        const indexes_actionBlocks_by_tag = createIndexes();
        const key = 'indexes_actionBlocks_by_tag';
    
        localStorage[key] = JSON.stringify(indexes_actionBlocks_by_tag);
    
        console.log('Update indexes', indexes_actionBlocks_by_tag);
    
        return true;
    
        // Example: indexes_actionBlocks_by_tag['hello'] = [1, 2];
        function createIndexes(actionBlocks) {
            if ( ! actionBlocks) actionBlocks = that.getActionBlocks();
    
            let indexes_actionBlocks_by_tag = {};
    
    
            // For all actionBlocks.
            for (const i_actionBlock_to_paste in actionBlocks) {
                let actionBlock = actionBlocks[i_actionBlock_to_paste];
                let tags = actionBlock.tags;
    
                // For all tags.
                for (const i_tag in tags) {
                    let tag = tags[i_tag];
                    
                    tag = tag.toLowerCase();
    
                    if ( ! tag) continue;
    
                    // WHILE first symbol in tag is empty THEN delete empty.
                    while (tag[0] === ' ') tag = tag.replace(tag[0], '');
    
                    // Separated words of tag.
                    let tag_words = that.#textManager.splitText(tag, ' ');
                    
                    // For each word in tag.
                    for (const i_wordTag in tag_words) {
                        let tag_word = tag_words[i_wordTag];
                    
                        if ( ! indexes_actionBlocks_by_tag[tag_word]) {
                            indexes_actionBlocks_by_tag[tag_word] = [];
                        }
                        
                        // Indexes for link to actionBlock.
                        let indexes_arr = Object.values(indexes_actionBlocks_by_tag[tag_word]);
                        
                        // Each index must be different in indexes array.
                        let isIndexExistInIndexesArr = arrayManager.isValueExistsInArray(indexes_arr, i_actionBlock_to_paste);

                        if (isIndexExistInIndexesArr) continue;

                        indexes_actionBlocks_by_tag[tag_word].push(i_actionBlock_to_paste);
                    }
                }
            }
    
            return indexes_actionBlocks_by_tag;
        }
    
    }

    #updateTagsIndexesForMap() {
        const that = this;

        const indexes_actionBlocks_by_tag = createIndexes();
        const key = 'titles_actionBlocks_by_tag';
        localStorage[key] = JSON.stringify(indexes_actionBlocks_by_tag);
        this.#titles_actionBlocksMap_by_tag = indexes_actionBlocks_by_tag;
    
    
        // Example: indexes_actionBlocks_by_tag['hello'] = [1, 2];
        function createIndexes() {
            const actionBlocksMap = that.getActionBlocks();
            let indexes_actionBlocks_by_tag = {};

            actionBlocksMap.forEach((actionBlock, i_actionBlock) => {
                if (i_actionBlock === undefined) return indexes_actionBlocks_by_tag;
                const tags = actionBlock.tags;

                // For all tags.
                for (const tag of tags) {
                    let tag_lower_case = tag.toLowerCase();

                    if ( ! tag_lower_case) continue;

                    // WHILE first symbol in tag_lower_case is empty THEN delete empty.
                    while (tag_lower_case[0] === ' ') tag_lower_case = tag_lower_case.replace(tag_lower_case[0], '');

                    // Separated words of tag_lower_case.
                    let tag_words = that.#textManager.splitText(tag_lower_case, ' ');

                    // For each word in tag_lower_case.
                    for (const tag_word of tag_words) {
                        if ( ! indexes_actionBlocks_by_tag[tag_word]) {
                            indexes_actionBlocks_by_tag[tag_word] = [];
                        }
                        
                        // Indexes for link to actionBlock.
                        let indexes_arr = Object.values(indexes_actionBlocks_by_tag[tag_word]);
                        
                        // Each index must be different in indexes array.
                        let isIndexExistInIndexesArr = arrayManager.isValueExistsInArray(indexes_arr, i_actionBlock);

                        if (isIndexExistInIndexesArr) continue;

                        indexes_actionBlocks_by_tag[tag_word].push(i_actionBlock);
                    }
                }
            });

            return indexes_actionBlocks_by_tag;
        }
    }

    // #updateTitleIndexes() {
    //     const that = this;
    //     this.#index_actionBlock_by_title = createIndexes();
    //     const key = 'index_actionBlock_by_title';
    
    //     localStorage[key] = JSON.stringify(this.#index_actionBlock_by_title);
    
    //     console.log('Update indexes', this.#index_actionBlock_by_title);
    
    //     return this.#index_actionBlock_by_title;
    
    //     // Example: index_actionBlock_by_title['my targets'] = 0;
    //     function createIndexes(actionBlocks) {
    //         if ( ! actionBlocks) actionBlocks = that.getActionBlocks();
    
    //         let index_actionBlock_by_title = {};
    
    
    //         // For all actionBlocks.
    //         for (const i_actionBlock in actionBlocks) {
    //             const actionBlock = actionBlocks[i_actionBlock];
    //             const title = actionBlock.title.toLowerCase();
    
    //             index_actionBlock_by_title[title] = i_actionBlock;
    //         }
    
    //         return index_actionBlock_by_title;
    //     }
    // }

    #getNormalizedTags(tags) {
        let normalizedTags;
    
        // Change all new lines to symbol ',".
        const tags_without_new_line = tags.replaceAll('\n', ',');
        //tags_lower_case = tags_without_new_line.toLowerCase();
    
        let tags_array = this.#textManager.getArrayByText(tags_without_new_line);
        
        // Delete empty symbols from sides in text.
        for (const i_tag in tags_array) {
            tags_array[i_tag] = tags_array[i_tag].trim();
        }
    
        // Delete same tags.
        const tags_set = new Set(tags_array);
    
        // Convertation from Set to Array.
        normalizedTags = Array.from(tags_set);
    
        return normalizedTags;
    }

    // Get priority of object from DB. How many times words from user phrase are in the tags of objet DB.
    // Priority = 0 means that user words not exist in tags of object.
    #getPriorityActionBlockByPhrase(obj, user_phrase) {
        let priority = 0;
        let tags_phrases = obj.tags;

        // Check for each object in a storage is the same TITLE with user phrase.
        // IF 'title' == 'user phrase' THEN info is probably that we are looking. Add proiority for current info obj + 10
        if (obj.title === undefined) {
            console.log('Warning! title property doesn\'t exist in obj: ', obj);
        }



        // Separated words of user phrase.
        const user_words = this.#textManager.splitText(user_phrase, ' ');
        // All tags.
        let tags = [];

        // For all user words.
        for (const i_wordUser in user_words) {
            // for each tags phrases separated by ','.
            for (const i_inTags in tags_phrases) {
                const tag = tags_phrases[i_inTags];
                const tag_words = this.#textManager.splitText(tag, ' ');
                tags = tags.concat(tag_words);
                //console.log('tag_words', tags);
            }
            
            // For each word in tag.
            for (let i_wordTag in tags) {
                let user_word = user_words[i_wordUser];
                let tag_word = tags[i_wordTag];

                // If in tag exist user word THEN add priority for this info object.
                if (this.#textManager.isSame(user_word, tag_word)) {
                    priority++;
                    /*
                    console.log('====== GROWUP PRIORITY =======');
                    console.log('obj.title', obj.title);
                    console.log('priority', priority);
                    console.log('tag_word', tag_word);
                    console.log('====== END GROWUP PRIORITY =======');
                    */
                    break;
                }
            }
        }
        
        return priority;
    }
    
    // Bubble sort O(n^2).
    // Get sorted actionBlocks by property.
    #getSortedActionBlocksByProperty = function(actionBlocks, property = "priority") {
        let is_sorting = true;
        while (is_sorting) {
            is_sorting = false;
            for (let i = 0; i < actionBlocks.length - 1; i++) {
                let infoObj_curr = actionBlocks[i];
                let infoObj_next = actionBlocks[i + 1];
                if (infoObj_curr[property] < infoObj_next[property]) {
                    actionBlocks[i] = infoObj_next;
                    actionBlocks[i + 1] = infoObj_curr;
                    is_sorting = true;
                }
            }
        }
        //console.log("sorted actionBlocks:.");
        //console.log(actionBlocks);
        return actionBlocks;
    }

    // #deleteAllIndexes() {
    //     const key = 'indexes_actionBlocks_by_tag';
    //     localStorage[key] = '';
    
    //     return true;
    // }
}


// const infoBlockModel = {};