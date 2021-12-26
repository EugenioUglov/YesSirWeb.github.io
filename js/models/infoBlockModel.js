const infoBlockModel = {};

infoBlockModel.infoBlocks_on_page = "";
infoBlockModel.showed_infoObjects = "";
infoBlockModel.new_infoObjects_to_add = "";

// Return an array with all info objects.
infoBlockModel.getAll = function () {
    let infoObjects = [];
    let key = "infoObjects";
    if (localStorage.getItem(key)) infoObjects = JSON.parse(localStorage.getItem(key));

    return infoObjects;
}

infoBlockModel.getByPhrase = function(user_phrase, language) {
    // Delete characters "," from phrase.
    user_phrase = user_phrase.replaceAll(',', '');
    // If phrase doesn't exist.
    if ( ! user_phrase) {
        console.log("Info doesn't exist with tags: " + user_phrase);
        return;
    }

    if (user_phrase === undefined || user_phrase === null) {
        let error_text = "user_phrase not defined during information searching";
        console.log(error_text);
    }

    // Here all objects from a storage which info can to be looking by user.
    let searched_infoObjects = [];
    // All infoObjects.
    let infoObjects = infoBlockModel.getAll();
    
    user_phrase = user_phrase.toLowerCase();
    let user_words = textAlgorithms.splitText(user_phrase, " ");
    
    
    let indexes_infoObjects_by_tag = infoBlockModel.getIndexes();
    console.log(indexes_infoObjects_by_tag);


    let indexes_infoObjects_to_show = getIndexesInfoObjectsToShowByPhrase(user_words); 



    console.log("indexes");
    console.log(indexes_infoObjects_to_show);

    // Create an array with infoObjects and priority value to show.
    for (let i_obj of indexes_infoObjects_to_show) {
        let infoObj_curr = infoObjects[i_obj];

        let priority_infoObj_curr = getPrioriptyObjByTags(infoObj_curr, user_phrase, language);
        infoObj_curr.priority = priority_infoObj_curr;
        console.log(infoObj_curr, priority_infoObj_curr);

        if (priority_infoObj_curr > 0) {
            // Push current obj
            searched_infoObjects.push(infoObj_curr);
        }
    }

    let property_in_infoObj_for_sort = "priority";
    let is_sort_from_A_to_Z = false;

    // Sort by priority.
    searched_infoObjects = sort.getSortedInfoObjectsByProperty(searched_infoObjects, property_in_infoObj_for_sort, is_sort_from_A_to_Z);

    return searched_infoObjects;

    function getIndexesInfoObjectsToShowByPhrase(user_words) {
        let indexes_infoObjects_to_show = [];
        
        // Push index of infoObj by user phrase if it doesn't exist yet in array. 
        for (let i_user_word in user_words) {
            // One user word of phrase.
            let user_word = user_words[i_user_word];
            // Indexes of current tag.
            let indexes_infoObjects_curr = indexes_infoObjects_by_tag[user_word];

            // For each index of infoObject for current tag.
            for (i_index_infoObj_to_show in indexes_infoObjects_curr) {
                let i_infoObj_to_show = indexes_infoObjects_curr[i_index_infoObj_to_show];

                let index_exist_in_indexes_infoObjects = isValueExistInArray(indexes_infoObjects_to_show, i_infoObj_to_show);

                if (index_exist_in_indexes_infoObjects) {
                    continue;
                }

                indexes_infoObjects_to_show.push(i_infoObj_to_show);
            }
        }

        return indexes_infoObjects_to_show;
    }

    function getIndexesInfoObjectsToShowByTags(tags) {
        let indexes_infoObjects_to_show = [];
        let indexes_infoObjects_with_tags = [];

        // Push index of infoObj by user phrase if it doesn't exist yet in array. 
        for (let i_tag in tags) {
            // One user word of phrase.
            let tag = tags[i_tag];
            // Indexes of current tag.
            indexes_infoObjects_with_tags = indexes_infoObjects_with_tags.concat(indexes_infoObjects_by_tag[tag]);
        }

        // For each index of infoObject for current tag.
        for (i_index_infoObj_to_show in indexes_infoObjects_with_tags) {
            let i_infoObj_to_show = indexes_infoObjects_with_tags[i_index_infoObj_to_show];

            let index_exist_in_indexes_infoObjects = isValueExistInArray(indexes_infoObjects_to_show, i_infoObj_to_show);


            if (index_exist_in_indexes_infoObjects) {
                indexes_infoObjects_to_show.push(i_infoObj_to_show);
                continue;
            }
            else {
                if (tags.length == 1) {
                    indexes_infoObjects_to_show.push(i_infoObj_to_show);
                }
            }

            
        }

        for (i_index_infoObj_to_show in indexes_infoObjects_with_tags) {
            let i_infoObj_to_show = indexes_infoObjects_with_tags[i_index_infoObj_to_show];

            let index_exist_in_indexes_infoObjects = isValueExistInArray(indexes_infoObjects_to_show, i_infoObj_to_show);


            if (index_exist_in_indexes_infoObjects) {
                continue;
            }
           
            indexes_infoObjects_to_show.push(i_infoObj_to_show);
        }

        return indexes_infoObjects_to_show;
    }
}

infoBlockModel.saveInStorage = function(infoBlocks_object) {
    if ( ! infoBlocks_object) return false;
    console.log("Saved to " + siteSettingsModel.get().storage);
        
    // Save in localStorage    
    let key = "infoObjects";
    localStorage.setItem(key, JSON.stringify(infoBlocks_object));

    if (siteSettingsModel.get().storage === STORAGE.database)
    {
        // Send in DB.
        infoBlockModel.saveToDatabase();
    }

    infoBlockModel.updateIndexes();

    return true;
}

infoBlockModel.saveToDatabase = function(onUpdatedUserData) {
    console.log("authorizationData", authorizationDataModel.get());

    if ( ! authorizationDataModel.get()) {
        return false;    
    }

    // Get infoObjects from localStorage
    let infoObjects_to_DB_string = JSON.stringify(infoBlockModel.getAll());
    // Set object to save in DB
    let userData_to_DB_obj = {
        infoObjects: infoObjects_to_DB_string
    }
    // Stringify object for DB
    let userData_to_DB_string = JSON.stringify(userData_to_DB_obj);

    // Upload data to user field
    const user_id = authorizationDataModel.get().id;
    const data_to_send = userData_to_DB_string;
    dbManager.setUserData(user_id, data_to_send, onUpdatedUserData);
    
    return true;
}

infoBlockModel.add = function (infoBlock_to_add, isShowAlert = true) {
    let key = "infoObjects";
  
    let infoObjects = infoBlockModel.getAll();

    if (infoObjects === undefined || infoObjects === null) {
        infoObjects = [];
    }
  
  
    // Add new infoObj to infoObjects.
    let is_obj_added_to_array = insertInfoObjToArray(infoObjects, infoBlock_to_add);
  
    if ( ! is_obj_added_to_array) {
        if (isShowAlert) alert("Data with current title already exists. Title: " + infoBlock_to_add.title);
        else {
            console.log("Data with current title already exists. Title: " + infoBlock_to_add.title);
        }

        return false;
    }

    // Update infoObjects data in local storage.
    localStorage.setItem(key, JSON.stringify(infoObjects));

    onUpdate();

    return true;
}

infoBlockModel.deleteFromArrayByTitle = function(infoObjects, title) {
    console.log("array", infoObjects);
    console.log("title to delete: " + title);
    let i_infoObject_to_delete = search.binarySearchInArrayOfObjectsByTitle(infoObjects, title);

    console.log("i_infoObject_to_delete: " + i_infoObject_to_delete);
    console.log("obj to delete: ", infoObjects[i_infoObject_to_delete]);

    if ( ! i_infoObject_to_delete || i_infoObject_to_delete < 0 || i_infoObject_to_delete >= infoObjects.length) {
       //alert("Data doesn't exist with title: " + title);
        return false;
    }

    // Delete infoObject from array
    infoObjects.splice(i_infoObject_to_delete, 1);
    console.log("infoObjects after delete obj " + title, infoObjects);

    // Save indexes of infoObjects
    infoBlockModel.updateIndexes();

    return infoObjects;
}

infoBlockModel.deleteInfoObjByTitle = function (title, isShowAlertOnError = true) {
    console.log("title to delete: " + title);
    let infoObjects = infoBlockModel.getAll();
    let i_infoObject_to_delete = infoBlockModel.getIndexByTitle(title);

    console.log("i_infoObject_to_delete: " + i_infoObject_to_delete);
    console.log("obj to delete: ", infoObjects[i_infoObject_to_delete]);

    if (i_infoObject_to_delete < 0 || i_infoObject_to_delete >= infoObjects.length) {
        if (isShowAlertOnError) alert("Data doesn't exist with title: " + title);
        return false;
    }

    // Delete infoObject from array.
    infoObjects.splice(i_infoObject_to_delete, 1);
    // Update info with deleted infoObj in localStorage.
    localStorage.setItem("infoObjects", JSON.stringify(infoObjects));
    console.log("infoObjects after delete obj " + title, infoObjects);

    onUpdate();

    return true;
}

infoBlockModel.deleteAll = function() {
    // Delete from localStorage
    let key = "infoObjects";
    localStorage[key] = "";

    return true;
}



// .START (IndexesForInfoObjects).

infoBlockModel.getIndexes = function() {
    let key = "indexes_infoObjects_by_tag";

    if (localStorage.getItem(key)) return JSON.parse(localStorage[key]);

    return [];
}

infoBlockModel.getIndexByTitle = function (title) {
    return search.binarySearchInArrayOfObjectsByTitle(infoBlockModel.getAll(), title);
}

infoBlockModel.updateIndexes = function() {
    let indexes_infoObjects_by_tag = createIndexes();
    let key = "indexes_infoObjects_by_tag";

    localStorage[key] = JSON.stringify(indexes_infoObjects_by_tag);

    console.log("Update indexes infoBlocks");

    return true;
}

infoBlockModel.deleteAllIndexes = function() {
    let key = "indexes_infoObjects_by_tag";
    localStorage[key] = "";

    return true;
}

// .END (IndexesForInfoObjects).


infoBlockModel.isTitleSameAsPhrase = function(infoObject, phrase) {
    if (textAlgorithms.isSame(infoObject.title, phrase)) {
        return true;
    }

    return false;
}



// Get tags from all infoBlocks.
// Example: indexes_infoObjects_by_tag["hello"] = [1, 2];
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
            while (tag[0] === " ") tag = tag.replace(tag[0], '');

            // Separated words of tag.
            let tag_words = textAlgorithms.splitText(tag, " ");
            
            // For each word in tag.
            for (let i_wordTag in tag_words) {
                let tag_word = tag_words[i_wordTag];
            
                if ( ! indexes_infoObjects_by_tag[tag_word]) {
                    indexes_infoObjects_by_tag[tag_word] = [];
                }
                
                // Indexes for link to infoObj.
                let indexes_arr = Object.values(indexes_infoObjects_by_tag[tag_word]);
                
                // Each index must be different in indexes array.
                let isIndexExistInIndexesArr = isValueExistInArray(indexes_arr, i_infoObj_to_paste);
                if (isIndexExistInIndexesArr) continue;
                indexes_infoObjects_by_tag[tag_word].push(i_infoObj_to_paste);
            }
        }
    }

    console.log("indexes_infoObjects_by_tag", indexes_infoObjects_by_tag);

    return indexes_infoObjects_by_tag;
}



// Each time when infoObjects are updated.
function onUpdate() {

}

// Get priority of object from DB. How many times words from user phrase are in the tags of objet DB.
// Priority = 0 means that user words not exist in tags of object.
function getPrioriptyObjByTags(obj, user_phrase) {
    let priority = 0;
    let tags_phrases = obj.tags;

    // Check for each object in a storage is the same TITLE with user phrase.
    // IF "title" == "user phrase" THEN info is probably that we are looking. Add proiority for current info obj + 10
    if (obj.title === undefined) {
        console.log("Warning! title property doesn't exist in obj: ", obj);
    }



    // Separated words of user phrase.
    let user_words = textAlgorithms.splitText(user_phrase, " ");
    // All tags.
    let tags = [];

    // For all user words.
    for (let i_wordUser in user_words) {
        // for each tags phrases separated by ",".
        for (let i_inTags in tags_phrases) {
            let tag = tags_phrases[i_inTags];
            let tag_words = textAlgorithms.splitText(tag, " ");
            tags = tags.concat(tag_words);
            //console.log("tag_words", tags);
        }

        console.log("tags", tags);
        
        // For each word in tag.
        for (let i_wordTag in tags) {
            let user_word = user_words[i_wordUser];
            let tag_word = tags[i_wordTag];
            
            //console.log(tag_word + " == "+ user_words[i_wordUser] );

            // If in tag exist user word THEN add priority for this info object.
            if (textAlgorithms.isSame(user_word, tag_word)) {
                priority++;
                console.log("====== GROWUP PRIORITY =======");
                console.log("obj.title", obj.title);
                console.log("priority", priority);
                console.log("tag_word", tag_word);
                console.log("====== END GROWUP PRIORITY =======");
                break;
            }
        }
    }
    
    return priority;
}

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



function isValueExistInArray(arr, value) {
    for (i_value in arr) {
        let value_curr_arr = arr[i_value];
        
        if (value === value_curr_arr) {
            return true;
        }
    }

    return false;
}
