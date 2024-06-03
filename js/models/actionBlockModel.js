class ActionBlockModel {
    #textManager;
    #dateManager;

    constructor(dbManager, textManager, dataStorageService, mapDataStructure, fileManager, dateManager) {
        this.#textManager = textManager;
        this.title_actionBlock_before_update = '';
        this.dbManager = dbManager;
        this.dataStorageService = dataStorageService;
        this.mapDataStructure = mapDataStructure;
        this.fileManager = fileManager;

        this.#dateManager = dateManager;

        // this.actionBlocks = [];
        this.actionBlocks_from_database = [];
        this.is_menu_create_type_actionBlock_open = false;
    
        this.action_description_by_action_name = {
            openURL: 'Open URL',
            showInfo: 'Show info',
            openFolder: 'Create folder (Search info by tags)',
            showHTML: 'Show info in HTML mode'
        };

        this.#init();
    }
    

    #actionBlocks_map;
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
            // console.log('authorization data', localStorage['authorization']);

            if (authorization_data) {
                const nickname = authorization_data.nickname;
                const password = authorization_data.password;
                
                $('#input_field_nickname')[0].value = nickname;
                $('#input_field_password')[0].value = password;

                $('#autorization_log').text('Connecting to database..');
                
                
                that.dbManager.authorization(nickname, password, onAuthorization, onAuthorizationFail);

                function onAuthorizationFail() {
                    // console.log('fail storage');
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
                                // console.log('onGetUserDataFromDB', DB_responce);
                                // Get user_data from DB field.

                                // is_possible_get_actionBlocks_from_database.
                                if (DB_responce) {
                                    if (DB_responce['user_data']) {
                                        let userDataFromDB;
                                        let actionBlocks_from_database = new Map();

                                        // IF data from DB parsed successfully THEN go next.
                                        try {
                                            userDataFromDB = JSON.parse(DB_responce['user_data']);
                                        }
                                        catch {
                                            onGetActionBlocksFailed();

                                            return;
                                        }

                                        actionBlocks_from_database = that.mapDataStructure.getParsed(userDataFromDB['actionBlocks']);

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

                                        // console.log('data from DB', that.actionBlocks_from_database);

                                        onGetCallback(that.actionBlocks_from_database);
                                        
                                        return;
                                    }
                                }
                            }
                        }
                        else {
                            // console.log('fail access');
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
        return this.getActionBlocks().get(title.toUpperCase());
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
            // console.log('Action-Blocks don\'t exist with tags: ' + user_phrase);
            return;
        }
    
        if (user_phrase === undefined || user_phrase === null) {
            let error_text = 'user_phrase not defined during information searching';
            // console.log(error_text);
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
    
                    let index_exist_in_indexes_infoObjects = yesSir.arrayManager.isValueExistsInArray(indexes_infoObjects_to_show, i_infoObj_to_show);
    
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
            // console.log('Action-Blocks don\'t exist with tags: ' + user_phrase);
            return;
        }
    
        if (user_phrase === undefined || user_phrase === null) {
            let error_text = 'user_phrase not defined during information searching';
            // console.log(error_text);
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
                    titles_actionBlocks_to_show = yesSir.arrayManager.getSameItemsFromArrays
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
                        if (that.#titles_actionBlocksMap_by_tag[minus_tag] === undefined) continue;
                        const i_infoObj_to_show = titles_actionBlocks_to_show[i_index_infoObj_to_show];
                        
                        // console.log(that.#titles_actionBlocksMap_by_tag[minus_tag]);
    
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
        const defaultActionBlocks = new DefaultActionBlocks();
        return defaultActionBlocks.getDefaultActionBlocks(); 
    }

    getActionNameEnum() {
        const ACTION_NAME_ENUM = {
            openURL: 'openURL',
            showInfo: 'showInfo',
            openFolder: 'openFolder',
            showHTML: 'showHTML'
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
                this.#actionBlocks_map.set(actionBlock.title.toUpperCase(), actionBlock);
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
            }
            else {
                if (that.mapDataStructure.getStringified(actionBlocks_from_user_storage) === that.mapDataStructure.getStringified(actionBlocks_from_localStorage)) {
                    that.setActionBlocks(actionBlocks_from_user_storage);
                    if (callbackSetActionBlocks) callbackSetActionBlocks();
                }
                else {
                    that.dataStorageService.view.showDatabaseDialog();
                    if (callbackUserStorageDifferentFromLocal) callbackUserStorageDifferentFromLocal();
                }
            }
        }

        return this.#actionBlocks_map;
    }


    add(actionBlock_to_add, is_show_alert_on_error = true) {
        actionBlock_to_add.tags = this.#getNormalizedTags(actionBlock_to_add.tags);
       
        actionBlock_to_add.tags = this.#getNormalizedTags([...actionBlock_to_add.tags, ...this.#getAdditionalTags(actionBlock_to_add.tags)]);


        actionBlock_to_add.title = actionBlock_to_add.title.trim();
        // Change title to URI friendly.
        actionBlock_to_add.title = actionBlock_to_add.title.replace(/[^a-zA-Z0-9-_ ]/g, '');


        if (this.#actionBlocks_map.has(actionBlock_to_add.title.toUpperCase())) {
            if (is_show_alert_on_error) alert('Action-Block with current title already exists. Title: ' + actionBlock_to_add.title);
            else {
                // console.log('Action-Block with current title already exists. Title: ' + actionBlock_to_add.title);
            }

            return false;
        }

        this.#actionBlocks_map.set(actionBlock_to_add.title.toUpperCase(), actionBlock_to_add);
        
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
            // console.log("saveInDatabase");
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


    getFromDatabaseFirebaseAsync(onGetActionBlocks) {
        console.log("getFromDatabaseFirebaseAsync()");
        const that = this;
        const dbRef = firebase.database().ref();
        const databaseTable = dbRef.child('actionBlocks');

        dbRef.on('value',(snapshot) => {
            const databaseObject = snapshot.val();
            console.log(databaseObject);
            const actionBlocksString = databaseObject.actionBlocks[0];
            console.log("get from firebase database completed:");
            // console.log(actionBlocks);

            yesSir.modalBoxService.show({header_text:'Success', body_text:'Receiving data from firebase database has been completed.'});

            setTimeout(() => {
                yesSir.modalBoxService.hide();
            }, "3000");
            

            const actionBlocks = this.mapDataStructure.getParsed(actionBlocksString);
            onGetActionBlocks(actionBlocks);
        });
    }

    getFromDatabaseFirebaseAsyncNoRealTimeTest(onGetActionBlocks) {
        console.log("getFromDatabaseFirebaseAsync()");
        const that = this;
        const dbRef = firebase.database().ref();
        const databaseTable = dbRef.child('actionBlocks');

        dbRef.get().then(function(results){
            console.log(results.data());

        });
    }
  

    saveInDatabase() {
        const that = this;

        let actionBlocks_to_DB_string = this.mapDataStructure.getStringified(this.getActionBlocks());

        let authorization_data;
        if (localStorage['authorization']) authorization_data = JSON.parse(localStorage['authorization']);

        if ( ! authorization_data) {
            alert('ERROR! Data has not been saved in database. Authorization error.');
            onDatabaseError();
            return false; 
        }

        // console.log('actionBlocks_to_DB_string', actionBlocks_to_DB_string);
        // actionBlocks_to_DB_string = '{"_type":"map","map":[["Cute videos",{"title":"Cute videos","tags":["Cute videos","video","fun","funny"],"action":"showInfo","content":"https://youtu.be/FTcjzaqL0pE\n\nhttps://youtube.com/shorts/CBuVCGI_mOM?feature=share\n\nhttps://youtube.com/shorts/Lehz34upmHs?feature=share\n\nhttps://youtube.com/shorts/HL0JFvzADfg?feature=share\n\nhttps://youtube.com/shorts/0BypBg5UXgU?feature=share\n\nhttps://youtube.com/shorts/ytbixShVm74?feature=share\n\nhttps://youtu.be/2Wzk_UlPcWg\n\nMonkey chill\nhttps://www.instagram.com/reel/CcCdHpcJg58/?utm_medium=copy_link\n\nOld man gives present to grandma\nhttps://www.instagram.com/reel/Cb_6hWAJUOw/?utm_medium=copy_link\n______\nDogs\n\nhttps://www.instagram.com/reel/Cb1kF4hJz4h/?utm_medium=copy_link\n\nhttps://www.instagram.com/reel/Cb0TY-WlXjT/?utm_medium=copy_link\n\nhttps://www.instagram.com/reel/CbupzFQpKUe/?utm_medium=copy_link\n\nhttps://www.instagram.com/reel/CcAvlB9lysj/?utm_medium=copy_link","imageURL":"","is_editable":true,"priority":1}]]}';
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
        const actionBlocks_to_save = this.mapDataStructure.getStringified(actionBlocks);
        const key = 'actionBlocks';
        localStorage.setItem(key, actionBlocks_to_save);

        return true;
    }

    updateActionBlock(title, tags, action, content, image_URL) {
        const original_title = this.title_actionBlock_before_update;
  
        // Check new title validation.
        if (original_title.toLowerCase() != title.toLowerCase()) {
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
    
        if ( ! is_created) {
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
        const is_deleted = this.#actionBlocks_map.delete(title.toUpperCase());

        this.#onUpdateVarialbeWithActionBlocks();
    
        return is_deleted;
    }

    deleteActionBlocks() {
        this.#actionBlocks_map = new Map();

        this.#onUpdateVarialbeWithActionBlocks();
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
    
        // console.log('Update indexes', indexes_actionBlocks_by_tag);
    
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
                        let isIndexExistInIndexesArr = yesSir.arrayManager.isValueExistsInArray(indexes_arr, i_actionBlock_to_paste);

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
                        let isIndexExistInIndexesArr = yesSir.arrayManager.isValueExistsInArray(indexes_arr, i_actionBlock);

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
        if (Array.isArray(tags)) {
            tags = tags.toString();
        }

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

    #getAdditionalTags(tags) {
         if (Array.isArray(tags) === false) {
            tags = this.#textManager.getArrayByText(tags);
        }

        const additionalTags = [];

        for (const tag of tags) {
            const tagWithoutSpecialCharacters = this.#textManager.getTextWithoutSpecialCharactes(tag);

            if (tag != tagWithoutSpecialCharacters) {
                additionalTags.push(tagWithoutSpecialCharacters);
            }

            if (tag === tag.toUpperCase() == false && tag === tag.toLowerCase() === false) {
                const tagWithSeparatedWords = this.#textManager.getSeparatedWordsByCamelCaseString(tag);

                additionalTags.push(tagWithSeparatedWords);
            }
        }

        console.log(additionalTags);

        return additionalTags;
    }

    // Get priority of object from DB. How many times words from user phrase are in the tags of objet DB.
    // Priority = 0 means that user words not exist in tags of object.
    #getPriorityActionBlockByPhrase(obj, user_phrase) {
        let priority = 0;
        let tags_phrases = obj.tags;

        // Check for each object in a storage is the same TITLE with user phrase.
        // IF 'title' == 'user phrase' THEN info is probably that we are looking. Add proiority for current info obj + 10
        if (obj.title === undefined) {
            // console.log('Warning! title property doesn\'t exist in obj: ', obj);
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
            }
            
            // For each word in tag.
            for (let i_wordTag in tags) {
                let user_word = user_words[i_wordUser];
                let tag_word = tags[i_wordTag];

                // If in tag exist user word THEN add priority for this info object.
                if (this.#textManager.isSame(user_word, tag_word)) {
                    priority++;
                    
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

        return actionBlocks;
    }
}