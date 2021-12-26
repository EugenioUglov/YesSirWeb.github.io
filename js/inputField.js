const inputField = {};

inputField.add = function(parent, title, text = "", placeholderText = "...") {
    // Number of inputs to create.
    let number = 1;
  
    // Append a node with a text.
    // let text_for_action_input_field = document.createTextNode("Member " + (i+1));
    // console.log(text_for_action_input_field);
    //parent.append("<div align='left'>" + text_for_action_input_field + "</div>");
    $('#title_action_descritption').text(title)
    //$('<div class="text_title_for_input_field title_action_descritption">' + title + '</div>').appendTo(parent);
    // Create an <input> element, set its type and name attributes
    //const action_description_container = $('<textarea class="action_description_container interactive_field resize_field" rows=4 value ="' + text + 
     //   '" placeholder="' + placeholderText + '"></textarea>').appendTo(parent);
    //action_description_container[0].value = text;
    /*
    let input = document.createElement("input");
    console.log(input);
    input.type = "text";
    input.name = "member" + i;
    input.placeholder = "..."; 
    parent.appendChild(input);
    */
    // Append a line break 
    //parent.appendChild(document.createElement("br"));

    /* textAreaResizer.update(); */
}