class ActionBlockNoteCommands {
    #viewElement = {
        inputFieldWithSuggestions: $('.inputFieldWithSuggestions'),
        contentExecutedFromActionBlock: $("#content_executed_from_actionBlock"),
        btnQuickUpdateActionBlock: $('#btn_quick_update_actionBlock'),
        title: $('#content_executed_from_actionBlock .note_title'),
        content: $('#content_executed_from_actionBlock .content'),
    };

    #commandObject = {
        openPageToEditActionBlock: {
            title: 'Open page to Edit Action-Block', 
            executeHandler: () => {
                // Clear executed content.
                this.#viewElement.contentExecutedFromActionBlock.hide();
        
                const title = this.#viewElement.contentExecutedFromActionBlock
                    .find(".title")
                    .text();
                
                yesSir.actionBlockService.openActionBlockSettings(title);
                
                this.#onCommandEntered();
            }
        },
        turnOnQuickEdit: {
            title: 'Turn on quick edit', 
            executeHandler: () => {
                this.#viewElement.btnQuickUpdateActionBlock.show();
        
                this.#viewElement.title.attr('contenteditable', 'true');
                this.#viewElement.content.attr('contenteditable', 'true');

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
                this.#viewElement.btnQuickUpdateActionBlock.hide();
        
                this.#viewElement.title.attr('contenteditable', 'false');
                this.#viewElement.content.attr('contenteditable', 'false');

                // Refresh current command list.
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
        this.#viewElement.inputFieldWithSuggestions.val('');
    }
}