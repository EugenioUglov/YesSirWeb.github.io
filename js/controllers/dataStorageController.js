class DataStorageController {
    constructor(actionBlockService, dataStorageService, hashService) {
        this.actionBlockService = actionBlockService;
        this.dataStorageService = dataStorageService;
        this.hashService = hashService;

        this.#setListeners();
    }

    #onRbStorageDatabaseChecked() {
        this.dataStorageService.setUserStorage(this.dataStorageService.getStorageNameEnum().database);
    }

    #onRbLocalStorageChoosed() {
        $('#autorization_log').text('');
        this.dataStorageService.setUserStorage(this.dataStorageService.getStorageNameEnum().localStorage);
        $('#authorization_form').hide();
    }


    #setListeners() {
        const that = this;

        // On click btn authorization.
        $('#btn_authorization')[0].addEventListener('click', function() {
            // console.log('btn_authorization click');
            const authorization_data = {
                nickname: $('#input_field_nickname').val(),
                password: $('#input_field_password').val()
            };

            localStorage['authorization'] = JSON.stringify(authorization_data);

            $('#autorization_log').text('');
            // $('#btn_authorization')[0].disabled = true;
            $('#authorization_form').hide();
            that.dataStorageService.setUserStorage(that.dataStorageService.getStorageNameEnum().database);
            window.scrollTo(0, 0);
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
            that.hashService.openMainPage();
        }

        this.dataStorageService.view.bindClickBtnUploadActionBlocksToDatabase(onClickBtnUploadActionBlocksToDatabase);
        
        function onClickBtnUploadActionBlocksToDatabase() {
            that.actionBlockService.save();
            that.hashService.openMainPage();
        }

        this.dataStorageService.view.bindClickBtnCancelGetActionBlocksFromDatabase(onClickBtnCancelDialogDatabase);

        function onClickBtnCancelDialogDatabase() {
            $('#rb_storage_localStorage')[0].checked = true;
            that.#onRbLocalStorageChoosed();
            that.actionBlockService.showActionBlocksFromStorage();
            that.hashService.openMainPage();
        }
    }
}
