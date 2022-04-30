let fileManager;
let dropdownManager;
let mapDataStructure;
let dbManager;
let arrayManager;

let observable;
let actionBlockController; 
let logsController; 
let speakerController;

let speakerService;
let voiceRecognitionService;
let autocompleteService;
let fileService;
let actionBlockService;
let logsService; 


(function(){
    window.addEventListener('load', function () {
        onPageLoaded();
    });

    function onPageLoaded() {
        //let autocompleteController;
        let searchController;
        let voiceRecognitionController;
        let noteController;
        let pageController;
        let scrollController;
        let loadingController;
        const dateManager = new DateManager();
        const inputDeviceManager = new InputDeviceManager();
        const keyCodeByKeyName = inputDeviceManager.getKeyCodeByKeyName();
        
        const textManager = new TextManager();
        const dialogWindow = new DialogWindow();
        observable = new Observable();
        fileManager = new FileManager(textManager);
        dropdownManager = new DropdownManager();
        mapDataStructure = new MapDataStructure();
        dbManager = new DBManager();
        arrayManager = new ArrayManager();

        // Initialize Services.
        voiceRecognitionService = new VoiceRecognitionService();
        speakerService = new SpeakerService();
        autocompleteService = new AutocompleteService(textManager);
        const scrollService = new ScrollService();
        const searchService = new SearchSevice();
        logsService = new LogsService(fileManager, dateManager);
        const loadingService = new LoadingService();
        const noteService = new NoteService();
        const dataStorageService = new DataStorageService(dialogWindow);
        const pageService = new PageService(textManager);
        actionBlockService = new ActionBlockService(dbManager, observable, fileManager, textManager, 
            dropdownManager, dataStorageService, mapDataStructure, logsService, dialogWindow, 
            keyCodeByKeyName, scrollService, searchService, loadingService, pageService, noteService, dateManager);
        fileService = new FileService(actionBlockService, fileManager);

        // Initialize Controller.
        logsController = new LogsController(fileManager);
        speakerController = new SpeakerController(speakerService);
        loadingController = new LoadingController(observable);
        actionBlockController = new ActionBlockController(actionBlockService, dbManager, observable, fileManager, textManager, 
            dropdownManager, mapDataStructure, loadingService, pageController, dialogWindow, 
            scrollService, searchService, pageService, noteService);
        const autocompleteController = new AutocompleteController(pageService, actionBlockService, autocompleteService, textManager);
        voiceRecognitionController = new VoiceRecognitionController(voiceRecognitionService, observable);
        scrollController = new ScrollController(scrollService, actionBlockService);
        pageController = new PageController(pageService, actionBlockController, actionBlockService, textManager, observable);
        searchController = new SearchController(searchService, actionBlockService, pageService, textManager, keyCodeByKeyName);
        noteController = new NoteController(actionBlockService, noteService, pageService);
        const dataStorageController = new DataStorageController(actionBlockService, dataStorageService, pageService, dialogWindow);

        
        //autocompleteController.bindApplyTags(onAutocompleteItemSelected);
        actionBlockService.showActionBlocksFromStorage();


        // resizeContentDialogInfo();
        // window.addEventListener('resize', onWindowResize);
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