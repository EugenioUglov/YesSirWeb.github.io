class DefaultActionBlocks {
    constructor() {

    }

    getDefaultActionBlocks() {
        const actionBlock_create = {
            title: 'Create Action-Block',
            tags: 'Create Action-Block, default',
            action: 'showHTML',
            content: '<script>yesSir.actionBlockService.showSettingsToCreateActionBlock()</script>',
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
            content: '<script>yesSir.dataStorageService.showDataStorageSettings()</script>',
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
            content: '<script>yesSir.voiceRecognitionService.showSettings()</script>',
            imageURL: 'https://walkthechat.com/wp-content/uploads/2015/02/voice-recognition.jpg'
        };

        const default_actionBlocks = [
            // actionBlock_create,
            // actionBlock_create_note,
            actionBlock_facebook_of_developer, 
            actionBlock_email_of_developer,
            actionBlock_open_file_manager,
            // actionBlock_open_data_storage_manager,
            // actionBlock_logs,
            // actionBlock_voiceRecognitionSettings
        ];

        function getContentActionBlockOpenFileManager() {
            return `
                <div id="elements_for_file_manager" class="elements_for_executed_actionBlock" padding-top: 50px;">
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
                    yesSir.fileManager.uploadFile(onFileLoaded);
            
                    function onFileLoaded(content_of_file) {
                        yesSir.actionBlockService.saveActionBlocksFromFile(content_of_file);
            
                        // Give possibility to load the same file again.
                        $('.btn_upload_actionBlocks').value = '';
            
                        window.location.hash = "main";
                    }
                });
            
                $('.btn_download_actionBlocks')[0].addEventListener('click', () => {
                    yesSir.actionBlockService.downloadFileWithActionBlocks();
                });
                </script>
            `;
        }
    
        function getContentActionBlockCreateNote() {
            return `
                <script>
                yesSir.actionBlockService.showSettingsToCreateActionBlock('showInfo');
                yesSir.pageService.setHashCreateNote();

                // const dropdown_select_action = $('#settings_actionBlock_container').find('.dropdown_select_action');
                // dropdown_select_action.val('showInfo');
                // $('#title_action_descritption').text(yesSir.actionBlockService.model.getContentTypeDescriptionByActionEnum()[dropdown_select_action.val()]);
                
                voiceRecognitionForContent();
                
                function voiceRecognitionForContent() {
                    $('.input_field_content').focus();
                    yesSir.speakerManager.speak('Please, tell the text of the note', onEndSpeak);
                
                    function onEndSpeak() {
                        if (yesSir.pageService.getCurrentPageName() != yesSir.getPageNameEnum().createNote) return;

                        // Начинаем слушать микрофон и распознавать голос
                        yesSir.voiceRecognitionService.startRecognizing({
                            callbackInterimTranscript: onInterimTranscript, 
                            callbackFinalTranscript: onFinalTranscript, 
                            callbackEnd: onEndVoiceRecognition
                        });

                        function onInterimTranscript(result_text) {
                            // console.log('InterimTranscript', result_text);
                            $('.input_field_content').val(result_text);
                        }

                        function onFinalTranscript(result_text) {
                            $('.input_field_content').val(result_text);
                            yesSir.speakerManager.speak('Thank you!');
                            voiceRecognitionForCommand();
                        }

                        function onEndVoiceRecognition() {
                            // console.log('end');
                        }
                    }
                }
                
                function voiceRecognitionForCommand() {
                    $('.input_field_title').focus();
                    yesSir.speakerManager.speak('Please, tell the command that opens this note', onEndSpeak);
                
                    function onEndSpeak() {
                        if (yesSir.pageService.getCurrentPageName() != yesSir.getPageNameEnum().createNote) return;

                        yesSir.voiceRecognitionService.startRecognizing({
                            callbackInterimTranscript: onInterimTranscript, 
                            callbackFinalTranscript: onFinalTranscript, 
                            callbackEnd: onEndVoiceRecognition
                        });

                        function onInterimTranscript(result_text) {
                            $('.input_field_title').val(result_text);
                        }

                        function onFinalTranscript(result_text) {
                            $('.input_field_title').val(result_text);
                            yesSir.speakerManager.speak('Thank you!');
                            voiceRecognitionSaveResult();
                        }

                        function onEndVoiceRecognition() {
                            // console.log('end');
                        }
                    }
                }
                
                function voiceRecognitionSaveResult() {
                    yesSir.speakerManager.speak('Do you want to save this note?', onEndSpeak);
                
                    function onEndSpeak() {
                        if (yesSir.pageService.getCurrentPageName() != yesSir.getPageNameEnum().createNote) return;
                        
                        yesSir.voiceRecognitionService.startRecognizing({
                            callbackInterimTranscript: onInterimTranscript, 
                            callbackFinalTranscript: onFinalTranscript, 
                            callbackEnd: onEndVoiceRecognition
                        });

                        function onInterimTranscript(result_text) {
                            // console.log('interim result', result_text);
                        }

                        function onFinalTranscript(result_text) {
                            // console.log('final result', result_text);

                            if (result_text.includes('no') || result_text.includes('nope') || result_text.includes("don't")) {
                                isFinalResult = true;
                                yesSir.speakerManager.speak("Ok. I didn't save the note. You can customize the note manually. I'm switching off");
                            
                                return;
                            }
                            else if (
                                result_text.includes('save') || result_text.includes('yes') || 
                                result_text.includes('yeah') || result_text.includes('want')
                            ) {
                                isFinalResult = true;
                                yesSir.speakerManager.speak('Ok. Note has been saved!', onEndSpeak);
                                
                                function onEndSpeak() {
                                    $('#btn_create_actionBlock').click();
                                }

                                return;
                            }
                        }

                        function onEndVoiceRecognition() {
                            // console.log('end');
                        }
                    }
                }
                </script>
            `;
        }

        return default_actionBlocks;
    }
}