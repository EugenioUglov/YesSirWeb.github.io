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