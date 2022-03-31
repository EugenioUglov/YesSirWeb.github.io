let fileManager;
let dropdownManager;
let mapDataStructure;
let dbManager;

let observable;
let actionBlockController; 
let logsController; 
let speakerController;

let speakerService;
let voiceRecognitionService;
let autocompleteService;


(function(){
    window.addEventListener('load', function () {
        onPageLoaded();
    });

    function onPageLoaded() {
        let autocompleteController;
        let searchController;
        let versionController;
        let voiceRecognitionController;
        let noteController;
        let dataStorageController;
        let pageController;
        let scrollController;
        let loadingController;

        const textManager = new TextManager();

        const dialogWindow = new DialogWindow();
        observable = new Observable();
        fileManager = new FileManager(textManager);
        dropdownManager = new DropdownManager();
        mapDataStructure = new MapDataStructure();

        logsController = new LogsController(fileManager, observable);
        dataStorageController = new DataStorageController(observable, dialogWindow);
        dbManager = new DBManager();
        speakerService = new SpeakerService();
        speakerController = new SpeakerController(speakerService, observable);
        actionBlockController = new ActionBlockController(dbManager, observable, fileManager, textManager, 
            dropdownManager, dataStorageController, mapDataStructure, logsController,
            dialogWindow);
        autocompleteService = new AutocompleteService(textManager);
        autocompleteController = new AutocompleteController(autocompleteService, textManager);
        searchController = new SearchController(observable, textManager);
        versionController = new VersionController();
        voiceRecognitionService = new VoiceRecognitionService();
        voiceRecognitionController = new VoiceRecognitionController(voiceRecognitionService, observable);
        noteController = new NoteController(observable);
        scrollController = new ScrollController(observable);
        loadingController = new LoadingController(observable);
        pageController = new PageController(noteController, textManager, observable, keyCodeByKeyName);

        // Events.

        document.addEventListener('test', function(event) {alert(event.log);});

        /*
        searchController.onClickBtnSearchByTags = function(user_plus_tags, user_minus_tags) {
            actionBlockController.showActionBlocksByTags(user_plus_tags, user_minus_tags);
        }
        */


        observable.listen('continuosVoiceRecognition', function(observable, eventType, data){
            window.location.hash = '#request=' + data.transcript + '&executebytitle=false';
        });

        observable.listen('resultVoiceRecognition', function(observable, eventType, data){
            window.location.hash = '#request=' + data.transcript + '&executebytitle=true';
        });

        observable.listen('requestEntered', function(observable, eventType, data){
            if (data.request === '') {
                pageController.openMainPage();
                return;
            }
            
            window.location.hash = '#request=' + data.request + '&executebytitle=true';
        });

        document.addEventListener('keyup', function(event) {
            if (event.code == 'Slash') {
                searchController.focus();
            }
        });
        
        searchController.onClickBtnSearchByTags(onClickBtnSearchByTags);
        dataStorageController.onClickBtnRewriteOnDialogDatabaseManger(onClickBtnRewriteOnDialogDatabaseManger);
        autocompleteController.bindApplyTags(onAutocompleteItemSelected);
        dataStorageController.bindClickRbLocalStorage(onClickRbLocalStorage);
        actionBlockController.showActionBlocksFromStorage();


        function onClickBtnSearchByTags(user_plus_tags, user_minus_tags) {
            actionBlockController.showActionBlocksByTags(user_plus_tags, user_minus_tags);
        }

        function onClickBtnRewriteOnDialogDatabaseManger() {
            $(".black_background").hide();
            actionBlockController.onClickBtnRewriteActionBlocks();
        }

        function onClickRbLocalStorage() {
            updateLogMessage();
        }

        function onAutocompleteItemSelected() {
            console.log('curent page name', pageController.getCurrentPageName());
            
            if (pageController.getCurrentPageName() === pageController.getPageNameOptions().main) {
                const actionBlocks = actionBlockController.getActionBlocksByPhrase($('#input_field_request').val());
                actionBlockController.showActionBlocks(actionBlocks);
            }
        }

        function updateLogMessage() {
            const data_storage = storage_name[dataStorageController.getUserStorage()];
            const storage_for_log = {};
            storage_for_log[storage_name.database] = 'database';
            storage_for_log[storage_name.localStorage] = 'browser';

            const log = 'Found ' + actionBlockController.getActionBlocks().length + ' results | ' + 
                'Saved in ' + storage_for_log[data_storage] + ' storage';

            logsController.showLog(log);
        }
        
        //versionController.applyUpdates();

        resizeContentDialogInfo();
        window.addEventListener('resize', onWindowResize);
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