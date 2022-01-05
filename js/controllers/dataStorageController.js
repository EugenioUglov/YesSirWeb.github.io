let rb_storage_db = {}; 
let rb_storage_localStorage = {};

rb_storage_db.onChecked = function() {
    siteSettingsModel.set(STORAGE.database);
    console.log('authorization_form show');
    $('#authorization_form').show();
}

rb_storage_localStorage.onChecked = function() {
    $('#autorization_log').text('');
    siteSettingsModel.set(STORAGE.localStorage);
    console.log('authorization_form hide');
    $('#authorization_form').hide();

    let data_to_show = infoBlockModel.getAll();
    infoBlockModel.infoBlocks_on_page = actionBlockController.showActionBlocks(data_to_show);
}

// On click btn authorization.
$('#btn_authorization')[0].addEventListener('click', function() {
    $('#autorization_log').text('');
    $('#btn_authorization')[0].disabled = true;
    let nickname = $('#input_field_nickname')[0].value;
    let password = $('#input_field_password')[0].value;

    //dbAuthorization(nickname, password);
    actionBlockController.showActionBlocksFromStorageAsync();
});


// Selected radiobutton DB.
$('#rb_storage_db_conainer')[0].addEventListener('change', function() {
    rb_storage_db.onChecked();
});

// Selected radiobutton LocalStorage.
$('#rb_storage_localStorage')[0].addEventListener('change', function() {
    rb_storage_localStorage.onChecked();
});


function dbAuthorization(nickname, password) {
    console.log('dbAuthorization ' + nickname + '  ' + password);

    localStorage['authorization'] = '';

    dbManager.authorization(nickname, password, onAuthorization);

    function onAuthorization(DB_responce) {
        console.log(DB_responce);
        label_help.innerText = 'Waiting for responce from Database..';
        $('#autorization_log').text('Waiting for responce from Database..');
        $('#autorization_log').css('color', 'gray');

        if (DB_responce) {
            if (DB_responce.access) {
                // Set text: authorization completed successfully.
                $('#autorization_log').text('Authorization completed successfully for user: ' + nickname);
                $('#autorization_log').css('color', 'green');

                
                label_help.innerText = 'Database connection is completed successfully';

                // Set authorization data to localStorage.
                localStorage['authorization'] = '{"nickname" : "' + nickname + '" , "password" : "' + password + '" , "id" : "' + DB_responce.id + '" }';
                
                // Get data from DB.
                getDataFromDatabase(onGetUserDataFromDB);



                // Set infoObjects from DB
                let data_to_show = infoBlockModel.getAll();
                infoBlockModel.infoBlocks_on_page = actionBlockController.showActionBlocks(data_to_show);

                console.log('Authorization data', DB_responce);
                $('#btn_authorization')[0].disabled = false;
                window.scrollTo(pageXOffset, 0);
                return;

                function onGetUserDataFromDB(DB_responce) {
                    // Get user_data from DB field.
                
                    console.log('dbData', DB_responce);
                
                    // is_possible_get_infoObjects_from_DB
                    if (DB_responce) {
                        if (DB_responce['user_data']) {
                            let userDataFromDB;
                            
                            // IF data from DB parsed successfully THEN go next.
                            try {
                                userDataFromDB = JSON.parse(DB_responce['user_data']);
                            }
                            catch {
                                alert('ERROR!!! InfoObjects have not been loaded from DB.\nProbably infoOBjects data from DB are broken');
                                return;
                            }
                
                
                            let infoObjects_from_DB = JSON.parse(userDataFromDB['infoObjects']);
                            
                            console.log('infoObjects_from_DB', infoObjects_from_DB);
                            console.log('infoObjects_from_localStorage', infoBlockModel.getAll());
                            
                            if (infoObjects_from_DB.length) {
                                // IF data from DB and from localStorage is equal THEN return.
                                if (JSON.stringify(infoObjects_from_DB) === JSON.stringify(infoBlockModel.getAll())) {
                                    return;
                                }
                
                                infoBlockModel.new_infoObjects_to_add = infoObjects_from_DB;
                
                                dialogDatabaseView.show();
                
                                return;
                            }
                        }
                    }
                    else {
                        // actionBlockModel.saveInDatabase();
                    }
                    // IF data infoObjects weren't loaded from DB THEN set current infoObjects to DB.
                    // actionBlockModel.saveInDatabase();
                    
                }

                function getDataFromDatabase(onGetUserData) {
                    if ( ! authorizationDataModel.get()) {
                        return false;
                    }

                    let user_id = authorizationDataModel.get().id;
                    dbManager.getUserData(user_id, onGetUserDataFromDB);
                    
                    return true;
                }
            }
        }

        label_help.innerText = 'Database connection is failed';
        $('#autorization_log').text('ERROR!!! Connection to DB is failed');
        $('#autorization_log').css('color', 'red');
        $('#btn_authorization')[0].disabled = false;
    }   
}