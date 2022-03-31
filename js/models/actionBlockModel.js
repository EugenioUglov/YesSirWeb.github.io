class ActionBlockModel {
    constructor(dbManager, textManager, observable, dataStorageController, mapDataStructure, logsController) {
        this.textManager = textManager;
        this.title_actionBlock_before_update = '';
        this.dbManager = dbManager;
        this.dataStorageController = dataStorageController;
        this.mapDataStructure = mapDataStructure;
        this.logsController = logsController;
        this.actionBlocks = [];
        this.actionBlocks_from_database = [];
        this.indexes_actionBlocks_by_tag = [];
        this.infoBlocks_on_page = '';
        this.i_actionBlock_opened_settings;
        this.is_menu_create_type_actionBlock_open = false;
    
        this.action_name = {
            openURL: 'openURL',
            showInfo: 'showInfo',
            openFolder: 'openFolder',
            showHTML: 'showHTML',
            createActionBlock: 'createActionBlock',
            showFileManager: 'showFileManager',
            showDataStorageManager: 'showDataStorageManager',
            showElementsForVoiceRecognitionManager: 'showElementsForVoiceRecognitionManager',
            showLogs: 'showLogs',
        };
    
        this.action_description_by_action_name = {
            openURL: 'Open URL',
            showInfo: 'Show info',
            openFolder: 'Create folder (Search info by tags)',
            showHTML: 'Show info in HTML mode'
        };
    
        // Titles for input field info of action.
        this.content_type_description_by_action = {
            openURL: 'URL',
            showInfo: 'Description',
            openFolder: 'Tags to search',
            showHTML: 'HTML code'
        };

        this.observable = observable;

        this.#init();
    }
    

    #actionBlocks_map;
    #index_actionBlock_by_title = {};
    #titles_actionBlocksMap_by_tag = {};
    
    #init() {
        this.#actionBlocks_map = new Map();
    }

    /* OLD
    getActionBlocks() {
        return this.actionBlocks;
    }
    */

    // NEW
    getActionBlocks() {
        return this.getActionBlocksMap();
    }

    getActionBlocksMap() {
        return this.#actionBlocks_map;
    }




    /* OLD
    getActionBlocksFromStorageAsync(onGetCallback) {
        let that = this;


        if (this.dataStorageController.getUserStorage() === storage_name.database) {
            getActionBlocksFromDatabase(onGetCallback, onFail);

            function onFail() {
                alert('Data synchronization error! Action-Blocks will be saved in the browser storage');

                $('#autorization_log').text('ERROR! Connection to database is failed');
                $('#autorization_log').css('color', 'red');

                localStorage.removeItem('authorization');
                that.dataStorageController.setUserStorage(storage_name.localStorage);
                that.getActionBlocksFromLocalStorageAsync(onGetCallback);
            }
        }
        else if (this.dataStorageController.getUserStorage() === storage_name.localStorage) {
            that.getActionBlocksFromLocalStorageAsync(onGetCallback);
        }

        function getActionBlocksFromDatabase(onGetCallback, failCallback) {
            //console.log('dataFromDatabaseLoading');
            const event_data_from_database_loading = {
                name: 'dataFromDatabaseLoading',
                data: {
                    log: 'Loading data from database'
                }
            };

            that.observable.dispatchEvent(event_data_from_database_loading.name, event_data_from_database_loading.data);
         


            let authorizationData;
            if (localStorage['authorization']) authorizationData = JSON.parse(localStorage['authorization']);

            if (authorizationData) {
                const nickname = authorizationData.nickname;
                const password = authorizationData.password;
                
                $('#input_field_nickname')[0].value = nickname;
                $('#input_field_password')[0].value = password;

                $('#autorization_log').text('Connecting to database..');
                
                
                that.dbManager.authorization(nickname, password, onAuthorization, failCallback);

                function onAuthorization(DB_responce) {
                    $('#autorization_log').text('Waiting for responce from database..');
                    $('#autorization_log').css('color', 'gray');

                    if (DB_responce) {
                        if (DB_responce.access) {
                            // Set text: authorization completed successfully.
                            $('#autorization_log').text('Authorization completed successfully for user: ' + nickname);
                            $('#autorization_log').css('color', 'green');

                            // Set authorization data to localStorage.
                            authorizationData = {
                                id: DB_responce.id,
                                nickname: nickname,
                                password: password
                            };


                            localStorage['authorization'] = JSON.stringify(authorizationData);

                            const event_database_connection_success = {
                                name: 'databaseConnectionSuccess',
                                data: {
                                    log: 'Database connection is completed successfully for user: ' + nickname
                                }
                            };

                            that.observable.dispatchEvent(event_database_connection_success.name, event_database_connection_success.data);

                            // Get data from DB.
                            if ( ! authorizationData) {
                                alert('Error authorization');
                                return false;
                            }

                            const user_id = authorizationData.id;
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
                                        let actionBlocks_from_database;
                                        
                                        // IF data from DB parsed successfully THEN go next.
                                        try {
                                            userDataFromDB = JSON.parse(DB_responce['user_data']);
                                            actionBlocks_from_database = JSON.parse(userDataFromDB['actionBlocks']);
                                        }
                                        catch {
                                            alert('ERROR! Action-Blocks have not been loaded from database. \nProbably data is broken.');

                                            failCallback();
                                            return;
                                        }
                                        that.actionBlocks_from_database = [].concat(actionBlocks_from_database);
                                        console.log('data from DB', that.actionBlocks_from_database);
                                        onGetCallback(that.actionBlocks_from_database);
                                        
                                        return;
                                    }
                                }
                            }
                        }
                    }

                    onGetCallback(null);

                    const event_database_connection_failed = {
                        name: 'databaseConnectionFailed',
                        data: {
                            log: 'Database connection is failed for user: ' + nickname
                        }
                    };
                    
                    that.observable.dispatchEvent(event_database_connection_failed.name, event_database_connection_failed.data);

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
    */

    // NEW
    getActionBlocksFromStorageAsync(onGetCallback) {
        return this.getActionBlocksMapFromStorageAsync(onGetCallback);
    }

    getActionBlocksMapFromStorageAsync(onGetCallback) {
        let that = this;


        if (this.dataStorageController.getUserStorage() === storage_name.database) {
            getActionBlocksFromDatabase(onGetCallback, onFail);

            function onFail() {
                alert('Data synchronization error! Action-Blocks will be saved in the browser storage');

                $('#autorization_log').text('ERROR! Connection to database is failed');
                $('#autorization_log').css('color', 'red');

                localStorage.removeItem('authorization');
                that.dataStorageController.setUserStorage(storage_name.localStorage);
                that.getActionBlocksFromLocalStorageAsync(onGetCallback);
            }
        }
        else if (this.dataStorageController.getUserStorage() === storage_name.localStorage) {
            that.getActionBlocksFromLocalStorageAsync(onGetCallback);
        }

        function getActionBlocksFromDatabase(onGetCallback, failCallback) {
            //console.log('dataFromDatabaseLoading');
            const event_data_from_database_loading = {
                name: 'dataFromDatabaseLoading',
                data: {
                    log: 'Loading data from database'
                }
            };

            that.observable.dispatchEvent(event_data_from_database_loading.name, event_data_from_database_loading.data);
         


            let authorizationData;
            if (localStorage['authorization']) authorizationData = JSON.parse(localStorage['authorization']);

            if (authorizationData) {
                const nickname = authorizationData.nickname;
                const password = authorizationData.password;
                
                $('#input_field_nickname')[0].value = nickname;
                $('#input_field_password')[0].value = password;

                $('#autorization_log').text('Connecting to database..');
                
                
                that.dbManager.authorization(nickname, password, onAuthorization, failCallback);

                function onAuthorization(DB_responce) {
                    $('#autorization_log').text('Waiting for responce from database..');
                    $('#autorization_log').css('color', 'gray');

                    if (DB_responce) {
                        if (DB_responce.access) {
                            // Set text: authorization completed successfully.
                            $('#autorization_log').text('Authorization completed successfully for user: ' + nickname);
                            $('#autorization_log').css('color', 'green');

                            // Set authorization data to localStorage.
                            authorizationData = {
                                id: DB_responce.id,
                                nickname: nickname,
                                password: password
                            };


                            localStorage['authorization'] = JSON.stringify(authorizationData);

                            const event_database_connection_success = {
                                name: 'databaseConnectionSuccess',
                                data: {
                                    log: 'Database connection is completed successfully for user: ' + nickname
                                }
                            };

                            that.observable.dispatchEvent(event_database_connection_success.name, event_database_connection_success.data);

                            // Get data from DB.
                            if ( ! authorizationData) {
                                alert('Error authorization');
                                return false;
                            }

                            const user_id = authorizationData.id;
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
                                            alert('ERROR! Action-Blocks have not been loaded from database. \nProbably data is broken.');

                                            failCallback();
                                            return;
                                        }

                                        that.actionBlocks_from_database = actionBlocks_from_database;
                                        console.log('data from DB', that.actionBlocks_from_database);
                                        onGetCallback(that.actionBlocks_from_database);
                                        
                                        return;
                                    }
                                }
                            }
                        }
                    }

                    onGetCallback(null);

                    const event_database_connection_failed = {
                        name: 'databaseConnectionFailed',
                        data: {
                            log: 'Database connection is failed for user: ' + nickname
                        }
                    };
                    
                    that.observable.dispatchEvent(event_database_connection_failed.name, event_database_connection_failed.data);

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

    getActionBlockFromMapByTitle(title) {
        return this.getActionBlocksMap().get(title);
    }
    /* OLD
    getActionBlocksFromLocalStorageAsync(onGetCallback) {
        let actionBlocks = [];
        const key = 'actionBlocks';
        
        if (localStorage.getItem(key)) {
            const actionBlocks_from_localStorage = JSON.parse(localStorage.getItem(key));
    
            // Make array even if in localStorage just one Action-Block.
            actionBlocks = actionBlocks.concat(actionBlocks_from_localStorage);
        }

        //this.setActionBlocks(actionBlocks);

        if (onGetCallback) onGetCallback(actionBlocks);

        return actionBlocks;
    }
    */

    // NEW
    getActionBlocksFromLocalStorageAsync(onGetCallback) {
        let actionBlocks_from_localStorage = new Map;
        const key = 'actionBlocks';
        
        if (localStorage.getItem(key)) {
            actionBlocks_from_localStorage = this.mapDataStructure.getParsed(localStorage.getItem(key));
    
            // Make array even if in localStorage just one Action-Block.
            //actionBlocks = actionBlocks.concat(actionBlocks_from_localStorage);
        }

        //this.setActionBlocks(actionBlocks);

        if (onGetCallback) onGetCallback(actionBlocks_from_localStorage);

        return actionBlocks_from_localStorage;
    }


    getIndexesActionBlocksByTag() {
        const key = 'indexes_actionBlocks_by_tag';
    
        if (localStorage.getItem(key)) return JSON.parse(localStorage[key]);
    
        return {};
    }

    getIndexActionBlockByTitle(title) {
        title = title.toLowerCase();
        return this.#index_actionBlock_by_title[title];
    }

    /* OLD
    getByPhrase(user_phrase) {
        const that = this;

        console.log('this', this);
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
        const user_words = this.textManager.splitText(user_phrase, ' ');
        
        
        const indexes_actionBlocks_by_tag = this.getIndexesActionBlocksByTag();
        const indexes_infoObjects_to_show = getIndexesInfoObjectsToShowByPhrase(user_words); 
    
    
    
        // Create an array with actionBlocks and priority value to show.
        for (const i_obj of indexes_infoObjects_to_show) {
            let actionBlock = actionBlocks[i_obj];
    
            let priority_actionBlock = this.#getPriorityActionBlockByPhrase(actionBlock, user_phrase);
            actionBlock.priority = priority_actionBlock;
            // console.log(actionBlock, priority_actionBlock);
    
            if (priority_actionBlock > 0) {
                // Push current obj.
                found_actionBlocks.push(actionBlock);
            }
        }
    
        const property_in_actionBlock_for_sort = 'priority';
        let is_sort_from_A_to_Z = false;
    
        // Sort by priority.
        found_actionBlocks = sort.getSortedActionBlocksByProperty(found_actionBlocks, property_in_actionBlock_for_sort, is_sort_from_A_to_Z);
    
        return found_actionBlocks;
    
        function getIndexesInfoObjectsToShowByPhrase(user_words) {
            const indexes_infoObjects_to_show = [];
            
            // Push index of infoObj by user phrase if it doesn't exist yet in array. 
            for (const i_user_word in user_words) {
                // One user word of phrase.
                const user_word = user_words[i_user_word];
                // Indexes of current tag.
                const indexes_infoObjects_curr = indexes_actionBlocks_by_tag[user_word];
    
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
    */

    // NEW
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
        const user_words = this.textManager.splitText(user_phrase, ' ');
        
        const titles_actionBlocks_to_show = getTitlesActionBlocksByTags(user_words);
        
            
        // Create an array with actionBlocks and priority value to show.
        for (const title_actionBlock of titles_actionBlocks_to_show) {
            let actionBlock = this.getActionBlockFromMapByTitle(title_actionBlock);
            const priority_actionBlock = this.#getPriorityActionBlockByPhrase(actionBlock, user_phrase);

            actionBlock.priority = priority_actionBlock;
            console.log(actionBlock, priority_actionBlock);
    
            if (priority_actionBlock > 0) {
                // Push current obj.
                found_actionBlocks.push(actionBlock);
            }
        }
        
        const property_in_actionBlock_for_sort = 'priority';
        let is_sort_from_A_to_Z = false;
    
        // Sort by priority.
        found_actionBlocks = sort.getSortedActionBlocksByProperty(found_actionBlocks, property_in_actionBlock_for_sort, is_sort_from_A_to_Z);
    
        return found_actionBlocks;
    
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
    

    /* OLD
    getActionBlocksByTags(user_phrase, minus_tags) {
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
        let actionBlocks = this.getActionBlocks();
        
        user_phrase = user_phrase.toLowerCase();
        minus_tags = minus_tags.toLowerCase();
    
        const user_tags = this.textManager.splitText(user_phrase, ' ');
        const user_minus_tags = this.textManager.splitText(minus_tags, ' ');
        
        const indexes_actionBlocks_by_tag = this.getIndexesActionBlocksByTag();
    
    
        const indexes_infoObjects_to_show = getIndexesActionBlocksToShowByTags(user_tags, user_minus_tags); 
    
        // Create an array with actionBlocks and priority value to show.
        for (let i_obj of indexes_infoObjects_to_show) {
            let infoObj_curr = actionBlocks[i_obj];
    
            let priority_infoObj_curr = this.#getPriorityActionBlockByPhrase(infoObj_curr, user_phrase);
            infoObj_curr.priority = priority_infoObj_curr;
            console.log(infoObj_curr, priority_infoObj_curr);
    
            if (priority_infoObj_curr > 0) {
                // Push current obj
                searched_infoObjects.push(infoObj_curr);
            }
        }
    
        const property_in_actionBlock_for_sort = 'priority';
        let is_sort_from_A_to_Z = false;
    
        // Sort by priority.
        searched_infoObjects = sort.getSortedActionBlocksByProperty(searched_infoObjects, 
            property_in_actionBlock_for_sort, is_sort_from_A_to_Z);
    
        return searched_infoObjects;
    
    
        function getIndexesActionBlocksToShowByTags(tags, minus_tags) {
            let indexes_actionBlocks_to_show = [];
    
            // Push index of Action-blocks by user phrase if it doesn't exist yet in array. 
            for (let i_tag in tags) {
                // One user word of phrase.
                let tag = tags[i_tag];
    
                if (indexes_actionBlocks_by_tag[tag] === undefined) {
                    return [];
                }
                
                // If array with indexes to show is empty. 
                if (indexes_actionBlocks_to_show.length < 1) {
                    // Add all Action-Blocks indexes of tag to array.
                    indexes_actionBlocks_to_show = indexes_actionBlocks_to_show.concat(indexes_actionBlocks_by_tag[tag]);
                }
                else {
                    indexes_actionBlocks_to_show = arrayManager.getSameElementsFromArrays
                    (
                        indexes_actionBlocks_to_show, indexes_actionBlocks_by_tag[tag]
                    );
    
                    if (indexes_actionBlocks_to_show.length < 1) {
                        // No same indexes in tags after comparation.
    
                        return []; 
                    }
                }
            }
    
            indexes_actionBlocks_to_show = getIndexesActionBlocksWithoutMinusTags(indexes_actionBlocks_to_show, minus_tags);
    
            return indexes_actionBlocks_to_show;
    
    
            function getIndexesActionBlocksWithoutMinusTags(indexes_actionBlocks_to_show, minus_tags) {
                // Delete items with minus tags.
                for (const minus_tag of minus_tags) {
                    for (const i_index_infoObj_to_show in indexes_actionBlocks_to_show) {
                        const i_infoObj_to_show = indexes_actionBlocks_to_show[i_index_infoObj_to_show];
    
                        // Compare minus tag with each Action-Block that has this tag.
                        for (const index_actionBlock_with_minus_tag of indexes_actionBlocks_by_tag[minus_tag]) {
                            if (index_actionBlock_with_minus_tag === i_infoObj_to_show) {
                                indexes_actionBlocks_to_show[i_index_infoObj_to_show] = undefined;
                            }
                        }
                    }
                }
    
                // Delete all undefined elements from array.
                indexes_actionBlocks_to_show = indexes_actionBlocks_to_show.filter(function(x) {
                    return x !== undefined;
                });
    
    
                return indexes_actionBlocks_to_show;
            }
        }
    }
    */

    // NEW
    getActionBlocksByTags(user_phrase, minus_tags) {
        return this.getActionBlocksFromMapByTags(user_phrase, minus_tags);
    }

    getActionBlocksFromMapByTags(user_phrase, minus_tags) {
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

        const user_tags = this.textManager.splitText(user_phrase, ' ');
        const user_minus_tags = this.textManager.splitText(minus_tags, ' ');
        
        const titles_actionBlocks_to_show = getTitlesActionBlocksByTags(user_tags, user_minus_tags);
        
            
        // Create an array with actionBlocks and priority value to show.
        for (let title_actionBlock of titles_actionBlocks_to_show) {
            let actionBlock = this.getActionBlockFromMapByTitle(title_actionBlock);
            const priority_actionBlock = this.#getPriorityActionBlockByPhrase(actionBlock, user_phrase);

            actionBlock.priority = priority_actionBlock;
            console.log(actionBlock, priority_actionBlock);
    
            if (priority_actionBlock > 0) {
                // Push current obj
                searched_infoObjects.push(actionBlock);
            }
        }
    
        const property_in_actionBlock_for_sort = 'priority';
        let is_sort_from_A_to_Z = false;
    
        // Sort by priority.
        searched_infoObjects = sort.getSortedActionBlocksByProperty(searched_infoObjects, 
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
                    titles_actionBlocks_to_show = arrayManager.getSameElementsFromArrays
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
            content: '<script>actionBlockController.showElementsToCreateActionBlock()</script>',
            imageURL: 'https://i.ibb.co/K6kqJQc/plus.png'
        };

        const actionBlock_create_note = {
            title: 'Create a note',
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
            content: '<script>actionBlockController.showElementsForDataStorageManager()</script>',
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
            content: '<script>logsController.showLogs()</script>',
            imageURL: 'https://pbs.twimg.com/profile_banners/240696823/1528203940/1500x500'
        };
    
        const actionBlock_voiceRecognitionSettings = {
            title: 'Open voice recognition settings',
            tags: 'voice recognition, default',
            action: 'showHTML',
            content: '<script>actionBlockController.showElementsForVoiceRecognitionManager()</script>',
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
            if (content_of_file === undefined) {
                alert('Error! Data from the file has not been loaded');
                return;
            }
            
            // Get actionBlocks from the file.
            let actionBlocks_from_file;
            
            console.log(content_of_file);
            
            try {
                // actionBlocks_from_file = JSON.parse(content_of_file);
                actionBlocks_from_file = mapDataStructure.getParsed(content_of_file);
            }
            catch(error) {
                alert('Content of file is not correct. File must contain an Action-Blocks data.');
                console.log(error);
                return;
            }
            
            $('#btn_close').click();
            
            const event_file_actionBlocks_uploaded = {
            name: 'fileActionBlocksUploaded',
            data: {
            log: 'fileActionBlocksUploaded',
            actionBlocks: actionBlocks_from_file
            }
            };
            
            observable.dispatchEvent(event_file_actionBlocks_uploaded.name, event_file_actionBlocks_uploaded.data);
            }
            
            
            
            // Give possibility to load the same file again.
            $('.btn_upload_actionBlocks').value = '';
            });
            
            
            downloadFileWithActionBlocks = () => {
                const content = mapDataStructure.getParsed(actionBlockController.getActionBlocks());
                
                const date_obj = new Date();
                // Get date in format day.month.year hours.minutes.seconds.
                // const date_text = date_obj.today() + '  ' + date_obj.timeNow();
                
                //months from 1-12
                const month = date_obj.getUTCMonth() + 1;
                const day = date_obj.getUTCDate();
                const year = date_obj.getUTCFullYear();
                const hours = date_obj.getHours();
                const minutes = date_obj.getMinutes();
                const seconds = date_obj.getSeconds();
                
                const date_text = '' + year + month + day + '_' + hours + minutes + seconds;
                
                // Set variable for name of the saving file with date and time. 
                const file_name = 'Action-Blocks ' + date_text;
                const extension = '.json';
                
                fileManager.downloadFile(content, file_name, extension);
            }
            
            $('.btn_download_actionBlocks')[0].addEventListener('click', () => {
                downloadFileWithActionBlocks();
            });
            </script>`;
        }
    
        function getContentActionBlockCreateNote() {
            return `<script>
            actionBlockController.showElementsToCreateActionBlock('showInfo');

            $('#settings_action_block_container').find('.dropdown_select_action').val('showInfo');
            $('#title_action_descritption').text(content_type_description_by_action['showInfo']);

  
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
                speakerService.speak('Please, tell the text of the note', onEndSpeak);
            
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
                            speakerService.speak('Thank you!');
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
                    voiceRecognitionService.startRecognizing(onInterimTranscript, onFinalTranscript, onEndVoiceRecognition);

                    function onInterimTranscript(result_text) {
                        $('.input_field_content').val(result_text);
                    }

                    function onFinalTranscript(result_text) {
                        $('.input_field_content').val(result_text);
                        speakerService.speak('Thank you!');
                        voiceRecognitionForCommand();
                    }

                    function onEndVoiceRecognition() {
                        console.log('end');
                    }
                }
            }
            
            function voiceRecognitionForCommand() {
               $('.input_field_title').focus();
                speakerService.speak('Please, tell the command that opens this note', onEndSpeak);
            
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
                            
                            speakerService.speak('Thank you!');
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
                    voiceRecognitionService.startRecognizing(onInterimTranscript, onFinalTranscript, onEndVoiceRecognition);

                    function onInterimTranscript(result_text) {
                        $('.input_field_title').val(result_text);
                    }

                    function onFinalTranscript(result_text) {
                        $('.input_field_title').val(result_text);
                        speakerService.speak('Thank you!');
                        voiceRecognitionSaveResult();
                    }

                    function onEndVoiceRecognition() {
                        console.log('end');
                    }
                }
            }
            
            function voiceRecognitionSaveResult() {
                  speakerService.speak('Do you want to save this note?', onEndSpeak);
            
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
                                speakerService.speak("Ok. I didn't save the note. You can customize the note manually. I'm switching off");
                              
                              return;
                            }
                            else if (result[0].transcript.includes('save') || result[0].transcript.includes('yes') || result[0].transcript.includes('yeah') || result[0].transcript.includes('want')) {
                                isFinalResult = true;
                                speakerService.speak('Ok. Note has been saved!', onEndSpeak);
                                
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
                    voiceRecognitionService.startRecognizing(onInterimTranscript, onFinalTranscript, onEndVoiceRecognition);

                    function onInterimTranscript(result_text) {
                    }

                    function onFinalTranscript(result_text) {
                        if (result_text.includes('no') || result_text.includes('nope') || result_text.includes("don't")) {
                            isFinalResult = true;
                            speakerService.speak("Ok. I didn't save the note. You can customize the note manually. I'm switching off");
                          
                            return;
                        }
                        else if (result_text.includes('save') || result_text.includes('yes') || 
                            result_text.includes('yeah') || result_text.includes('want')) {
                                isFinalResult = true;
                                speakerService.speak('Ok. Note has been saved!', onEndSpeak);
                                
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

                observable.listen('noteClosed', function(observable, eventType, data) {
                    voiceRecognitionService.stopRecognizing();
                });
            }
                </script>`;
        }

        return default_actionBlocks;
    }




    /* OLD
    setActionBlocks(actionBlocks_to_save) {
        this.actionBlocks = [].concat(actionBlocks_to_save);
        this.#onUpdate();
        
        return this.actionBlocks;
    }
    */

    // NEW
    setActionBlocks(actionBlocks_to_save) {
        return this.setActionBlocksMap(actionBlocks_to_save);
    }

    setActionBlocksMap(actionBlocks_map_new) {
        console.log('set actionBlocks_map_new', actionBlocks_map_new);
        if ( ! actionBlocks_map_new) actionBlocks_map_new = new Map();
        else {
            actionBlocks_map_new.forEach(actionBlock => {
                this.#actionBlocks_map.set(actionBlock.title, actionBlock);
            });
        }

        this.#onUpdate();

        return this.#actionBlocks_map;
    }


    /* OLD
    add(actionBlock_to_add, is_show_alert_on_error = true) {
        let actionBlocks = this.getActionBlocks();
        console.log('!!!', actionBlock_to_add.tags);
        actionBlock_to_add.tags = this.#getNormalizedTags(actionBlock_to_add.tags);
        
        const indexActionBlockByTitle = this.getIndexActionBlockByTitle(actionBlock_to_add.title);

        // If Action-Block not found in current Action-Blocks array.
        if (indexActionBlockByTitle === undefined) {
            // Add new Action-Block to the beginning of array.
            actionBlocks.unshift(actionBlock_to_add);
            console.log('ActionBlock created', actionBlock_to_add.title);
            //this.#actionBlocks_map.set(actionBlock_to_add.title, actionBlock_to_add);
        }
        else {
            if (is_show_alert_on_error) alert('Action-Block with current title already exists. Title: ' + actionBlock_to_add.title);
            else {
                console.log('Action-Block with current title already exists. Title: ' + actionBlock_to_add.title);
            }

            return false;
        }

        this.setActionBlocks(actionBlocks);
    
        return true;
    }
    */

    // NEW
    add(actionBlock_to_add, is_show_alert_on_error = true) {
        return this.addActionBlockMap(actionBlock_to_add, is_show_alert_on_error);
    }

    addActionBlockMap(actionBlock_to_add, is_show_alert_on_error = true) {
        actionBlock_to_add.tags = this.#getNormalizedTags(actionBlock_to_add.tags);
        

        if (this.#actionBlocks_map.has(actionBlock_to_add.title)) {
            if (is_show_alert_on_error) alert('Action-Block with current title already exists. Title: ' + actionBlock_to_add.title);
            else {
                console.log('Action-Block with current title already exists. Title: ' + actionBlock_to_add.title);
            }

            return false;
        }

        this.#actionBlocks_map.set(actionBlock_to_add.title, actionBlock_to_add);
        
        this.#onUpdate();
    
        return true;
    }
 
    /* OLD
    saveAsync(actionBlocks, callBackSavedSuccessfully, callBackError) {
        const that = this;
        this.actionBlocks = actionBlocks;

        this.logsController.showLog('Data is saving... Don\'t close this tab');

        let isSavedInLocalStorage = saveInLocalStorage(actionBlocks);
    
        if (this.dataStorageController.getUserStorage() === storage_name.database)
        {
            // Send to DB.
            saveToDatabase(onUpdatedUserData, onDatabaseError);
            
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
    
    

        function saveToDatabase(callBackUpdatedUserData, callBackDatabaseError) {
            console.log("saveToDatabase");
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
        this.saveActionBlocksMapAsync(actionBlocks, callBackSavedSuccessfully, callBackError);
    }

    saveActionBlocksMapAsync(actionBlocks, callBackSavedSuccessfully, callBackError) {
        const that = this;
        if ( ! actionBlocks) {
            actionBlocks = this.#actionBlocks_map;
        }

        this.logsController.showLog('Data is saving... Don\'t close this tab');
        

        let isSavedInLocalStorage = saveInLocalStorage(actionBlocks);
    
        if (this.dataStorageController.getUserStorage() === storage_name.database)
        {
            // Send to DB.
            saveToDatabase(onUpdatedUserData, onDatabaseError);
            
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
    
    

        function saveToDatabase(callBackUpdatedUserData, callBackDatabaseError) {
            console.log("saveToDatabase");
            const actionBlocks_to_DB_string = this.mapDataStructure.getStringified(that.getActionBlocks());

            let authorizationData;
            if (localStorage['authorization']) authorizationData = JSON.parse(localStorage['authorization']);

            if ( ! authorizationData) {
                alert('ERROR! Not saved in database. Authorization error.');
                callBackDatabaseError();
                return false; 
            }
            /*
            if 
            (
                JSON.stringify(that.actionBlocks_from_database) === actionBlocks_to_DB_string
            ) {
                console.log('that.actionBlocks_from_database', that.actionBlocks_from_database);
                console.log('actionBlocks_to_DB_string', actionBlocks_to_DB_string);
                console.log('Not saved in database. Data the same.');
                callBackDatabaseError();
                return false;    
            }
            */
            
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
            console.log('Send data to DB', data_to_send);
            
            function onFailSaveUserData() {
                return false;
            }

            return true;
        }
    
        function saveInLocalStorage(actionBlocks) {
            const key = 'actionBlocks';
            localStorage.setItem(key, mapDataStructure.getStringified(actionBlocks));

            return true;
        }
    }



    /* OLD
    deleteActionBlockByTitle(title, is_show_alert_on_error = true) {
        let i_actionBlock = this.getIndexActionBlockByTitle(title);
        const is_deleted = this.deleteActionBlockByIndex(i_actionBlock, is_show_alert_on_error);
    
        return is_deleted;
    }
    */

    // NEW
    deleteActionBlockByTitle(title, is_show_alert_on_error = true) {
        return this.deleteActionBlockMapByTitle(title, is_show_alert_on_error);
    }

    deleteActionBlockMapByTitle(title) {
        const is_deleted = this.#actionBlocks_map.delete(title);

        this.#onUpdate();
        console.log('Deleted ' + title);
        console.log('this.#actionBlocks_map', this.#actionBlocks_map)
    
        return is_deleted;
    }

    deleteActionBlockByIndex(i_actionBlock, is_show_alert_on_error = true) {
        alert("Function not support anymore deleteActionBlockByIndex()");
        return;
        if (i_actionBlock < 0 || i_actionBlock >= this.actionBlocks.length || i_actionBlock === undefined) {
            if (is_show_alert_on_error) alert('Data doesn\'t exist for Action-Block with index: ' + i_actionBlock);
            return false;
        }

        // Delete infoObject from array.
        this.actionBlocks.splice(i_actionBlock, 1);

        this.setActionBlocks(this.actionBlocks);
    
        return true;
    }

    deleteCurrentActionBlock(is_show_alert_on_error = true) {
        alert("Function not support anymore deleteCurrentActionBlock()");

        return;
        return this.deleteActionBlockByIndex(this.i_actionBlock_opened_settings, is_show_alert_on_error);
    }


    #onUpdate() {
        this.saveAsync(this.getActionBlocks());
        this.#updateTagsIndexes();
        this.#updateTagsIndexesForMap();
        this.#updateTitleIndexes();
        //this.#updateActionBlocksMap();
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
                    let tag_words = that.textManager.splitText(tag, ' ');
                    
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
            const actionBlocksMap = that.getActionBlocksMap();
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
                    let tag_words = that.textManager.splitText(tag_lower_case, ' ');

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

    #updateTitleIndexes() {
        const that = this;
        this.#index_actionBlock_by_title = createIndexes();
        const key = 'index_actionBlock_by_title';
    
        localStorage[key] = JSON.stringify(this.#index_actionBlock_by_title);
    
        console.log('Update indexes', this.#index_actionBlock_by_title);
    
        return this.#index_actionBlock_by_title;
    
        // Example: index_actionBlock_by_title['my targets'] = 0;
        function createIndexes(actionBlocks) {
            if ( ! actionBlocks) actionBlocks = that.getActionBlocks();
    
            let index_actionBlock_by_title = {};
    
    
            // For all actionBlocks.
            for (const i_actionBlock in actionBlocks) {
                const actionBlock = actionBlocks[i_actionBlock];
                const title = actionBlock.title.toLowerCase();
    
                index_actionBlock_by_title[title] = i_actionBlock;
            }
    
            return index_actionBlock_by_title;
        }
    }

    /*
    #updateActionBlocksMap(actionBlocks) {
        if (actionBlocks === undefined) actionBlocks = this.getActionBlocks();

        const actionBlocks_map = new Map();

        for (let i = actionBlocks.length - 1; i >= 0; i--) {
            const actionBlock = actionBlocks[i]; 
            actionBlocks_map.set(actionBlock.title, actionBlock);
        }

        console.log('actionBlocks_map update', actionBlocks_map);
    }
    */

    #getNormalizedTags(tags) {
        let normalizedTags;
    
        // Change all new lines to symbol ',".
        const tags_without_new_line = tags.replaceAll('\n', ',');
        //tags_lower_case = tags_without_new_line.toLowerCase();
    
        let tags_array = this.textManager.getArrayByText(tags_without_new_line);
        
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
        const user_words = this.textManager.splitText(user_phrase, ' ');
        // All tags.
        let tags = [];

        // For all user words.
        for (const i_wordUser in user_words) {
            // for each tags phrases separated by ','.
            for (const i_inTags in tags_phrases) {
                const tag = tags_phrases[i_inTags];
                const tag_words = this.textManager.splitText(tag, ' ');
                tags = tags.concat(tag_words);
                //console.log('tag_words', tags);
            }
            
            // For each word in tag.
            for (let i_wordTag in tags) {
                let user_word = user_words[i_wordUser];
                let tag_word = tags[i_wordTag];
                
                //console.log(tag_word + ' == '+ user_words[i_wordUser] );

                // If in tag exist user word THEN add priority for this info object.
                if (this.textManager.isSame(user_word, tag_word)) {
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

    #deleteAllIndexes() {
        const key = 'indexes_actionBlocks_by_tag';
        localStorage[key] = '';
    
        return true;
    }
}


const infoBlockModel = {};

infoBlockModel.infoBlocks_on_page = '';

