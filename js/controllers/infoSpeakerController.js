const speak_info_btn = $(".btn_speak_info")[0];
let is_speaking_now = false;

function onClickBtnSpeak(event) {
    // console.log("speak " + is_speak_info);
    // Don't close panel after click speack button
    event.preventDefault();
    if (is_speaking_now) {
        speakerView.stop();
        speak_info_btn.innerText = "Speak";
        is_speaking_now = false;
    }
    else {
        const speak_bot = speakerView.start(speakerModel.text_to_speak);
        speak_info_btn.innerText = "Stop speak";
        speak_bot.onend = function(event) {
            speak_info_btn.innerText = "Speak";
            is_speaking_now = false;
        }
        is_speaking_now = true;
    }
}

speak_info_btn.addEventListener('click', function(){
    onClickBtnSpeak(event);
});