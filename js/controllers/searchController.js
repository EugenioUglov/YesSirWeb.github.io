class SearchController {
    constructor(searchService, actionBlockService, pageService, textManager, keyCodeByKeyName) {
        this.searchService = searchService;
        this.actionBlockService = actionBlockService;
        this.pageService = pageService;
        this.textManager = textManager;
        this.keyCodeByKeyName = keyCodeByKeyName;

        //this.searchService.view = new SearchView(this, textManager);
        console.log('searchService', this.searchService);

        this.#setEventListeners();
        this.#bindViewEvenets();

        this.init();
    }

    init() {
        const that = this;
        this.searchService.view.bindClickBtnSearchByTags((user_plus_tags, user_minus_tags) => onClickBtnSearchByTags(user_plus_tags, user_minus_tags));
        
        function onClickBtnSearchByTags(user_plus_tags, user_minus_tags) {
            that.actionBlockService.showActionBlocksByTags(user_plus_tags, user_minus_tags);
        }
    }

    // Show infoBlocks by user_phrase.
    onEnter = (is_execute_actionBlock_by_title = true) => {
        this.searchService.view.onEnter();
        const request = this.searchService.view.getUserRequest();

        if (request === '') {
            this.pageService.openMainPage();
            return;
        }
        
        window.location.hash = '#request=' + $('#input_field_request').val() + '&executebytitle=true';
    }

    onClickBtnClear = () => {
        this.searchService.view.clear();
        this.pageService.openMainPage();
    }


    #onKeypressInputFieldPlusTags = (event) => {
        const that = this;
        // Enter.
        if (event.keyCode == 13)  {
            event.preventDefault();

            that.searchService.view.focusInputFieldMinusTags();
        }
    }

    #setEventListeners() {
        const that = this;

        document.addEventListener('keyup', function(event) {
            if (event.code == 'Slash') {
                that.searchService.view.focus();
            }
        });
    }

    #bindViewEvenets() {
        const onKeyUpRequestField = (request, clicked_keyCode) => {
            const that = this;

            if (clicked_keyCode === that.keyCodeByKeyName.enter) {
                const is_execute_actionBlock_by_title = true;
    
                window.location.hash = '#request=' + request + '&executebytitle=' + is_execute_actionBlock_by_title;
            }
            else {
                const is_execute_actionBlock_by_title = false;
                window.location.hash = '#request=' + request + '&executebytitle=' + is_execute_actionBlock_by_title;
            }
        }

        this.searchService.view.bindClickBtnClearRequestField(this.onClickBtnClear);
        this.searchService.view.bindClickBtnEnterRequest(this.onEnter);
        this.searchService.view.bindKeyUpRequestField(onKeyUpRequestField);
        this.searchService.view.bindKeypressInputFieldPlusTags(this.#onKeypressInputFieldPlusTags);
    }

 
}