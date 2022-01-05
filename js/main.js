
let dbManager;
let speakerController;
let actionBlockController; 
let logsController; 
let autocompleteController;
let searchController;
let versionController;
let fileManagerController;

let observable;

(function(){
    window.addEventListener('load', function () {
        onPageLoaded();
    });

    function onPageLoaded() {
        observable = new Observable();

        dbManager = new DBManager();
        speakerController = new SpeakerController(observable);
        actionBlockController = new ActionBlockController(dbManager);
        logsController = new LogsController();
        autocompleteController = new AutocompleteController();
        searchController = new SearchController();
        versionController = new VersionController();
        fileManagerController = new FileManagerController();

        logsController.addLog('START');


        resizeContentDialogInfo();
        window.addEventListener('resize', onWindowResize);

        

        actionBlockController.showActionBlocksFromStorageAsync();

        /*
        function onGetActionBlocksFromStorage(actionBlocks_from_storage) {
            console.log('data from storage', actionBlocks_from_storage)
            $('.icon_spinner').hide();

            if ( ! actionBlocks_from_storage || actionBlocks_from_storage.length < 1) {
                actionBlocks_from_storage = actionBlockController.getActionBlocksFromLocalStorage();

                if ( ! actionBlocks_from_storage || actionBlocks_from_storage.length < 1) {
                    $('#welcome_page').show();
                    return;
                }
                
            }

            actionBlockController.showActionBlocks(actionBlocks_from_storage);
            
            $('.actionBlocks_container').show();
            
        }
        */

        /*
        function showActionBlocksFromLocalStorage() {
            logsController.addLog('Get data from LocalStorage');
            
            const actionBlocks_to_show = infoBlockModel.getAll();
            console.log('actionBlocks_to_show', actionBlocks_to_show);
            infoBlockModel.infoBlocks_on_page = actionBlockController.showActionBlocks(actionBlocks_to_show);
            infoBlockModel.showed_infoObjects = actionBlocks_to_show;
            siteSettingsModel.set(STORAGE.localStorage);
            onGetInfoBlocksFromStorage();
        }


        function onGetInfoBlocksFromStorage() {
            setPage(1);
            if (infoBlockModel.showed_infoObjects) {
                if (infoBlockModel.showed_infoObjects.length > 0) {
                    versionController.applyUpdates();
                }
                else {
                    $("#search_area").hide();
                    $("#welcome_page").show();
                }
            }
            else {
                $("#search_area").hide();
                $("#welcome_page").show();
            }
        }
        */
    }


    function onWindowResize() {
        resizeContentDialogInfo();
    }

    // Resize content in dialog info.
    function resizeContentDialogInfo() {
        let width_dialog_info = $(".content").css("width");
        
        $(".dialog_content").css({
            "width": "250px"
        });
    }
})();