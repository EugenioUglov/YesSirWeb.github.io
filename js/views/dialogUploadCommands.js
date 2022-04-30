const dialogUploadCommands = {};

dialogUploadCommands.show = function(title_text) {
    $(".black_background").show();

    // .START (Set text for title)
    let dialog_upload_InfoBloks_from_file = {};
    dialog_upload_InfoBloks_from_file.elem = $("#dialog_upload_InfoBloks_from_file");
    dialog_upload_InfoBloks_from_file.title = dialog_upload_InfoBloks_from_file.elem.find(".title")[0];
    dialog_upload_InfoBloks_from_file.title.innerText = "";
    if (title_text) dialog_upload_InfoBloks_from_file.title.innerText = title_text;
    // .END (Set text for title)


    if (typeof dialog_upload_InfoBloks_from_file.elem[0].showModal === "function") {
        dialog_upload_InfoBloks_from_file.elem[0].showModal();
    } else {
        alert("WARNING! The <dialog> API is not supported by this browser");
    }
}