class NoteSpeakerView {
    constructor() {

    }

    #btn_speaker = $('.btn_content_speaker');
    
    showBtnSpeaker() {
        $('.btn_content_speaker').show();
    }

    hideBtnSpeaker() {
        $('.btn_content_speaker').hide();
    }

    bindClickBtnSpeaker(handler) {
        const that = this;
        this.#btn_speaker.on('click', () => {
            handler();
        });
    }

    changeTextForSpeakButton(new_text) {
        this.#btn_speaker.text(new_text);
    }
    
    getContent() {
        return $("#content_executed_from_actionBlock").find('.content').text();
    }
}