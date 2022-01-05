const buttons_back = $('.btn_back');

const close = function() {
    // Clear all input fields.
    $('#settings_action_block_container').find('.resize_field').val('');

    infoPageView.close();
    // Also close info alert (by standart logic of API)

    const event = {
        name: 'closeContentContainer',
        data: 'close content container'
    };
    
    observable.dispatchEvent(event.name, event.data);
    
    $('.btn_speak').hide();
    $('#btn_close').hide();
    $('#btn_back_main').hide() 
}

/*
for (const btn_back of buttons_back) {
    btn_back.onclick = closeCurrentContentContainer;
}
*/

$('.btn_back').on('click', () => {
    close();
});

$('#btn_close').on('click', () => {
    close();
});


$('#btn_back_main').on('click', () => { 
    close();
});