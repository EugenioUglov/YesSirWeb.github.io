function activateAllAccordions() {
    let acc = document.getElementsByClassName("accordion");

    for (let i = 0; i < acc.length; i++) {
        acc[i].onclick = function () {
            this.classList.toggle("active");
            this.nextElementSibling.classList.toggle("show");
        }
    }
}

/*
// .START (Create "Update command accordion container")
let dropdown_select_action_for_update = $("#settings_action_block_container").find(".dropdown_select_action");
dropdown.setOptions(dropdown_select_action_for_update, action_description_by_action_name);
let first_dropdown_item_text_for_update = dropdown_select_action_for_update[0][0].value;
let text_info_container_for_update = content_type_description_by_action[first_dropdown_item_text_for_update];
let info_container_update = $("#settings_action_block_container").find(".action_description_container")[0];
inputField.add(info_container_update, text_info_container_for_update);
// .END (Create "Update command accordion container")
*/