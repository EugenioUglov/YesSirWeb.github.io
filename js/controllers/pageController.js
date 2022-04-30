class PageController {
    constructor(pageService, actionBlockController, actionBlockService, textManager, observable) {
        this.pageService = pageService;
        this.actionBlockController = actionBlockController;
        this.actionBlockService = actionBlockService;
        this.textManager = textManager;
        this.observable = observable;

        this.#setListeners();
    }



    #setListeners() {
        const that = this;

        window.onhashchange = function() {
            that.#onHashChanged();
        }  

        return;

        that.observable.listen('actionBlocksLoaded', function(observable, eventType, data) {
            onActionBlocksLoaded();
        });


        function onActionBlocksLoaded() {
            that.#onHashChanged();
        
            window.onhashchange = function() {
                that.#onHashChanged();
            }  
        }
    }

    #onHashChanged() {
        const that = this;

        if (this.pageService.getHashChangeListenerActiveState() === false) return;
        console.log('onHashChanged()');
        this.pageService.handleHash();

        // that.actionBlockService.view.clear();


        // if (window.location.hash === '#main' || window.location.hash === '' || window.location.hash === '#undefined') {
        //     that.pageService.openMainPage();

        //     // if (that.actionBlockService.getActionBlocks().size > 0) {
        //     //     that.actionBlockService.view.onOpenMainPageWithActionBlocks();
        //     //     that.actionBlockService.showActionBlocks();
        //     // }
        //     // else {
        //     //     that.actionBlockService.view.onOpenMainPageWithoutActionBlocks();
        //     // }
            
        //     // that.actionBlockService.view.onShowMainPage();
        // }
        // // else if (window.location.hash.includes('#showActionBlocksFromStorage')) {
        // //     that.actionBlockService.showActionBlocksFromStorage();
        // // }
        // else if (window.location.hash.includes('#request')) {
        //     let request = '';
        //     const text_to_cut = window.location.hash;
        //     const from_character_request = '=';

        //     let is_execute_actionBlock_by_title = false;

        //     if (window.location.hash.includes('executebytitle=false')) {
        //         const to_character_request = '&executebytitle';
        //         request = that.textManager.getCuttedText(text_to_cut, from_character_request, to_character_request);
        //         $('#input_field_request')[0].style.color = 'gray';

        //     }
        //     else if (window.location.hash.includes('executebytitle=true') || window.location.hash.includes('executebytitle')) {
        //         console.log('executebytitle=true');
        //         is_execute_actionBlock_by_title = true;
        //         const to_character_request = '&executebytitle';
        //         request = that.textManager.getCuttedText(text_to_cut, from_character_request, to_character_request);
        //         $('#input_field_request')[0].style.color = 'black';
        //     }
        //     else {
        //         request = that.textManager.getCuttedText(text_to_cut, from_character_request);
        //     }

        //     request = decodeURIComponent(request);
        //     that.actionBlockService.showActionBlocksByRequest(request, is_execute_actionBlock_by_title);

        //     $('#input_field_request').val(request);
            
        //     // request = that.textManager.replaceSymbols(request, '%20', ' ');

        //     // const last_character_of_requets = request.slice(-1);;

        //     // if (last_character_of_requets === ' ') {
        //     //     is_execute_actionBlock_by_title = false;
        //     // }
        // }
    }
}
