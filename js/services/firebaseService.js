class FirebaseService {
    #i_accessed_username_from_database;
    #dbRef;
    #data_from_datbase;

    constructor() {
        this.#i_accessed_username_from_database = localStorage.getItem("usernameIndex");
        this.#dbRef = firebase.database().ref();

        this.#setChangeDatabaseValueHandler();
    }

    setIndexOfUsername(new_i_username) {
        this.#i_accessed_username_from_database = new_i_username;
    }

    // !!!
    saveActioBlocks(actionBlocks_map_to_save) {
        console.log("saveActioBlocks()");
        // const i_username = yesSir.firebaseService.getIndexOfUsername();

        // !!! admin index in databse.
        const i_username = 0;

        if (i_username === undefined) {
            return null;
        }
        
        if (actionBlocks_map_to_save === undefined) {
            actionBlocks_map_to_save = yesSir.actionBlockService.getActionBlocks();
        }
        
        const actionBlocks_to_save = yesSir.mapDataStructure.getStringified(actionBlocks_map_to_save);

        const newdata = {};

        newdata[i_username] = actionBlocks_to_save;

        const databaseTable = this.#dbRef.child('actionBlocks');
        databaseTable.update(newdata).then(() => {
            yesSir.modalBoxService.show({header_text:'Success', body_text:'Data saved successfully to firebase database.'});

            setTimeout(() => {
                yesSir.modalBoxService.hide();
            }, "3000");
        }).catch(function(error) {
            alert("Error! Data could not be saved. " + error);
            console.log(error);
        });

        

        // console.log("Save to firebase database has been completed:");
        // console.log(actionBlocks_to_save);

    }

    getIndexOfUsername() {
        return this.#i_accessed_username_from_database;
    }

    getDataFromDatabase() {
        return this.#data_from_datbase;
    }

    #setChangeDatabaseValueHandler() {
        return false;
        // if (this.#i_accessed_username_from_database === undefined) {    
        //     return null;
        // }

        // On database value changed.
        this.#dbRef.on('value',(snapshot) => {
            if (snapshot.exists() === false) {
                return false;
            }

            const databaseObject = snapshot.val();

            if (this.#i_accessed_username_from_database != undefined) {
                const actionBlocksKey = databaseObject.userActionBlocksRelation[this.#i_accessed_username_from_database].actionBlocksKey;
                const actionBlocks_string = databaseObject.actionBlocks[actionBlocksKey];
                const actionBlocks = yesSir.mapDataStructure.getParsed(actionBlocks_string);
                yesSir.actionBlockService.setActionBlocks(actionBlocks);
                yesSir.actionBlockService.showActionBlocks();
            }

            this.#data_from_datbase = databaseObject;
        });
    }
}