class DropdownManager {
    setOptions = function(dropdown, options) {
        for (let x in options) {
            let i_addElement = dropdown.options.length;
            dropdown.options[i_addElement] = new Option(options[x], options[x]);
            dropdown.options[i_addElement].value = x;
        }
    }
}