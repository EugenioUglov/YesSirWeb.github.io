class DataStorageView {
    constructor (dialogWindow) {
        this.dialogWindow = dialogWindow;
        this.#init();
    }

    #init() {
        const dialog_database_manager = {};
        dialog_database_manager.btn_add = $('#dialog_database_manager').find('.btn_add_infoBlocks')[0];
        dialog_database_manager.btn_rewrite = $('#dialog_database_manager').find('.btn_rewrite_actionBlocks')[0];
        dialog_database_manager.btn_upload = $('#dialog_database_manager').find('.btn_upload_actionBlocks')[0];
        dialog_database_manager.btn_cancel = $('#dialog_database_manager').find('.btn_cancel')[0];
        
        
        dialog_database_manager.onClickBtnCancel = function() {
            $(".black_background").hide();
        
            observable.dispatchEvent('databaseDialogCanceled', 'databaseDialogCanceled');
        
            
            alert('All data will only be available locally(exclusively from the current browser).' + '\n' + 
                'In order to change type of the storage, select a tab \'Data Manager\'.');
        
            // Also close info alert (by standart logic of API)
        };
        
        
        // dialog_database_manager.btn_rewrite.addEventListener('click', function() {
        //     $(".black_background").hide();
        //     actionBlockController.onClickBtnRewriteActionBlocks();
        // });
        
        dialog_database_manager.btn_upload.addEventListener('click', function() {
            const text_confirm_window = 'Are you sure to synchronize current Action-Blocks?\n\
                All previous data in database will be deleted.';
            
            function onClickOkConfirm() {
                $(".black_background").hide();
                actionBlockController.save(actionBlockController.getActionBlocks());
                actionBlockController.showActionBlocks();
            }
        
            function onClickCancelConfirm() {
                $(".black_background").hide();
            }
        
            this.dialogWindow.confirmAlert(text_confirm_window, onClickOkConfirm, onClickCancelConfirm);
        });
        
        dialog_database_manager.btn_cancel.addEventListener('click', function() {
            $(".black_background").hide();
            dialog_database_manager.onClickBtnCancel();
        });
    }



    bindClickBtnRewriteOnDialogDatabaseManager(handler) {
        const btn_rewrite = $('#dialog_database_manager').find('.btn_rewrite_actionBlocks')[0];
        
        btn_rewrite.addEventListener('click', function() {
            handler();
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