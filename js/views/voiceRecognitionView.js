class VoiceRecognitionView {
    constructor() {
        
    }

    recognition = {};

    showSettings() {
        $('#elements_for_voice_recognition_settings').show();
    }

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

    showProgressRecognition() {
        $('#img_voice_recognition').attr('src', './icons/mic-animate.gif');
    }

    showStopRecognition() {
        $('#img_voice_recognition').attr('src', './icons/mic.gif');
    }
}
