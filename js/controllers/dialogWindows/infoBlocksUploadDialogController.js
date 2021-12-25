const dialog_upload_InfoBloks_from_file = {};
dialog_upload_InfoBloks_from_file.elem = $("#dialog_upload_InfoBloks_from_file");
dialog_upload_InfoBloks_from_file.btn_add = dialog_upload_InfoBloks_from_file.elem.find(".btn_add_infoBlocks")[0];
dialog_upload_InfoBloks_from_file.btn_rewrite = dialog_upload_InfoBloks_from_file.elem.find(".btn_rewrite_infoBlocks")[0];
dialog_upload_InfoBloks_from_file.btn_cancel = dialog_upload_InfoBloks_from_file.elem.find(".btn_cancel")[0];

dialog_upload_InfoBloks_from_file.onClickBtnCancel = function() {
    blackBackgroundView.disable();
    scrollView.scrollToTop();

    // Also close info alert (by standart logic of API)
}


dialog_upload_InfoBloks_from_file.btn_add.addEventListener('click', function() {
    infoBlocks_area.addInfoObjects();
});

dialog_upload_InfoBloks_from_file.btn_rewrite.addEventListener('click', function() {
    infoBlocks_area.rewriteInfoObjects();
});

dialog_upload_InfoBloks_from_file.btn_cancel.addEventListener('click', function() {
    dialog_upload_InfoBloks_from_file.onClickBtnCancel();
});