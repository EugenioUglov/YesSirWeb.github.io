class PageController {
    constructor(observable, keyCodeByKeyName) {
        this.observable = observable;
        this.keyCodeByKeyName = keyCodeByKeyName;

        this.hash_previous;

        this.#start();
        this.#setListeners();
    }

    #currentPageName = 'main';

    #pageName = {
        main: 'main',
        settingsActionBlock: 'settingsActionBlock',
        contentActionBlock: 'contentActionBlock'
    };

    getPageNameOptions() {
        return this.#pageName;
    }

    getCurrentPageName() {
        return this.#currentPageName;
    }
    
    setPageName(pageName) {
        this.#currentPageName = pageName;
    }

    openMainPage() {
        window.location.hash = '#main';
        this.setPageName('main');
    }

    #start() {
        if (window.location.hash.includes('settingsActionBlock')) {
            this.openMainPage();
        }
    }

    #setListeners() {
        const that = this;

        that.observable.listen('actionBlocksLoaded', function(observable, eventType, data) {
            onActionBlocksLoaded();
        });


        function onActionBlocksLoaded() {
            that.#hashChangeListener();

            setObservableListeners();
    
            function setObservableListeners() {
                const events_to_open_previous_page = ['new_settings_for_actionBlocks_applied', 'noteClosed', 
                    'actionBlockOpenURLExecuted'];
                
                const events_to_open_main_page = ['btnClearRequestFieldClicked'];

                const events_to_execute_actionBlock = ['actionBlockExecuted', 'actionBlockClicked'];

                /*
                const action_blocks_to_change_content = [
                    'actionBlockFileManagerExecuted', 'actionBlockDataStorageManagerExecuted', 
                    'actionBlockVoiceRecognitionManagerExecuted', 'actionBlockLogsManagerExecuted'];
    
                for (const event of action_blocks_to_change_content) {
                    that.observable.listen(event, function(observable, eventType, data){
                        window.location.hash = '#contentActionBlock';
                    });
                }
                */
    

    
    
                that.observable.listen('keyUpOnRequestFieldPressed', function(observable, eventType, data){
                    const clicked_keyCode = data.keyCode;
                    let is_execute_actionBlock_by_title = false;
    
                    if (clicked_keyCode === that.keyCodeByKeyName.enter) {
                        is_execute_actionBlock_by_title = true;
        
                        window.location.hash = '#request=' + data.request + '&executebytitle=' + is_execute_actionBlock_by_title;
                    }
                });
        
    
        
                for (const event of events_to_open_previous_page) {
                    that.observable.listen(event, function(observable, eventType, data){
                        console.log('open previous page from ' + event);
                        //history.back();
                        let new_hash = '#main';
                        
                        if (that.hash_previous) {
                            if (that.hash_previous.includes('#request')) {
                                new_hash = that.hash_previous;
                            }
                        }
                        
                        window.location.hash = new_hash;
                        
                        console.log('event called', event);
                        console.log('open previous hash: ', window.location.hash);
                    });
                }
    
    
                for (const event of events_to_open_main_page) {
                    that.observable.listen(event, function(observable, eventType, data){
                        that.openMainPage();
                    });
                }
    
                that.observable.listen('settingsActionBlockShowed', function(observable, eventType, data){
                    // !!!
                    if ($('#input_field_request').val() === '') {
                        that.hash_previous = window.location.hash;
                    }
                    else {
                        that.hash_previous = '#request=' + $('#input_field_request').val() + '&executebytitle=false';
                    }
    
                    
                    window.location.hash = '#settingsActionBlock';

                    that.setPageName('settingsActionBlock');
                });
    
    
                
                for (const event of events_to_execute_actionBlock) {
                    that.observable.listen(event, function(observable, eventType, data){
                        // !!!
                        if ($('#input_field_request').val() === '') {
                            that.hash_previous = window.location.hash;
                        }
                        else {
                            that.hash_previous = '#request=' + $('#input_field_request').val() + '&executebytitle=false';
                        }
        
                        const index = data.index;
                        window.location.hash = '#indexActionBlock=' + index;
                        
                        that.setPageName('contentActionBlock');
                    });
                }
                
    
            }
        }

    }

    #hashChangeListener() {
        const that = this;

        this.#onHashChanged();

        window.onhashchange = function() {
            that.#onHashChanged();
        }
    }

    #onHashChanged() {
        const that = this;

        sendEventHashChanged();

        function sendEventHashChanged () {
            const event = {
                name: 'hashChanged',
                data: {
                    hash: window.location.hash,
                    hash_previous: that.hash_previous,
                    log: 'Hash changed to: ' + window.location.hash
                }
            };
    
            that.observable.dispatchEvent(event.name, event.data);
        }
    }
}




const infoBlocks_area = {};

infoBlocks_area.infoBlocks = {};
infoBlocks_area.page_with_infoBlocks_current = 1;

infoBlocks_area.arrow_left = {};
infoBlocks_area.arrow_right = {};
infoBlocks_area.dots_container = $('.dots');


// .START (Arrows event handler)
infoBlocks_area.arrow_left.onClick = function() {
    const infoBlocks_length = Object.keys(infoBlockModel.infoBlocks_on_page).length;

    infoBlocks_area.page_with_infoBlocks_current--;

    // IF it is the first page THEN go to the last page.
    if (infoBlocks_area.page_with_infoBlocks_current < 1) {
        infoBlocks_area.page_with_infoBlocks_current = infoBlocks_length;
        // console.log(infoBlocks_area.page_with_infoBlocks_current)
    }

    setPage(infoBlocks_area.page_with_infoBlocks_current);
}  


infoBlocks_area.arrow_right.onClick = function() {
    const infoBlocks_length = Object.keys(infoBlockModel.infoBlocks_on_page).length

    infoBlocks_area.page_with_infoBlocks_current++;

    // IF it is the last page THEN go to first page.
    if (infoBlocks_area.page_with_infoBlocks_current > infoBlocks_length) {
        infoBlocks_area.page_with_infoBlocks_current = 1;
        // console.log(infoBlocks_area.page_with_infoBlocks_current)
    }

    setPage(infoBlocks_area.page_with_infoBlocks_current);
}  

function setPage(n) {
    return;
    infoBlocks_area.page_with_infoBlocks_current = n;
    const i_page = n - 1;
    const infoBlocks_to_show = infoBlockModel.infoBlocks_on_page[i_page];
    actionBlockController.showActionBlocks(infoBlocks_to_show);


    /*
    // .START (Update styles for dots)
    let dots_length = $(".dots")[0].children.length;
    
    for (let i_dot = 0; i_dot < dots_length; i_dot++) {
        let dot = $(".dots")[0].children[i_dot];
        dot.className = dot.className.replace(" active", "");
    }

    let dot_to_active = $(".dots")[0].children[i_page];
    dot_to_active.className += " active";
    // .END (Update styles for dots)
    */

    const count_pages = Object.keys(infoBlockModel.infoBlocks_on_page).length;    
    const current_page = n;

    // Set text which page (example: 1 / 3).
    setNumberPage(current_page, count_pages);
}






// Buttons change page with actionBlocks.
$('.page_control_elements').children('.prev').on('click', infoBlocks_area.arrow_left.onClick);
$('.page_control_elements').children('.next').on('click', infoBlocks_area.arrow_right.onClick);

function setNumberPage(current_page, all_pages) {
    for (const count_pages_label of $('.count_pages_actionBlocks')) {
        count_pages_label.innerText = current_page + ' / ' + all_pages;
    }
}


function showPageDots(page) {
    // Rewrite html in elem.
    //$('.dots').html(dots_container.html+ '<span class='dot'></span> ');
    // Add html to elem.
    $('.dots').append('<span class="dot" onclick="setPage(' + page + ')"></span>');
    // Hide dots container.
    $('.dots').hide();
}