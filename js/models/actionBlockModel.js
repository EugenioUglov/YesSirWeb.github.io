class ActionBlockModel {
    constructor(dbManager) {
        this.title_infoBlock_before_update = '';
        this.dbManager = dbManager;
        
        
    }
    
    actionBlocks = [];
    actionBlocks_from_database = [];
    indexes_actionBlocks_by_tag = [];
    infoBlocks_on_page = '';

    
    add(actionBlock_to_add, isShowAlert = true) {
        //this.actionBlocks = infoBlockModel.getAll();
      
        // Add new Action-Block.
        // const is_obj_added_to_array = insertInfoObjToArray(actionBlocks, actionBlock_to_add);

        const indexActionBlockByTitle = search.getIndexInfoObjByTitle(this.actionBlocks, actionBlock_to_add.title);


        // If Action-Block not found in current Action-Blocks array.
        if (indexActionBlockByTitle === -1) {
            // Add new Action-Block to the beginning of array.
            this.actionBlocks.unshift(actionBlock_to_add);
        }
        else {
            if (isShowAlert) alert('Data with current title already exists. Title: ' + actionBlock_to_add.title);
            else {
                console.log('Data with current title already exists. Title: ' + actionBlock_to_add.title);
            }

            return false;
        }
        

        console.log('actionBlocks after', this.actionBlocks);

        this.#onUpdate();
        
        // Binary insert infoObject to array of infoObjects.
        function insertInfoObjToArray(array, obj) {
            //console.log(array);
            let index = search.binarySearchInArrayOfObjectsByTitle(array, obj.title);
            //console.log(index);
            if (index < 0) {
                // Add infoObject to array.
                array.splice(-(index + 1), 0, obj);
                //console.log("new array", array);
                return true;
            }
            return false;
        }
    
        return this.actionBlocks;
    }

    get() {
        return this.actionBlocks;
    }

    getActionBlocksFromStorageAsync(onGetCallback) {
        console.log('getActionBlocksFromStorageAsync');
        let that = this;


        if (siteSettingsModel.get().storage === STORAGE.database){
            getActionBlocksFromDatabase();
        }
        else if (siteSettingsModel.get().storage === STORAGE.localStorage) {
            this.getActionBlocksFromLocalStorage(onGetCallback)
        }

        function getActionBlocksFromDatabase() {
            let actionBlocks = [];

            logsController.addLog('Get data from Database');

            $('.icon_spinner').show();
            $('#rb_storage_db')[0].checked = true;
            rb_storage_db.onChecked();

            if (authorizationDataModel.get()) {
                const nickname = authorizationDataModel.get().nickname;
                const password = authorizationDataModel.get().password;
                
                $('#input_field_nickname')[0].value = nickname;
                $('#input_field_password')[0].value = password;

                
                logsController.addLog('Connecting to the Database..');
                
                dbManager.authorization(nickname, password, onAuthorization);

                function onAuthorization(DB_responce) {
                    logsController.addLog('Waiting for responce from Database..');
                    $('#autorization_log').text('Waiting for responce from Database..');
                    $('#autorization_log').css('color', 'gray');

                    console.log(DB_responce);

                    if (DB_responce) {
                        if (DB_responce.access) {
                            // Set text: authorization completed successfully.
                            $('#autorization_log').text('Authorization completed successfully for user: ' + nickname);
                            $('#autorization_log').css('color', 'green');

                            // Set authorization data to localStorage.
                            localStorage['authorization'] = '{"nickname" : "' + nickname + '" , "password" : "' + 
                                password + '" , "id" : "' + DB_responce.id + '" }';

                            logsController.addLog('Database connection is completed successfully for user: ' + nickname);
                            
                            // Get data from DB.
                            // getUserDataFromDatabase(onGetUserDataFromDB);
                            if ( ! authorizationDataModel.get()) {
                                alert('Error authorizationDataModel');
                                return false;
                            }

                            const user_id = authorizationDataModel.get().id;
                            dbManager.getUserData(user_id, onGetUserDataFromDB);

                            console.log('Authorization data', DB_responce);
                            $('#btn_authorization')[0].disabled = false;
                            window.scrollTo(pageXOffset, 0);

                            return;

                            function onGetUserDataFromDB(DB_responce) {
                                // Get user_data from DB field.

                                // is_possible_get_infoObjects_from_DB.
                                if (DB_responce) {
                                    if (DB_responce['user_data']) {
                                        let userDataFromDB;
                                        
                                        // IF data from DB parsed successfully THEN go next.
                                        try {
                                            userDataFromDB = JSON.parse(DB_responce['user_data']);
                                        }
                                        catch {
                                            alert('ERROR!!! InfoObjects have not been loaded from DB. \nProbably infoOBjects data from DB are broken');
                                            return;
                                        }
                            
                            
                                        const infoObjects_from_DB = JSON.parse(userDataFromDB['infoObjects']);
                                        // that.actionBlocks = infoObjects_from_DB;
                                        
                                        console.log('infoObjects_from_DB', infoObjects_from_DB);
                                        console.log('that from get data from database ', that);
   
                                        that.actionBlocks_from_database = [].concat(infoObjects_from_DB);
                                        onGetCallback(that.actionBlocks_from_database);

                                        
                                        return;
                                        
                                    }
                                }
                                else {
                                    // actionBlockModel.saveInDatabase();
                                }
                                // IF data infoObjects weren't loaded from DB THEN set current infoObjects to DB.
                                // actionBlockModel.saveInDatabase();
                            }
                        }
                    }

                    onGetCallback(null);
                    logsController.addLog('Database connection is failed');

                    $('#autorization_log').text('ERROR!!! Connection to DB is failed');
                    $('#autorization_log').css('color', 'red');
                    $('#btn_authorization')[0].disabled = false;
                }
            }
            else {
                alert('Error on authorization to database! Data is out of sync.\n\nThe data will be updated in the browser storage.\nLog in again to sync your data.');
                onGetCallback(null);
            }
        }
    }

    getActionBlocksFromLocalStorage(onGetCallback) {
        let actionBlocks = [];
        const key = 'infoObjects';
        
        if (localStorage.getItem(key)) {
            const actionBlocks_from_localStorage = JSON.parse(localStorage.getItem(key));
    
            // Make array even if in localStorage just one Action-Block.
            actionBlocks = actionBlocks.concat(actionBlocks_from_localStorage);
        }

        this.actionBlocks = actionBlocks;

        if (onGetCallback) onGetCallback(actionBlocks);

        return actionBlocks;
    }

    setActionBlocks(actionBlocks_to_save) {
        this.actionBlocks = [].concat(actionBlocks_to_save);
        this.#onUpdate();
        
        return this.actionBlocks;
    }

    getActionBlocks() {
        return this.actionBlocks;
    }

    save(actionBlocks) {
        this.actionBlocks = actionBlocks;

        // if ( ! actionBlocks) return false;

        saveInLocalStorage(actionBlocks);
    
        if (siteSettingsModel.get().storage === STORAGE.database)
        {
            // Send to DB.
            saveInDatabase();
        }
    
    
        return true;

        function saveInDatabase(onUpdatedUserData) {
            console.log("authorizationData", authorizationDataModel.get());
        
            if 
            ( 
                ! authorizationDataModel.get() || 
                JSON.stringify(this.actionBlocks_from_database) === JSON.stringify(this.getActionBlocks())
            ) {
                console.log('not saved in database');
                return false;    
            }
        
            // Get infoObjects from localStorage
            const infoObjects_to_DB_string = JSON.stringify(infoBlockModel.getAll());
            // Set object to save in DB
            const userData_to_DB_obj = {
                infoObjects: infoObjects_to_DB_string
            }
            // Stringify object for DB
            const userData_to_DB_string = JSON.stringify(userData_to_DB_obj);
        
            // Upload data to user field
            const user_id = authorizationDataModel.get().id;
            const data_to_send = userData_to_DB_string;
            
            this.dbManager.setUserData(user_id, data_to_send, onUpdatedUserData);
            
            return true;
        }
    
        function saveInLocalStorage(actionBlocks) {
            const key = 'infoObjects';
            console.log('save in localstorage', actionBlocks);
            localStorage.setItem(key, JSON.stringify(actionBlocks));
        }
    }

    updateIndexes() {
        const indexes_infoObjects_by_tag = createIndexes();
        const key = 'indexes_infoObjects_by_tag';
    
        localStorage[key] = JSON.stringify(indexes_infoObjects_by_tag);
    
        console.log('Update indexes', indexes_infoObjects_by_tag);
    
        return true;
    
        // Get tags from all infoBlocks.
        // Example: indexes_infoObjects_by_tag['hello'] = [1, 2];
        function createIndexes(infoObjects) {
            if ( ! infoObjects) infoObjects = infoBlockModel.getAll();
    
            let indexes_infoObjects_by_tag = {};
    
    
            // For all infoObjects.
            for (const i_infoObj_to_paste in infoObjects) {
                let infoObj = infoObjects[i_infoObj_to_paste];
                let tags = infoObj.tags;
    
                // For all tags.
                for (const i_tag in tags) {
                    let tag = tags[i_tag];
                    // !!! Not important
                    tag = tag.toLowerCase();
    
                    if ( ! tag) continue;
    
                    // WHILE first symbol in tag is empty THEN delete empty.
                    while (tag[0] === ' ') tag = tag.replace(tag[0], '');
    
                    // Separated words of tag.
                    let tag_words = textAlgorithm.splitText(tag, ' ');
                    
                    // For each word in tag.
                    for (const i_wordTag in tag_words) {
                        let tag_word = tag_words[i_wordTag];
                    
                        if ( ! indexes_infoObjects_by_tag[tag_word]) {
                            indexes_infoObjects_by_tag[tag_word] = [];
                        }
                        
                        // Indexes for link to infoObj.
                        let indexes_arr = Object.values(indexes_infoObjects_by_tag[tag_word]);
                        
                        // Each index must be different in indexes array.
                        let isIndexExistInIndexesArr = arrayAlgorithm.isValueExistsInArray(indexes_arr, i_infoObj_to_paste);
                        if (isIndexExistInIndexesArr) continue;
                        indexes_infoObjects_by_tag[tag_word].push(i_infoObj_to_paste);
                    }
                }
            }
    
            console.log('indexes_infoObjects_by_tag', indexes_infoObjects_by_tag);
    
            return indexes_infoObjects_by_tag;
        }
    
    }

    #onUpdate() {
        this.save(this.actionBlocks);
        this.updateIndexes();
    }
}


const infoBlockModel = {};

infoBlockModel.infoBlocks_on_page = '';
infoBlockModel.new_infoObjects_to_add = '';


// Return an array with all info objects.
infoBlockModel.getAll = function () {
    let actionBlocks = [];
    const key = 'infoObjects';

    if (localStorage.getItem(key)) {
        const actionBlocks_from_localStorage = JSON.parse(localStorage.getItem(key));

        // Make array even if in localStorage just one Action-Block.
        actionBlocks = actionBlocks.concat(actionBlocks_from_localStorage);
    }
    else {
        console.log('Not possible to take data from localStorage. No key: ' + key);
    }

    return actionBlocks;
}

infoBlockModel.getByPhrase = function(user_phrase) {
    console.log('getByPhrase');
    // Delete characters "," from phrase.
    user_phrase = user_phrase.replaceAll(',', '');

    // If phrase doesn't exist.
    if ( ! user_phrase) {
        console.log('Info doesn\'t exist with tags: ' + user_phrase);
        return;
    }

    if (user_phrase === undefined || user_phrase === null) {
        let error_text = 'user_phrase not defined during information searching';
        console.log(error_text);
    }

    // Here all objects from a storage which info can to be looking by user.
    let searched_infoObjects = [];
    // All infoObjects.
    const infoObjects = infoBlockModel.getAll();
    console.log('infoBlockModel.getByPhrase getAll', infoObjects);
    
    user_phrase = user_phrase.toLowerCase();
    let user_words = textAlgorithm.splitText(user_phrase, ' ');
    
    
    let indexes_infoObjects_by_tag = infoBlockModel.getIndexesActionBlocksByTag();
    console.log('indexes_infoObjects_by_tag', indexes_infoObjects_by_tag);


    const indexes_infoObjects_to_show = getIndexesInfoObjectsToShowByPhrase(user_words); 



    console.log('indexes_infoObjects_to_show', indexes_infoObjects_to_show);

    // Create an array with infoObjects and priority value to show.
    for (let i_obj of indexes_infoObjects_to_show) {
        let infoObj_curr = infoObjects[i_obj];

        let priority_infoObj_curr = getPrioriptyObjByTags(infoObj_curr, user_phrase);
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
    searched_infoObjects = sort.getSortedInfoObjectsByProperty(searched_infoObjects, property_in_actionBlock_for_sort, is_sort_from_A_to_Z);

    return searched_infoObjects;

    function getIndexesInfoObjectsToShowByPhrase(user_words) {
        const indexes_infoObjects_to_show = [];
        
        // Push index of infoObj by user phrase if it doesn't exist yet in array. 
        for (let i_user_word in user_words) {
            // One user word of phrase.
            let user_word = user_words[i_user_word];
            // Indexes of current tag.
            let indexes_infoObjects_curr = indexes_infoObjects_by_tag[user_word];

            // For each index of infoObject for current tag.
            for (i_index_infoObj_to_show in indexes_infoObjects_curr) {
                let i_infoObj_to_show = indexes_infoObjects_curr[i_index_infoObj_to_show];

                let index_exist_in_indexes_infoObjects = arrayAlgorithm.isValueExistsInArray(indexes_infoObjects_to_show, i_infoObj_to_show);

                if (index_exist_in_indexes_infoObjects) {
                    continue;
                }

                indexes_infoObjects_to_show.push(i_infoObj_to_show);
            }
        }

        return indexes_infoObjects_to_show;
    }
}

infoBlockModel.getByTags = function(user_phrase, minus_tags) {
    // Delete characters ',' from phrase.
    user_phrase = user_phrase.replaceAll(',', ' ');
    minus_tags = minus_tags.replaceAll(',', ' ');
    console.log('plus_tags', user_phrase)

    // If phrase doesn't exist.
    if ( ! user_phrase) {
        console.log('Info doesn\'t exist with tags: ' + user_phrase);
        return;
    }

    if (user_phrase === undefined || user_phrase === null) {
        let error_text = 'user_phrase not defined during information searching';
        console.log(error_text);
    }

    // Here all objects from a storage which info can to be looking by user.
    let searched_infoObjects = [];
    // All infoObjects.
    let infoObjects = infoBlockModel.getAll();
    
    user_phrase = user_phrase.toLowerCase();
    minus_tags = minus_tags.toLowerCase();

    const user_tags = textAlgorithm.splitText(user_phrase, ' ');
    const user_minus_tags = textAlgorithm.splitText(minus_tags, ' ');

    console.log('user_tags', user_tags);
    console.log('minus_tags', user_minus_tags);
    
    const indexes_infoObjects_by_tag = infoBlockModel.getIndexesActionBlocksByTag();
    console.log('indexes_infoObjects_by_tag', indexes_infoObjects_by_tag);


    const indexes_infoObjects_to_show = getIndexesActionBlocksToShowByTags(user_tags, user_minus_tags); 



    console.log('indexes');
    console.log(indexes_infoObjects_to_show);

    // Create an array with infoObjects and priority value to show.
    for (let i_obj of indexes_infoObjects_to_show) {
        let infoObj_curr = infoObjects[i_obj];

        let priority_infoObj_curr = getPrioriptyObjByTags(infoObj_curr, user_phrase);
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
    searched_infoObjects = sort.getSortedInfoObjectsByProperty(searched_infoObjects, 
        property_in_actionBlock_for_sort, is_sort_from_A_to_Z);

    return searched_infoObjects;


    function getIndexesActionBlocksToShowByTags(tags, minus_tags) {
        let indexes_actionBlocks_to_show = [];
        console.log('=================================');
        console.log('== getIndexesActionBlocksToShowByTags ==');

        // Push index of Action-blocks by user phrase if it doesn't exist yet in array. 
        for (let i_tag in tags) {
            // One user word of phrase.
            let tag = tags[i_tag];
            console.log('tag: ', tag);

            if (indexes_infoObjects_by_tag[tag] === undefined) { 
                console.log('return', indexes_actionBlocks_to_show);

                return [];
            }
            
            // If array with indexes to show is empty. 
            if (indexes_actionBlocks_to_show.length < 1) {
                // Add all Action-Blocks indexes of tag to array.
                indexes_actionBlocks_to_show = indexes_actionBlocks_to_show.concat(indexes_infoObjects_by_tag[tag]);
                console.log('start indexes', indexes_actionBlocks_to_show);
            }
            else {
                indexes_actionBlocks_to_show = arrayAlgorithm.getSameElementsFromArrays
                (
                    indexes_actionBlocks_to_show, indexes_infoObjects_by_tag[tag]
                );

                if (indexes_actionBlocks_to_show.length < 1) {
                    // No same indexes in tags after comparation.

                    return []; 
                } 

                console.log('indexes_actionBlocks_to_show after same comparation', indexes_actionBlocks_to_show);

            }
        }

        indexes_actionBlocks_to_show = getIndexesActionBlocksWithoutMinusTags(indexes_actionBlocks_to_show, minus_tags);

        console.log('=================================');

        return indexes_actionBlocks_to_show;


        function getIndexesActionBlocksWithoutMinusTags(indexes_actionBlocks_to_show, minus_tags) {
            // Delete items with minus tags.
            for (const minus_tag of minus_tags) {
                for (const i_index_infoObj_to_show in indexes_actionBlocks_to_show) {
                    const i_infoObj_to_show = indexes_actionBlocks_to_show[i_index_infoObj_to_show];
                    console.log('i_infoObj_to_show', i_infoObj_to_show);

                    // Compare minus tag with each Action-Block that has this tag.
                    for (const index_actionBlock_with_minus_tag of indexes_infoObjects_by_tag[minus_tag]) {
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





infoBlockModel.deleteFromArrayByTitle = function(infoObjects, title) {
    let i_infoObject_to_delete = search.binarySearchInArrayOfObjectsByTitle(infoObjects, title);


    if ( ! i_infoObject_to_delete || i_infoObject_to_delete < 0 || i_infoObject_to_delete >= infoObjects.length) {
       //alert("Data doesn't exist with title: " + title);
        return false;
    }

    // Delete infoObject from array
    infoObjects.splice(i_infoObject_to_delete, 1);

    // Save indexes of infoObjects
    infoBlockModel.updateIndexes();

    return infoObjects;
}

infoBlockModel.deleteInfoObjByTitle = function (title, isShowAlertOnError = true) {
    console.log('title to delete: ' + title);
    let infoObjects = infoBlockModel.getAll();
    let i_infoObject_to_delete = infoBlockModel.getIndexByTitle(title);

    if (i_infoObject_to_delete < 0 || i_infoObject_to_delete >= infoObjects.length) {
        if (isShowAlertOnError) alert('Data doesn\'t exist with title: ' + title);
        return false;
    }

    // Delete infoObject from array.
    infoObjects.splice(i_infoObject_to_delete, 1);
    // Update info with deleted infoObj in localStorage.
    localStorage.setItem('infoObjects', JSON.stringify(infoObjects));

    actionBlockController.onUpdate();

    return true;
}

infoBlockModel.deleteAll = function() {
    // Delete from localStorage
    let key = 'infoObjects';
    localStorage[key] = '';

    return true;
}



// .START (IndexesForInfoObjects).

infoBlockModel.getIndexesActionBlocksByTag = function() {
    const key = 'indexes_infoObjects_by_tag';

    if (localStorage.getItem(key)) return JSON.parse(localStorage[key]);

    return [];
}

infoBlockModel.getIndexByTitle = function (title) {
    return search.binarySearchInArrayOfObjectsByTitle(infoBlockModel.getAll(), title);
}

infoBlockModel.updateIndexes = function() {
    const indexes_infoObjects_by_tag = createIndexes();
    const key = 'indexes_infoObjects_by_tag';

    localStorage[key] = JSON.stringify(indexes_infoObjects_by_tag);

    console.log('Update indexes infoBlocks');

    return true;

    // Get tags from all infoBlocks.
    // Example: indexes_infoObjects_by_tag['hello'] = [1, 2];
    function createIndexes(infoObjects) {
        if ( ! infoObjects) infoObjects = infoBlockModel.getAll();

        let indexes_infoObjects_by_tag = {};


        // For all infoObjects.
        for (i_infoObj_to_paste in infoObjects) {
            let infoObj = infoObjects[i_infoObj_to_paste];
            let tags = infoObj.tags;

            // For all tags.
            for (i_tag in tags) {
                let tag = tags[i_tag];
                // !!! Not important
                tag = tag.toLowerCase();

                if ( ! tag) continue;

                // WHILE first symbol in tag is empty THEN delete empty.
                while (tag[0] === ' ') tag = tag.replace(tag[0], '');

                // Separated words of tag.
                let tag_words = textAlgorithm.splitText(tag, ' ');
                
                // For each word in tag.
                for (let i_wordTag in tag_words) {
                    let tag_word = tag_words[i_wordTag];
                
                    if ( ! indexes_infoObjects_by_tag[tag_word]) {
                        indexes_infoObjects_by_tag[tag_word] = [];
                    }
                    
                    // Indexes for link to infoObj.
                    let indexes_arr = Object.values(indexes_infoObjects_by_tag[tag_word]);
                    
                    // Each index must be different in indexes array.
                    let isIndexExistInIndexesArr = arrayAlgorithm.isValueExistsInArray(indexes_arr, i_infoObj_to_paste);
                    if (isIndexExistInIndexesArr) continue;
                    indexes_infoObjects_by_tag[tag_word].push(i_infoObj_to_paste);
                }
            }
        }

        console.log('indexes_infoObjects_by_tag', indexes_infoObjects_by_tag);

        return indexes_infoObjects_by_tag;
    }

}

infoBlockModel.deleteAllIndexes = function() {
    const key = 'indexes_infoObjects_by_tag';
    localStorage[key] = '';

    return true;
}

// .END (IndexesForInfoObjects).


infoBlockModel.isTitleSameAsPhrase = function(infoObject, phrase) {
    if (textAlgorithm.isSame(infoObject.title, phrase)) {
        return true;
    }

    return false;
}





// Get priority of object from DB. How many times words from user phrase are in the tags of objet DB.
// Priority = 0 means that user words not exist in tags of object.
function getPrioriptyObjByTags(obj, user_phrase) {
    let priority = 0;
    let tags_phrases = obj.tags;

    // Check for each object in a storage is the same TITLE with user phrase.
    // IF 'title' == 'user phrase' THEN info is probably that we are looking. Add proiority for current info obj + 10
    if (obj.title === undefined) {
        console.log('Warning! title property doesn\'t exist in obj: ', obj);
    }



    // Separated words of user phrase.
    let user_words = textAlgorithm.splitText(user_phrase, ' ');
    // All tags.
    let tags = [];

    // For all user words.
    for (let i_wordUser in user_words) {
        // for each tags phrases separated by ','.
        for (let i_inTags in tags_phrases) {
            let tag = tags_phrases[i_inTags];
            let tag_words = textAlgorithm.splitText(tag, ' ');
            tags = tags.concat(tag_words);
            //console.log('tag_words', tags);
        }

        console.log('tags', tags);
        
        // For each word in tag.
        for (let i_wordTag in tags) {
            let user_word = user_words[i_wordUser];
            let tag_word = tags[i_wordTag];
            
            //console.log(tag_word + ' == '+ user_words[i_wordUser] );

            // If in tag exist user word THEN add priority for this info object.
            if (textAlgorithm.isSame(user_word, tag_word)) {
                priority++;
                console.log('====== GROWUP PRIORITY =======');
                console.log('obj.title', obj.title);
                console.log('priority', priority);
                console.log('tag_word', tag_word);
                console.log('====== END GROWUP PRIORITY =======');
                break;
            }
        }
    }
    
    return priority;
}



infoBlockModel.getDefaultActionBlocks = function() {
    const actionBlock_create = {
        title: 'Create Info-Block',
        tags: 'Create Info-Block, default',
        action: 'createInfoBlock',
        imagePath: 'https://i.ibb.co/K6kqJQc/plus.png',
        isEditable: false
    };

    const actionBlock_open_file_manager = {
        title: 'Open File Manager',
        tags: 'File Manager, save, upload, load, default',
        action: 'showFileManager',
        imagePath: 'https://icon-library.com/images/file-download-icon/file-download-icon-19.jpg',
        isEditable: false
    };

    const actionBlock_open_data_storage_manager = {
        title: 'Open Data Storage Manager',
        tags: 'Data Storage Manager, localstorage, database, default',
        action: 'showDataStorageManager',
        imagePath: 'https://www.sostechgroup.com/wp-content/uploads/2016/08/ThinkstockPhotos-176551504.jpg',
        isEditable: false
    };


    const actionBlock_facebook_of_developer = {
        title: 'Open Facebook page of developer',
        tags: 'facebook, account, developer, contact, message, default',
        action: 'openUrl',
        info: 'https://www.facebook.com/eugeniouglov',
        imagePath: 'https://i.ibb.co/QJ4y5v3/DEVELOPER-facebook.png',
        isEditable: false
    };

    const actionBlock_email_of_developer = {
        title: 'Write email to developer - eugeniouglov@gmail.com',
        tags: 'email, developer, contact, message, gmail, mail, default',
        action: 'openUrl',
        info: 'mailto:eugeniouglov@gmail.com',
        imagePath: 'https://i.ibb.co/dMHPk78/DEVELOPER-gmail.png',
        isEditable: false
    };

    const actionBlock_logs = {
        title: 'Show logs',
        tags: 'logs, default',
        action: 'showLogs',
        imagePath: 'https://pbs.twimg.com/profile_banners/240696823/1528203940/1500x500',
        isEditable: false
    };

    const actionBlock_voiceRecognitionSettings = {
        title: 'Open voice recognition settings',
        tags: 'voice recognition, default',
        action: 'showElementsForVoiceRecognitionManager',
        imagePath: 'https://walkthechat.com/wp-content/uploads/2015/02/voice-recognition.jpg',
        isEditable: false
    };
    

    const default_actionBlocks = [
        actionBlock_facebook_of_developer, 
        actionBlock_email_of_developer,
        actionBlock_create,
        actionBlock_open_file_manager,
        actionBlock_open_data_storage_manager,
        actionBlock_logs,
        actionBlock_voiceRecognitionSettings
    ];

    return default_actionBlocks;
}