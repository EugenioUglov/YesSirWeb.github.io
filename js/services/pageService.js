class PageService {
    #hash_previous;

    constructor(textManager, noteSpeakerService, searchService) {
        this.textManager = textManager;
        this.noteSpeakerService = noteSpeakerService;
        this.searchService = searchService;

        this.#hash_previous;
    }

    #actionBlockService;
    #is_hash_change_listener_active_state_enabled = false;
    #current_page_name;
    #view = new PageView();

    getPageNameEnum() {
        const PAGE_NAME_ENUM = {
            main: 'main',
            request: 'request',
            createActionBlock: 'createactionblock',
            createNote: 'createnote',
            createLink: 'createlink',
            editActionBlock: 'editactionblock',
            contentActionBlock: 'contentactionblock'
        };

        return PAGE_NAME_ENUM;
    }

    #setCurrenPageName(new_page_name) {
        this.#current_page_name = new_page_name;
    }

    getCurrentPageName() {
        return this.#current_page_name;
    }

    getNormalizedCurrentHash() {
        return window.location.hash.toLowerCase();
    }

    setHashMain() {
        this.#hash_previous = this.getNormalizedCurrentHash();
        this.#setCurrenPageName(this.getPageNameEnum().name);
        window.location.hash = this.getPageNameEnum().name;
    }

    setHashRequest(value) {
        this.#hash_previous = this.getNormalizedCurrentHash();
        this.#setCurrenPageName(this.getPageNameEnum().reuqest);
        window.location.hash = this.getPageNameEnum().reuqest + '=' + value;
    }

    setHashCreateActionBlock() {
        this.#hash_previous = this.getNormalizedCurrentHash();
        this.#setCurrenPageName(this.getPageNameEnum().createActionBlock);
        window.location.hash = this.getPageNameEnum().createActionBlock;
    }

    setHashCreateNote() {
        this.#hash_previous = this.getNormalizedCurrentHash();
        this.#setCurrenPageName(this.getPageNameEnum().createNote);
        window.location.hash = this.getPageNameEnum().createNote;
    }

    setHashCreateLink() {
        this.#hash_previous = this.getNormalizedCurrentHash();
        this.#setCurrenPageName(this.getPageNameEnum().createLink);
        window.location.hash = this.getPageNameEnum().createLink;
    }

    setHashEditActionBlock(title) {
        this.#hash_previous = this.getNormalizedCurrentHash();
        this.#setCurrenPageName(this.getPageNameEnum().editActionBlock);
        window.location.hash = this.getPageNameEnum().editActionBlock + '=' + title;
    }



   
    init() {
        this.setHashChangeListenerActiveState(true);
        this.handleHash();
    }

    showElement(element) {
        this.#view.showElement(element);
    }

    hideShowedElements() {
        this.#view.hideShowedElements();
    }


    setActionBlockService(actionBlockService_to_set) {
        this.#actionBlockService = actionBlockService_to_set;
    }



    setPageName(new_page_name) {
        this.#current_page_name = new_page_name;
    }
    
    openMainPage() {
        window.location.hash = this.getPageNameEnum().main;
    }

    openActionBlockPage(title) {
        // if ($('#input_field_request').val() === '') {
        //     this.#hash_previous = window.location.hash;
        // }
        // else {
        //     this.#hash_previous = '#request=' + $('#input_field_request').val() + '&executebytitle=false';
        // }

        window.location.hash = '#request=' + title + '&executebytitle=true';
        
        this.setPageName('contentActionBlock');
    }

    openSettingsActionBlockPage(title) {
        // if ($('#input_field_request').val() === '') {
        //     this.#hash_previous = this.getNormalizedCurrentHash();
        // }
        // else {
        //     // this.#hash_previous = '#request=' + $('#input_field_request').val() + '&executebytitle=false';
        // }
        
        // title = (title != undefined) ? '=' + title : '';
        window.location.hash = '#editActionBlock=' + title;
        this.setPageName(this.getPageNameEnum().settingsActionBlock);
    }

    openPreviousPage() {
        console.log('previous hash', this.#hash_previous);

        let hash_lower_case = window.location.hash.toLowerCase();

        if (
            this.#hash_previous && this.#hash_previous.includes(this.getPageNameEnum().editActionBlock) === false && 
            this.#hash_previous.includes('&executebytitle=true') === false
        ) {
            window.location.hash = this.#hash_previous;
        }
        else {
            this.openMainPage();
        }

        // if (hash_lower_case.includes(this.getPageNameEnum().createActionBlock) || hash_lower_case.includes(this.getPageNameEnum().editActionBlock)) {
        //     this.openMainPage();
        // }
    }

    openPageSettingsToCreateLink() {
        window.location.hash = this.getPageNameEnum().createLink;
        this.#setCurrenPageName(this.getPageNameEnum().createLink);
    }

    openPageSettingsToCreateNote() {
        window.location.hash = this.getPageNameEnum().createNote;
        this.#setCurrenPageName(this.getPageNameEnum().createNote);
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
        const hash_converted_to_object = this.#getConvertedHashToObject();
        console.log('hash_converted_to_object', hash_converted_to_object);
        console.log('hash_converted_to_object.hasOwnProperty("request")', hash_converted_to_object.hasOwnProperty("request"));
        if (this.noteSpeakerService.isSpeaking) this.noteSpeakerService.stopSpeak();

        this.hideShowedElements();
        if (this.getHashChangeListenerActiveState() === false) return;
        console.log('handleHash', this.getNormalizedCurrentHash());
        console.log('edit page', this.getPageNameEnum().editActionBlock);
        
        this.#actionBlockService.view.clear();

        if (this.getNormalizedCurrentHash() === '#main' || this.getNormalizedCurrentHash() === '' || this.getNormalizedCurrentHash() === '#undefined') {
            this.setPageName('main');
            // $('#input_field_request').val('');
            this.searchService.clearInputField();

            if (that.#actionBlockService.model.getActionBlocks().size > 0) {
                that.#actionBlockService.view.onOpenMainPageWithActionBlocks();
                that.#actionBlockService.showActionBlocks();
            }
            else {
                that.#actionBlockService.view.onOpenMainPageWithoutActionBlocks();
            }
            
            that.#actionBlockService.view.onShowMainPage();
        }
        else if (this.getNormalizedCurrentHash().includes('#request')) {
            let request = '';
            const text_to_cut = window.location.hash;
            const from_character_request = '=';

            let is_execute_actionBlock_by_title = false;

            if (window.location.hash.includes('executebytitle=false')) {
                const to_character_request = '&executebytitle';
                request = that.textManager.getCuttedText(text_to_cut, from_character_request, to_character_request);
            }
            else if (window.location.hash.includes('executebytitle=true') || window.location.hash.includes('executebytitle')) {
                is_execute_actionBlock_by_title = true;
                const to_character_request = '&executebytitle';
                request = that.textManager.getCuttedText(text_to_cut, from_character_request, to_character_request);
            }
            else {
                request = that.textManager.getCuttedText(text_to_cut, from_character_request);
            }

            request = decodeURIComponent(request);
            that.#actionBlockService.showActionBlocksByRequest(request, is_execute_actionBlock_by_title);


            this.searchService.setTextToInputField(request)
            // $('#input_field_request').val(request);
            
            // request = that.textManager.replaceSymbols(request, '%20', ' ');

            // const last_character_of_requets = request.slice(-1);;

            // if (last_character_of_requets === ' ') {
            //     is_execute_actionBlock_by_title = false;
            // }
        }
        else if (this.getNormalizedCurrentHash().includes(this.getPageNameEnum().createActionBlock)) {
            console.log('handleHash create ActionBLock');
            this.#actionBlockService.showSettingsToCreateAdvancedActionBlock();
        }
        else if (this.getNormalizedCurrentHash().includes(this.getPageNameEnum().createNote)) {
            console.log('createNote');
            this.#actionBlockService.showSettingsToCreateNote();
        }
        else if (this.getNormalizedCurrentHash().includes(this.getPageNameEnum().createLink)) {
            console.log('createLink');
            this.#actionBlockService.showSettingsToCreateLink();
        }
        else if (this.getNormalizedCurrentHash().includes(this.getPageNameEnum().editActionBlock)) {
            const text_to_cut = window.location.hash;
            const from_character_actionBlock_settings = '=';
            const to_character_request_actionBlock_settings = '';
            

            let title = this.textManager.getCuttedText(text_to_cut, from_character_actionBlock_settings, 
                to_character_request_actionBlock_settings);
            console.log("editactionblock=" + title);

            title = decodeURIComponent(title);
            this.#actionBlockService.openActionBlockSettings(title);
        }
        else {
            console.log('else');

            window.location.hash === this.getPageNameEnum().main;
        }

    }

    #getConvertedHashToObject() {
        const hash2Obj = window.location.hash
            .split("&")
            .map(v => v.split("="))
            .reduce( (pre, [key, value]) => ({ ...pre, [key]: value }), {} );

        return hash2Obj;
    }
}