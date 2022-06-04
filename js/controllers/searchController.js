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

    onEnter = () => {
        this.searchService.view.setTextColorInInpurField('black');
        const user_request = this.searchService.view.getTextFromMainInputField();
        
        this.searchService.setHashRequest({
            request_value: user_request, 
            is_execute_actionBlock_by_title: true
        });
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
        const that = this;

        const onKeyUpRequestField = (request, clicked_keyCode) => {
            let is_execute_actionBlock_by_title = false;

            if (clicked_keyCode === that.keyCodeByKeyName.enter) {
                is_execute_actionBlock_by_title = true;
            } else {
                is_execute_actionBlock_by_title = false;
            }

            that.pageService.setHashRequest({
                request_value: request, 
                is_execute_actionBlock_by_title: is_execute_actionBlock_by_title
            });
        }

        this.searchService.view.bindClickBtnClearRequestField(this.onClickBtnClear);
        this.searchService.view.bindClickBtnEnterRequest(this.onEnter);
        this.searchService.view.bindKeyUpRequestField(onKeyUpRequestField);
        this.searchService.view.bindKeypressInputFieldPlusTags(this.#onKeypressInputFieldPlusTags);
    }
}