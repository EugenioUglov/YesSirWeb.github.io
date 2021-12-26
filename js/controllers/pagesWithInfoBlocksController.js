const infoBlocks_area = {};

infoBlocks_area.infoBlocks = {};
infoBlocks_area.page_with_infoBlocks_current = 1;

infoBlocks_area.arrow_left = {};
infoBlocks_area.arrow_right = {};
infoBlocks_area.dots_container = $(".dots");


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
    infoBlocks_area.page_with_infoBlocks_current = n;
    const i_page = n - 1;
    const infoBlocks_to_show = infoBlockModel.infoBlocks_on_page[i_page];
    infoBlocks_area.infoBlocks.createByInfoObjects(infoBlocks_to_show);


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


infoBlocks_area.infoBlocks.createByInfoObjects = function(infoObjects) {
    // Clear infoBlocks.
    $('.infoBlocks_container')[0].innerHTML = "";

    if ( ! infoObjects) return;

    for (i_obj in infoObjects) {
        const infoObj_curr = infoObjects[i_obj];
        const id = ++i_obj;

        const infoBlock = new InfoBlock(id, infoObj_curr);
        const infoBlock_elem = infoBlock.create();
        
        // .START (Set click listeners)
        infoBlockController.setListener(infoBlock.infoObj, infoBlock.infoBlock_container);
        // .END (Set click listeners)
    }
}

infoBlocks_area.addInfoObjects = function() {
    let new_commands_objects = infoBlockModel.new_infoObjects_to_add;
    infoBlockModel.new_infoObjects_to_add = "";
    console.log("new_commands_objects", new_commands_objects);
    let isShowAlert = false;

    for (i_obj in new_commands_objects) {
        infoBlockModel.add(new_commands_objects[i_obj], isShowAlert);
    }


    $("#input_field_request")[0].value = "";
    const infoObjects_from_localStorage = infoBlockModel.getAll();

    infoBlockModel.saveInStorage(infoObjects_from_localStorage);

    // Refresh data list
    infoBlockModel.infoBlocks_on_page = infoBlockView.showInfoBlocksOnPages(infoObjects_from_localStorage);
    infoBlockModel.showed_infoObjects = infoObjects_from_localStorage;
    
    blackBackgroundView.disable();
}


infoBlocks_area.rewriteInfoObjects = function() {
    const text_confirm_window = "Before rewrite all the commands data is recommended to save current data.." + 
        "\n" + "Are you sure you want to rewrite it now?";
    dialogWindow.confirmAlert(text_confirm_window, onClickOkConfirm, onClickCancelConfirm);

    function onClickOkConfirm() {
        const new_commands_objects = infoBlockModel.new_infoObjects_to_add;
        infoBlockModel.new_infoObjects_to_add = "";
        infoBlockModel.deleteAll();
        
        for (i_obj in new_commands_objects) {
            console.log("save", new_commands_objects[i_obj]);
            infoBlockModel.add(new_commands_objects[i_obj]);
        }

       
        $("#input_field_request")[0].value = "";
        const infoObjects_from_localStorage = infoBlockModel.getAll();
        infoBlockModel.saveInStorage(infoObjects_from_localStorage);

        // Refresh data list
        infoBlockModel.infoBlocks_on_page = infoBlockView.showInfoBlocksOnPages(infoObjects_from_localStorage);

        infoBlockModel.showed_infoObjects = infoObjects_from_localStorage;

        blackBackgroundView.disable();
        
        return;
    }

    function onClickCancelConfirm() {
        blackBackgroundView.disable();
        return;
    }
}


$(".page_control_elements").children(".prev")[0].addEventListener("click", infoBlocks_area.arrow_left.onClick);
$(".page_control_elements").children(".next")[0].addEventListener("click", infoBlocks_area.arrow_right.onClick);

function setNumberPage(current_page, all_pages) {
    $(".count_pages_infoBlocks")[0].innerText = current_page + " / " + all_pages;
}


function showPageDots(page) {
    // Rewrite html in elem.
    //$(".dots").html(dots_container.html+ "<span class='dot'></span> ");
    // Add html to elem.
    $(".dots").append("<span class='dot' onclick='setPage(" + page + ")'></span>");
    // Hide dots container.
    $(".dots").hide();
}