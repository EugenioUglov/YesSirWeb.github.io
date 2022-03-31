class SpeakerView {
    constructor(controller) {
        this.controller = controller; 
        this.btn_speaker = $('.btn_content_speaker');
    }


    changeTextForSpeakButton(text) {
        const buttons_speakers = this.btn_speaker;

        for(const btn_speaker of buttons_speakers) {
            btn_speaker.innerText = text;
        }
    }

    bindClickBtnSpeak(handler) {
        this.btn_speaker.on('click', () => handler());
    }

    hideBtnSpeakContent() {
        $('.btn_content_speaker').hide();
    }
}