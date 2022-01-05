// .START - Create 'Create command accordion container'.
const dropdown_select_action_for_create_container =  $('#settings_action_block_container').find('.dropdown_select_action');
dropdown.setOptions(dropdown_select_action_for_create_container, action_description_by_action_name);
const first_dropdown_item_text_for_create = dropdown_select_action_for_create_container[0][0].value;
const text_info_container_for_create = content_type_description_by_action[first_dropdown_item_text_for_create];
//let info_container_for_create =  $('#settings_action_block_container').find('.action_description_container')[0];
//inputField.add(info_container_for_create, text_info_container_for_create);
// .END - Create 'Create command accordion container'.


// On change value of dropdown to choose action.
$('#settings_action_block_container').find('.dropdown_select_action')[0].onchange = function () {
    const dropdown = $('#settings_action_block_container').find('.dropdown_select_action'); 
    const selected_item = dropdown.find(':selected')[0];
    $('#title_action_descritption').text(content_type_description_by_action[selected_item.value]);
    
    infoBlockController.action_for_new_actionBlock = selected_item.value;
}



// Parameters: container - where to paste input field, dropdown - create input field by selected item.
function createInfoField(container, dropdown) {
    const selected_item = dropdown.find(':selected')[0];
    // Get container to add input field.
    const action_description_container = container.find('.action_description_container')[0];
    let text_for_input_field_info = container.find('.action_description_container')[0].value;
    if ( ! text_for_input_field_info) text_for_input_field_info = '';
    clearContentInContainer(action_description_container);
    const title_info_container = content_type_description_by_action[selected_item.value];
    inputField.add(action_description_container, title_info_container, text_for_input_field_info);
}