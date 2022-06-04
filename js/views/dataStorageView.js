class DataStorageView {
    constructor (dialogWindow) {
        this.dialogWindow = dialogWindow;
    }

    showDataStorageSettings() {
        $('#elements_for_data_storage').show();
    }

    bindClickBtnUpload(okClickHandler, cancelClickHandler) {
        const that = this;

        const dialog_database_manager = {};
        dialog_database_manager.btn_add = $('#dialog_database_manager').find('.btn_add_actionBlocks')[0];
        dialog_database_manager.btn_rewrite = $('#dialog_database_manager').find('.btn_rewrite_actionBlocks')[0];
        dialog_database_manager.btn_upload = $('#dialog_database_manager').find('.btn_upload_actionBlocks')[0];

        dialog_database_manager.btn_upload.addEventListener('click', function() {
            const text_confirm_window = 'Are you sure that you want to synchronize current Action-Blocks?\n\
                All previous data in database will be deleted.';
            
            function onClickOkConfirm() {
                $(".black_background").hide();

                if (okClickHandler) okClickHandler();
            }
        
            function onClickCancelConfirm() {
                $(".black_background").hide();
                if (cancelClickHandler) cancelClickHandler();
            }
        
            that.dialogWindow.confirmAlert(text_confirm_window, onClickOkConfirm, onClickCancelConfirm);
        });
    }

    bindClickBtnGetActionBlocksFromDatabase(handler) {
        const btn_rewrite = $('#dialog_database_manager').find('.btn_rewrite_actionBlocks');
        
        btn_rewrite.on('click', () => {
            handler();
        });
    }

    bindClickBtnUploadActionBlocksToDatabase(okClickHandler, cancelClickHandler) {
        const that = this;

        const btn_upload = $('#dialog_database_manager').find('.btn_upload_actionBlocks');
        
        btn_upload.on('click', () => {
            const text_confirm_window = 'Are you sure that you want to synchronize current Action-Blocks?\n\
                All previous data in the database will be deleted.';
            
            function onClickOkConfirm() {
                $(".black_background").hide();

                if (okClickHandler) okClickHandler();
            }
        
            function onClickCancelConfirm() {
                $(".black_background").hide();
                
                if (cancelClickHandler) cancelClickHandler();
            }
        
            that.dialogWindow.confirmAlert(text_confirm_window, onClickOkConfirm, onClickCancelConfirm);
        });
    }

    bindClickBtnCancelGetActionBlocksFromDatabase(handler) {
        $('#dialog_database_manager').find('.btn_cancel')[0].addEventListener('click', function() {
            $(".black_background").hide();
        
            handler();
            
            alert('All data will only be available locally(exclusively from the current browser).' + '\n' + 
                'In order to change type of the storage, select a tab \'Data Manager\'.');
        });
    }

    showDatabaseDialog() {
        $(".black_background").show();

        if (typeof $("#dialog_database_manager")[0].showModal === "function") {
            $("#dialog_database_manager")[0].showModal();
        } else {
            alert("WARNING! The <dialog> API is not supported by this browser");
        }
    }
}