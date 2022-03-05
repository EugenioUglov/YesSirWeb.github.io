class ScrollView {
    constructor() {
        
    }

    btnScrollUpHide() {
        $('#btn_scroll_up').hide();
    }

    bindClickBtnScrollUp(handler) {
        $('#btn_scroll_up').on('click', () => handler());
    }
}