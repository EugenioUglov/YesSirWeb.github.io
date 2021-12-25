const dialogWindow = {};

dialogWindow.confirmAlert = function(text, callBackOk, callBackCancel) {
    let r = confirm(text);
    if (r == true) {
        callBackOk();
    } else {
        callBackCancel()
    }
}