const dialogDatabaseView = {};

dialogDatabaseView.show = function() {
    blackBackgroundView.enable();

    let dialog = {};
    dialog.elem = $("#dialog_database_manager");


    if (typeof dialog.elem[0].showModal === "function") {
        dialog.elem[0].showModal();
    } else {
        alert("WARNING! The <dialog> API is not supported by this browser");
    }
}