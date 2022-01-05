class SearchController {
    constructor() {
        this.view = new SearchView();

        // Set text gray in input field command.
        $('#input_field_request')[0].style.color = 'gray';

    }

    searchByCommand(command, is_execute_actionBlock_by_title = true) {
        $('.icon_spinner').show();
        $('.actionBlocks_container').hide();
        
        let actionBlocks_to_show;

        console.log('command', command);

        if ( ! command) {
            console.log('This is not a command');

            // Show all infoBlocks.
    
            actionBlocks_to_show = actionBlockController.getActionBlocks();
            console.log('actionBlocks_to_show', actionBlocks_to_show);
    
        
            // Show data in images.
            infoBlockModel.infoBlocks_on_page = actionBlockController.showActionBlocks(actionBlocks_to_show);
        }
        else {
            // Show infoBlocks by user phrase.
    
            // Get command text from input field and find possible search data.
            actionBlocks_to_show = infoBlockModel.getByPhrase(command);
    
        
            if ( ! actionBlocks_to_show) {
                actionBlocks_to_show = [];
            }
    
            // Show infoBlocks separated by pages.
            infoBlockModel.infoBlocks_on_page = actionBlockController.showActionBlocks(actionBlocks_to_show);
            
           
            if (is_execute_actionBlock_by_title) {
                // IF ActionBlock has been found with the same title THEN execute action.
                for (const actionBlock of actionBlocks_to_show) {
                    if (textAlgorithm.isSame(actionBlock.title, command)) {
                        actionBlockController.executeActionBlock(actionBlock);
                        
                        break;
                    }
                }
            }
    
            // IF has been found just one infoObject THEN execute action.
            /*
            if (actionBlocks_to_show.length === 1) {
                let infoObj = actionBlocks_to_show[0];
                actionBlockController.executeActionBlock(infoObj);
            }
            */
        }
    }

    focus() {
        this.view.focus();
    }
}

// Show infoBlocks by user_phrase.
function onEnterCommand(is_execute_actionBlock_by_title = true) {
    const user_phrase = $('#input_field_request')[0].value;
    // Set color of text in input field command to black.
    $('#input_field_request')[0].style.color = 'black';
    searchController.searchByCommand(user_phrase, is_execute_actionBlock_by_title);
}

function onClear() {
    actionBlockController.clearInfoBlocksArea();
    $('#input_field_request')[0].value = '';
    
    const actionBlocks = actionBlockController.getActionBlocks(); //infoBlockModel.getAll(); 
    actionBlockController.showActionBlocks(actionBlocks);
}

// Execute a function when the user releases a key on the keyboard
$('#input_field_request')[0].addEventListener('keyup', function(e) {
    if (e.keyCode === keyCodeByKeyName.space) {
        const is_execute_actionBlock_by_title = false;
        onEnterCommand(is_execute_actionBlock_by_title);
    }
    else if (e.keyCode === keyCodeByKeyName.enter) {
        onEnterCommand();
    } 
});

/*execute a function when someone writes in the text field:*/
$('#input_field_request')[0].addEventListener('input', function(e) {
    let lastCharacter = e.data;
    
    $('#input_field_request')[0].style.color = 'gray';

    if (lastCharacter == ' ') {
        const is_execute_actionBlock_by_title = false;
        onEnterCommand(is_execute_actionBlock_by_title);
    }
   // view.closeAllLists();
});




// IF mouse over input field THEN set new title with text inside input field
$('#input_field_request')[0].addEventListener('mouseenter', function( event ) {
    $(this).attr('title', input_field_request.value);
});

$('#btn_accept_command')[0].addEventListener('click', onEnterCommand);
$('#btn_clear_input_field_request')[0].addEventListener('click', onClear);

function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "view-active":*/
    x[currentFocus].classList.add('autocomplete-active');
}

function removeActive(x) {
    /*a function to remove the "active" class from all view items:*/
    for (let i = 0; i < x.length; i++) {
        x[i].classList.remove('autocomplete-active');
    }
}