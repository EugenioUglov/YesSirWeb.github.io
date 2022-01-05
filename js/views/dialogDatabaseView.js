const dialogDatabaseView = {};

dialogDatabaseView.show = function() {
    blackBackgroundView.enable();

    if (typeof $("#dialog_database_manager")[0].showModal === "function") {
        $("#dialog_database_manager")[0].showModal();
    } else {
        alert("WARNING! The <dialog> API is not supported by this browser");
    }
}