class ScrollView {
    constructor() {
        
    }


    btnScrollUpShow() {
        $('#btn_scroll_up').show();
    }

    btnScrollUpHide() {
        $('#btn_scroll_up').hide();
    }

    bindClickBtnScrollUp(handler) {
        $('#btn_scroll_up').on('click', () => handler());
    }
}