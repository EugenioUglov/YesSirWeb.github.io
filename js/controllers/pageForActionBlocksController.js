const infoBlocks_area = {};

infoBlocks_area.infoBlocks = {};
infoBlocks_area.page_with_infoBlocks_current = 1;

infoBlocks_area.arrow_left = {};
infoBlocks_area.arrow_right = {};
infoBlocks_area.dots_container = $('.dots');


// .START (Arrows event handler)
infoBlocks_area.arrow_left.onClick = function() {
    const infoBlocks_length = Object.keys(infoBlockModel.infoBlocks_on_page).length;

    infoBlocks_area.page_with_infoBlocks_current--;

    // IF it is the first page THEN go to the last page.
    if (infoBlocks_area.page_with_infoBlocks_current < 1) {
        infoBlocks_area.page_with_infoBlocks_current = infoBlocks_length;
        // console.log(infoBlocks_area.page_with_infoBlocks_current)
    }

    setPage(infoBlocks_area.page_with_infoBlocks_current);
}  


infoBlocks_area.arrow_right.onClick = function() {
    const infoBlocks_length = Object.keys(infoBlockModel.infoBlocks_on_page).length

    infoBlocks_area.page_with_infoBlocks_current++;

    // IF it is the last page THEN go to first page.
    if (infoBlocks_area.page_with_infoBlocks_current > infoBlocks_length) {
        infoBlocks_area.page_with_infoBlocks_current = 1;
        // console.log(infoBlocks_area.page_with_infoBlocks_current)
    }

    setPage(infoBlocks_area.page_with_infoBlocks_current);
}  

function setPage(n) {
    return;
    infoBlocks_area.page_with_infoBlocks_current = n;
    const i_page = n - 1;
    const infoBlocks_to_show = infoBlockModel.infoBlocks_on_page[i_page];
    actionBlockController.showActionBlocks(infoBlocks_to_show);


    /*
    // .START (Update styles for dots)
    let dots_length = $(".dots")[0].children.length;
    
    for (let i_dot = 0; i_dot < dots_length; i_dot++) {
        let dot = $(".dots")[0].children[i_dot];
        dot.className = dot.className.replace(" active", "");
    }

    let dot_to_active = $(".dots")[0].children[i_page];
    dot_to_active.className += " active";
    // .END (Update styles for dots)
    */

    const count_pages = Object.keys(infoBlockModel.infoBlocks_on_page).length;    
    const current_page = n;

    // Set text which page (example: 1 / 3).
    setNumberPage(current_page, count_pages);
}




infoBlocks_area.addInfoObjects = function() {
    infoBlockModel.new_infoObjects_to_add = '';


    $('#input_field_request')[0].value = '';
    const infoObjects_from_localStorage = infoBlockModel.getAll();

    // Refresh data list.
    //actionBlockController.showInfoBlocksOnPages(infoObjects_from_localStorage);
    infoBlockModel.infoBlocks_on_page = actionBlockController.showActionBlocks(infoObjects_from_localStorage);

    blackBackgroundView.disable();
}


infoBlocks_area.rewriteInfoObjects = function() {
    const text_confirm_window = 'Before rewrite all the commands data is recommended to save current data..' + 
        '\n' + 'Are you sure you want to rewrite it now?';

    dialogWindow.confirmAlert(text_confirm_window, onClickOkConfirm, onClickCancelConfirm);

    function onClickOkConfirm() {
        $('#dialog_database_manager')[0].close();
        blackBackgroundView.disable();
        observable.dispatchEvent('clickBtnRewrite', 'Click button Rewrite');
        
        /*
        actionBlockController.getActionBlocksFromStorageAsync(onGetActionBlocksFromStorage);

        function onGetActionBlocksFromStorage(actionBlocks_from_storage) {
            $('.icon_spinner').hide();

            // Exceptions
            if ( ! actionBlocks_from_storage || actionBlocks_from_storage.length < 1) {
                $('#welcome_page').show();

                return;
            }
            //

            actionBlockController.showActionBlocks(actionBlocks_from_storage);
            
            $('#actionBlocks_container').show();

            $('#input_field_request')[0].value = '';
        }

        actionBlockController.deleteAll();
        
        for (i_obj in new_commands_objects) {
            console.log('save', new_commands_objects[i_obj]);
            actionBlockController.save(new_commands_objects[i_obj]);
        }

       
        const infoObjects_from_localStorage = infoBlockModel.getAll();
        actionBlockController.save(infoObjects_from_localStorage);

        // Refresh data list.
        // actionBlockController.showInfoBlocksOnPages(infoObjects_from_localStorage);
        infoBlockModel.infoBlocks_on_page = actionBlockController.showActionBlocks(infoObjects_from_localStorage);
        */

        
        return;
    }

    function onClickCancelConfirm() {
        blackBackgroundView.disable();
        return;
    }
}


// Buttons change page with actionBlocks.
$('.page_control_elements').children('.prev').on('click', infoBlocks_area.arrow_left.onClick);
$('.page_control_elements').children('.next').on('click', infoBlocks_area.arrow_right.onClick);

function setNumberPage(current_page, all_pages) {
    for (const count_pages_label of $('.count_pages_infoBlocks')) {
        count_pages_label.innerText = current_page + ' / ' + all_pages;
    }
}


function showPageDots(page) {
    // Rewrite html in elem.
    //$('.dots').html(dots_container.html+ '<span class='dot'></span> ');
    // Add html to elem.
    $('.dots').append('<span class="dot" onclick="setPage(' + page + ')"></span>');
    // Hide dots container.
    $('.dots').hide();
}