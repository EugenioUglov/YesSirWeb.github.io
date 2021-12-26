const infoBlockController = {};

const btn_add_command_plus = $("#fixed_btn_plus")[0];
const settings_action_block_container = $("#settings_action_block_container");
const create_action_block_container = $("#elements_to_create_action-block");

const btn_update_infoBlock = $("#btn_update_infoBlock")[0];
const btn_delete_infoBlock = $("#btn_delete_infoBlock")[0];
const btn_delete_all_infoBlocks = $("#btn_delete_all_infoBlocks")[0];




let title_infoBlock_before_update = "";

infoBlockController.setListener = function(infoObj, infoBlock_container) {
    let is_mouse_eneter_settings = false;
    
    function onClickBtnSettings(e) {
        title_infoBlock_before_update = infoObj.title;
        infoBlockView.showElementsToUpdateInfoBlock(infoObj);
    }

    // On click infoBlock.
    infoBlock_container[0].addEventListener("click", function(e) {
        if (is_mouse_eneter_settings) return false;

        infoBlockView.executeActionByObj(infoObj);
    });

    const settings_container = infoBlock_container.find(".settings")[0];

    if (settings_container) {
        settings_container.onmouseenter = function(){is_mouse_eneter_settings = true;};
        settings_container.onmouseleave = function(){is_mouse_eneter_settings = false;};
        settings_container.addEventListener("click", onClickBtnSettings);
    }
}



// On click button create command.
//
//function setListenerCreateInfoBlock() {
    console.log("set listener");
    $("#btn_create_infoBlock")[0].addEventListener("click", function () {
        // Get title value.
        let input_field_title = settings_action_block_container.find(".input_field_title");
        let title = textAlgorithms.getTextInOneLine(input_field_title.val());
        console.log(title);
        
        
        if ( ! title) {
            alert("Impossible to create command. Title field is empty");
            return false;
        }

        // .Start tags.
        // Get tags values.
        let input_field_tags = settings_action_block_container.find(".input_field_tags")[0];
        let tags_from_field = input_field_tags.value;
        

        let title_without_symbols = title.replace(/[^a-zа-яё0-9\s]/gi, '');
        console.log("title_without_symbols", title_without_symbols);

        let tags_plus_title = "";

        if (tags_from_field) tags_plus_title += tags_from_field + ", ";

        // Add new tag getting text from title.
        tags_plus_title += title + ", " + title_without_symbols;
        // .End tags.
    


        // Get action.
        let selected_action = settings_action_block_container.find(".dropdown_select_action").find(":selected")[0];
        let action_user_choose = selected_action.value;
        if (action_user_choose === undefined || action_user_choose === null) {
            alert("Impossible to create command.\nProbably dropdown menu for action has been broken.");
            return false;
        }
    
        // Get info of action.
        const input_field_info_container = settings_action_block_container.find(".input_field_action_description");
        let info = input_field_info_container.val();
        if ( ! info) {
            action_user_choose = ACTION_NAME.showInfo;
            info = title;
            // alert("Impossible to create command. Info field for action is empty");
            // return false;
        }
        
    
    
        //let input_field_action = settings_action_block_container.find("#input_field_action")[0];
    
        let input_field_image_path_container = settings_action_block_container.find(".input_field_image_path");
        let image_path = input_field_image_path_container.val();

        //console.log(action_description_container.val())

        /*
        clearContentInContainer($("#text_info_obj_create")[0]);
        $("<br><div align='left'>" + "Result created info object:" + "</div>").appendTo($("#text_info_obj_create")[0]);
        $("<div>" + JSON.stringify(infoObj_new) + "</div>").appendTo($("#text_info_obj_create")[0]);
        */
    
        //console.log("title: " + input_field_title.value + " | tags: " + input_field_tags.value + " | action: " + action_user_choose + " | input_field_action: " + input_field_action.value + " | image path: " + image_path.value);
        
        const isInfoBlockCreated = infoBlockView.create(title, tags_plus_title, action_user_choose, info, image_path);

        if ( ! isInfoBlockCreated) return;
        
        // Clear all fields.
        settings_action_block_container.find(".resize_field").val("");


        //setDefaultValuesForCreateInfoBlockContainer();
        infoPageView.close();
    });
//}



btn_update_infoBlock.addEventListener("click", function () {
    /*
    // Get original title of infoObj to update.
    let input_field_original_title = $("#settings_action_block_container").find(".input_field_original_title");
    let original_title = input_field_original_title.val();
    if ( ! original_title) {
      alert("Impossible to create command. Original Title field is empty");
      return false;
    }
    */
  
    original_title = title_infoBlock_before_update;

    // Get new title value.
    let input_field_title = $("#settings_action_block_container").find(".input_field_title");
    let title = input_field_title.val();
    if ( ! title) {
        alert("ERROR! Empty field for title");
        return;

        input_field_title.val(original_title);
        title = original_title;
    }
  
    // Get tags values
    const input_field_tags = $("#settings_action_block_container").find(".input_field_tags")[0];
    const tags_from_input_field = input_field_tags.value;
    let tags = tags_from_input_field;

    if (original_title != title) {
        // Add new tag getting text from title

        let title_without_symbols = title.replace(/[^a-zа-яё0-9\s]/gi, '');
        

        if (tags) tags = tags + ", ";
        
        // Add new tag getting text from title.
        tags += title + ", " + title_without_symbols;
    }

    

    /*
    // Change all new lines to symbol ","
    let tags_without_new_line = tags_with_title.replaceAll('\n', ',');
    tags_without_new_line = tags_without_new_line.toLowerCase();
    tags = textAlgorithms.getArrayByText(tags_without_new_line);
    

    // Delete empty symbols from sides in text.
    for (i_tag in tags) {
        tags[i_tag] = tags[i_tag].trim();
        console.log(tags[i_tag]);
    }
    console.log("tags array", tags);

    // Delete same tags.
    let tags_set = new Set(tags);
    console.log("tags_set", tags_set);
    
    tags = Array.from(tags_set);
    console.log("tags array from set", tags);
    */

    // Get action
    const dropdown_select_action_for_update = $("#settings_action_block_container").find(".dropdown_select_action");
    const selected_action = dropdown_select_action_for_update.find(":selected")[0];
    const action_user_choose = selected_action.value;
    if (action_user_choose === undefined || action_user_choose === null) {
        alert("Impossible to create command. Dropdown action_user_choose = undefined");
        return false;
    }
  
    // Get info
    const input_field_info_container = $("#settings_action_block_container").find(".input_field_action_description");
    const info = input_field_info_container.val();
    if ( ! info) {
        alert("Impossible to create command. Action input field is empty");
        return false;
    }
  
  
    //let input_field_action = $("#settings_action_block_container").find("#input_field_action")[0];
  
    // Get image path
    const input_field_image_path_container = $("#settings_action_block_container").find(".input_field_image_path");
    const image_path = input_field_image_path_container.val();
  
   
    const index_of_title = infoBlockModel.getIndexByTitle(title);
    let is_obj_exists_in_infoObjects = false;
    if (index_of_title >= 0) {
        is_obj_exists_in_infoObjects = true;
    }
    console.log("is title exist: "  + is_obj_exists_in_infoObjects + " | original: " + original_title + " | title: " + title);

    if (is_obj_exists_in_infoObjects && original_title != title) {
        alert("Info already exists with title: " + title);
        return;
    }

    const is_deleted_obj = infoBlockModel.deleteInfoObjByTitle(original_title);
    if ( ! is_deleted_obj) {
        alert("ERROR! Info container weren't delete");
        return;
    }
    

    const isInfoBlockCreated = infoBlockView.create(title, tags, action_user_choose, info, image_path);

    if ( ! isInfoBlockCreated) return;

    //setDefaultValuesForCreateInfoBlockContainer();
    setDefaultValuesForUpdateInfoBlockContainer();
    setDefaultValuesForDeleteInfoBlockContainer();
    
    
    //clearContentInContainer($("#text_info_obj_create")[0]);
    //$("<br><div align='left'>" + "Result created info object:" + "</div>").appendTo($("#text_info_obj_create")[0]);
    //$("<div>" + JSON.stringify(infoObj_new) + "</div>").appendTo($("#text_info_obj_create")[0]);

    infoBlockView.onUpdate();
    infoPageView.close();
});
 
btn_delete_infoBlock.addEventListener('click', onClickBtnDeleteInfoBlock);
// btn_delete_all_infoBlocks.addEventListener("click", onClickBtnDeleteAllInfoBlocks);


btn_add_command_plus.addEventListener('click', onClickFixedBtnPlus);


// .START - Preview Info-Block.
$("#settings_action_block_container").find(".input_field_title").on('input', infoBlockView.updatePreview);
$("#settings_action_block_container").find(".input_field_image_path").on('input', infoBlockView.updatePreview);


const parent_element_for_preview_infoBlock_on_create = $("#settings_action_block_container").find(".infoBlock_preview_container");


const id_preview_create = "previewCreate";
const id_preview_update = "previewUpdate";

let infoBlock_preview = new InfoBlock(id_preview_create, {});

infoBlock_preview.create(parent_element_for_preview_infoBlock_on_create);
// .END - Preview Info-Block.



function onClickFixedBtnPlus() {
    infoBlockView.showElementsToCreateInfoBlock();
    $("#welcome_page").hide();
}






function onClickBtnDeleteInfoBlock() {
    const title = $("#settings_action_block_container").find(".input_field_title")[0].value;
    const infoObjects = infoBlockModel.getAll();
    
    //  let i_infoObject_to_delete = binarySearchInObjectsArrByTitle(infoObjects, title);
    const i_infoObject_to_delete = infoBlockModel.getIndexByTitle(title);

    if (i_infoObject_to_delete < 0) {
        alert("Command doesn't exist with title: " + title);
        return;
    }

    console.log("infoObject_to_delete", infoObjects[i_infoObject_to_delete]);
    const text_confirm_window = 'Are you sure you want to delete' + '\n' + ' "' + title + '" ?';

    function onClickOkConfirm() {
        // Delete infoObject from array
        // infoObjects.splice(i_infoObject_to_delete, 1);
       
        infoBlockModel.deleteInfoObjByTitle(title);
        console.log("infoObjects after delete obj", infoObjects);

        //setDefaultValuesForUpdateInfoBlockContainer();
        //setDefaultValuesForDeleteInfoBlockContainer();

        infoBlockView.onUpdate();
        infoPageView.close();

        return;
    }

    function onClickCancelConfirm() {
        return;
    }
  
    dialogWindow.confirmAlert(text_confirm_window, onClickOkConfirm, onClickCancelConfirm);
    infoBlockView.onUpdate();
}

function onClickBtnDeleteAllInfoBlocks() {
    let text_confirm_window = "Are you sure you want to delete ALL commands?"+"\n"+"* It's recommended to download the commands first to save all created information";

    function onClickOkConfirm() {
        infoBlockModel.deleteAll();
        //setDefaultValuesForUpdateInfoBlockContainer();
        //setDefaultValuesForDeleteInfoBlockContainer();

        infoBlockView.createDefaultInfoBlocks();
        infoBlockView.onUpdate();
        infoPageView.close();
        
        return;
    }
    function onClickCancelConfirm() {
      return;
    }
  
    dialogWindow.confirmAlert(text_confirm_window, onClickOkConfirm, onClickCancelConfirm);
    //infoBlockView.onUpdate();
}

function setListenersForPreviewInfoBlock() {

}


function setDefaultValuesForCreateInfoBlockContainer() {
    // Get title value
    let input_field_title = $("#settings_action_block_container").find(".input_field_title");
    input_field_title.val("");
    let input_field_tags = $("#settings_action_block_container").find(".input_field_tags")[0];
    input_field_tags.value = "";
    let input_field_info_container = $("#settings_action_block_container").find(".input_field_action_description");
    input_field_info_container.val("");
    let input_field_image_path_container = $("#settings_action_block_container").find(".input_field_image_path");
    input_field_image_path_container.val("");
}

function setDefaultValuesForUpdateInfoBlockContainer() {
    let input_field_original_title = $("#settings_action_block_container").find(".input_field_original_title");
    input_field_original_title.val("");
    let input_field_title = $("#settings_action_block_container").find(".input_field_title");
    input_field_title.val("");
    let input_field_tags = $("#settings_action_block_container").find(".input_field_tags")[0];
    input_field_tags.value = "";
    let input_field_info_container = $("#settings_action_block_container").find(".input_field_action_description");
    input_field_info_container.val("");
    let input_field_image_path_container = $("#settings_action_block_container").find(".input_field_image_path");
    input_field_image_path_container.val("");
}

function setDefaultValuesForDeleteInfoBlockContainer() {
    // Get title value.
    let input_field_title = $("#settings_action_block_container").find(".input_field_title");
    input_field_title.val("");
}

