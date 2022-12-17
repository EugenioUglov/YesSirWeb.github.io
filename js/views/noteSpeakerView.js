class NoteSpeakerView {
    constructor() {

    }

    #btn_speaker = $('.btn_content_speaker');
    
    showBtnSpeaker() {
        const btn_speaker = $('.btn_content_speaker');
        btn_speaker.show();
        return btn_speaker;
    }

    hideBtnSpeaker() {
        this.#btn_speaker.hide();
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
        const content = $("#content_executed_from_actionBlock").find('.content').text();
        // console.log(content);
        return content;
    }
}