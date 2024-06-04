class ActionBlockNoteCommands {
    #commandObject = {
        openPageToEditActionBlock: {
            title: 'Open page to Edit Action-Block', 
            executeHandler: () => {
                // Clear executed content.
                $("#content_executed_from_actionBlock").hide();
        
                const title = $("#content_executed_from_actionBlock")
                    .find(".title")
                    .text();
                
                yesSir.actionBlockService.openActionBlockSettings(title);
                
                this.#onCommandEntered();
            }
        },
        turnOnQuickEdit: {
            title: 'Turn on quick edit', 
            executeHandler: () => {
                $('#btn_quick_update_actionBlock').show();
        
                $('#content_executed_from_actionBlock .content').attr('contenteditable', 'true');
        
                $('#content_executed_from_actionBlock .note_title').attr('contenteditable', 'true');

                // Refresh current command list.
                delete this.#currentCommandObject.turnOnQuickEdit;
                this.#currentCommandObject.turnOffQuickEdit = this.#commandObject.turnOffQuickEdit;

                this.#inputFieldWithSuggestions.setOptions({optionObjects: this.getCurrentCommandObjects()});
                //
                
                this.#onCommandEntered();
            }
        },
        turnOffQuickEdit: {
            title: 'Turn off quick edit', 
            executeHandler: () => {
                $('#btn_quick_update_actionBlock').hide();
        
                $('#content_executed_from_actionBlock .content').attr('contenteditable', 'false');
        
                $('#content_executed_from_actionBlock .note_title').attr('contenteditable', 'false');
                
                // Refresh current command list.
                this.#onCommandEntered();

                delete this.#currentCommandObject.turnOffQuickEdit;
                this.#currentCommandObject.turnOnQuickEdit = this.#commandObject.turnOnQuickEdit;

                this.#inputFieldWithSuggestions.setOptions({optionObjects: this.getCurrentCommandObjects()});
                //
                
                this.#onCommandEntered();
            }
        }
    };
    

    #currentCommandObject = {
        openPageToEditActionBlock: this.#commandObject.openPageToEditActionBlock, 
        turnOnQuickEdit: this.#commandObject.turnOnQuickEdit
    };

    #inputFieldWithSuggestions;


    constructor(inputFieldWithSuggestions) {
        this.#inputFieldWithSuggestions = inputFieldWithSuggestions;
    }

    getCurrentCommandObjects() {
        const commandObjects = [];

        for (const commandKey of Object.keys(this.#currentCommandObject)) {
            commandObjects.push(this.#currentCommandObject[commandKey]);
        }

        return commandObjects;
    }

    #onCommandEntered() {
        $('.inputFieldWithSuggestions').val('');
    }
}