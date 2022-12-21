class PageService {
    #hash_previous;

    constructor(textManager, noteSpeakerService, searchService) {
        this.textManager = textManager;
        this.noteSpeakerService = noteSpeakerService;
        this.searchService = searchService;
        this.#view = new PageView();

        this.#hash_previous;
    }

    #actionBlockService;
    #is_hash_change_listener_active_state_enabled = false;
    #current_page_name;
    #view;


    init() {
        this.setHashChangeListenerActiveState(true);
        this.handleHash();
    }


    getPageNameEnum() {
        const PAGE_NAME_ENUM = {
            main: 'main',
            request: 'request',
            publicActionBlocks: 'publicActionBlocks',
            createActionBlock: 'createactionblock',
            createNote: 'createnote',
            createLink: 'createlink',
            editActionBlock: 'editactionblock',
            contentActionBlock: 'contentactionblock'
        };

        return PAGE_NAME_ENUM;
    }

    getPageOptionNameEnum() {
        const PAGE_OPTION_NAME_ENUM = {
            executebytitle: 'executebytitle',
            speechRecognition: 'speechrecognition',
            listen: 'listen'
        };

        return PAGE_OPTION_NAME_ENUM;
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

    setHashRequest = (parameter = {
        request_value: '', 
        is_execute_actionBlock_by_title: false,
        is_listen_text: false}) => {
            
        const DEFAULT_PARAMETER = {
            request_value: '',
            is_execute_actionBlock_by_title: false,
            is_listen_text: false
        };

        const request_value = parameter.request_value != undefined ? parameter.request_value : 
            DEFAULT_PARAMETER.request_value;
        const is_execute_actionBlock_by_title = parameter.is_execute_actionBlock_by_title != undefined ? 
            parameter.is_execute_actionBlock_by_title : DEFAULT_PARAMETER.is_execute_actionBlock_by_title;
        const is_listen_text = parameter.is_listen_text != undefined ? parameter.is_listen_text : 
            DEFAULT_PARAMETER.is_listen_text;

        this.#hash_previous = this.getNormalizedCurrentHash();
        
        if (request_value === undefined || request_value === '') {
            this.openMainPage();
        }

        this.#setCurrenPageName(this.getPageNameEnum().request);
        const new_hash = this.getPageNameEnum().request + '=' + request_value + 
            (is_execute_actionBlock_by_title ? '&' + this.getPageOptionNameEnum().executebytitle : '') + 
                (is_listen_text ? '&' + this.getPageOptionNameEnum().listen : '');
        window.location.hash = new_hash;
    };

    setPreviousHash(new_hash_previous) {
        this.#hash_previous = new_hash_previous != undefined ? new_hash_previous : window.location.hash;
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

    // setHashEditActionBlock(title) {
    //     this.#hash_previous = this.getNormalizedCurrentHash();
    //     console.log("hash_previous = " + this.#hash_previous);
    //     this.#setCurrenPageName(this.getPageNameEnum().editActionBlock);
    //     window.location.hash = this.getPageNameEnum().editActionBlock + '=' + title;
    // }

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

    openPublicActionBlocksPage() {
        window.location.hash = this.getPageNameEnum().publicActionBlocks;
    }

    openActionBlockPage(title) {
        this.#hash_previous = window.location.hash;
        window.location.hash = this.getPageNameEnum().request + '=' + title + '&' + 
            this.getPageOptionNameEnum().executebytitle + '=true';
    }



    openSettingsActionBlockPage(title) {
        this.#hash_previous = window.location.hash;
        this.#setCurrenPageName(this.getPageNameEnum().editActionBlock);
        window.location.hash = this.getPageNameEnum().editActionBlock + '=' + title;
        this.setPageName(this.getPageNameEnum().settingsActionBlock);
    }

    openPreviousPage() {
        if (
            this.#hash_previous && 
            this.#hash_previous.includes(this.getPageNameEnum().editActionBlock) === false
        ) {
            let hash_to_open = this.#hash_previous;

            const is_previous_hash_includes_execute_by_title = (this.#hash_previous.includes('&' + this.getPageOptionNameEnum().executebytitle)) && (this.#hash_previous.includes('&' + this.getPageOptionNameEnum().executebytitle + "=false") === false);
           
            if (is_previous_hash_includes_execute_by_title) {
                const i_start_word_execute_by_title = this.#hash_previous.indexOf('&' + this.getPageOptionNameEnum().executebytitle);
                hash_to_open = this.#hash_previous.substring(0, i_start_word_execute_by_title);
            }
            
            window.location.hash = hash_to_open;
        }
        else {
            this.openMainPage();
        }
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
        // console.log('hash_converted_to_object', hash_converted_to_object);
        // console.log('hash_converted_to_object.hasOwnProperty("request")', hash_converted_to_object.hasOwnProperty(this.getPageNameEnum().request));
        if (this.noteSpeakerService.isSpeaking) this.noteSpeakerService.stopSpeak();

        this.hideShowedElements();
        if (this.getHashChangeListenerActiveState() === false) return;
        // console.log('handleHash', this.getNormalizedCurrentHash());
        // console.log('edit page', this.getPageNameEnum().editActionBlock);
        
        this.#actionBlockService.view.clear();


        if (
            this.getNormalizedCurrentHash() === '#' + this.getPageNameEnum().main || 
            this.getNormalizedCurrentHash() === '' || 
            this.getNormalizedCurrentHash() === '#undefined'
        ) {
            this.setPageName(this.getPageNameEnum().main);
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
        else if (
            this.getNormalizedCurrentHash().includes('#' + this.getPageNameEnum().main) &&
            window.location.hash.includes(this.getPageOptionNameEnum().speechRecognition)
        ) {
            $('.content').hide();
            $('.fixed_elements').hide();
        }
        else if (this.getNormalizedCurrentHash().includes(this.getPageNameEnum().request)) {
            let request = '';
            const text_to_cut = window.location.hash;
            const from_character_request = '=';

            let is_execute_actionBlock_by_title = false;

            if (window.location.hash.includes(this.getPageOptionNameEnum().executebytitle + '=false')) {
                const to_character_request = '&' + this.getPageOptionNameEnum().executebytitle;
                request = that.textManager.getCuttedText(text_to_cut, from_character_request, to_character_request);
            }
            else if (window.location.hash.includes(this.getPageOptionNameEnum().executebytitle + '=true') || 
                window.location.hash.includes(this.getPageOptionNameEnum().executebytitle)) {
                    is_execute_actionBlock_by_title = true;
                    const to_character_request = '&' + this.getPageOptionNameEnum().executebytitle;
                    request = that.textManager.getCuttedText(text_to_cut, from_character_request, to_character_request);
            }
            else {
                request = that.textManager.getCuttedText(text_to_cut, from_character_request);
            }

            request = decodeURIComponent(request);
            that.#actionBlockService.showActionBlocksByRequest(request, is_execute_actionBlock_by_title);
            this.searchService.setTextToInputField(request);
        }
        else if (this.getNormalizedCurrentHash().includes(this.getPageNameEnum().createActionBlock)) {
            this.#actionBlockService.showSettingsToCreateAdvancedActionBlock();
        }
        else if (this.getNormalizedCurrentHash().includes(this.getPageNameEnum().createNote)) {
            this.#actionBlockService.showSettingsToCreateNote();
        }
        else if (this.getNormalizedCurrentHash().includes(this.getPageNameEnum().createLink)) {
            this.#actionBlockService.showSettingsToCreateLink();
        }
        else if (this.getNormalizedCurrentHash().includes(this.getPageNameEnum().editActionBlock)) {
            const text_to_cut = window.location.hash;
            const from_character_actionBlock_settings = '=';
            const to_character_request_actionBlock_settings = '';
            

            let title = this.textManager.getCuttedText(text_to_cut, from_character_actionBlock_settings, 
                to_character_request_actionBlock_settings);

            title = decodeURIComponent(title);
            this.#actionBlockService.openActionBlockSettings(title);
        }
        else {
            window.location.hash === this.getPageNameEnum().main;
        }
    }

    #setCurrenPageName(new_page_name) {
        this.#current_page_name = new_page_name;
    }

    #getConvertedHashToObject() {
        const hash2Obj = window.location.hash
            .split("&")
            .map(v => v.split("="))
            .reduce( (pre, [key, value]) => ({ ...pre, [key]: value }), {} );

        return hash2Obj;
    }
}