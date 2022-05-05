class DataStorageController {
    constructor(actionBlockService, dataStorageService, pageSerice) {
        this.actionBlockService = actionBlockService;
        this.dataStorageService = dataStorageService;
        this.pageSerice = pageSerice;

        this.#setListeners();
    }

    // #user_storage = localStorage['storage'];

    #onRbStorageDatabaseChecked() {
        this.dataStorageService.setUserStorage(this.dataStorageService.getStorageNameEnum().database);
    }

    #onRbLocalStorageChoosed() {
        $('#autorization_log').text('');
        this.dataStorageService.setUserStorage(this.dataStorageService.getStorageNameEnum().localStorage);
        $('#authorization_form').hide();
    }

    // getUserStorage() {
    //     if (this.#user_storage === undefined) {
    //         this.#user_storage = this.dataStorageService.getStorageNameEnum().localStorage;
    //     }
        
    //     return this.#user_storage;
    // }

    // setUserStorage(storage) {
    //     this.#user_storage = storage;
    //     localStorage['storage'] = storage;

    //     if (storage === this.dataStorageService.getStorageNameEnum().database) {
    //         $('#rb_storage_database')[0].checked = true;
    //         $('#authorization_form').show();
    //     }
    // }



    #setListeners() {
        const that = this;

        // On click btn authorization.
        $('#btn_authorization')[0].addEventListener('click', function() {
            console.log('btn_authorization click');
            const authorization_data = {
                nickname: $('#input_field_nickname').val(),
                password: $('#input_field_password').val()
            };

            localStorage['authorization'] = JSON.stringify(authorization_data);

            $('#autorization_log').text('');
            // $('#btn_authorization')[0].disabled = true;
            $('#authorization_form').hide();
            that.dataStorageService.setUserStorage(that.dataStorageService.getStorageNameEnum().database);
            that.actionBlockService.showActionBlocksFromStorage();
        });

        // Selected radiobutton LocalStorage.
        $('#rb_storage_localStorage')[0].addEventListener('change', () => {
            that.#onRbLocalStorageChoosed();
        });
        
        // Selected radiobutton DB.
        $('#rb_storage_database_conainer')[0].addEventListener('change', function() {
            $('#authorization_form').show();
            //that.#onRbStorageDatabaseChecked();
        });

        this.dataStorageService.view.bindClickBtnGetActionBlocksFromDatabase(onClickBtnRewriteOnDialogDatabaseManger);

        function onClickBtnRewriteOnDialogDatabaseManger() {
            $(".black_background").hide();
            that.actionBlockService.rewriteActionBlocks();
        }

        this.dataStorageService.view.bindClickBtnUploadActionBlocksToDatabase(onClickBtnUploadActionBlocksToDatabase);
        
        function onClickBtnUploadActionBlocksToDatabase() {
            that.actionBlockService.save();
        }

        this.dataStorageService.view.bindClickBtnCancelGetActionBlocksFromDatabase(onClickBtnCancelDialogDatabase);

        function onClickBtnCancelDialogDatabase() {
            $('#rb_storage_localStorage')[0].checked = true;
            that.#onRbLocalStorageChoosed();
            that.actionBlockService.showActionBlocksFromStorage();
            that.pageSerice.openMainPage();
        }
    }
}
