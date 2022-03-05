class VoiceRecognitionView {
    constructor() {
        
    }

    recognition = {};

    bindClickBtnVoiceRecognition(handler) {
        $('#btn_voice_recognition').on('click', (event) => {
            handler(event);
        });
    }

    bindClickDropdownSelectLanguage(handler) {
        document.getElementById('dropdown_select_language').addEventListener('click', function(e) {
            handler(event);
        });
    }
}
