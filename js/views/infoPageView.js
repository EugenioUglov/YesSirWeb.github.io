const infoPageView = {};

infoPageView.close = function() {
    console.log('infoPageView.close');
    blackBackgroundView.disable();
    

    const elements_for_executed_infoBlock_array = document.getElementsByClassName('elements_for_executed_infoBlock');

    for (const elements_for_executed_infoBlock of elements_for_executed_infoBlock_array) {
        elements_for_executed_infoBlock.style.display = 'none';
    }

    // Clear executed content. 
    // document.getElementById('content_executed_from_infoBlock').innerHTML = '';
    $('#content_executed_from_infoBlock').hide();

    // Clear fixed elements for info page.
    //$('#fixed_elements_on_show_info').hide();

    if (actionBlockController.getActionBlocks().length > 0) {
        // Show search area with Info-Blocks.
        $('#search_area').show();
    }
    else {
        $('#search_area').hide();
        $('#welcome_page').show();
    }
    
    $('#info_page_from_executed_action-block_container').hide();

    // Show button to add ActionBlock.
    $('#fixed_btn_plus').css('visibility', 'visible');
};