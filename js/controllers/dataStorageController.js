class DataStorageController {
    constructor(observable) {
        this.view = new DataStorageView();

        this.observable = observable;

        this.#setListeners();
        this.#getFromLocalStorage();
    }

    #user_storage;
    
    onChangeStorage() {
        
    }


    onRbStorageDatabaseChecked() {
        this.setUserStorage(storage_name.database);
    }

    onRbLocalStorageClicked() {
        $('#autorization_log').text('');
        this.setUserStorage(storage_name.localStorage);
        $('#authorization_form').hide();
    
        observable.dispatchEvent('rbLocalStorageClicked', 'rbLocalStorageClicked');
    }

    getUserStorage() {
        if (this.#user_storage === undefined) {
            this.#user_storage = storage_name.localStorage;
        }
        
        return this.#user_storage;
    }

    setUserStorage(storage) {
        this.#user_storage = storage;
        localStorage['storage'] = storage;

        if (storage === storage_name.database) {
            $('#rb_storage_database')[0].checked = true;
            $('#authorization_form').show();
        }
    }

    onClickBtnRewriteOnDialogDatabaseManger(handler) {
        this.view.bindClickBtnRewriteOnDialogDatabaseManager(handler);
    }

    bindClickRbLocalStorage(handler) {
        const that = this; 

        // Selected radiobutton LocalStorage.
        $('#rb_storage_localStorage')[0].addEventListener('change', () => {
            that.onRbLocalStorageClicked();
            handler();
        });
    }

    #setListeners() {
        const that = this;

        // On click btn authorization.
        $('#btn_authorization')[0].addEventListener('click', function() {
            const authorization_data = {
                nickname: $('#input_field_nickname').val(),
                password: $('#input_field_password').val()
            };

            localStorage['authorization'] = JSON.stringify(authorization_data);

            $('#autorization_log').text('');
            $('#btn_authorization')[0].disabled = true;

            const event_btn_authorization_clicked = {
                name: 'btnAuthorizationClicked',
                data: {
                    log: 'btnAuthorizationClicked'
                }
            };
            
            observable.dispatchEvent(event_btn_authorization_clicked.name, event_btn_authorization_clicked.data);
        });
        
        
        // Selected radiobutton DB.
        $('#rb_storage_database_conainer')[0].addEventListener('change', function() {
            that.onRbStorageDatabaseChecked();
        });
        




        this.observable.listen('actionBlocksFromDatabaseNotEqualCurrentActionBlocksLoaded', function(observable, eventType, data) {
            that.view.showDatabaseDialog();
        });


        this.observable.listen('databaseConnectionSuccess', function(observable, eventType, data) {
            that.setUserStorage(storage_name.database);
        });

        this.observable.listen('databaseOperationFailed', function(observable, eventType, data) {
            setUserStorage(storage_name.localStorage);
        });
        
        this.observable.listen('databaseDialogCanceled', function(observable, eventType, data) {
            $('#rb_storage_localStorage')[0].checked = true;
            that.onRbLocalStorageClicked();
        });
    }


    #getFromLocalStorage() {
        this.#user_storage = localStorage['storage'];

        return this.#user_storage;
    }
}
