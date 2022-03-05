class SearchController {
    constructor(observable, textAlgorithm) {
        this.observable = observable;
        this.textAlgorithm = textAlgorithm;

        this.view = new SearchView(this, textAlgorithm);

        this.view.onStart();

        this.#setEventListeners();
        this.#bindViewEvenets();

        this.init();
    }

    init() {
        const that = this;
        this.view.bindKeyUpRequestField(that.#onKeyUpRequestField);
    }

    
    onClickBtnSearchByTags(handler) {
        this.view.bindClickBtnSearchByTags((user_plus_tags, user_minus_tags) => handler(user_plus_tags, user_minus_tags));
    }

    // Show infoBlocks by user_phrase.
    onEnter = (is_execute_actionBlock_by_title = true) => {
        const request = this.view.getUserRequest();

        const event = {
            name: 'requestEntered',
            data: {
                request: request,
                is_execute_actionBlock_by_title: is_execute_actionBlock_by_title
            }
        };

        observable.dispatchEvent(event.name, event.data);
    }

    onClear = () => {
        this.view.clear();
        
        observable.dispatchEvent('btnClearRequestFieldClicked', 'Button Clear Request Field Clicked');
    }

    focus() {
        this.view.focus();
    }

    #setEventListeners() {
        const that = this;

        setObservableListeners();
      

        function setObservableListeners() {
            that.observable.listen('actionBlockFolderExecuted', function(observable, eventType, data) {
                that.view.setTextToInputField(data.tags)
                that.view.focus();
            });

            that.observable.listen('fileActionBlocksUploaded', function(observable, eventType, data) {
                that.view.clear();
            });

            
            that.observable.listen('hashChanged', function(observable, eventType, data){
                let request = '';

                if (window.location.hash.includes('#request')) {
                    request = getRequestFromHash();
                }

                function getRequestFromHash() {
                    const text_to_cut = window.location.hash;
                    const from_character_request = '=';

                    let is_execute_actionBlock_by_title = false;

                    if (window.location.hash.includes('&executebytitle')) {
                        is_execute_actionBlock_by_title = false;
                        const to_character_request = '&executebytitle';
                        request = that.textAlgorithm.getCuttedText(text_to_cut, from_character_request, to_character_request);
                    }
                    else {
                        request = that.textAlgorithm.getCuttedText(text_to_cut, from_character_request);
                    }

                    request = that.textAlgorithm.replaceSymbols(request, '%20', ' ');

                    return request;
                }

                $('#input_field_request').val(request);
                
            });
        }
    }

    #onKeyUpRequestField = (request, clicked_keyCode) => {
        const that = this;

        const event = {
            name: 'keyUpOnRequestFieldPressed',
            data: {
                request: request,
                keyCode: clicked_keyCode,
                log: 'Key Up On Request Field Pressed, keyCode' + clicked_keyCode
            }
        };

        that.observable.dispatchEvent(event.name, event.data);
    }

    #bindViewEvenets() {
        this.view.bindClickBtnClearRequestField(this.onClear);
        this.view.bindClickBtnEnterRequest(this.onEnter);
        
    }
}