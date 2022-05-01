class PageService {
    #hash_previous;

    constructor(textManager) {
        this.textManager = textManager;

        this.#hash_previous;
    }

    #actionBlockService;
    #is_hash_change_listener_active_state_enabled = false;
    #current_page_name = 'main';

    #pageNameEnum = {
        main: 'main',
        settingsActionBlock: 'settingsActionBlock',
        contentActionBlock: 'contentActionBlock'
    };


    init() {
        if (window.location.hash.includes('#settingsActionBlock')) {
            this.pageService.openMainPage();
        }

        this.setHashChangeListenerActiveState(true);
        this.handleHash();
        //this.onHashChanged();
    }

    setActionBlockService(actionBlockService_to_set) {
        this.#actionBlockService = actionBlockService_to_set;
    }

    getPageNameEnum() {
        return this.#pageNameEnum;
    }

    getcurrent_page_name() {
        return this.#current_page_name;
    }

    setPageName(new_page_name) {
        this.#current_page_name = new_page_name;
    }
    
    openMainPage() {
        window.location.hash = '#main';
    }

    openActionBlockPage(title) {
        if ($('#input_field_request').val() === '') {
            this.#hash_previous = window.location.hash;
            console.log(this.#hash_previous);
        }
        else {
            this.#hash_previous = '#request=' + $('#input_field_request').val() + '&executebytitle=false';
        }

        window.location.hash = '#request=' + title + '&executebytitle=true';
        // console.log('openActionBlockPage', title);
        // console.log(window.location.hash);
        
        this.setPageName('contentActionBlock');
    }

    openSettingsActionBlockPage() {
        if ($('#input_field_request').val() === '') {
            this.#hash_previous = window.location.hash;
        }
        else {
            this.#hash_previous = '#request=' + $('#input_field_request').val() + '&executebytitle=false';
        }
        
        window.location.hash = '#settingsActionBlock';

        this.setPageName(this.#pageNameEnum.settingsActionBlock);
    }

    openPreviousPage() {
        if (this.#hash_previous && this.#hash_previous.includes('#settingsActionBlock') === false && this.#hash_previous.includes('&executebytitle=true') === false) {
            window.location.hash = this.#hash_previous;
        }
        else {
            this.openMainPage();
        }
    }

    openPreviousBrowserPage() {
        history.back();
    }

    setHashChangeListenerActiveState(is_active_new) {
        this.#is_hash_change_listener_active_state_enabled = is_active_new;
    }

    getHashChangeListenerActiveState() {
        return this.#is_hash_change_listener_active_state_enabled;
    }

    handleHash() {
        const that = this;

        if (this.getHashChangeListenerActiveState() === false) return;
        
        this.#actionBlockService.view.clear();

        if (window.location.hash === '#main' || window.location.hash === '' || window.location.hash === '#undefined') {
            this.setPageName('main');
            $('#input_field_request').val('');

            if (that.#actionBlockService.model.getActionBlocks().size > 0) {
                that.#actionBlockService.view.onOpenMainPageWithActionBlocks();
                that.#actionBlockService.showActionBlocks();
            }
            else {
                that.#actionBlockService.view.onOpenMainPageWithoutActionBlocks();
            }
            
            that.#actionBlockService.view.onShowMainPage();
        }
        else if (window.location.hash.includes('#request')) {
            let request = '';
            const text_to_cut = window.location.hash;
            const from_character_request = '=';

            let is_execute_actionBlock_by_title = false;

            if (window.location.hash.includes('executebytitle=false')) {
                const to_character_request = '&executebytitle';
                request = that.textManager.getCuttedText(text_to_cut, from_character_request, to_character_request);
                $('#input_field_request')[0].style.color = 'gray';

            }
            else if (window.location.hash.includes('executebytitle=true') || window.location.hash.includes('executebytitle')) {
                is_execute_actionBlock_by_title = true;
                const to_character_request = '&executebytitle';
                request = that.textManager.getCuttedText(text_to_cut, from_character_request, to_character_request);
                $('#input_field_request')[0].style.color = 'black';
            }
            else {
                request = that.textManager.getCuttedText(text_to_cut, from_character_request);
            }

            request = decodeURIComponent(request);
            that.#actionBlockService.showActionBlocksByRequest(request, is_execute_actionBlock_by_title);

            $('#input_field_request').val(request);
            
            // request = that.textManager.replaceSymbols(request, '%20', ' ');

            // const last_character_of_requets = request.slice(-1);;

            // if (last_character_of_requets === ' ') {
            //     is_execute_actionBlock_by_title = false;
            // }
        }
    }
}