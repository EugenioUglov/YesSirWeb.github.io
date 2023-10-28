class LoginController {
    constructor() {
        this.view = new LoginView();
        this.#setListeners();
    }

        
    #setListeners() {
        this.view.bindClickBtnSubmit(this.#onSubmit);
    }

    #onSubmit = (input_username, input_password) => {
        const dbRef = firebase.database().ref();
        const databaseTable = dbRef.child('actionBlocks');
        let actionBlock_strings_to_show = [];

        let is_user_exist = false;
        let is_accessed = false;

        const databaseObject = yesSir.firebaseService.getDataFromDatabase();
        // const databaseObject = snapshot.val();
        const users_from_database = databaseObject.users;
        
        for (const i_user_from_database in users_from_database) {
            const user_from_database = users_from_database[i_user_from_database];
            console.log(user_from_database);
            
            console.log(input_username);
            if (user_from_database.username === input_username) {
                is_user_exist = true;

                if (user_from_database.password === input_password) {
                    console.log('accessed');
                    yesSir.actionBlockService.downloadFileWithActionBlocks();
                    localStorage.setItem("usernameIndex", i_user_from_database);
                    yesSir.firebaseService.setIndexOfUsername(i_user_from_database);
                    const actionBlocksKey = databaseObject.userActionBlocksRelation[i_user_from_database].actionBlocksKey;
                    const actionBlocks_string = databaseObject.actionBlocks[actionBlocksKey];
                    console.log(actionBlocks_string);
                    
                    const actionBlocks = yesSir.mapDataStructure.getParsed(actionBlocks_string);
                    console.log(actionBlocks);
                    yesSir.actionBlockService.setActionBlocks(actionBlocks);
                    this.view.hide();
                    yesSir.hashService.openMainPage();
                    is_accessed = true;
                }
                else {
                    yesSir.modalBoxService.show({header_text:'Fail', body_text:'Wrong password!'}); 
    
                    setTimeout(() => {
                        yesSir.modalBoxService.hide();
                    }, "5000");
                }

                break;
            }
        }

        if (is_user_exist === false) {
            yesSir.modalBoxService.show({header_text:'Fail', body_text:'Username doesn\'t exist in database.'}); 

            setTimeout(() => {
                yesSir.modalBoxService.hide();
            }, "5000");
        }

        // // On database value changed.
        // dbRef.on('value',(snapshot) => {
        //     console.log('login');

        // });

        console.log('login: ' + input_username + " | pass: " + input_password);
        location.href = "/yessir/index.html";
    };

    RefreshPage() {
        
    }
}