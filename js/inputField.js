const inputField = {};

inputField.add = function(to, title, text = "", placeholderText = "...") {
    // Number of inputs to create.
    let number = 1;
    // Container <div> where dynamic content will be placed.
    let container = to;
  
    for (i = 0; i < number; i++) {
        // Append a node with a text
        // let text_for_action_input_field = document.createTextNode("Member " + (i+1));
        // console.log(text_for_action_input_field);
        //container.append("<div align='left'>" + text_for_action_input_field + "</div>");
        $("<br><div align='center'>" + title + "</div>").appendTo(container);
        // Create an <input> element, set its type and name attributes
        let input_field_info = $('<textarea class="input_field_info interactive_field resize_field" rows=4 value ="' + text + '" placeholder="' + placeholderText + '"></textarea>').appendTo(container);
        input_field_info[0].value = text;
        /*
        let input = document.createElement("input");
        console.log(input);
        input.type = "text";
        input.name = "member" + i;
        input.placeholder = "..."; 
        container.appendChild(input);
        */
        // Append a line break 
        container.appendChild(document.createElement("br"));
    }

    /* textAreaResizer.update(); */
}