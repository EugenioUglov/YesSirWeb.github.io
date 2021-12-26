const infoBlockView = {};

const infoBlock_create = {
    title: "Create Info-Block",
    tags: "Create Info-Block, default",
    action: "createInfoBlock",
    imagePath: "https://i.ibb.co/K6kqJQc/plus.png",
    isEditable: false
};

const infoBlock_open_file_manager = {
    title: "Open File Manager",
    tags: "File Manager, save, upload, load, default",
    action: "showFileManager",
    imagePath: "https://icon-library.com/images/file-download-icon/file-download-icon-19.jpg",
    isEditable: false
};

const infoBlock_open_data_storage_manager = {
    title: "Open Data Storage Manager",
    tags: "Data Storage Manager, localstorage, database, default",
    action: "showDataStorageManager",
    imagePath: "https://www.sostechgroup.com/wp-content/uploads/2016/08/ThinkstockPhotos-176551504.jpg",
    isEditable: false
};


const infoBlock_facebook_of_developer = {
    title: "Open Facebook page of developer",
    tags: "facebook, account, developer, contact, message, default",
    action: "openUrl",
    info: "https://www.facebook.com/eugeniouglov",
    imagePath: "https://i.ibb.co/QJ4y5v3/DEVELOPER-facebook.png",
    isEditable: false
};

const infoBlock_email_of_developer = {
    title: "Write email to developer - eugeniouglov@gmail.com",
    tags: "email, developer, contact, message, gmail, mail, default",
    action: "openUrl",
    info: "mailto:eugeniouglov@gmail.com",
    imagePath: "https://i.ibb.co/dMHPk78/DEVELOPER-gmail.png",
    isEditable: false
};

const infoBlock_logs = {
    title: "Show logs",
    tags: "logs, default",
    action: "showLogs",
    imagePath: "https://pbs.twimg.com/profile_banners/240696823/1528203940/1500x500",
    isEditable: false
};

const infoBlock_voiceRecognitionSettings = {
    title: "Open voice recognition settings",
    tags: "voice recognition, default",
    action: "showElementsForVoiceRecognitionManager",
    imagePath: "https://walkthechat.com/wp-content/uploads/2015/02/voice-recognition.jpg",
    isEditable: false
};

const infoBlocks_to_create = [
    infoBlock_facebook_of_developer, 
    infoBlock_email_of_developer,
    infoBlock_create,
    infoBlock_open_file_manager,
    infoBlock_open_data_storage_manager,
    infoBlock_logs,
    infoBlock_voiceRecognitionSettings
];

infoBlockView.executeActionByName = function(obj, action_name, action_info) {
    if (action_name === "showAlert") action_name = ACTION_NAME.showInfo;

    if (action_name === ACTION_NAME.openUrl) {
        console.log("openUrl", action_info);
        openUrl(action_info);
    }
    // Action alertInfo must to include info option.
    else if (action_name === ACTION_NAME.showInfo) {
        console.log("showInfo", action_info);
        onSetInfoOnPage();
        const isHTML = false;
        showInfo(action_info, obj.title, isHTML);
        
        speakerModel.text_to_speak = action_info;
        $(".btn_speak_info").show();
        $("#info_page_from_executed_action-block_container").show();
    }
    else if (action_name === ACTION_NAME.showHTML) {
        onSetInfoOnPage();
        console.log("showHTML", action_info);
        const isHTML = true;
        showInfo(action_info, obj.title, isHTML);
        $("#info_page_from_executed_action-block_container").show();
    }
    else if (action_name === ACTION_NAME.openFolder) {
        voiceRecognition.stop();
        //console.log("open folder from infoblock");
        openFolder(obj, action_info);
    }
    else if (action_name === ACTION_NAME.createInfoBlock) {
        this.showElementsToCreateInfoBlock();
    }
    else if (action_name === ACTION_NAME.showFileManager) {
        this.showElementsForFileManager();
    }
    else if (action_name === ACTION_NAME.showDataStorageManager) {
        this.showElementsForDataStorageManager();
    }
    else if (action_name === ACTION_NAME.showElementsForVoiceRecognitionManager) {
        this.showElementsForVoiceRecognitionManager();
    }
    else if (action_name === ACTION_NAME.showLogs) {
        this.showLogs();
    }
    else {
        console.log("ERROR!!! Action of infoObj doesn't exist. action_name: ", action_name);
    }
}

infoBlockView.executeActionByObj = function(obj) {
    infoBlockView.executeActionByName(obj, obj.action, obj.info);
}

infoBlockView.create = function(title, tags, action, info, image_path, isEditable = true) {
    tags = getNormalizedTags(tags);

    const infoObj_new =
    {
      title: title,
      tags: tags,
      action: action,
      info: info,
      imagePath: image_path,
      isEditable : isEditable
    };

    console.log("Result created info object", infoObj_new);

    const is_saved_obj = infoBlockModel.add(infoObj_new);

    if ( ! is_saved_obj) { 
        alert("Info Block has not been created");
        return false;
    }

    this.onUpdate();

    return true;

    function getNormalizedTags(tags) {
        let normalizedTags;
    
        // Change all new lines to symbol ",".
        const tags_without_new_line = tags.replaceAll('\n', ',');
        //tags_lower_case = tags_without_new_line.toLowerCase();
    
        tags_array = textAlgorithms.getArrayByText(tags_without_new_line);
        // Delete empty symbols from sides in text.
        for (i_tag in tags_array) {
            tags_array[i_tag] = tags_array[i_tag].trim();
            console.log(tags_array[i_tag]);
        }
        console.log("tags array", tags_array);
    
    
        // Delete same tags.
        let tags_set = new Set(tags_array);
        console.log("tags_set", tags_set);
    
        normalizedTags = Array.from(tags_set);
        console.log("tags array from set", tags_set);
    
        return normalizedTags;
    }
}

infoBlockView.updateDefaultInfoBlocks = function() {
    const isShowAlertOnError = false;

    // Delete previous default InfoBlocks.
    for (const infoBlock_to_delete of infoBlocks_to_create) {
        // Update site.
        infoBlockModel.deleteInfoObjByTitle(infoBlock_to_delete.title, isShowAlertOnError);
    }
    
    // Create default Info-Blocks.
    infoBlockView.createDefaultInfoBlocks();
}

infoBlockView.createDefaultInfoBlocks = function() {
    infoBlocks_to_create.forEach(infoBlock => {
            console.log(infoBlock.title + " created");
            infoBlockView.create(infoBlock.title, infoBlock.tags, infoBlock.action, infoBlock.info, infoBlock.imagePath, infoBlock.isEditable);
        }
    );
}

infoBlockView.update = function(infoObj) {
   
}

infoBlockView.onUpdate = function() {
    $("#input_field_command")[0].value = "";
    const infoObjects_from_localStorage = infoBlockModel.getAll();
    infoBlockModel.saveInStorage(infoObjects_from_localStorage);
    // Refresh data list.
    infoBlockModel.infoBlocks_on_page = infoBlockView.showInfoBlocksOnPages(infoObjects_from_localStorage);
    infoBlockModel.showed_infoObjects = infoObjects_from_localStorage;

    // Scroll top.
    scrollView.scrollTo();
}

infoBlockView.clearInfoBlocksArea = function() {
    // Clear infoblocks.
    $('.infoBlocks_container')[0].innerHTML = "";
    // Clear dots container.
    //$(".dots").empty();
    //$(".dots").hide();
    // Clear text page container.
    clearPageNumberText();
    // Clear arrows container.
    $(".page_control_elements").hide();
}




infoBlockView.showInfoBlocksOnPages = function(infoBlocks_to_show) {
    // IF infoBLocks in parameter THEN return emty array.
    if ( ! infoBlocks_to_show) { 
        console.log("infoBlocks_to_show", infoBlocks_to_show);
        return [];
    }

    label_help.innerText = "Found " + infoBlocks_to_show.length + " Info-Blocks | " + "Data storage: " + STORAGE[siteSettingsModel.get().storage];  

   this.clearInfoBlocksArea();

    infoBlocks_area.page_curr = 1;
    const max_count_pages_infoBlocks_on_page = 12;
    const infoBlocks_on_page = {}; 
   
    let i_infoBlock_container = 0;
    infoBlocks_on_page[i_infoBlock_container] = [];
    let number_infoBlock_curr = 0;


    // Push infoObjects to array sepparate by pages.
    for (i_obj in infoBlocks_to_show) {
        infoBlocks_on_page[i_infoBlock_container].push(infoBlocks_to_show[i_obj]);
        number_infoBlock_curr = Number(i_obj) + 1;
        //console.log(number_infoBlock_curr + "%" + max_count_pages_infoBlocks_on_page, infoBlocks_to_show[i_obj]);

        if ((number_infoBlock_curr != infoBlocks_to_show.length) && (number_infoBlock_curr % max_count_pages_infoBlocks_on_page === 0)) {
            //console.log("!!!");
            //console.log(i_obj);
            i_infoBlock_container++;
            infoBlocks_on_page[i_infoBlock_container] = [];
            
            let page_curr_for_infoBlock_containers = i_infoBlock_container + 1;
            //console.log(page_curr_for_infoBlock_containers);

            /*
            // Show dots.
            if ($(".dots").is(":hidden")) {
                let page_first = 1;
                showPageDots(page_first);
                let dot_to_active = $(".dots")[0].children[0];
                dot_to_active.className += " active";

                $(".dots").show();
            }
            */
            // .START - Show arrows.
            if ($(".page_control_elements").is(":hidden")) {
                $(".page_control_elements").show();
            }
            // .END - Show arrows.
            
            // showPageDots(page_curr_for_infoBlock_containers);
        }
    }
    
    const count_pages = Object.keys(infoBlocks_on_page).length;

    if (count_pages > 1) {
        // Set text number of page.
        let current_page = 1;
        setNumberPage(current_page, count_pages);
    }

    infoBlocks_to_show = infoBlocks_on_page[0];
    // Show infoBlocks on the first page.
    infoBlocks_area.infoBlocks.createByInfoObjects(infoBlocks_to_show);
    

    return infoBlocks_on_page;
}




function openFolder(folderObj, tags) {
    let data_to_show;
    if ( ! tags) {
        console.log("Warning! Tags for folder don't exist");
        return;
    }
  
    infoBlockView.clearInfoBlocksArea();
    $("#input_field_command")[0].value = "";
    // Get command text from input field and find possible search data.
    data_to_show = infoBlockModel.getByPhrase(tags);
    console.log("search tags", tags);
    infoBlockModel.showed_infoObjects = data_to_show;
    console.log("data_to_show", data_to_show);


    // Delete from array a folder. For don't show a folder with showed infoBlocks.
    console.log("Delete folder", data_to_show)
    let i_infoObject_to_delete = search.getIndexInfoObjByTitle(data_to_show, folderObj.title);
    console.log(i_infoObject_to_delete);
    if (i_infoObject_to_delete >= 0) {
        data_to_show.splice(i_infoObject_to_delete, 1);
    }

    // Show infoBlocks.
    //view.infoBlockView.showInfoBlocksOnPages(data_to_show);
    

    // Paste tags to input field.
    $("#input_field_command")[0].value = tags;

    focusInputField();

    // !!!
    infoBlockModel.infoBlocks_on_page = infoBlockView.showInfoBlocksOnPages(data_to_show);
    
    /*
    if (data_to_show.length === 1) {
        // Open the first infoObject

        let infoObj = data_to_show[0];
        view.infoBlockView.executeActionByObj(infoObj);
    }
    */
}

function openUrl(url) {
    // open in new tab.
    let new_tab = window.open(url, '_blank');
}


function showInfo(info, title, isHTML) {
    $('#content_executed_from_infoBlock').show();

    // Title text.
    const titleHTML = '<div class="center" style="font-size:30px"><b>' + title + '</div></b><br><br>';
    $("#content_executed_from_infoBlock").find(".title").val(title);
    // Info text.
    const infoHTML = '<div class="text_info"></div>';
    // const infoHTML = '<div class="info">' + info + '</div>';
    
    let content_to_show = "";
    content_to_show = titleHTML + infoHTML;
    $("#content_executed_from_infoBlock").find(".title").html(title);


    showContentOnPage(content_to_show, info, isHTML);
}

function showContentOnPage(content_to_show, info, isHTML = false) {
    // Hide search area with Info-Blocks.
    document.getElementById("search_area").style.display = "none";

    // Append title and html eleemtns.
    //document.getElementById("content_executed_from_infoBlock").innerHTML = content_to_show;
    $("#content_executed_from_infoBlock").find(".info").show();
    if (isHTML) {
        $("#content_executed_from_infoBlock").find(".info").html(info);
    }
    else {
        content_to_show = textAlgorithms.getConvertedTextToHTML(info);
        $("#content_executed_from_infoBlock").find(".info").text(info);
    }

    $("#content_executed_from_infoBlock").find(".info").show();
}

function onSetInfoOnPage() {
    $('#search_area').hide();
    // Hide button to add InfoBlock.
    $('#fixed_btn_plus').hide();
    // Show buttons.
    $('#fixed_elements_on_show_info').show();
}

// Show alert.
function showAlert(info, title) {
    let dialog_show_info_elem = $('#dialog_show_info');
    
    // Hide search area with Info-Blocks.
    $("#search_area").hide();

    if (typeof dialog_show_info_elem[0].showModal === "function") {
        dialog_show_info_elem[0].showModal();

        if (title) {
            // Set title of infoBlock.
            dialog_show_info_elem.find(".title")[0].innerText = title;
        }

        // Set text info.
        dialog_show_info_elem.find(".text_info")[0].innerText = info;

        blackBackgroundView.enable();
    } else {
        alert(info);
        console.log("WARNING! The <dialog> API is not supported by this browser");
    }
}



function focusInputField() {		
    $("#input_field_command")[0].focus();
    $("#input_field_command")[0].select();
    $("#input_field_command")[0].selectionStart = $("#input_field_command")[0].value.length;
}

function clearPageNumberText() {
    $(".count_pages_infoBlocks")[0].innerText = "";
}


function createInfoFieldInUpdateContainer() {
    let selected_item = $("#settings_action_block_container").find(".dropdown_select_action").find(":selected")[0];
    // Get container to add input field.
    let action_description_container = $("#settings_action_block_container").find(".action_description_container")[0];
    let title_for_container = action_description_container.value;
  
    clearContentInContainer(action_description_container);
    if ( ! selected_item) selected_item.value 
  
    if ( ! title_for_container) title_for_container = ACTION_TARGETS[selected_item.value];
    
  
    inputField.add(action_description_container, title_for_container);
}

function clearContentInContainer(container) {
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
}  

infoBlockView.showElementsToCreateInfoBlock = function() {
    onSetInfoOnPage();
    $("#elements_to_create_action-block").show();
    $("#settings_action_block_container").show();
    $("#settings_action_block_container").find(".input_field_title")[0].focus();
    this.updatePreview();
}

infoBlockView.showElementsToUpdateInfoBlock = function(infoObj) {
    let action_name = infoObj.action;
    if (action_name === 'showAlert') action_name = ACTION_NAME.showInfo;

    onSetInfoOnPage();
    $('#elements_to_update_infoBlock').show();
    $('#settings_action_block_container').show();
    $('#elements_for_delete_infoBlock').show();
    $('#settings_action_block_container').find('.input_field_title')[0].focus();

    // Set value title.
    $('#settings_action_block_container').find('.input_field_title')[0].value = infoObj.title;
    
    let tags = '';

    // Set value tags
    for (i_tag in infoObj.tags) { 
        tags += infoObj.tags[i_tag];
        if (i_tag < infoObj.tags.length - 1) {
            tags += ', ';
        }
    }

    $('#settings_action_block_container').find('.input_field_tags')[0].value = tags;
    // Set value dropdown.
    $('#settings_action_block_container').find('.dropdown_select_action').val(action_name);
    
    // Set value info.
    $('#settings_action_block_container').find('.input_field_action_description')[0].value = infoObj.info;
    
    // Set value image path.
    $('#settings_action_block_container').find('.input_field_image_path')[0].value = infoObj.imagePath;

    
    const titles_elements = $('.title_infoBlock');

    for (const title_elem of titles_elements) {
        title_elem.innerText = '"' + infoObj.title + '"';
    }00

    this.updatePreview();
};

infoBlockView.showElementsForFileManager = function() {
    onSetInfoOnPage();
    $("#elements_for_file_manager").show();
};

infoBlockView.showElementsForDataStorageManager = function() {
    onSetInfoOnPage();
    $("#elements_for_data_storage").show();
};

infoBlockView.showLogs = function() {
    onSetInfoOnPage();
    $("#elements_for_logs").show();
};

infoBlockView.showElementsForVoiceRecognitionManager = function() {
    onSetInfoOnPage();
    $("#elements_for_voice_recognition_settings").show();
};



infoBlockView.updatePreview = function() {
    const infoObj_preview = {
        title: $("#settings_action_block_container").find(".input_field_title")[0].value,
        imagePath: $("#settings_action_block_container").find(".input_field_image_path")[0].value,
    }

    infoBlock_preview.remove();

    infoBlock_preview = new InfoBlock(id_preview_create, infoObj_preview);
    infoBlock_preview.create(parent_element_for_preview_infoBlock_on_create);
}