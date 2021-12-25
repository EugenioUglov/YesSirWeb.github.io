const dialog_database_manager = {};
dialog_database_manager.elem = $("#dialog_database_manager");
dialog_database_manager.btn_add = dialog_database_manager.elem.find(".btn_add_infoBlocks")[0];
dialog_database_manager.btn_rewrite = dialog_database_manager.elem.find(".btn_rewrite_infoBlocks")[0];
dialog_database_manager.btn_upload = dialog_database_manager.elem.find(".btn_upload_infoBlocks")[0];
dialog_database_manager.btn_cancel = dialog_database_manager.elem.find(".btn_cancel")[0];

dialog_database_manager.onClickBtnCancel = function() {
    $("#rb_storage_localStorage")[0].checked = true;
    rb_storage_localStorage.onChecked();
    
    blackBackgroundView.disable();
    scrollView.scrollToTop();
    alert("All data will only be available locally(exclusively from the current browser)." + "\n" + "In order to change type of the storage, select a tab \"Data Manager\".");
    // Also close info alert (by standart logic of API)
}

dialog_database_manager.btn_add.addEventListener('click', function() {
    infoBlocks_area.addInfoObjects();
});

dialog_database_manager.btn_rewrite.addEventListener('click', function() {
    infoBlocks_area.rewriteInfoObjects();
});

dialog_database_manager.btn_upload.addEventListener('click', function() {
    let text_confirm_window = "Are you sure you want to synchronize current Action-Blocks?";
    
    function onClickOkConfirm() {
        infoBlockModel.saveToDatabase();
        blackBackgroundView.disable();
        
        return;
    }

    function onClickCancelConfirm() {
        dialogDatabaseView.show();
        
        return;
    }

    dialogWindow.confirmAlert(text_confirm_window, onClickOkConfirm, onClickCancelConfirm);
});

dialog_database_manager.btn_cancel.addEventListener('click', function() {
    dialog_database_manager.onClickBtnCancel();
});

