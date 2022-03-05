class NoteView {
    constructor() {
    }



    bindClickBtnClose(handler) {
        const buttons_close = ['#btn_close', '#btn_back_main'];

        for (const button_close of buttons_close) {
            $(button_close).on('click', () => { handler(); });
        }
    }

    close() {
        const elements_for_executed_actionBlock_array = document.getElementsByClassName('elements_for_executed_actionBlock');
    
        for (const elements_for_executed_actionBlock of elements_for_executed_actionBlock_array) {
            elements_for_executed_actionBlock.style.display = 'none';
        }
    
        // Clear executed content.
        $('#content_executed_from_actionBlock').hide();
        $('#content_executed_action-block_container').hide();
    
        // Also close modal box (by standart logic of API).

        $('#btn_close').hide();
        $('#btn_back_main').hide();
    }
}