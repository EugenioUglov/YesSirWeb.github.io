const dropdown = {};

dropdown.setOptions = function(dropDown, options) {
    for (let x in options) {
        let i_addElement = dropDown[0].options.length;
        dropDown[0].options[i_addElement] = new Option(options[x], options[x]);
        dropDown[0].options[i_addElement].value = x;
    }
}