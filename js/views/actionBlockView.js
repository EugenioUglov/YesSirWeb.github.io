class ActionBlockView {
    constructor(controller) {
        this.controller = controller;
        this.setEventListeners();
    }

    addOnPage(id, actionBlock, parent_element = $('.actionBlocks_container').first(), isEditable = true) {
        console.log('add on page block', actionBlock);
        console.log('with ID', id);
        const actionBlock_html = this.#createHTMLContainerActionBlock(id, actionBlock, isEditable);

        // Add ActionBlock to parent element.
        parent_element.append(actionBlock_html);
        // Search for last actionBlock.
        const actionBlock_container = parent_element.children().last();

        return actionBlock_container;
    }

    updatePreview() {
        const actionBlock_preview = {
            title: $('#settings_action_block_container').find('.input_field_title')[0].value,
            imagePath: $('#settings_action_block_container').find('.input_field_image_path')[0].value
        };
        
        // Set default values.
        $('#infoBlockPreview').find('.title')[0].innerText = '';
        $('#infoBlockPreview').find('.img').removeAttr('src');


        $('#infoBlockPreview').find('.title')[0].innerText = actionBlock_preview.title;
        
        if (actionBlock_preview.imagePath)
            $('#infoBlockPreview').find('.img').attr('src', actionBlock_preview.imagePath);
    }

    showElementsToCreateInfoBlock() {
        $('#btn_close').show();
        $('#elements_to_create_action-block').show();
        $('#settings_action_block_container').show();
        $('#settings_action_block_container').find('.input_field_title')[0].focus();
        this.updatePreview();
        this.#onShowElementsToUpdateActionBlock();
    }

    showElementsToUpdateInfoBlock(actionBlock) {
        let action_name_of_actionBlock = actionBlock.action;
        console.log('actionBlock', actionBlock);
        console.log('action name before', action_name_of_actionBlock);
        if (action_name_of_actionBlock === 'showAlert') action_name_of_actionBlock = action_name.showInfo;

        console.log('action name after', action_name_of_actionBlock);

        console.log('type action', typeof action_name_of_actionBlock);

        $('#btn_close').show();
        $('#elements_to_update_infoBlock').show();
        $('#settings_action_block_container').show();
        $('#elements_for_delete_infoBlock').show();
        $('#settings_action_block_container').find('.input_field_title')[0].focus();

        // Set value title.
        $('#settings_action_block_container').find('.input_field_title')[0].value = actionBlock.title;
        
        let tags = '';

        // Set value tags
        for (const i_tag in actionBlock.tags) { 
            tags += actionBlock.tags[i_tag];
            if (i_tag < actionBlock.tags.length - 1) {
                tags += ', ';
            }
        }

        $('#settings_action_block_container').find('.input_field_tags')[0].value = tags;
        console.log('action_name', action_name_of_actionBlock);

        // Set value dropdown.
        $('#settings_action_block_container').find('.dropdown_select_action').val(action_name_of_actionBlock);
        console.log('dropdown select action', $('#settings_action_block_container').find('.dropdown_select_action').val());

        
        // Set value info.
        $('#settings_action_block_container').find('.input_field_action_description')[0].value = actionBlock.info;
        
        // Set value image path.
        $('#settings_action_block_container').find('.input_field_image_path')[0].value = actionBlock.imagePath;

        
        const titles_elements = $('.title_infoBlock');

        for (const title_elem of titles_elements) {
            title_elem.innerText = actionBlock.title;
        }

        this.updatePreview();
        this.#onDropdownActionValueChange()
    }

    fixed_btn_plus = {
        rotateIcon() {
            const icon_plus = document.querySelector('.ico-btn');
            icon_plus.classList.toggle('is-active');
        }
    }

    onPageContentChange() {
        const icon_plus = document.querySelector('.ico-btn');

        // Hide button to add ActionBlock.
        $('#fixed_btn_plus').css('visibility', 'hidden');
        $('#list_of_type_action-blocks_to_create').hide();
        
        $('#search_area').hide();
        
        if (icon_plus.classList.contains('is-active')) { 
            this.fixed_btn_plus.rotateIcon();
        }
    }

    clearInfoBlocksArea = function() {
        // Clear infoblocks.
        $('.actionBlocks_container')[0].innerHTML = "";
        // Clear dots container.
        //$('.dots').empty();
        //$('.dots').hide();
        // Clear text page container.
        clearPageNumberText();
        // Clear arrows container.
        $('.page_control_elements').hide();
    }

    setEventListeners() {
        $('#btn_create_infoBlock').on('click', () => this.controller.onClickBtnCreateActionBlock());
        $('#btn_update_infoBlock').on('click', () => this.controller.updateActionBlock());
        $('#fixed_btn_plus').on('click', () => { this.controller.onClickFixedBtnPlus(); $('#welcome_page').hide();});
        $('#btn_create_note').on('click', () => this.controller.showSettingsForNoteActionBlock());
        $('#btn_create_link').on('click', () => this.controller.showSettingsForLinkActionBlock());
        $('#btn_create_folder').on('click', () => this.controller.showSettingsForFolderActionBlock());
        $('#btn_create_advanced_action-block').on('click', () => this.controller.showSettingsForAdvancedActionBlock());
        $('#btn_delete_infoBlock').on('click', () => this.controller.onClickBtnDeleteInfoBlock());
        $('#settings_action_block_container').find('.input_field_title').on('input', () => this.controller.updatePreview());
        $('#settings_action_block_container').find('.input_field_image_path').on('input', () => this.controller.updatePreview());

        $('.btn_save').on('click', () => { $('#btn_back_main').hide(); infoPageView.close(); });
    }


    #createHTMLContainerActionBlock = function(id, infoObj, isEditable = true) {
        this.id = id;
        this.infoObj = infoObj;
        this.title = infoObj.title;
        this.is_folder = infoObj.action === action_name.openFolder;
        this.imagePath = infoObj.imagePath;

        this.infoBlock_container;

        let title_html = '';

        if ( ! this.id) {
            console.log('ERROR! Id must be defined to create infoBlock'); 
            return;
        }

        if (this.title != undefined) {
            title_html = '<div class="title">' + this.title + '</div>';
        }

                
        let img_div_html = '';
        let folder_elem = '';
        let is_padding_top = false;
        const settings_html = '<div class="settings"><div class="icon"></div></div>';


        if (this.imagePath) {
            img_div_html = '<img class="img" src="' + this.imagePath + '">';
        }
        else {
            this.imagePath = '';
            img_div_html = '<img class="img">';
        }
        /*
        else {
            is_padding_top = true;
        }
        */

        if (this.is_folder)
        {
            folder_elem = '<div class="folder"></div>';
        }
        
        this.id_html = 'infoBlock' + this.id; // this.title.replaceAll(' ', '_');

        let perspective_container_html = '<div id="' + this.id_html + '" class="perspective_img_effect_container">';
    
        let first_part_infoBlock_html = '';

        first_part_infoBlock_html = '<div id="' + this.id_html +  '" class="infoBlock">';

        // Set padding from settings button.
        /*
        if (is_padding_top) {
            first_part_infoBlock_html = '<div id="' + this.id_html +  '" class="infoBlock" style="padding-top:30px">';
        }
        else {
            first_part_infoBlock_html = '<div id="' + this.id_html +  '" class="infoBlock">';
        }
        */

        if (isEditable) {
            this.infoBlock_html = first_part_infoBlock_html + folder_elem + settings_html + img_div_html  + title_html +'</div>';
        }
        else {
            this.infoBlock_html = first_part_infoBlock_html + folder_elem + img_div_html  + title_html +'</div>';
        }

        return this.infoBlock_html;
    }

    #onShowElementsToUpdateActionBlock() {
        // Select first item in dropdown for choose action.
        $('#settings_action_block_container').find('.dropdown_select_action')[0].selectedIndex = 0;
        this.#onDropdownActionValueChange();
    }

    #onDropdownActionValueChange() {
        let dropdown = $("#settings_action_block_container").find(".dropdown_select_action"); 
        const selected_item = dropdown.find(":selected")[0];
        $('#title_action_descritption').text(content_type_description_by_action[selected_item.value]);
        
        infoBlockController.action_for_new_actionBlock = selected_item.value;
    }
}




function openUrl(url) {
    // open in new tab.
    let new_tab = window.open(url, '_blank');
}


function showInfo(info, title, isHTML) {
    // Title text.
    const titleHTML = '<div class="center" style="font-size:30px"><b>' + title + '</div></b><br><br>';
    $('#content_executed_from_infoBlock').find('.title').val(title);
    // Info text.
    const infoHTML = '<div class="text_info"></div>';
    // const infoHTML = '<div class="info">' + info + '</div>';
    
    let content_to_show = "";
    content_to_show = titleHTML + infoHTML;
    $('#content_executed_from_infoBlock').find('.title').html(title);


    showContentOnPage(content_to_show, info, isHTML);
}

function showContentOnPage(content_to_show, info, isHTML = false) {
    $('#btn_close').show();
    $('#content_executed_from_infoBlock').show();
    
    // Hide search area with Info-Blocks.
    //document.getElementById('search_area').style.display = "none";
    

    // Append title and html elements.
    //document.getElementById('content_executed_from_infoBlock').innerHTML = content_to_show;
    $('#content_executed_from_infoBlock').find('.info').show();
    if (isHTML) {
        $('#content_executed_from_infoBlock').find('.info').html(info);
    }
    else {
        content_to_show = textAlgorithm.getConvertedTextToHTML(info);
        $('#content_executed_from_infoBlock').find('.info').text(info);
    }

    $('#content_executed_from_infoBlock').find('.info').show();
}


function showAlert(info, title) {
    let dialog_info_elem = $('#dialog_info');
    
    // Hide search area with Info-Blocks.
    $('#search_area').hide();

    if (typeof dialog_info_elem[0].showModal === 'function') {
        dialog_info_elem[0].showModal();

        if (title) {
            // Set title of infoBlock.
            dialog_info_elem.find('.title')[0].innerText = title;
        }

        // Set text info.
        dialog_info_elem.find('.text_info')[0].innerText = info;

        blackBackgroundView.enable();
    } else {
        alert(info);
        console.log('WARNING! The <dialog> API is not supported by this browser');
    }
}



function focusInputField() {		
    $('#input_field_request')[0].focus();
    $('#input_field_request')[0].select();
    $('#input_field_request')[0].selectionStart = $('#input_field_request')[0].value.length;
}

function clearPageNumberText() {
    if ($('.count_pages_infoBlocks')[0]) $('.count_pages_infoBlocks')[0].innerText = "";
}