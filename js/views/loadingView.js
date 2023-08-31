class LoadingView {
    constructor() {

    }


    startLoading() {
        $('.multiColorCircleLoader').show();
    }

    stopLoading() {
        $('.multiColorCircleLoader').hide();
        $('.multiColorCircleLoader').find('.text-info').text('');
    }
    
    setText(new_text) {
        $('.multiColorCircleLoader').find('.text-info').text(new_text);
    }
}