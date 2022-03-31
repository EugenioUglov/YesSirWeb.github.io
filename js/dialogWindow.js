class DialogWindow {
    constructor() {

    }

    confirmAlert(text, callBackOk, callBackCancel) {
        const is_confirmed = confirm(text);
        
        if (is_confirmed == true) {
            callBackOk();
        } else {
            callBackCancel();
        }
    }
}

const dialogWindow = {};

dialogWindow.confirmAlert = function(text, callBackOk, callBackCancel) {
    let is_confirmed = confirm(text);
    
    if (is_confirmed == true) {
        callBackOk();
    } else {
        callBackCancel();
    }
}