// Show infoBlocks by user_phrase.
function onEnterCommand(isExecuteInfoBlockByTitle = true) {
    const user_phrase = $("#input_field_command")[0].value;
    // Set color of text in input field command to black.
    $("#input_field_command")[0].style.color = "black";
    infoBlockSearcher.searchByCommand(user_phrase, isExecuteInfoBlockByTitle);
}

function onClear() {
    infoBlockView.clearInfoBlocksArea();
    $("#input_field_command")[0].value = "";

    $("#input_field_command")[0].value = "";
    let infoObjects_from_localStorage = infoBlockModel.getAll();
    infoBlockModel.infoBlocks_on_page = infoBlockView.showInfoBlocksOnPages(infoObjects_from_localStorage);
    infoBlockModel.showed_infoObjects = infoObjects_from_localStorage;
}

// Execute a function when the user releases a key on the keyboard
$("#input_field_command")[0].addEventListener("keyup", function(e) {
    let isCommandInputFieldEmpty = $("#input_field_command")[0].value == "";

    if (isCommandInputFieldEmpty) {
        let isExecuteInfoBlockByTitle = false;
        onEnterCommand(isExecuteInfoBlockByTitle);
    }

    if (e.keyCode === keyName.Enter) {
        onEnterCommand();
    } 
});

/*execute a function presses a key on the keyboard:*/
$("#input_field_command")[0].addEventListener("keydown", function(e) {
    let x = document.getElementById(this.id + "view-list");
    if (x) x = x.getElementsByTagName("div");


    if (e.keyCode == keyCodeByKeyName.arrowDown) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus letiable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
    } else if (e.keyCode == keyCodeByKeyName.arrowUp) { 
        /*If the arrow UP key is pressed,
        decrease the currentFocus letiable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
    } else if (e.keyCode == keyCodeByKeyName.enter) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        console.log("Enter pressed ???");
        e.preventDefault();
        if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
        }
    }
});

/*execute a function when someone writes in the text field:*/
$("#input_field_command")[0].addEventListener("input", function(e) {
    let lastCharacter = e.data;
    label_help.innerText = "";
    $("#input_field_command")[0].style.color = "gray";

    if (lastCharacter == " ") {
        let isExecuteInfoBlockByTitle = false;
        onEnterCommand(isExecuteInfoBlockByTitle);
    }
   // view.closeAllLists();
});

$("#input_field_command")[0].onfocus = () => {
    $("#autocomplete")[0].style.boxShadow = "0px 0px 5px 1px #4285f4"; 
    $("#autocomplete")[0].style.webkitBoxShadow =  "0px 0px 5px 2px #4285f4";
    $("#autocomplete")[0].style.mozBoxShadow = "0px 0px 5px 2px #4285f4";
}

$("#input_field_command").focusout(function(){
    $("#autocomplete")[0].style.boxShadow = null;
    $("#autocomplete")[0].webkitBoxShadow =  null;
    $("#autocomplete")[0].mozBoxShadow =  null;
});


// IF mouse over input field THEN set new title with text inside input field
$("#input_field_command")[0].addEventListener("mouseenter", function( event ) {
    $(this).attr('title', input_field_command.value);
});



$("#btn_clear_input_field_command").click(function(){
    $("#input_field_command")[0].focus();
});

$("#btn_accept_command").click(function(){
    $("#input_field_command")[0].focus();
});


$("#btn_voice_recognition").click(function(){
    $("#input_field_command")[0].focus();
});

$("#btn_accept_command")[0].addEventListener("click", onEnterCommand);
$("#btn_clear_input_field_command")[0].addEventListener("click", onClear);

function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "view-active":*/
    x[currentFocus].classList.add("autocomplete-active");
}

function removeActive(x) {
    /*a function to remove the "active" class from all view items:*/
    for (let i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
    }
}